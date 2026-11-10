import { PAGES, pageHref } from '../pages'

// 하위 페이지 머리: 경로(홈 / 페이지) · 페이지 제목. 사진 없이 짧게 두고 바로 내용으로 들어간다.
export default function PageHead({ title }) {
  return (
    <header
      className="border-b border-line bg-white px-(--w-gutter) pt-[clamp(3rem,7vw,5.5rem)] pb-[clamp(2.5rem,5vw,4rem)] [&+[data-curtain]]:mt-0"
      data-theme="light"
    >
      <div className="mx-auto w-full max-w-(--yw-max)">
        <nav aria-label="현재 위치">
          <ol className="m-0 mb-6 flex list-none gap-2 p-0 text-[0.82rem] text-muted [&_a]:text-inherit [&_a]:no-underline [&>li+li]:before:mr-2 [&>li+li]:before:opacity-50 [&>li+li]:before:content-['/']">
            <li>
              <a href={pageHref(PAGES.home)}>홈</a>
            </li>
            <li aria-current="page">{title}</li>
          </ol>
        </nav>
        <h1 className="m-0 font-serif text-[clamp(2.25rem,4.6vw,3.75rem)] leading-[1.2] font-medium tracking-[-0.03em]">{title}</h1>
      </div>
    </header>
  )
}
