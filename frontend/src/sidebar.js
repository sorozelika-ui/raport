import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <Link to="/dashboard" className="mb-3 hover:text-blue-400">Accueil</Link>
      <Link to="/prestataires" className="mb-3 hover:text-blue-400">Prestataires</Link>
      <Link to="/evaluations" className="mb-3 hover:text-blue-400">Évaluations</Link>
      <Link to="/resultats" className="mb-3 hover:text-blue-400">Résultats</Link>
    </div>
  );
}
