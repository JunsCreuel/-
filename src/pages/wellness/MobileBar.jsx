import { telHref } from './data'
import { scrollToId } from './scroll'

// 모바일에서만 보이는 하단 고정 바: 전화 / 상담 예약
export default function MobileBar({ branch }) {
  return (
    <div className="w-bar">
      <a className="w-btn w-btn--light" href={telHref(branch.phone)}>
        전화
      </a>
      <button type="button" className="w-btn w-btn--primary" onClick={() => scrollToId('booking')}>
        상담 예약
      </button>
    </div>
  )
}
