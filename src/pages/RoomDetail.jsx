import { useParams } from 'react-router-dom'

export default function RoomDetail() {
  const { roomId } = useParams()

  return (
    <div className="placeholder-page">
      <h1>방 상세</h1>
      <p>
        <code>{roomId}</code> 방의 상세 화면(재생, 사연, 답글, 반응)은 3단계에서
        구현될 예정이에요.
      </p>
    </div>
  )
}
