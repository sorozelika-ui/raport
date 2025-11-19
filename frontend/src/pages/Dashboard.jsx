import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Users,
  CheckCircle,
  ChevronRight,
  ChevronDown,
  FileText,
  Award,
  Calendar,
  Star,
} from "lucide-react";

const Dashboard = () => {
  const [openMenus, setOpenMenus] = useState({
    prestataires: false,
    evaluateurs: false,
  });

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* --- SIDEBAR ÉLÉGANTE --- */}

      {/* --- motion:librairie react pour les animations --- */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-72 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 text-white p-8 fixed h-full shadow-2xl overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mb-12"
        >
          <h1 className="text-3xl font-bold tracking-wide bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            DGBF-PERFORM
          </h1>
          <div className="h-1 w-16 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mt-3"></div>
        </motion.div>

        <nav className="flex flex-col gap-3">
          {/* Menu Accueil */}
          <motion.a
            href="#"
            whileHover={{ x: 8, backgroundColor: "rgba(59, 130, 246, 0.2)" }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-between gap-3 p-4 rounded-xl bg-white bg-opacity-5 backdrop-blur-sm border border-white border-opacity-10 hover:border-opacity-30 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 bg-opacity-20 rounded-lg group-hover:bg-opacity-40 transition-all">
                <Home size={20} />
              </div>
              <span className="font-medium">Accueil</span>
            </div>
            <ChevronRight
              size={18}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </motion.a>

          {/* Menu Prestataires avec sous-menu */}
          <div>
            <motion.button
              onClick={() => toggleMenu("prestataires")}
              whileHover={{ x: 8, backgroundColor: "rgba(59, 130, 246, 0.2)" }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="w-full flex items-center justify-between gap-3 p-4 rounded-xl bg-white bg-opacity-5 backdrop-blur-sm border border-white border-opacity-10 hover:border-opacity-30 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500 bg-opacity-20 rounded-lg group-hover:bg-opacity-40 transition-all">
                  <Users size={20} />
                </div>
                <span className="font-medium">Prestataires</span>
              </div>
              <motion.div
                animate={{ rotate: openMenus.prestataires ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={18} />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {openMenus.prestataires && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="ml-4 mt-2 space-y-2">
                    <motion.a
                      href="/login"
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-white bg-opacity-5 hover:bg-opacity-10 transition-all text-sm"
                    >
                      <FileText size={16} className="text-blue-300" />
                      <span>connectez-Vous</span>
                    </motion.a>
                    <motion.a
                      href="/consulter-resultat"
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-white bg-opacity-5 hover:bg-opacity-10 transition-all text-sm"
                    >
                      <Award size={16} className="text-green-300" />
                      <span>Consulter mon résultat</span>
                    </motion.a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Menu Évaluateurs avec sous-menu */}
          <div>
            <motion.button
              onClick={() => toggleMenu("evaluateurs")}
              whileHover={{ x: 8, backgroundColor: "rgba(59, 130, 246, 0.2)" }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="w-full flex items-center justify-between gap-3 p-4 rounded-xl bg-white bg-opacity-5 backdrop-blur-sm border border-white border-opacity-10 hover:border-opacity-30 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500 bg-opacity-20 rounded-lg group-hover:bg-opacity-40 transition-all">
                  <CheckCircle size={20} />
                </div>
                <span className="font-medium">Évaluateurs</span>
              </div>
              <motion.div
                animate={{ rotate: openMenus.evaluateurs ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={18} />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {openMenus.evaluateurs && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="ml-4 mt-2 space-y-2">
                    <motion.a
                      href="/prestataires"
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-white bg-opacity-5 hover:bg-opacity-10 transition-all text-sm"
                    >
                      <Users size={16} className="text-blue-300" />
                      <span>Liste des prestataires</span>
                    </motion.a>
                    <motion.a
                      href="/critere"
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-white bg-opacity-5 hover:bg-opacity-10 transition-all text-sm"
                    >
                      <FileText size={16} className="text-yellow-300" />
                      <span>Liste des Critère</span>
                    </motion.a>
                    <motion.a
                      href="/annee"
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-white bg-opacity-5 hover:bg-opacity-10 transition-all text-sm"
                    >
                      <Calendar size={16} className="text-green-300" />
                      <span>Liste des années</span>
                    </motion.a>
                    <motion.a
                      href="/note"
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-white bg-opacity-5 hover:bg-opacity-10 transition-all text-sm"
                    >
                      <Star size={16} className="text-orange-300" />
                      <span>Liste des notes</span>
                    </motion.a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Décoration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="absolute bottom-8 left-8 right-8"
        >
          <div className="h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-20 mb-4"></div>
          <p className="text-xs text-slate-400 text-center opacity-70">
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
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
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
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                  <CheckCircle size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Évaluateurs
                  </p>
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
