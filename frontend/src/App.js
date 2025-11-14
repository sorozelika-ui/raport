import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Prestataires from './pages/Prestataires';
import Evaluations from './pages/Evaluations';
import Resultats from './pages/Resultats';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/prestataires" element={<Prestataires />} />
        <Route path="/evaluations" element={<Evaluations />} />
        <Route path="/resultats" element={<Resultats />} />
      </Routes>
    </Router>
  );
}

export default App;
