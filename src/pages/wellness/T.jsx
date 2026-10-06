import { useEffect, useLayoutEffect, useRef } from 'react'
import { useContent } from './content-context'
import { childrenToText, normalizeEdited } from './content-utils'

// 고칠 수 있는 글 한 덩어리. k는 문구의 고유 이름이고, 자식은 코드에 적힌 기본 문구다.
// - 방문자: 저장된 수정본이 있으면 그 글, 없으면 기본 문구를 그대로 보여 준다.
// - 수정 모드: 그 자리에서 바로 타이핑해서 고칠 수 있다.
// single: 한 줄짜리(버튼, 칩 등)라서 Enter로 줄바꿈하지 못하게 한다.
export default function T({ k, as: Tag = 'span', single = false, className = '', children }) {
  const ctx = useContent()
  const ref = useRef(null)
  const fallback = childrenToText(children)
  const value = ctx?.texts[k] ?? fallback
  const editing = Boolean(ctx?.editing)
  const revision = ctx?.revision
  const defaultsRef = ctx?.defaultsRef

  useEffect(() => {
    if (defaultsRef) defaultsRef.current[k] = fallback
  }, [defaultsRef, k, fallback])

  // 수정 모드에서는 글자를 DOM에 직접 넣어 두고(커서가 튀지 않게), 켜질 때와 되돌릴 때만 다시 맞춘다.
  // 타이핑할 때마다 DOM을 덮어쓰지 않도록 최신 글은 ref로 들고 있다.
  const valueRef = useRef(value)
  useLayoutEffect(() => {
    valueRef.current = value
  })
  useLayoutEffect(() => {
    if (editing && ref.current) ref.current.textContent = valueRef.current
  }, [editing, revision])

  const cls = `w-t${className ? ` ${className}` : ''}`

  if (!editing) return <Tag className={cls}>{value}</Tag>

  const edited = ctx.texts[k] !== undefined

  return (
    <Tag
      ref={ref}
      className={`${cls} is-editable${edited ? ' is-edited' : ''}`}
      data-t={k}
      contentEditable="plaintext-only"
      suppressContentEditableWarning
      spellCheck={false}
      onInput={(e) => ctx.setText(k, normalizeEdited(e.currentTarget.innerText))}
      onKeyDown={(e) => {
        if (single && e.key === 'Enter') e.preventDefault()
      }}
      onPaste={(e) => {
        e.preventDefault()
        const plain = e.clipboardData.getData('text/plain')
        document.execCommand('insertText', false, single ? plain.replace(/\s*\n\s*/g, ' ') : plain)
      }}
      // 링크·버튼 안의 글을 눌러도 이동하거나 접히지 않게 한다.
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
    />
  )
}
