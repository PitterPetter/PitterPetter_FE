# Loventure / Frontend

AI가 커플을 위한 맞춤형 데이트 코스를 추천해주는 웹 애플리케이션입니다.

## 🚀 프로젝트 개요

Loventure는 커플들이 더 특별한 데이트를 즐길 수 있도록 AI가 개인화된 코스를 추천해주는 서비스입니다. 사용자의 선호도, 시간 등을 고려하여 최적의 데이트 루트를 제안합니다.

## ✨ 주요 기능

### 🗺️ 지도 기반 코스 추천
- **시작점 선택**: 지도를 클릭하여 데이트 시작점을 선택
- **AI 추천**: 사용자 선호도와 조건을 바탕으로 한 맞춤형 코스 추천
- **실시간 지도**: Mapbox를 활용한 인터랙티브한 지도 UI

### 💕 커플 기능
- **커플 룸**: 커플 방 생성 및 입장 기능

### 📝 다이어리
- **기록 저장**: 다녀온 코스와 경험을 다이어리로 기록
- **지도 표시**: 다이어리 위치를 지도에 마커로 표시

### 👤 마이페이지
- **프로필 관리**: 사용자 프로필 정보 관리
- **커플 홈**: 커플과의 공유 공간

## 🛠️ 기술 스택

### Frontend
- **React 19.1.1** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Vite** - 빌드 도구
- **React Router DOM** - 라우팅
- **TanStack Query** - 서버 상태 관리
- **Zustand** - 클라이언트 상태 관리

### UI/UX
- **Tailwind CSS** - 스타일링
- **Material-UI (MUI)** - 컴포넌트 라이브러리
- **FontAwesome** - 아이콘

### 지도 & 위치
- **Mapbox GL JS** - 지도 렌더링

### 기타
- **Axios** - HTTP 클라이언트
- **Date-fns** - 날짜 처리
- **ESLint** - 코드 품질 관리

## 📁 프로젝트 구조

```
src/
├── app/                    # 앱 설정 및 레이아웃
│   ├── layouts/           # 공통 레이아웃 컴포넌트
│   └── providers/         # 전역 프로바이더
├── features/              # 기능별 모듈
│   ├── auth/             # 인증 관련
│   ├── course/           # 코스 추천 관련
│   ├── diary/            # 다이어리 관련
│   ├── mapbox/           # 지도 관련
│   ├── mypage/           # 마이페이지 관련
│   └── option/           # 옵션 설정 관련
├── pages/                 # 페이지 컴포넌트
│   ├── LoginPage/        # 로그인 페이지
│   ├── MainPage/         # 메인 페이지 (지도)
│   ├── OptionsPage/      # 옵션 설정 페이지
│   ├── RecommendCoursePage/ # 코스 추천 페이지
│   ├── CourseListPage/   # 코스 목록 페이지
│   ├── CourseDetailPage/ # 코스 상세 페이지
│   ├── DiaryPage/        # 다이어리 페이지
│   ├── MyPage/           # 마이페이지
│   ├── CoupleRoomPage/   # 커플 룸 페이지
│   └── OnboardingPage/   # 온보딩 페이지
├── shared/               # 공통 모듈
│   ├── api/             # API 관련
│   ├── store/           # 상태 관리
│   ├── ui/              # 공통 UI 컴포넌트
│   └── types/           # 공통 타입 정의
└── main.tsx             # 앱 진입점
```

## 🚀 시작하기

### 필수 요구사항
- Node.js 18.0.0 이상
- npm 또는 yarn

### 설치 및 실행

1. **저장소 클론**
```bash
git clone [repository-url]
cd PitterPetter_FE
```

2. **의존성 설치**
```bash
npm install
```

3. **환경 변수 설정**
```bash
# .env 파일 생성
VITE_API_BASE_URL=your_api_base_url
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_token
```

4. **개발 서버 실행**
```bash
npm run dev
```

5. **빌드**
```bash
npm run build
```

## 🔄 사용자 플로우

1. **로그인**: Google OAuth를 통한 로그인
2. **시작점 선택**: 메인 페이지에서 지도를 클릭하여 시작점 선택
3. **옵션 설정**: 시간, 컨디션, 음주 의향, 음식 선호도 등 설정
4. **코스 추천**: AI가 개인화된 데이트 코스 추천
5. **코스 확인**: 추천받은 코스의 상세 정보 확인
6. **저장**: 마음에 드는 코스를 저장
7. **다이어리 작성**: 다녀온 코스의 경험을 다이어리로 기록

## 🔧 개발 환경 설정

### 코드 스타일
- ESLint를 통한 코드 품질 관리
- TypeScript를 통한 타입 안정성 보장

### 상태 관리
- **Zustand**: 클라이언트 상태 관리 (지도 마커, 추천 데이터 등)
- **TanStack Query**: 서버 상태 관리 및 캐

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해 주세요.