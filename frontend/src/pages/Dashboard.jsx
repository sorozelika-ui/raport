import React from "react";
import { motion } from "framer-motion";
import { Home, Users, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";


const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="p-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="max-w-5xl"
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-5xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent"
        >
          Bienvenue sur DGBF-PERFORM
        </motion.h2>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "6rem" }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-8"
        ></motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-lg text-gray-700 leading-relaxed mb-12"
        >
          Sélectionnez un menu dans la barre latérale pour enregistrer et
          évaluer un prestataire.
        </motion.p>

        {/* Cartes statistiques */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <motion.div
            whileHover={{
              y: -4,
              boxShadow: "0 20px 40px rgba(59, 130, 246, 0.2)",
            }}
            onClick={() => navigate("/navigation")}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                <Home size={24} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Accueil</p>
                <p className="text-2xl font-bold text-gray-800">
                  Vue d'ensemble
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{
              y: -4,
              boxShadow: "0 20px 40px rgba(99, 102, 241, 0.2)",
            }}
            onClick={() => navigate("/prestataires")}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl">
                <Users size={24} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Prestataires
                </p>
                <p className="text-2xl font-bold text-gray-800">Gestion</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{
              y: -4,
              boxShadow: "0 20px 40px rgba(79, 70, 229, 0.2)",
            }}
            onClick={() => navigate("/prestataire_evalues")}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                <CheckCircle size={24} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Évaluateurs</p>
                <p className="text-2xl font-bold text-gray-800">Suivi</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
