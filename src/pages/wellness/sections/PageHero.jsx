import { PAGES, pageHref } from '../pages'
import { Pic } from '../editorial'
import './yw-page.css'

// 하위 페이지 머리 — 사진 위에 경로(홈 / 페이지)와 영문 이름표, 페이지 제목. 메인 히어로보다 낮게(화면의 60% 남짓) 둔다.
export default function PageHero({ title, en, pic, pos = 'center' }) {
  return (
    <section className="yw-phero" data-theme="dark" data-cursor-off>
      <div className="yw-phero__bg" aria-hidden="true">
        <Pic pic={pic} sizes="100vw" priority style={{ objectPosition: pos }} />
      </div>
      <div className="yw-wrap yw-phero__in">
        <nav className="yw-phero__crumb" aria-label="현재 위치">
          <ol>
            <li>
              <a href={pageHref(PAGES.home)}>홈</a>
            </li>
            <li aria-current="page">{title}</li>
          </ol>
        </nav>
        {en && (
          <p className="yw-phero__en" lang="en">
            {en}
          </p>
        )}
        <h1 className="yw-phero__title">{title}</h1>
      </div>
    </section>
  )
}
