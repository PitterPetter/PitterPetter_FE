import { LoginPage } from './pages/LoginPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { AuthInitializer } from './app/providers/AuthInitializer';
import { MainPage } from './pages/MainPage';
import { HeaderLayout } from './app/layouts';
import { OptionsPage } from './pages/OptionsPage';
import { RecommendCoursePage } from './pages/RecommendCoursePage';
import { MyPage } from './pages/MyPage';
import { DiaryListPage } from './pages/DiaryPage';
import { CourseListPage } from './pages/CourseListPage';
import { CourseDetailPage, CourseDetailSidebar, PlaceDetailSidebar } from './pages/CourseDetailPage';
import { DiaryDetailPage } from './pages/DiaryDetailPage';
import { SidebarLayout } from './app/layouts/SidebarLayout';
import { OnboardingPage } from './pages/OnboardingPage';
import { CoupleRoomPage, EnterCoupleRoom, CreateCoupleRoom } from './pages/CoupleRoomPage';
import { RecommendCourseSidebar, RecommendPlaceSidebar } from './pages/RecommendCoursePage';
import AuthBootstrap from './app/providers/AuthBootstrap';

function App() {

  return (
    <BrowserRouter>
      <AuthBootstrap />
      <Routes>
        {/* 로그인 페이지 */}
        <Route path="/login" element={<LoginPage />} />

        {/* 헤더 레이아웃 */}
        <Route element={<HeaderLayout />}>
          <Route path="/home" element={<MainPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/options" element={<OptionsPage />} />

          {/* 커플 룸 페이지 */}
          <Route path="/coupleroom" element={<CoupleRoomPage />} />
          <Route path="/coupleroom/create" element={<CreateCoupleRoom />} />
          <Route path="/coupleroom/enter" element={<EnterCoupleRoom />} />

          {/* 코스 추천 페이지 */}
          <Route path="/recommend" element={<RecommendCoursePage />}>
            <Route index element={<RecommendCourseSidebar />} />
            <Route path="course/:id" element={<RecommendPlaceSidebar />} />
          </Route>

          {/* 코스 상세 페이지 */}
          <Route path="/course/:id" element={<CourseDetailPage />}>
            <Route index element={<CourseDetailSidebar />} />
            <Route path="place/:id" element={<PlaceDetailSidebar />} />
          </Route>

          {/* 사이드바 페이지 */}
          <Route element={<SidebarLayout />}>
            <Route path="/course" element={<CourseListPage />} />
            <Route path="/mypage" element={<MyPage />} />

            {/* 다이어리 페이지 */}
            <Route path="/diary" element={<DiaryListPage />} />
            <Route path="/diary/:id" element={<DiaryDetailPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
