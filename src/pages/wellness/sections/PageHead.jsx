import { PAGES, pageHref } from '../pages'
import './yw-page.css'

// 하위 페이지 머리: 경로(홈 / 페이지) · 영문 이름 · 페이지 제목. 사진 없이 짧게 두고 바로 내용으로 들어간다.
export default function PageHead({ title, en }) {
  return (
    <header className="yw-phead" data-theme="light">
      <div className="yw-wrap">
        <nav className="yw-phead__crumb" aria-label="현재 위치">
          <ol>
            <li>
              <a href={pageHref(PAGES.home)}>홈</a>
            </li>
            <li aria-current="page">{title}</li>
          </ol>
        </nav>
        {en && (
          <p className="yw-phead__en" lang="en">
            {en}
          </p>
        )}
        <h1 className="yw-phead__title">{title}</h1>
      </div>
    </header>
  )
}
