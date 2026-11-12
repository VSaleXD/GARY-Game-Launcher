import { useState } from "react";
import LandingPage from "./Pages/landingPage";
import GaryGameHub from "./Pages/garyGameHub";

function App() {
  const [page, setPage] = useState<"landing" | "hub">("landing");

  return page === "landing"
    ? <LandingPage onOpenHub={() => setPage("hub")} />
    : <GaryGameHub onBack={() => setPage("landing")} />;
}

export default App;
