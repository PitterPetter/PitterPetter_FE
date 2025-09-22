import { LoginPage } from './pages/LoginPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthInitializer } from './app/providers/AuthInitializer';
import { MainPage } from './pages/MainPage';
import { HeaderLayout } from './app/layouts';
import { OptionsPage } from './pages/OptionsPage';
import { RecommendCoursePage } from './pages/RecommendCoursePage';
import { MyPage } from './pages/MyPage';
import { DiaryPage } from './pages/DiaryPage';
import { CourseListPage } from './pages/CourseListPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { DiaryDetailPage } from './pages/DiaryDetailPage';

function App() {

  return (
    <BrowserRouter>
      <HeaderLayout />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<MainPage />} />
        <Route path="/options" element={<OptionsPage />} />
        <Route path="/recommend" element={<RecommendCoursePage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/diary" element={<DiaryPage />} />
        <Route path="/course" element={<CourseListPage />} />
        <Route path="/course/:id" element={<CourseDetailPage />} />
        <Route path="/diary/:id" element={<DiaryDetailPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
