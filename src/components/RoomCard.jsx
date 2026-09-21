import { Link } from 'react-router-dom'

export default function RoomCard({ room }) {
  return (
    <Link to={`/room/${room.id}`} className="room-card" style={{ '--accent': room.accent }}>
      <span className="room-card-mood">{room.mood}</span>
      <h3 className="room-card-song">{room.song}</h3>
      <p className="room-card-artist">{room.artist}</p>
      <p className="room-card-quote">“{room.quote}”</p>
    </Link>
  )
}
