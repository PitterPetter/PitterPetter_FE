import './App.css';
import { LoginPage } from './pages/LoginPage';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthInitializer } from './app/providers/AuthInitializer';
import { MainPage } from './pages/MainPage';
import { HeaderLayout } from './app/layouts';
import { OptionsPage } from './pages/OptionsPage';
import { RecommendCoursePage } from './pages/RecommendCoursePage';
import { MyPage } from './pages/MyPage';
import { DiaryListPage } from './pages/DiaryPage';
import { CourseListPage } from './pages/CourseListPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { CourseDetailSidebar, PlaceDetailSidebar } from './features/course';
import { DiaryDetailPage } from './pages/DiaryDetailPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { PersonalOnboarding } from './features/onboarding/PersonalOnboarding';
import { CoupleRoomPage, EnterCoupleRoom, CreateCoupleRoom } from './pages/CoupleRoomPage';
import AuthBootstrap from './app/providers/AuthBootstrap';
import { CoupleRoomModal } from './pages/CoupleRoomPage/CoupleRoomModal';
import { CoupleCodeRoom } from './pages/CoupleRoomPage/CoupleCodeRoom';
import { CreateDiaryPage } from './pages/DiaryPage/CreateDiaryPage';
import { DistrictModal } from './pages/DistrictPage/DistrictModal';
import { DistrictChoose } from './pages/DistrictPage/DistrictChoose';
import { UpdateDiaryPage } from './pages/DiaryPage/UpdateDiaryPage';
import { DistrictCheck } from './pages/DistrictPage/DistrictCheck';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from './app/providers/PrivateRoute';

// 로그인 페이지에서만 AuthBootstrap 실행
const LoginPageWithBootstrap = () => (
  <>
    <AuthBootstrap />
    <LoginPage />
  </>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 기본 경로 - 로그인으로 리디렉션 */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* 로그인 페이지 */}
        <Route path="/login" element={<LoginPageWithBootstrap />} />
        
        {/* 헤더 레이아웃 */}
        <Route element={<HeaderLayout />}>
          {/* 온보딩 페이지 */}
          <Route element={<PrivateRoute permissionLevel="ONBOARDING_REQUIRED" />}>
            <Route path="onboarding" element={<OnboardingPage />}>
              <Route index element={<PersonalOnboarding />} />
            </Route>
          </Route>

          {/* 커플 룸 페이지 */}
          <Route element={<PrivateRoute permissionLevel="COUPLE_MATCHING_REQUIRED" />}>
            <Route path="coupleroom" element={<CoupleRoomModal />}>
              <Route index element={<CoupleRoomPage />} />
              <Route path="create" element={<CreateCoupleRoom />} />
              <Route path="create/:id" element={<CoupleCodeRoom />} />
              <Route path="enter" element={<EnterCoupleRoom />} />
            </Route>
          </Route>

          {/* 지역 잠금 페이지 */}
          <Route element={<PrivateRoute permissionLevel="LOCK_REQUIRED" />}>
            <Route path="district" element={<DistrictModal />}>
              <Route path="choose" element={<DistrictChoose />} />
              <Route path="check" element={<DistrictCheck />} />
            </Route>
          </Route>

          {/* 완료된 사용자 페이지들 */}
          <Route element={<PrivateRoute permissionLevel="COMPLETED" />}>
            <Route path="home" element={<MainPage />} />
            <Route path="options" element={<OptionsPage />} />

            {/* 코스 추천 페이지 */}
            <Route path="recommend" element={<RecommendCoursePage />}>
              <Route index element={<CourseDetailSidebar />} />
              <Route path=":id" element={<PlaceDetailSidebar />} />
            </Route>

            {/* 코스 상세 페이지 */}
            <Route path="course/:id" element={<CourseDetailPage />}>
              <Route index element={<CourseDetailSidebar />} />
              <Route path="place/:placeId" element={null} />
            </Route>

            {/* 코스 목록 페이지 */}
            <Route path="course" element={<CourseListPage />} />

            {/* 마이페이지 */}
            <Route path="mypage" element={<MyPage />} />

            {/* 다이어리 페이지 */}
            <Route path="diary" element={<DiaryListPage />} />
            <Route path="diary/create" element={<CreateDiaryPage />} />
            <Route path="diary/update/:id" element={<UpdateDiaryPage />} />
            <Route path="diary/:id" element={<DiaryDetailPage />} />
          </Route>
        </Route>
      </Routes>
      <ToastContainer 
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        theme="light"
      />
    </BrowserRouter>
  )
}

export default App
