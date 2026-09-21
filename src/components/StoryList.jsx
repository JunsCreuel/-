import ReactionBar from './ReactionBar'

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleString('ko-KR', {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function StoryList({ stories, onToggleReaction }) {
  if (stories.length === 0) {
    return (
      <p className="story-empty">
        아직 남겨진 이야기가 없어요. 이 방의 첫 이야기를 남겨보세요.
      </p>
    )
  }

  return (
    <ul className="story-list">
      {stories.map((story) => (
        <li key={story.id} className="story-item">
          <p className="story-text">{story.text}</p>
          <div className="story-item-footer">
            <time className="story-time">{formatTime(story.createdAt)}</time>
            <ReactionBar
              counts={story.reactionCounts}
              myReactions={story.myReactions}
              onToggle={(key) => onToggleReaction(story.id, key)}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}
