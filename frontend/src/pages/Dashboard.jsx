import React from "react";
import { motion } from "framer-motion";
import { Home, Users, CheckCircle, ChevronRight } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">

      {/* --- SIDEBAR ÉLÉGANTE --- */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-72 bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 text-white p-8 fixed h-full shadow-2xl"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mb-12"
        >
          <h1 className="text-3xl font-bold tracking-wide bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            DGBF-PERFORM
          </h1>
          <div className="h-1 w-16 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mt-3"></div>
        </motion.div>

        <nav className="flex flex-col gap-3">
          {/* Menu Dashboard */}
          <motion.a
            href="#"
            whileHover={{ x: 8, backgroundColor: "rgba(59, 130, 246, 0.3)" }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-between gap-3 p-4 rounded-xl bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 hover:border-opacity-40 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 bg-opacity-30 rounded-lg group-hover:bg-opacity-50 transition-all">
                <Home size={20} />
              </div>
              <span className="font-medium">Accueil</span>
            </div>
            <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.a>

          {/* Menu Prestataires */}
          <motion.a
            href="/prestataires"
            whileHover={{ x: 8, backgroundColor: "rgba(59, 130, 246, 0.3)" }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-between gap-3 p-4 rounded-xl bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 hover:border-opacity-40 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 bg-opacity-30 rounded-lg group-hover:bg-opacity-50 transition-all">
                <Users size={20} />
              </div>
              <span className="font-medium">Prestataires</span>
            </div>
            <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.a>

          {/* Menu Évaluateurs */}
          <motion.a
            href="/evaluateurs"
            whileHover={{ x: 8, backgroundColor: "rgba(59, 130, 246, 0.3)" }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-between gap-3 p-4 rounded-xl bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 hover:border-opacity-40 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 bg-opacity-30 rounded-lg group-hover:bg-opacity-50 transition-all">
                <CheckCircle size={20} />
              </div>
              <span className="font-medium">Évaluateurs</span>
            </div>
            <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.a>
        </nav>

        {/* Décoration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="absolute bottom-8 left-8 right-8"
        >
          <div className="h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-20 mb-4"></div>
          <p className="text-xs text-blue-200 text-center opacity-70">
            Système de gestion des prestataires 
          </p>
        </motion.div>
      </motion.aside>

      {/* --- CONTENU PRINCIPAL --- */}
      <div className="ml-72 flex-1 p-12">
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
            className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-900 via-blue-700 to-indigo-700 bg-clip-text text-transparent"
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
            Sélectionnez un menu dans la barre latérale pour enregistrer et évaluer un prestataire.
          </motion.p>

          {/* Cartes statistiques */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <motion.div
              whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.2)" }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                  <Home size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Accueil</p>
                  <p className="text-2xl font-bold text-gray-800">Vue d'ensemble</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(99, 102, 241, 0.2)" }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl">
                  <Users size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Prestataires</p>
                  <p className="text-2xl font-bold text-gray-800">Gestion</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(79, 70, 229, 0.2)" }}
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
    </div>
  );
};

export default Dashboard;