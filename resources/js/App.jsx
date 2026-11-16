import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';
import Tentang from '@/pages/Tentang';
import Profil from '@/pages/Profil';
import CariTurnamen from '@/pages/CariTurnamen';
import DetailTurnamen from '@/pages/DetailTurnamen';
import Pendaftaran from '@/pages/Pendaftaran';
import Pembayaran from '@/pages/Pembayaran';
import TurnamenSaya from '@/pages/TurnamenSaya';
import DetailTurnamenSaya from '@/pages/DetailTurnamenSaya';
import Jadwal from '@/pages/Jadwal';
import Pertandingan from '@/pages/Pertandingan';
import OrganizerDashboard from '@/pages/organizer/Dashboard';
import BuatTurnamen from '@/pages/organizer/BuatTurnamen';
import OrganizerTurnamenSaya from '@/pages/organizer/TurnamenSaya';
import OrganizerDetailTurnamen from '@/pages/organizer/DetailTurnamen';

function App() {

  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <AuthProvider>
          <ScrollToTop />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/tentang" element={<Tentang />} />
              <Route path="/profil" element={<Profil />} />
              <Route path="/cari-turnamen" element={<CariTurnamen />} />
              <Route path="/turnamen/:id" element={<DetailTurnamen />} />
              <Route path="/pendaftaran/:id" element={<Pendaftaran />} />
              <Route path="/pembayaran/:id" element={<Pembayaran />} />
              <Route path="/turnamen-saya" element={<TurnamenSaya />} />
              <Route path="/turnamen-saya/:id" element={<DetailTurnamenSaya />} />
              <Route path="/jadwal" element={<Jadwal />} />
              <Route path="/pertandingan" element={<Pertandingan />} />
              <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
              <Route path="/organizer/buat-turnamen" element={<BuatTurnamen />} />
              <Route path="/organizer/turnamen-saya" element={<OrganizerTurnamenSaya />} />
              <Route path="/organizer/turnamen/:id" element={<OrganizerDetailTurnamen />} />
              <Route path="*" element={<PageNotFound />} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App