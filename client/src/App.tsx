import { Routes, Route } from "react-router";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/marketing/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import NotFound from "./pages/errors/NotFound";
import Privacy from "./pages/marketing/Privacy";
import Terms from "./pages/marketing/Terms";
import Dashboard from "./pages/Dashboard";
import MyLetters from "./pages/MyLetters";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { RedirectIfAuthenticated } from "./components/RedirectIfAuthenticated";
import { AuthProvider } from '@/contexts/AuthContext';
import ForgotPassword from "./pages/auth/ForgotPassword";
import Letters from "./pages/letters/CategorySelection";
import LetterWizard from "./pages/letters/wizard/LetterWizard";

function App() {
  return (
    <AuthProvider>
      <Routes>

        {/* Auth routes - outside MainLayout (no header/footer).
          Wrapped so a logged-in user can't navigate back to these. */}
        <Route element={<RedirectIfAuthenticated />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* Public Marketing Routes - with MainLayout (header/footer) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/privacy" element={<Privacy/>}/>
          <Route path="/terms" element={<Terms/>}/>
          <Route path="/letter" element={<Letters/>}/>
          <Route path="/letter/:category" element={<LetterWizard />}/>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-letters" element={<MyLetters />} />
        </Route>



        {/* Catch-All 404 Route (No Header/Footer preferred to keep focus clear) */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
