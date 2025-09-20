import { LoginPage } from './pages/LoginPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthInitializer } from './app/providers/AuthInitializer';
import { MainPage } from './pages/MainPage';
import { HeaderLayout } from './app/layouts';
import { OptionsPage } from './pages/OptionsPage';
import { RecommendCoursePage } from './pages/RecommendCoursePage';
function App() {

  return (
    <BrowserRouter>
      <HeaderLayout />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<MainPage />} />
        <Route path="/options" element={<OptionsPage />} />
        <Route path="/recommend" element={<RecommendCoursePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
