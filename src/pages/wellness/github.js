import { sanitizeTexts } from './content-utils'

const API = 'https://api.github.com'
const CONTENT_PATH = 'src/pages/wellness/content.json'
const BRANCH = 'main'
const TOKEN_KEY = 'wellness.editToken'

export class GhError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

// 배포된 주소(owner.github.io/저장소/)에서 저장소를 알아낸다. 저장소 이름이 바뀌어도 따라간다.
// 개발·테스트에서만 window.__WELLNESS_EDIT_REPO__ = 'owner/repo'로 지정할 수 있다.
export function resolveRepo() {
  if (typeof window === 'undefined') return null
  const forced = window.__WELLNESS_EDIT_REPO__
  if (forced) {
    const [owner, repo] = String(forced).split('/')
    return owner && repo ? { owner, repo } : null
  }
  const { hostname, pathname } = window.location
  if (!hostname.endsWith('.github.io')) return null
  const owner = hostname.split('.')[0]
  const repo = pathname.split('/')[1] || hostname
  return { owner, repo }
}

export function readToken() {
  try {
    return window.localStorage.getItem(TOKEN_KEY) || ''
  } catch {
    return ''
  }
}

export function writeToken(token) {
  try {
    window.localStorage.setItem(TOKEN_KEY, token)
  } catch {
    // 저장이 막힌 환경(시크릿 창 등)에서는 이번 접속에서만 쓴다.
  }
}

export function clearToken() {
  try {
    window.localStorage.removeItem(TOKEN_KEY)
  } catch {
    // 지울 것이 없다.
  }
}

async function gh(token, path, init = {}) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      Authorization: `Bearer ${token}`,
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
    },
  })
  if (!res.ok) {
    let detail = ''
    try {
      detail = (await res.json()).message || ''
    } catch {
      // 본문이 없는 오류
    }
    throw new GhError(res.status, detail)
  }
  return res.json()
}

function decodeBase64(b64) {
  const bin = atob(b64.replace(/\s/g, ''))
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)))
}

function encodeBase64(text) {
  let bin = ''
  new TextEncoder().encode(text).forEach((b) => {
    bin += String.fromCharCode(b)
  })
  return btoa(bin)
}

// 저장소에 기록된 최신 수정본과 파일 버전(sha)을 읽어 온다. 토큰이 맞는지 확인하는 역할도 한다.
export async function loadRemote(token, { owner, repo }) {
  const data = await gh(token, `/repos/${owner}/${repo}/contents/${CONTENT_PATH}?ref=${BRANCH}`)
  const parsed = JSON.parse(decodeBase64(data.content))
  return { sha: data.sha, texts: sanitizeTexts(parsed.texts) }
}

export async function saveRemote(token, { owner, repo }, sha, texts, message) {
  const sorted = Object.fromEntries(Object.entries(texts).sort(([a], [b]) => a.localeCompare(b)))
  const body = JSON.stringify({ texts: sorted }, null, 2) + '\n'
  const data = await gh(token, `/repos/${owner}/${repo}/contents/${CONTENT_PATH}`, {
    method: 'PUT',
    body: JSON.stringify({ message, content: encodeBase64(body), sha, branch: BRANCH }),
  })
  return { sha: data.content.sha }
}

export function errorMessage(err) {
  if (err instanceof GhError) {
    if (err.status === 401) return '토큰이 맞지 않아요. 다시 확인해 주세요.'
    if (err.status === 403) return '이 토큰으로는 할 수 없어요. 토큰의 Contents 권한이 "Read and write"인지 확인해 주세요.'
    if (err.status === 404) return '저장소나 파일을 찾지 못했어요. 토큰의 저장소 선택을 확인해 주세요.'
    if (err.status === 409 || err.status === 422)
      return '다른 곳에서 먼저 저장된 것 같아요. 페이지를 새로고침한 뒤 다시 시도해 주세요.'
    return `GitHub에서 오류가 났어요 (${err.status}).`
  }
  return err instanceof Error ? err.message : '알 수 없는 오류가 났어요.'
}
