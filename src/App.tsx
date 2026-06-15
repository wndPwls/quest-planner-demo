import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Nav from './components/Nav';
import HomePage from './pages/HomePage';
import GoalsPage from './pages/GoalsPage';
import CharacterPage from './pages/CharacterPage';
import CalendarPage from './pages/CalendarPage';
import MyInfoPage from './pages/MyInfoPage';
import SettingsPage from './pages/SettingsPage';
import ShopPage from './pages/ShopPage';
import CommunityPage from './pages/CommunityPage';
import './App.css';

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <AppProvider>
        <div className="app-shell">
          <main className="app-main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/goals" element={<GoalsPage />} />
              <Route path="/character" element={<CharacterPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/myinfo" element={<MyInfoPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/community" element={<CommunityPage />} />
            </Routes>
          </main>
          <Nav />
        </div>
      </AppProvider>
    </BrowserRouter>
  );
}
