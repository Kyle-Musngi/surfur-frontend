import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { I18nProvider } from './contexts/I18nContext';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { FindPetPage } from './pages/FindPetPage';
import { PetDetailPage } from './pages/PetDetailPage';
import { ShelterMapPage } from './pages/ShelterMapPage';
import { ShelterDirectoryPage } from './pages/ShelterDirectoryPage';
import { ShelterProfilePage } from './pages/ShelterProfilePage';
import { PetQuizPage } from './pages/PetQuizPage';
import { ReportStrayPage } from './pages/ReportStrayPage';
import { EventsPage } from './pages/EventsPage';
import { DonatePage } from './pages/DonatePage';
import { AdoptionGuidePage } from './pages/AdoptionGuidePage';
import { AboutPage } from './pages/AboutPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { MyInquiriesPage } from './pages/MyInquiriesPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotificationsPage } from './pages/NotificationsPage';
import { RegisterShelterPage } from './pages/RegisterShelterPage';
import { ShelterDashboard } from './pages/dashboard/ShelterDashboard';
import { NotFoundPage } from './pages/NotFoundPage';

import { ThemeProvider } from './contexts/ThemeContext';
import { ErrorBoundary } from './components/ui/ErrorBoundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 3, // 3 minutes
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <I18nProvider>
            <AuthProvider>
              <BrowserRouter>
                <Routes>
                  <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/pets" element={<FindPetPage />} />
                <Route path="/pets/:id" element={<PetDetailPage />} />
                <Route path="/map" element={<ShelterMapPage />} />
                <Route path="/shelters" element={<ShelterDirectoryPage />} />
                <Route path="/shelters/register" element={<RegisterShelterPage />} />
                <Route path="/register-shelter" element={<RegisterShelterPage />} />
                <Route path="/shelters/:slug" element={<ShelterProfilePage />} />
                <Route path="/quiz" element={<PetQuizPage />} />
                <Route path="/report" element={<ReportStrayPage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/donate" element={<DonatePage />} />
                <Route path="/guide" element={<AdoptionGuidePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/inquiries" element={<MyInquiriesPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/dashboard" element={<ShelterDashboard />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
          </I18nProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
