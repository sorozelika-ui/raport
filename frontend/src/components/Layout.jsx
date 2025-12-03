import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {Home,Users,CheckCircle,ChevronRight,ChevronDown,FileText,Award,Calendar,Star,LogOut,User as UserIcon,} from "lucide-react";


const Layout = ({ children }) => {
  const [openMenus, setOpenMenus] = useState({
    prestataires: false,
    evaluateurs: false,
  });
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Récupérer l'utilisateur connecté
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const handleNavigation = (path) => {
    navigate(path);
  };
//deconnexion
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* --- SIDEBAR --- */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-72 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 text-white p-8 fixed h-full shadow-2xl overflow-y-auto"
      >
        {/* Logo */}
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

        {/* Profil utilisateur */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8 p-4 bg-white bg-opacity-10 rounded-xl backdrop-blur-sm border border-white border-opacity-20"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                <UserIcon size={24} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">
                  {user.nom || "Utilisateur"}
                </p>
                <p className="text-xs text-slate-300 truncate">{user.email}</p>
              </div>
            </div>
          </motion.div>
        )}

        <nav className="flex flex-col gap-3">
          {/* Menu Accueil */}
          <motion.button
            onClick={() => handleNavigation("/dashboard")}
            whileHover={{ x: 8, backgroundColor: "rgba(59, 130, 246, 0.2)" }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className={`w-full flex items-center justify-between gap-3 p-4 rounded-xl bg-white bg-opacity-5 backdrop-blur-sm border border-white border-opacity-10 hover:border-opacity-30 transition-all group ${
              isActive("/dashboard") ? "bg-opacity-20 border-opacity-40" : ""
            }`}
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
          </motion.button>

          {/* Menu Prestataires */}
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
                    <motion.button
                      onClick={() => handleNavigation("/login")}
                      whileHover={{ x: 4 }}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg bg-white bg-opacity-5 hover:bg-opacity-10 transition-all text-sm ${
                        isActive("/login") ? "bg-opacity-15" : ""
                      }`}
                    >
                      <FileText size={16} className="text-blue-300" />
                      <span>Connectez-vous</span>
                    </motion.button>
                    <motion.button
                      onClick={() => handleNavigation("/inscription")}
                      whileHover={{ x: 4 }}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg bg-white bg-opacity-5 hover:bg-opacity-10 transition-all text-sm ${
                        isActive("/inscription") ? "bg-opacity-15" : ""
                      }`}
                    >
                      <FileText size={16} className="text-blue-300" />
                      <span>Inscrivez-vous ici</span>
                    </motion.button>
                    <motion.button
                      onClick={() => handleNavigation("/consulter-resultat")}
                      whileHover={{ x: 4 }}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg bg-white bg-opacity-5 hover:bg-opacity-10 transition-all text-sm ${
                        isActive("/consulter-resultat") ? "bg-opacity-15" : ""
                      }`}
                    >
                      <Award size={16} className="text-green-300" />
                      <span>Consulter mon résultat</span>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Menu Évaluateurs */}
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
                    <motion.button
                      onClick={() => handleNavigation("/prestataire_evalues")}
                      whileHover={{ x: 4 }}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg bg-white bg-opacity-5 hover:bg-opacity-10 transition-all text-sm ${
                        isActive("/prestataire_evalues") ? "bg-opacity-15" : ""
                      }`}
                    >
                      <Users size={16} className="text-blue-300" />
                      <span>Prestataires évalués</span>
                    </motion.button>
                    <motion.button
                      onClick={() => handleNavigation("/evaluation")}
                      whileHover={{ x: 4 }}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg bg-white bg-opacity-5 hover:bg-opacity-10 transition-all text-sm ${
                        isActive("/evaluation") ? "bg-opacity-15" : ""
                      }`}
                    >
                      <Star size={16} className="text-yellow-300" />
                      <span>Évaluer un prestataire</span>
                    </motion.button>
                    <motion.button
                      onClick={() => handleNavigation("/prestataires")}
                      whileHover={{ x: 4 }}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg bg-white bg-opacity-5 hover:bg-opacity-10 transition-all text-sm ${
                        isActive("/prestataires") ? "bg-opacity-15" : ""
                      }`}
                    >
                      <Users size={16} className="text-blue-300" />
                      <span>Liste des prestataires</span>
                    </motion.button>
                    <motion.button
                      onClick={() => handleNavigation("/critere")}
                      whileHover={{ x: 4 }}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg bg-white bg-opacity-5 hover:bg-opacity-10 transition-all text-sm ${
                        isActive("/critere") ? "bg-opacity-15" : ""
                      }`}
                    >
                      <FileText size={16} className="text-yellow-300" />
                      <span>Liste des Critères</span>
                    </motion.button>
                    <motion.button
                      onClick={() => handleNavigation("/annee")}
                      whileHover={{ x: 4 }}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg bg-white bg-opacity-5 hover:bg-opacity-10 transition-all text-sm ${
                        isActive("/annee") ? "bg-opacity-15" : ""
                      }`}
                    >
                      <Calendar size={16} className="text-green-300" />
                      <span>Liste des années</span>
                    </motion.button>
                    <motion.button
                      onClick={() => handleNavigation("/note")}
                      whileHover={{ x: 4 }}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg bg-white bg-opacity-5 hover:bg-opacity-10 transition-all text-sm ${
                        isActive("/note") ? "bg-opacity-15" : ""
                      }`}
                    >
                      <Star size={16} className="text-orange-300" />
                      <span>Liste des notes</span>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bouton Déconnexion */}
          {user && (
            <motion.button
              onClick={handleLogout}
              whileHover={{ x: 8, backgroundColor: "rgba(239, 68, 68, 0.2)" }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-between gap-3 p-4 rounded-xl bg-white bg-opacity-5 backdrop-blur-sm border border-white border-opacity-10 hover:border-red-400 hover:border-opacity-40 transition-all group mt-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500 bg-opacity-20 rounded-lg group-hover:bg-opacity-40 transition-all">
                  <LogOut size={20} />
                </div>
                <span className="font-medium">Déconnexion</span>
              </div>
            </motion.button>
          )}
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
      <div className="ml-72 flex-1">{children}</div>
    </div>
  );
};

export default Layout;
