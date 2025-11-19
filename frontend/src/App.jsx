import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "rsuite/dist/rsuite.min.css";
import "./App.css";

// Pages
import Prestataires from "./pages/prestataires";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Critere from "./pages/Critere";
import Notes from "./pages/Notes";
import Annee from "./pages/Annee";
function App() {
  return (
    <Router>
      <Routes>
        {/* Page principale du Dashboard */}
        <Route path="/" element={<Dashboard />} />

        {/* Sous-pages */}

        <Route path="/prestataires" element={<Prestataires />} />
        <Route path="/login" element={<Login />} />
        <Route path="/critere" element={<Critere />} />
        <Route path="/note" element={<Notes />} />
        <Route path="/annee" element={<Annee />} />
      </Routes>
    </Router>
  );
}

export default App;
