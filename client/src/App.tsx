import { Routes, Route } from "react-router";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/marketing/Home";
import NotFound from "./pages/errors/NotFound";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>

        {/* Public Marketing Routes */}
        <Route path="/" element={<Home />} />
        
      </Route>


        {/* Catch-All 404 Route (No Header/Footer preferred to keep focus clear) */}
        <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
