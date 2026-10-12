import { useId, useState } from 'react'

// 알약형 탭 + 선택한 항목의 설명. 글을 한꺼번에 늘어놓지 않고 하나씩 보여 줄 때 쓴다.
export default function Tabs({ label, items }) {
  const uid = useId()
  const [active, setActive] = useState(items[0].id)
  const current = items.find((i) => i.id === active)

  return (
    <div className="w-tabset">
      <div className="w-pilltabs" role="tablist" aria-label={label}>
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`${uid}-${item.id}`}
            aria-selected={item.id === active}
            aria-controls={`${uid}-panel`}
            className={item.id === active ? 'is-active' : undefined}
            onClick={() => setActive(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <p className="w-tabset__panel" role="tabpanel" id={`${uid}-panel`} aria-labelledby={`${uid}-${active}`}>
        {current.text}
      </p>
    </div>
  )
}
