import { useState } from 'react'

const MAX_LENGTH = 300

export default function StoryForm({ onSubmit }) {
  const [text, setText] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    if (!text.trim()) return
    onSubmit(text)
    setText('')
  }

  return (
    <form className="story-form" onSubmit={handleSubmit}>
      <label htmlFor="story-input" className="story-form-label">
        이 노래가 떠오르는 이야기를 남겨보세요
      </label>
      <textarea
        id="story-input"
        value={text}
        onChange={(event) => setText(event.target.value.slice(0, MAX_LENGTH))}
        placeholder="누구에게도 하지 못했던 이야기를 여기에 적어보세요."
        rows={4}
        maxLength={MAX_LENGTH}
      />
      <div className="story-form-footer">
        <span className="story-form-count">
          {text.length}/{MAX_LENGTH}
        </span>
        <button type="submit" disabled={!text.trim()}>
          조용히 남기기
        </button>
      </div>
    </form>
  )
}
