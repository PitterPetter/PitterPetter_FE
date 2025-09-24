import { LoginPage } from './pages/LoginPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthInitializer } from './app/providers/AuthInitializer';
import { MainPage } from './pages/MainPage';
import { HeaderLayout } from './app/layouts';
import { OptionsPage } from './pages/OptionsPage';
import { RecommendCoursePage } from './pages/RecommendCoursePage';
import { MyPage } from './pages/MyPage';
import { DiaryListPage } from './pages/DiaryPage';
import { CourseListPage } from './pages/CourseListPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { DiaryDetailPage } from './pages/DiaryDetailPage';
import { SidebarLayout } from './app/layouts/SidebarLayout';
import { OnboardingPage } from './pages/OnboardingPage';
import { CoupleRoomPage } from './pages/CoupleRoomPage';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<HeaderLayout />}>
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/" element={<MainPage />} />
          <Route path="/options" element={<OptionsPage />} />
          <Route path="/recommend" element={<RecommendCoursePage />} />
          <Route path="/coupleroom" element={<CoupleRoomPage />} />
          <Route element={<SidebarLayout />}>
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/diary" element={<DiaryListPage />} />
            <Route path="/course" element={<CourseListPage />} />
            <Route path="/course/:id" element={<CourseDetailPage />} />
            <Route path="/diary/:id" element={<DiaryDetailPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
