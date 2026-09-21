import { createContext, useContext, useEffect, useState } from 'react'
import { reactions } from '../data/reactions'

const STORAGE_KEY = 'sabyeok:stories'

const AppContext = createContext(null)

function loadInitialState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { storiesByRoom: {} }
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || !parsed.storiesByRoom) {
      return { storiesByRoom: {} }
    }
    return parsed
  } catch {
    return { storiesByRoom: {} }
  }
}

function emptyReactionCounts() {
  return Object.fromEntries(reactions.map((r) => [r.key, 0]))
}

function emptyMyReactions() {
  return Object.fromEntries(reactions.map((r) => [r.key, false]))
}

export function AppProvider({ children }) {
  const [state, setState] = useState(loadInitialState)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // 저장 공간이 없거나 접근이 막힌 경우, 화면 동작에는 지장이 없도록 조용히 무시합니다.
    }
  }, [state])

  function getStories(roomId) {
    const list = state.storiesByRoom[roomId] ?? []
    return [...list].sort((a, b) => b.createdAt - a.createdAt)
  }

  function addStory(roomId, text) {
    const trimmed = text.trim()
    if (!trimmed) return

    const newStory = {
      id: crypto.randomUUID(),
      text: trimmed,
      createdAt: Date.now(),
      reactionCounts: emptyReactionCounts(),
      myReactions: emptyMyReactions(),
    }

    setState((prev) => {
      const existing = prev.storiesByRoom[roomId] ?? []
      return {
        ...prev,
        storiesByRoom: {
          ...prev.storiesByRoom,
          [roomId]: [...existing, newStory],
        },
      }
    })
  }

  function toggleReaction(roomId, storyId, reactionKey) {
    setState((prev) => {
      const existing = prev.storiesByRoom[roomId] ?? []
      const updated = existing.map((story) => {
        if (story.id !== storyId) return story
        const alreadyReacted = story.myReactions[reactionKey]
        return {
          ...story,
          reactionCounts: {
            ...story.reactionCounts,
            [reactionKey]: story.reactionCounts[reactionKey] + (alreadyReacted ? -1 : 1),
          },
          myReactions: {
            ...story.myReactions,
            [reactionKey]: !alreadyReacted,
          },
        }
      })
      return {
        ...prev,
        storiesByRoom: {
          ...prev.storiesByRoom,
          [roomId]: updated,
        },
      }
    })
  }

  const value = { getStories, addStory, toggleReaction }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) {
    throw new Error('useApp은 AppProvider 안에서만 사용할 수 있습니다.')
  }
  return ctx
}
