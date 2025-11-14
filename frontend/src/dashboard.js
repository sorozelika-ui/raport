import Sidebar from '../components/Sidebar';

export default function Dashboard() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-4">Bienvenue sur le Dashboard</h1>
        <p className="text-gray-700">Ici tu pourras gérer les prestataires et les évaluations.</p>
      </div>
    </div>
  );
}
