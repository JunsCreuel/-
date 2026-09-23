import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Firebase 콘솔(https://console.firebase.google.com) > 프로젝트 설정 >
// 일반 > 내 앱(웹 앱) 에서 나오는 값을 그대로 붙여넣으세요.
// 이 config 값들은 비밀키가 아니라 공개용 클라이언트 식별자라 코드에 그대로
// 있어도 괜찮습니다 (실제 보안은 Firestore 보안 규칙이 담당합니다).
const firebaseConfig = {
  apiKey: 'TODO',
  authDomain: 'TODO',
  projectId: 'TODO',
  storageBucket: 'TODO',
  messagingSenderId: 'TODO',
  appId: 'TODO',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
