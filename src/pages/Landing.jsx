import { rooms } from '../data/rooms'
import RoomCard from '../components/RoomCard'

export default function Landing() {
  return (
    <div className="landing">
      <section className="landing-intro">
        <p className="eyebrow">아무도 모르게, 그러나 혼자는 아니게</p>
        <h1>말하지 못한 마음을, 노래 한 곡에 기대어 놓아두는 곳</h1>
        <p className="lead">
          각 방에는 노래와 짧은 글귀가 있습니다. 그 곡이 떠오르는 이야기를
          익명으로 남기고, 다른 사람의 사연에는 정해진 반응으로만 조용히
          마음을 전할 수 있어요. 조언도, 정답도 없이 그저 곁에 있다는
          느낌만 남기는 공간입니다.
        </p>
      </section>

      <section className="room-grid" aria-label="방 목록">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </section>
    </div>
  )
}
