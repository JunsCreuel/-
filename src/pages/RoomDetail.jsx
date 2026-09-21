import { Navigate, useParams } from 'react-router-dom'
import { getRoomById } from '../data/rooms'
import { useApp } from '../store/useApp'
import StoryForm from '../components/StoryForm'
import StoryList from '../components/StoryList'

export default function RoomDetail() {
  const { roomId } = useParams()
  const room = getRoomById(roomId)
  const { getStories, addStory, toggleReaction } = useApp()

  if (!room) {
    return <Navigate to="/" replace />
  }

  const stories = getStories(room.id)
  const embedSrc = `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(
    room.searchQuery,
  )}`

  return (
    <div className="room-detail" style={{ '--accent': room.accent }}>
      <p className="room-detail-mood">{room.mood}</p>
      <h1 className="room-detail-song">{room.song}</h1>
      <p className="room-detail-artist">{room.artist}</p>
      <p className="room-detail-quote">“{room.quote}”</p>

      <div className="room-embed">
        <iframe
          src={embedSrc}
          title={`${room.song} - ${room.artist}`}
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      </div>

      <section className="room-story-section">
        <h2>사연 남기기</h2>
        <StoryForm onSubmit={(text) => addStory(room.id, text)} />
      </section>

      <section className="room-story-section">
        <h2>남겨진 사연</h2>
        <StoryList
          stories={stories}
          onToggleReaction={(storyId, key) => toggleReaction(room.id, storyId, key)}
        />
      </section>

      <p className="room-notice">
        이 방에 남긴 사연과 반응은 지금 이 브라우저에만 저장돼요. 다른 방문자에게는
        보이지 않는 컨셉 데모 단계이니, 실제로 누군가와 이야기를 나누는 공간이
        아니라는 점을 참고해주세요.
      </p>
    </div>
  )
}
