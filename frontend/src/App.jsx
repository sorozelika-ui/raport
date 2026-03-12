import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
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
import ProtectedRoute from "./pages/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import NotificationAdmin from "./pages/NotificationAdmin";
import Notificationinbox from "./pages/Notificationinbox";
import TelephoneAppel from "./pages/TelephoneAppel";

const observer = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends observer {
  constructor(callback) {
    super((entries, observer) => {
      requestAnimationFrame(() => {
        callback(entries, observer);
      });
    });
  }
};
const isAuthenticated = () => {
  return localStorage.getItem("user") !== null;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pages accessibles sans connexion */}
        <Route path="/login" element={<Login />} />
        <Route path="/inscription" element={<Inscription />} />
         <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* Redirection automatique vers /dashboard */}
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

        {/* Routes protégées - Accessibles à tous les utilisateurs connectés */}
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
          path="/navigation"
          element={
            <ProtectedRoute>
              <Layout>
                <EvolutionPrestataire />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/prestataire/notifications"
          element={
            <ProtectedRoute>
              <Layout>
                <Notificationinbox />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Routes protégées - ADMIN UNIQUEMENT */}
        <Route
          path="/prestataire_evalues"
          element={
            <ProtectedRoute adminOnly={true}>
              <Layout>
                <PrestatairesEvalues />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/evaluation"
          element={
            <ProtectedRoute adminOnly={true}>
              <Layout>
                <Evaluation />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/prestataires"
          element={
            <ProtectedRoute adminOnly={true}>
              <Layout>
                <Prestataires />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/critere"
          element={
            <ProtectedRoute adminOnly={true}>
              <Layout>
                <Critere />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/annee"
          element={
            <ProtectedRoute adminOnly={true}>
              <Layout>
                <Annee />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/note"
          element={
            <ProtectedRoute adminOnly={true}>
              <Layout>
                <Notes />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/notification"
          element={
            <ProtectedRoute adminOnly={true}>
              <Layout>
                <NotificationAdmin />
              </Layout>
            </ProtectedRoute>
          }
        />
        
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;
