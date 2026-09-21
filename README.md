# 새벽의 댓글창

노래와 글귀가 있는 방에서 익명으로 사연을 남기고, 정해진 반응 버튼만으로
서로를 위로하는 웹 서비스의 컨셉 데모입니다.

- 로그인·회원가입 없이 누구나 방을 둘러볼 수 있습니다.
- 방에 남긴 사연과 반응은 현재 데모 단계에서는 각자의 브라우저(`localStorage`)에만
  저장되며, 다른 방문자에게는 보이지 않습니다.

## 기술 스택

- React 19 + Vite
- react-router-dom 7 (`HashRouter`)
- React Context + `useState` 기반 전역 상태 (`src/store/useApp.jsx`)
- 순수 CSS (`src/index.css`의 CSS 변수 토큰)
- oxlint

## 개발

```bash
npm install
npm run dev      # 개발 서버
npm run lint      # oxlint
npm run build     # 프로덕션 빌드
```

## 배포

`main` 브랜치에 푸시하면 GitHub Actions(`.github/workflows/deploy.yml`)가
자동으로 빌드 후 GitHub Pages에 배포합니다.
