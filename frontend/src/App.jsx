import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Inscription from "./pages/Inscription";
import Critere from "./pages/Critere";
import Annee from "./pages/Annee";
import Notes from "./pages/Notes";
import Evaluation from "./pages/Evaluation";
import Prestataires from "./pages/prestataires";
import PrestatairesEvalues from "./pages/Prestataires_evalues";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pages sans Layout (Login et Inscription) */}
        <Route path="/login" element={<Login />} />
        <Route path="/inscription" element={<Inscription />} />

        {/* Pages avec Layout */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
  
  path="/prestataire_evalues"
  element={
    
      <Layout>
        <PrestatairesEvalues />
      </Layout>
    
  }
/>

<Route
  path="/evaluation"
  element={
      <Layout>
        <Evaluation />
      </Layout>

  }
/>

<Route
  path="/prestataires"
  element={
  
      <Layout>
        <Prestataires />
      </Layout>
  
  }
/>

<Route
  path="/critere"
  element={
   
      <Layout>
        <Critere />
      </Layout>
   
  }
/>

<Route
  path="/annee"
  element={
   
      <Layout>
        <Annee />
      </Layout>
  
  }/>

 <Route
  path="/note"
  element={
      <Layout>
        <Notes />
      </Layout>
    }/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
