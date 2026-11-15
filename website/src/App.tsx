import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./Pages/landingPage";
import GaryGameHub from "./Pages/garyGameHub";
import ResourcePage from "./Pages/ResourcePage";
import UploadPage from "./Pages/uploadPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/game-hub" element={<GaryGameHub />} />
        <Route path="/materi" element={<ResourcePage kind="material" title="Materi GARY" intro="Belajar game development bersama komunitas GARY." />} />
        <Route path="/dokumentasi" element={<ResourcePage kind="documentation" title="Dokumentasi GARY" intro="Panduan dan catatan teknis untuk membuat game bersama." />} />
        <Route path="/upload" element={<UploadPage />} />
      </Routes>
    </BrowserRouter>
  );
}
