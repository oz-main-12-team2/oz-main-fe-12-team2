# LOV2LY

LOV2LY 도서 판매 App

---

## 프로젝트 구조

```plaintext
LOV2LY/
├── node_modules/          # 프로젝트 의존성 패키지
├── public/                # 정적 파일 (favicon, logo)
│   ├── favicon.svg
│   └── logo.svg
├── src/                   # 소스 코드
│   ├── admin/             # 관리자 페이지 관련 코드
│   │   ├── components/    # 관리자 전용 UI 컴포넌트
│   │   ├── pages/         # 관리자 페이지 컴포넌트
│   │   ├── AdminLayout.jsx# 관리자 레이아웃 컴포넌트
│   │   └── adminRoutes.jsx# 관리자 라우터 설정
│   ├── api/               # API 요청 관련 코드
│   ├── assets/            # 이미지, 폰트 등 리소스
│   ├── components/        # 재사용 가능한 UI 컴포넌트
│   │   ├── common/        # 공용 컴포넌트
│   │   └── layout/        # 레이아웃 컴포넌트
│   ├── pages/             # 사용자 페이지 컴포넌트
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
```
---
## Git 브랜치 & PR & 커밋 가이드
# 브랜치 전략

항상 dev 브랜치에서 시작

  ```bash
  git checkout dev
  git pull
  ```
* 새 작업 시작 시 해당 이슈 번호 확인
* feature 브랜치 생성 (이슈 번호 포함)

  ```bash
  git checkout -b feature/1-kms
  ```
* 작업 → 커밋 → push
* dev로 Pull Request 생성 (리뷰 후 squash merge)
* feature 브랜치 삭제:

  ```bash
  git branch -D feature/1
  git push origin --delete feature/1
  ```
* 다음 작업 시작 전 dev 브랜치 pull:

  ```bash
  git checkout dev
  git pull
  ```

2. 커밋 메시지 규칙

---

* (#2) 같은 이슈번호는 커밋 메시지에 붙이지 않음
* 커밋은 작게, 자주 나눠서 작성

**커밋 타입 컨벤션**

| 타입       | 설명            | 예시                   |
| -------- | ------------- | -------------------- |
| Feat     | 새로운 기능 추가     | Feat: 로그인 페이지 추가     |
| Fix      | 버그/오류 수정      | Fix: header UI 깨짐 수정 |
| Style    | 코드형식/디자인만 수정  | Style: 코드 들여쓰기 수정    |
| Refactor | 기능 변화 없이 리팩토링 | Refactor: 중복 함수 제거   |
| Chore    | 기타 작업/환경 설정   | Chore: 프론트 빌드셋업 추가   |
| Docs     | 문서/주석 관련      | Docs: README 업데이트    |
| Test     | 테스트 코드 관련     | Test: 로그인 테스트케이스 추가  |
| Remove   | 파일/코드 삭제      | Remove: 불필요한 이미지 삭제  |

3. Pull Request 작성

---

* PR 제목: `Feat: 메인페이지 UI 구현 (#2)`
* PR 본문: `Closes #2`  → 머지 시 해당 이슈 자동 종료

4. 테스트 방법

---

1. 테스트 전 현재 작업 임시 저장

```bash
git add .
git commit -m "작업중이던거 커밋으로 안전하게 저장"
```

2. PR 테스트 브랜치 가져오기

```bash
git fetch origin pull/<PR번호>/head:test
ex) git fetch origin pull/3/head:test
```

3. 테스트 브랜치 체크아웃

```bash
git checkout test
```

4. 테스트 후 문제 없으면 브랜치 삭제 및 squash merge

```bash
git branch -D test
# github에서 dev로 squash merge
```

5. dev 브랜치 최신화

```bash
git checkout dev
git pull origin dev
```

6. 자신의 feature 브랜치 최신화

```bash
git checkout feat/내브랜치
git rebase dev    # 또는 git merge dev
```

7. 원격 브랜치 삭제

```bash
git push origin --delete feat/6-kms
```

8. 로컬 브랜치 삭제

```bash
git branch -D feat/6-kms
```

9. dev 강제 최신화

```bash
git fetch origin dev
git reset --hard origin/dev
```
