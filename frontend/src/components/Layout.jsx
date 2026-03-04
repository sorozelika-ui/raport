// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useNavigate, useLocation } from "react-router-dom";
// import {Home,Users,CheckCircle,ChevronRight,ChevronDown,FileText,Award,Calendar,Star,LogOut,User as UserIcon,Bell,} from "lucide-react";

// const Layout = ({ children }) => {
//   const [openMenus, setOpenMenus] = useState({
//     prestataires: false,
//     evaluateurs: false,
//   });

//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const userData = localStorage.getItem("user");
//     if (userData) setUser(JSON.parse(userData));
//   }, []);

//   const toggleMenu = (menu) => {
//     setOpenMenus((prev) => ({
//       ...prev,
//       [menu]: !prev[menu],
//     }));
//   };

//   const handleNavigation = (path) => navigate(path);

//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   const isActive = (path) => location.pathname === path;

//   return (
//     <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
//       {/* --- SIDEBAR --- */}
//       <motion.aside
//         initial={{ x: -100, opacity: 0 }}
//         animate={{ x: 0, opacity: 1 }}
//         transition={{ duration: 0.5, ease: "easeOut" }}
//         className="w-72 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 text-white p-8 fixed h-full shadow-2xl overflow-y-auto"
//       >
//         {/* Logo */}
//         <motion.div
//           initial={{ scale: 0.8, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           transition={{ delay: 0.2, duration: 0.4 }}
//           className="mb-12"
//         >
//           <h1 className="text-3xl font-bold tracking-wide bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
//             DGBF-PERFORM
//           </h1>
//           <div className="h-1 w-16 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mt-3"></div>
//         </motion.div>

//         {/* Profil utilisateur */}
//         {user && (
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.4 }}
//             className="mb-8 p-4 bg-white bg-opacity-10 rounded-xl backdrop-blur-sm border border-white border-opacity-20"
//           >
//             <div className="flex items-center gap-3">
//               <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
//                 <UserIcon size={20} className="text-orange-300"/>
//               </div>
//               <div className="flex-1">
//                 <p className="font-semibold text-sm">
//                   {user.nom || "Utilisateur"}
//                 </p>
//                 <p className="text-xs text-slate-300 truncate">{user.email}</p>
//               </div>
//             </div>
//           </motion.div>
//         )}

//         <nav className="flex flex-col gap-3">
//           {/* Menu Accueil */}
//           <motion.button
//             onClick={() => handleNavigation("/dashboard")}
//             whileHover={{ x: 8, backgroundColor: "rgba(59, 130, 246, 0.2)" }}
//             whileTap={{ scale: 0.98 }}
//             className={`w-full flex items-center justify-between p-4 rounded-xl bg-white bg-opacity-5 backdrop-blur-sm border border-white border-opacity-10 ${
//               isActive("/dashboard") ? "bg-opacity-20 border-opacity-40" : ""
//             }`}
//           >
//             <div className="flex items-center gap-3">
//               <Home size={20} className="text-orange-300" />
//               <span className="font-medium">Accueil</span>
//             </div>
//             <ChevronRight size={18} />
//           </motion.button>

//           {/* Menu Prestataires */}
//           <div>
//             <motion.button
//               onClick={() => toggleMenu("prestataires")}
//               whileHover={{ x: 8, backgroundColor: "rgba(59, 130, 246, 0.2)" }}
//               className="w-full flex items-center justify-between p-4 rounded-xl bg-white bg-opacity-5 border border-white border-opacity-10"
//             >
//               <div className="flex items-center gap-3">
//                 <Users size={20} className="text-orange-300" />
//                 <span className="font-medium">Prestataires</span>
//               </div>
//               <motion.div
//                 animate={{ rotate: openMenus.prestataires ? 180 : 0 }}
//                 transition={{ duration: 0.2 }}
//               >
//                 <ChevronDown size={18} />
//               </motion.div>
//             </motion.button>

//             {/* Sous-menu Prestataires */}
//             <AnimatePresence>
//               {openMenus.prestataires && (
//                 <motion.div
//                   initial={{ height: 0, opacity: 0 }}
//                   animate={{ height: "auto", opacity: 1 }}
//                   exit={{ height: 0, opacity: 0 }}
//                   className="overflow-hidden ml-4 mt-2 space-y-2"
//                 >
//                   <button
//                     onClick={() => handleNavigation("/login")}
//                     className="w-full flex items-center gap-3 p-3 text-sm bg-white bg-opacity-5 rounded-lg"
//                   >
//                     <FileText size={16} className="text-orange-300" />{" "}
//                     Connectez-vous
//                   </button>

//                   <button
//                     onClick={() => handleNavigation("/inscription")}
//                     className="w-full flex items-center gap-3 p-3 text-sm bg-white bg-opacity-5 rounded-lg"
//                   >
//                     <FileText size={16} className="text-orange-300" />{" "}
//                     Inscrivez-vous ici
//                   </button>

//                   <button
//                     onClick={() => handleNavigation("/consulter-resultat")}
//                     className="w-full flex items-center gap-3 p-3 text-sm bg-white bg-opacity-5 rounded-lg"
//                   >
//                     <Award size={16} className="text-orange-300" /> Consulter
//                     mon résultat
//                   </button>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>

//           {/* Menu Évaluateurs */}
//           <div>
//             <motion.button
//               onClick={() => toggleMenu("evaluateurs")}
//               whileHover={{ x: 8, backgroundColor: "rgba(59, 130, 246, 0.2)" }}
//               className="w-full flex items-center justify-between p-4 rounded-xl bg-white bg-opacity-5 border border-white border-opacity-10"
//             >
//               <div className="flex items-center gap-3">
//                 <CheckCircle size={20} className="text-orange-300" />
//                 <span className="font-medium">Évaluateurs</span>
//               </div>
//               <motion.div
//                 animate={{ rotate: openMenus.evaluateurs ? 180 : 0 }}
//                 transition={{ duration: 0.2 }}
//               >
//                 <ChevronDown size={18} />
//               </motion.div>
//             </motion.button>

//             {/* Sous-menu Évaluateurs */}
//             <AnimatePresence>
//               {openMenus.evaluateurs && (
//                 <motion.div
//                   initial={{ height: 0, opacity: 0 }}
//                   animate={{ height: "auto", opacity: 1 }}
//                   exit={{ height: 0, opacity: 0 }}
//                   className="overflow-hidden ml-4 mt-2 space-y-2"
//                 >
//                   <button
//                     onClick={() => handleNavigation("/prestataire_evalues")}
//                     className="w-full flex items-center gap-3 p-3 text-sm bg-white bg-opacity-5 rounded-lg"
//                   >
//                     <Users size={16} className="text-orange-300" /> Prestataires
//                     évalués
//                   </button>

//                   <button
//                     onClick={() => handleNavigation("/evaluation")}
//                     className="w-full flex items-center gap-3 p-3 text-sm bg-white bg-opacity-5 rounded-lg"
//                   >
//                     <Star size={16} className="text-orange-300" /> Évaluer un
//                     prestataire
//                   </button>

//                   <button
//                     onClick={() => handleNavigation("/prestataires")}
//                     className="w-full flex items-center gap-3 p-3 text-sm bg-white bg-opacity-5 rounded-lg"
//                   >
//                     <Users size={16} className="text-orange-300" /> Liste des
//                     prestataires
//                   </button>

//                   <button
//                     onClick={() => handleNavigation("/critere")}
//                     className="w-full flex items-center gap-3 p-3 text-sm bg-white bg-opacity-5 rounded-lg"
//                   >
//                     <FileText size={16} className="text-orange-300" /> Liste des
//                     Critères
//                   </button>

//                   <button
//                     onClick={() => handleNavigation("/annee")}
//                     className="w-full flex items-center gap-3 p-3 text-sm bg-white bg-opacity-5 rounded-lg"
//                   >
//                     <Calendar size={16} className="text-orange-300" /> Liste des
//                     années
//                   </button>

//                   <motion.button
//                     onClick={() => handleNavigation("/note")}
//                     whileHover={{ x: 4 }}
//                     className={`w-full flex items-center gap-3 p-3 rounded-lg bg-white bg-opacity-5 hover:bg-opacity-10 transition-all text-sm ${
//                       isActive("/note") ? "bg-opacity-15" : ""
//                     }`}
//                   >
//                     <Star size={16} className="text-orange-300" />
//                     <span>Liste des notes</span>
//                   </motion.button>
//                   <motion.button
//                     onClick={() => handleNavigation("/notification")}
//                     className="w-full flex items-center gap-3 p-3 text-sm bg-white bg-opacity-5 rounded-lg"
//                   >
//                     <Bell size={16} className="text-orange-300" /> Notification
//                   </motion.button>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>

//           {/* Déconnexion */}
//           {user && (
//             <motion.button
//               onClick={handleLogout}
//               whileHover={{ x: 8, backgroundColor: "rgba(239, 68, 68, 0.2)" }}
//               className="flex items-center gap-3 p-4 rounded-xl bg-white bg-opacity-5 border border-white border-opacity-10 mt-4"
//             >
//               <LogOut size={20} />
//               <span className="font-medium">Déconnexion</span>
//             </motion.button>
//           )}
//         </nav>
//       </motion.aside>

//       {/* Contenu principal */}
//       <div className="ml-72 flex-1">{children}</div>
//     </div>
//   );
// };

// export default Layout;


// //code corriger 
// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useNavigate, useLocation } from "react-router-dom";
// import {Home,Users,CheckCircle,ChevronRight,ChevronDown,FileText,Award,Calendar,Star,LogOut,User as UserIcon,Bell,} from "lucide-react";

// const Layout = ({ children }) => {
//   const [openMenus, setOpenMenus] = useState({
//     prestataires: false,
//     evaluateurs: false,
//   });

//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const userData = localStorage.getItem("user");
//     if (userData) setUser(JSON.parse(userData));
//   }, []);

//   // Fonction pour vérifier si l'utilisateur est admin
//   const isAdmin = () => {
//     return user && user.email === "admin@dgbf.ci";
//   };

//   const toggleMenu = (menu) => {
//     // Si c'est le menu évaluateurs et que l'utilisateur n'est pas admin, on bloque
//     if (menu === "evaluateurs" && !isAdmin()) {
//       alert("Accès réservé à l'administrateur uniquement");
//       return;
//     }

//     setOpenMenus((prev) => ({
//       ...prev,
//       [menu]: !prev[menu],
//     }));
//   };

//   const handleNavigation = (path) => navigate(path);

//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   const isActive = (path) => location.pathname === path;

//   return (
//     <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
//       {/* --- SIDEBAR --- */}
//       <motion.aside
//         initial={{ x: -100, opacity: 0 }}
//         animate={{ x: 0, opacity: 1 }}
//         transition={{ duration: 0.5, ease: "easeOut" }}
//         className="w-72 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 text-white p-8 fixed h-full shadow-2xl overflow-y-auto"
//       >
//         {/* Logo */}
//         <motion.div
//           initial={{ scale: 0.8, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           transition={{ delay: 0.2, duration: 0.4 }}
//           className="mb-12"
//         >
//           <h1 className="text-3xl font-bold tracking-wide bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
//             DGBF-PERFORM
//           </h1>
//           <div className="h-1 w-16 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mt-3"></div>
//         </motion.div>

//         {/* Profil utilisateur */}
//         {user && (
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.4 }}
//             className="mb-8 p-4 bg-white bg-opacity-10 rounded-xl backdrop-blur-sm border border-white border-opacity-20"
//           >
//             <div className="flex items-center gap-3">
//               <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
//                 <UserIcon size={20} className="text-orange-300"/>
//               </div>
//               <div className="flex-1">
//                 <p className="font-semibold text-sm">
//                   {user.nom || "Utilisateur"}
//                 </p>
//                 <p className="text-xs text-slate-300 truncate">{user.email}</p>
//                 {isAdmin() && (
//                   <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-orange-500 bg-opacity-30 text-orange-200 rounded">
//                     Admin
//                   </span>
//                 )}
//               </div>
//             </div>
//           </motion.div>
//         )}

//         <nav className="flex flex-col gap-3">
//           {/* Menu Accueil */}
//           <motion.button
//             onClick={() => handleNavigation("/dashboard")}
//             whileHover={{ x: 8, backgroundColor: "rgba(59, 130, 246, 0.2)" }}
//             whileTap={{ scale: 0.98 }}
//             className={`w-full flex items-center justify-between p-4 rounded-xl bg-white bg-opacity-5 backdrop-blur-sm border border-white border-opacity-10 ${
//               isActive("/dashboard") ? "bg-opacity-20 border-opacity-40" : ""
//             }`}
//           >
//             <div className="flex items-center gap-3">
//               <Home size={20} className="text-orange-300" />
//               <span className="font-medium">Accueil</span>
//             </div>
//             <ChevronRight size={18} />
//           </motion.button>

//           {/* Menu Prestataires */}
//           <div>
//             <motion.button
//               onClick={() => toggleMenu("prestataires")}
//               whileHover={{ x: 8, backgroundColor: "rgba(59, 130, 246, 0.2)" }}
//               className="w-full flex items-center justify-between p-4 rounded-xl bg-white bg-opacity-5 border border-white border-opacity-10"
//             >
//               <div className="flex items-center gap-3">
//                 <Users size={20} className="text-orange-300" />
//                 <span className="font-medium">Prestataires</span>
//               </div>
//               <motion.div
//                 animate={{ rotate: openMenus.prestataires ? 180 : 0 }}
//                 transition={{ duration: 0.2 }}
//               >
//                 <ChevronDown size={18} />
//               </motion.div>
//             </motion.button>

//             {/* Sous-menu Prestataires */}
//             <AnimatePresence>
//               {openMenus.prestataires && (
//                 <motion.div
//                   initial={{ height: 0, opacity: 0 }}
//                   animate={{ height: "auto", opacity: 1 }}
//                   exit={{ height: 0, opacity: 0 }}
//                   className="overflow-hidden ml-4 mt-2 space-y-2"
//                 >
//                   <button
//                     onClick={() => handleNavigation("/login")}
//                     className="w-full flex items-center gap-3 p-3 text-sm bg-white bg-opacity-5 rounded-lg"
//                   >
//                     <FileText size={16} className="text-orange-300" />{" "}
//                     Connectez-vous
//                   </button>

//                   <button
//                     onClick={() => handleNavigation("/inscription")}
//                     className="w-full flex items-center gap-3 p-3 text-sm bg-white bg-opacity-5 rounded-lg"
//                   >
//                     <FileText size={16} className="text-orange-300" />{" "}
//                     Inscrivez-vous ici
//                   </button>

//                   <button
//                     onClick={() => handleNavigation("/consulter-resultat")}
//                     className="w-full flex items-center gap-3 p-3 text-sm bg-white bg-opacity-5 rounded-lg"
//                   >
//                     <Award size={16} className="text-orange-300" /> Consulter
//                     mon résultat
//                   </button>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>

//           {/* Menu Évaluateurs - AFFICHÉ UNIQUEMENT POUR L'ADMIN */}
//           {isAdmin() && (
//             <div>
//               <motion.button
//                 onClick={() => toggleMenu("evaluateurs")}
//                 whileHover={{ x: 8, backgroundColor: "rgba(59, 130, 246, 0.2)" }}
//                 className="w-full flex items-center justify-between p-4 rounded-xl bg-white bg-opacity-5 border border-white border-opacity-10"
//               >
//                 <div className="flex items-center gap-3">
//                   <CheckCircle size={20} className="text-orange-300" />
//                   <span className="font-medium">Évaluateurs</span>
//                 </div>
//                 <motion.div
//                   animate={{ rotate: openMenus.evaluateurs ? 180 : 0 }}
//                   transition={{ duration: 0.2 }}
//                 >
//                   <ChevronDown size={18} />
//                 </motion.div>
//               </motion.button>

//               {/* Sous-menu Évaluateurs */}
//               <AnimatePresence>
//                 {openMenus.evaluateurs && (
//                   <motion.div
//                     initial={{ height: 0, opacity: 0 }}
//                     animate={{ height: "auto", opacity: 1 }}
//                     exit={{ height: 0, opacity: 0 }}
//                     className="overflow-hidden ml-4 mt-2 space-y-2"
//                   >
//                     <button
//                       onClick={() => handleNavigation("/prestataire_evalues")}
//                       className="w-full flex items-center gap-3 p-3 text-sm bg-white bg-opacity-5 rounded-lg"
//                     >
//                       <Users size={16} className="text-orange-300" /> Prestataires
//                       évalués
//                     </button>

//                     <button
//                       onClick={() => handleNavigation("/evaluation")}
//                       className="w-full flex items-center gap-3 p-3 text-sm bg-white bg-opacity-5 rounded-lg"
//                     >
//                       <Star size={16} className="text-orange-300" /> Évaluer un
//                       prestataire
//                     </button>

//                     <button
//                       onClick={() => handleNavigation("/prestataires")}
//                       className="w-full flex items-center gap-3 p-3 text-sm bg-white bg-opacity-5 rounded-lg"
//                     >
//                       <Users size={16} className="text-orange-300" /> Liste des
//                       prestataires
//                     </button>

//                     <button
//                       onClick={() => handleNavigation("/critere")}
//                       className="w-full flex items-center gap-3 p-3 text-sm bg-white bg-opacity-5 rounded-lg"
//                     >
//                       <FileText size={16} className="text-orange-300" /> Liste des
//                       Critères
//                     </button>

//                     <button
//                       onClick={() => handleNavigation("/annee")}
//                       className="w-full flex items-center gap-3 p-3 text-sm bg-white bg-opacity-5 rounded-lg"
//                     >
//                       <Calendar size={16} className="text-orange-300" /> Liste des
//                       années
//                     </button>

//                     <motion.button
//                       onClick={() => handleNavigation("/note")}
//                       whileHover={{ x: 4 }}
//                       className={`w-full flex items-center gap-3 p-3 rounded-lg bg-white bg-opacity-5 hover:bg-opacity-10 transition-all text-sm ${
//                         isActive("/note") ? "bg-opacity-15" : ""
//                       }`}
//                     >
//                       <Star size={16} className="text-orange-300" />
//                       <span>Liste des notes</span>
//                     </motion.button>
//                     <motion.button
//                       onClick={() => handleNavigation("/notification")}
//                       className="w-full flex items-center gap-3 p-3 text-sm bg-white bg-opacity-5 rounded-lg"
//                     >
//                       <Bell size={16} className="text-orange-300" /> Notification
//                     </motion.button>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           )}

//           {/* Déconnexion */}
//           {user && (
//             <motion.button
//               onClick={handleLogout}
//               whileHover={{ x: 8, backgroundColor: "rgba(239, 68, 68, 0.2)" }}
//               className="flex items-center gap-3 p-4 rounded-xl bg-white bg-opacity-5 border border-white border-opacity-10 mt-4"
//             >
//               <LogOut size={20} />
//               <span className="font-medium">Déconnexion</span>
//             </motion.button>
//           )}
//         </nav>
//       </motion.aside>

//       {/* Contenu principal */}
//       <div className="ml-72 flex-1">{children}</div>
//     </div>
//   );
// };

// export default Layout;


//code recorriger 


import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {Home,Users,CheckCircle,ChevronRight,ChevronDown,FileText,Award,Calendar,Star,LogOut,User as UserIcon,Bell,X,AlertCircle} from "lucide-react";

const Layout = ({ children }) => {
  const [openMenus, setOpenMenus] = useState({
    prestataires: false,
    evaluateurs: false,
  });

  const [user, setUser] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, []);

  // Fonction pour vérifier si l'utilisateur est admin
  const isAdmin = () => {
    return user && user.email === "admin@dgbf.ci";
  };

  // Fonction pour afficher le toast
  const showAccessDeniedToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const toggleMenu = (menu) => {
    // Si c'est le menu évaluateurs et que l'utilisateur n'est pas admin, on bloque avec un toast
    if (menu === "evaluateurs" && !isAdmin()) {
      showAccessDeniedToast();
      return;
    }

    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const handleNavigation = (path) => navigate(path);

  const handleAdminNavigation = (path) => {
    if (!isAdmin()) {
      showAccessDeniedToast();
      return;
    }
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Toast de notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -50, x: "-50%" }}
            className="fixed top-6 left-1/2 z-50 bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[350px]"
          >
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertCircle size={20} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">Accès refusé</p>
              <p className="text-xs text-white text-opacity-90">
                Accès réservé uniquement à l'administrateur
              </p>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="w-8 h-8 hover:bg-white hover:bg-opacity-20 rounded-lg flex items-center justify-center transition-colors"
            >
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

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
                <UserIcon size={20} className="text-orange-300"/>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">
                  {user.nom || "Utilisateur"}
                </p>
                <p className="text-xs text-slate-300 truncate">{user.email}</p>
                {isAdmin() && (
                  <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-orange-500 bg-opacity-30 text-orange-200 rounded">
                    Admin
                  </span>
                )}
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
            className={`w-full flex items-center justify-between p-4 rounded-xl bg-white bg-opacity-5 backdrop-blur-sm border border-white border-opacity-10 ${
              isActive("/dashboard") ? "bg-opacity-20 border-opacity-40" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <Home size={20} className="text-orange-300" />
              <span className="font-medium">Accueil</span>
            </div>
            <ChevronRight size={18} />
          </motion.button>

          {/* Menu Prestataires */}
          <div>
            <motion.button
              onClick={() => toggleMenu("prestataires")}
              whileHover={{ x: 8, backgroundColor: "rgba(59, 130, 246, 0.2)" }}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-white bg-opacity-5 border border-white border-opacity-10"
            >
              <div className="flex items-center gap-3">
                <Users size={20} className="text-orange-300" />
                <span className="font-medium">Prestataires</span>
              </div>
              <motion.div
                animate={{ rotate: openMenus.prestataires ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={18} />
              </motion.div>
            </motion.button>

            {/* Sous-menu Prestataires */}
            <AnimatePresence>
              {openMenus.prestataires && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden ml-4 mt-2 space-y-2"
                >
                  <button
                    onClick={() => handleNavigation("/login")}
                    className="w-full flex items-center gap-3 p-3 text-sm bg-white bg-opacity-5 rounded-lg hover:bg-opacity-10 transition-all"
                  >
                    <FileText size={16} className="text-orange-300" />{" "}
                    Connectez-vous
                  </button>

                  <button
                    onClick={() => handleNavigation("/inscription")}
                    className="w-full flex items-center gap-3 p-3 text-sm bg-white bg-opacity-5 rounded-lg hover:bg-opacity-10 transition-all"
                  >
                    <FileText size={16} className="text-orange-300" />{" "}
                    Inscrivez-vous ici
                  </button>

                  <button
                    onClick={() => handleNavigation("/consulter-resultat")}
                    className="w-full flex items-center gap-3 p-3 text-sm bg-white bg-opacity-5 rounded-lg hover:bg-opacity-10 transition-all"
                  >
                    <Award size={16} className="text-orange-300" /> Consulter
                    mon résultat
                  </button>
                   <button
                    onClick={() => handleNavigation("/prestataire/notifications")}
                    className="w-full flex items-center gap-3 p-3 text-sm bg-white bg-opacity-5 rounded-lg hover:bg-opacity-10 transition-all"
                  >
                    <Award size={16} className="text-orange-300" /> Boite de reception
                  </button>
                </motion.div>
                
              )}
            </AnimatePresence>
          </div>

          {/* Menu Évaluateurs - VISIBLE POUR TOUS */}
          <div>
            <motion.button
              onClick={() => toggleMenu("evaluateurs")}
              whileHover={{ x: 8, backgroundColor: "rgba(59, 130, 246, 0.2)" }}
              className={`w-full flex items-center justify-between p-4 rounded-xl bg-white bg-opacity-5 border border-white border-opacity-10 ${
                !isAdmin() ? "cursor-pointer" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <CheckCircle size={20} className="text-orange-300" />
                <span className="font-medium">Évaluateurs</span>
                {!isAdmin() && (
                  <span className="text-xs bg-red-500 bg-opacity-30 text-red-200 px-2 py-0.5 rounded">
                    Admin
                  </span>
                )}
              </div>
              <motion.div
                animate={{ rotate: openMenus.evaluateurs ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={18} />
              </motion.div>
            </motion.button>

            {/* Sous-menu Évaluateurs */}
            <AnimatePresence>
              {openMenus.evaluateurs && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden ml-4 mt-2 space-y-2"
                >
                  <button
                    onClick={() => handleAdminNavigation("/prestataire_evalues")}
                    className="w-full flex items-center gap-3 p-3 text-sm bg-white bg-opacity-5 rounded-lg hover:bg-opacity-10 transition-all"
                  >
                    <Users size={16} className="text-orange-300" /> Prestataires
                    évalués
                  </button>

                  <button
                    onClick={() => handleAdminNavigation("/evaluation")}
                    className="w-full flex items-center gap-3 p-3 text-sm bg-white bg-opacity-5 rounded-lg hover:bg-opacity-10 transition-all"
                  >
                    <Star size={16} className="text-orange-300" /> Évaluer un
                    prestataire
                  </button>

                  <button
                    onClick={() => handleAdminNavigation("/prestataires")}
                    className="w-full flex items-center gap-3 p-3 text-sm bg-white bg-opacity-5 rounded-lg hover:bg-opacity-10 transition-all"
                  >
                    <Users size={16} className="text-orange-300" /> Liste des
                    prestataires
                  </button>

                  <button
                    onClick={() => handleAdminNavigation("/critere")}
                    className="w-full flex items-center gap-3 p-3 text-sm bg-white bg-opacity-5 rounded-lg hover:bg-opacity-10 transition-all"
                  >
                    <FileText size={16} className="text-orange-300" /> Liste des
                    Critères
                  </button>

                  <button
                    onClick={() => handleAdminNavigation("/annee")}
                    className="w-full flex items-center gap-3 p-3 text-sm bg-white bg-opacity-5 rounded-lg hover:bg-opacity-10 transition-all"
                  >
                    <Calendar size={16} className="text-orange-300" /> Liste des
                    années
                  </button>

                  <motion.button
                    onClick={() => handleAdminNavigation("/note")}
                    whileHover={{ x: 4 }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg bg-white bg-opacity-5 hover:bg-opacity-10 transition-all text-sm ${
                      isActive("/note") ? "bg-opacity-15" : ""
                    }`}
                  >
                    <Star size={16} className="text-orange-300" />
                    <span>Liste des notes</span>
                  </motion.button>
                  
                  <motion.button
                    onClick={() => handleAdminNavigation("/admin/notification")}
                    className="w-full flex items-center gap-3 p-3 text-sm bg-white bg-opacity-5 rounded-lg hover:bg-opacity-10 transition-all"
                  >
                    <Bell size={16} className="text-orange-300" /> Notification
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Déconnexion */}
          {user && (
            <motion.button
              onClick={handleLogout}
              whileHover={{ x: 8, backgroundColor: "rgba(239, 68, 68, 0.2)" }}
              className="flex items-center gap-3 p-4 rounded-xl bg-white bg-opacity-5 border border-white border-opacity-10 mt-4"
            >
              <LogOut size={20} />
              <span className="font-medium">Déconnexion</span>
            </motion.button>
          )}
        </nav>
      </motion.aside>

      {/* Contenu principal */}
      <div className="ml-72 flex-1">{children}</div>
    </div>
  );
};

export default Layout;