import { reactions } from '../data/reactions'

export default function ReactionBar({ counts, myReactions, onToggle }) {
  return (
    <div className="reaction-bar">
      {reactions.map((reaction) => {
        const active = myReactions[reaction.key]
        const count = counts[reaction.key]
        return (
          <button
            key={reaction.key}
            type="button"
            className={active ? 'reaction-button active' : 'reaction-button'}
            onClick={() => onToggle(reaction.key)}
            aria-pressed={active}
          >
            <span className="reaction-emoji" aria-hidden="true">
              {reaction.emoji}
            </span>
            <span className="reaction-label">{reaction.label}</span>
            {count > 0 && <span className="reaction-count">{count}</span>}
          </button>
        )
      })}
    </div>
  )
}
