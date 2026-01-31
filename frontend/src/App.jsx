import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
// import Login from "./pages/Login";
import Inscription from "./pages/Inscription";
import Critere from "./pages/Critere";
import Annee from "./pages/Annee";
import Notes from "./pages/Notes";
import Evaluation from "./pages/Evaluation";
import Prestataires from "./pages/prestataires";
import PrestatairesEvalues from "./pages/Prestataires_evalues";
import Consulter from "./pages/Consulter";
import Notification from "./pages/Notification";
import EvolutionPrestataire from "./pages/EvolutionPrestataire";
import Login from "./pages/Login";

// 🔐 Vérifie si l'utilisateur est connecté
const isAuthenticated = () => {
  return localStorage.getItem("user") !== null; 
};

// 🔒 Composant pour protéger les routes
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pages accessibles sans connexion */}
        <Route path="/login" element={<Login />} />
        <Route path="/inscription" element={<Inscription />} />

        {/* Redirection automatique vers /dashboard si connecté */}
        <Route
          path="/"
          element={
            isAuthenticated() ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Routes protégées */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/prestataire_evalues"
          element={
            <ProtectedRoute>
              <Layout>
                <PrestatairesEvalues />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/evaluation"
          element={
            <ProtectedRoute>
              <Layout>
                <Evaluation />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/prestataires"
          element={
            <ProtectedRoute>
              <Layout>
                <Prestataires />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/critere"
          element={
            <ProtectedRoute>
              <Layout>
                <Critere />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/annee"
          element={
            <ProtectedRoute>
              <Layout>
                <Annee />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/note"
          element={
            <ProtectedRoute>
              <Layout>
                <Notes />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/consulter-resultat"
          element={
            <ProtectedRoute>
              <Layout>
                <Consulter />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/notification"
          element={
            <ProtectedRoute>
              <Layout>
                <Notification />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/navigation"
          element={
            <ProtectedRoute>
              <Layout>
                <EvolutionPrestataire />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
