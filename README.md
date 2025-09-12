# 프로젝트 이름

LOV2LY 도서 판매 App

---

## 📂 프로젝트 구조

```plaintext
LOV2LY/
├── node_modules/          # 프로젝트 의존성 패키지
├── public/                # 정적 파일 (favicon, logo)
│   ├── favicon.svg
│   └── logo.svg
├── src/                   # 소스 코드
│   ├── api/               # API 요청 관련 코드
│   ├── assets/            # 이미지, 폰트 등 리소스
│   ├── components/        # 재사용 가능한 UI 컴포넌트
│   │   ├── common/        # 공용 컴포넌트
│   │   └── layout/        # 레이아웃 컴포넌트
│   ├── pages/             # 페이지 컴포넌트
│   ├── stores/            # 상태 관리 (Zustand)
│   ├── styles/            # 전역 스타일 파일
│   ├── utils/             # 유틸리티 함수 모음
│   ├── App.jsx            # 루트 컴포넌트
│   └── main.jsx           # 진입점 파일
├── .gitignore             # Git에 포함하지 않을 파일 목록
├── eslint.config.js       # ESLint 설정
├── index.html             # 메인 HTML 파일
├── package.json           # 프로젝트 메타데이터 및 의존성
├── package-lock.json      # 의존성 버전 고정
├── README.md              # 프로젝트 설명 파일
└── vite.config.js         # Vite 설정 파일