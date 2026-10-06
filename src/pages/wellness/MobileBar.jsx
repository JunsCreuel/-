import { reserveAction, telHref } from './data'

// 모바일에서만 보이는 하단 고정 예약 바 (전화 / 네이버 예약)
export default function MobileBar({ branch }) {
  const reserve = reserveAction(branch)
  return (
    <div className="w-bar">
      {reserve.external ? (
        <>
          <a className="w-btn w-btn--light" href={telHref(branch.phone)}>
            전화
          </a>
          <a className="w-btn w-btn--primary" href={reserve.href} target="_blank" rel="noopener noreferrer">
            네이버 예약
          </a>
        </>
      ) : (
        <a className="w-btn w-btn--primary" href={reserve.href}>
          전화로 예약하기
        </a>
      )}
    </div>
  )
}
