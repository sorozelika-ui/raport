// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { Mail, Lock, Eye, EyeOff, LogIn, Shield } from "lucide-react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [passwordd, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError("");

//     try {
//       const response = await axios.post("http://127.0.0.1:8000/api/login", {
//         email,
//         passwordd,
//       });

//       // Stocker les informations de l'utilisateur dans localStorage
//       localStorage.setItem("user", JSON.stringify(response.data.user));
//       localStorage.setItem("token", response.data.token);
      
//       // Redirection vers le dashboard
//       navigate("/dashboard");
//     } catch (err) {
//       setError(
//         err.response?.data?.message || "Email ou mot de passe incorrect"
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-4">
//       {/* Cercles décoratifs en arrière-plan */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <motion.div
//           animate={{
//             scale: [1, 1.2, 1],
//             rotate: [0, 180, 360],
//           }}
//           transition={{
//             duration: 20,
//             repeat: Infinity,
//             ease: "linear",
//           }}
//           className="absolute -top-20 -left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
//         />
//         <motion.div
//           animate={{
//             scale: [1.2, 1, 1.2],
//             rotate: [360, 180, 0],
//           }}
//           transition={{
//             duration: 25,
//             repeat: Infinity,
//             ease: "linear",
//           }}
//           className="absolute -bottom-20 -right-20 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
//         />
//         <motion.div
//           animate={{
//             scale: [1, 1.3, 1],
//             x: [0, 100, 0],
//           }}
//           transition={{
//             duration: 15,
//             repeat: Infinity,
//             ease: "easeInOut",
//           }}
//           className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
//         />
//       </div>

//       {/* Container principal */}
//       <motion.div
//         initial={{ opacity: 0, y: 50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="relative w-full max-w-md"
//       >
//         {/* Card de connexion logo */}
//         <div className="bg-slate-800 bg-opacity-50 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white border-opacity-10">
//           {/* En-tête avec dégradé */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.2 }}
//             className="bg-gradient-to-b from-slate-700 to-slate-800 p-8 text-white border-b border-white border-opacity-10"
//           >
//             <motion.div
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               transition={{ delay: 0.3, type: "spring" }}
//               className="flex justify-center mb-4"
//             >
//               <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-lg">
//                 <Shield size={40} className="text-white" // icone du haut dans la connexion
//                  />
//               </div>
//             </motion.div>
//             <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
//               DGBF-PERFORM
//             </h1>
//             <p className="text-center text-slate-300 text-sm">
//               Connectez-vous à votre espace
//             </p>
//             <div className="h-1 w-16 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mt-3 mx-auto"></div>
//           </motion.div>

//           {/* Formulaire */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.4 }}
//             className="p-8"
//           >
//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* Message d'erreur */}
//               {error && (
//                 <motion.div
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   className="bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30 text-red-300 px-4 py-3 rounded-xl text-sm backdrop-blur-sm"
//                 >
//                   {error}
//                 </motion.div>
//               )}

//               {/* Champ Email */}
//               <motion.div
//                 initial={{ x: -50, opacity: 0 }}
//                 animate={{ x: 0, opacity: 1 }}
//                 transition={{ delay: 0.5 }}
//               >
//                 <label
//                   className="block text-sm font-semibold text-slate-300 mb-2" //boite de message icone
//                 >
//                   Adresse email
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                     <Mail
//                       size={20}
//                       className="text-slate-400" //icone pour le mail
//                     />
//                   </div>
//                   <input
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)} //setemail modifier la valeur de l'email envoyée
//                     placeholder="votre@email.com"
//                     required
//                     className="w-full pl-12 pr-4 py-3 bg-slate-700 bg-opacity-50 border-2 border-slate-600 text-white rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300 placeholder-slate-400"
//                   />
//                 </div>
//               </motion.div>

//               {/* Champ Mot de passe */}
//               <motion.div
//                 initial={{ x: -50, opacity: 0 }}
//                 animate={{ x: 0, opacity: 1 }}
//                 transition={{ delay: 0.6 }}
//               >
//                 <label
//                   className="block text-sm font-semibold text-slate-300 mb-2" // cadenard véroullé
//                 >
//                   Mot de passe
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                     <Lock size={20} className="text-slate-400" />
//                   </div>
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     value={passwordd}
//                     onChange={(e) => setPassword(e.target.value)} //setPassword la valeur du mot de passe envoyée
//                     placeholder="minimum 5 caractères"
//                     required
//                     className="w-full pl-12 pr-12 py-3 bg-slate-700 bg-opacity-50 border-2 border-slate-600 text-white rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300 placeholder-slate-400"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)} // verifie la valeur du mot de passe envoyée
//                     className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white transition-colors"
//                   >
//                     {showPassword ? <EyeOff size={20} /> : <Eye size={20} //icone afficher le mot de passe ou le masquer
//                     />}
//                   </button>
//                 </div>
//               </motion.div>

//               {/* Mot de passe oublié */}
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.7 }}
//                 className="flex items-center justify-end text-sm"
//               >
//                 <a // pas encore pris en charge: page pour recuperer le mot de passe 
//                   href="oublie"
//                   className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
//                 >
//                   Mot de passe oublié ?
//                 </a>
//               </motion.div>

//               {/* Bouton de connexion */}
//               <motion.button
//                 initial={{ y: 20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 0.8 }}
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
//               >
//                 {isLoading ? ( //permet de mettre le button qui tourne pendant la connexion
//                   <>
//                     <motion.div
//                       animate={{ rotate: 360 }}
//                       transition={{
//                         duration: 1,
//                         repeat: Infinity,
//                         ease: "linear",
//                       }}
//                       className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
//                     />
//                     <span>Connexion en cours...</span>
//                   </>
//                 ) : (
//                   <>
//                     <LogIn size={20} />
//                     <span>Se connecter</span>
//                   </>
//                 )}
//               </motion.button>
//             </form>

//             {/* Lien d'inscription */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 1 }}
//               className="text-center mt-6"
//             >
//               <p className="text-slate-400 text-sm">
//                 Vous n'avez pas de compte ?{" "}
//                 <a
//                   href="/inscription"
//                   className="text-blue-400 hover:text-blue-300 font-semibold transition-colors hover:underline"
//                 >
//                   Créer un compte
//                 </a>
//               </p>
//             </motion.div>
//           </motion.div>
//         </div>

//         {/* Footer */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 1.1 }}
//           className="text-center mt-8 text-sm text-slate-400"
//         >
//           <p>© 2024 DGBF-PERFORM. Tous droits réservés.</p>
//         </motion.div>
//       </motion.div>
//     </div>
//   );
// };

// export default Login;


import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, LogIn, Shield } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [passwordd, setPasswordd] = useState("");
  const [showPasswordd, setShowPasswordd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login", {
        email,
        passwordd, // ✅ Corrigé : 'password' au lieu de 'passwordd'
      });

      // ✅ Ajout de isLoggedIn (requis par ProtectedRoute)
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("isLoggedIn", "true"); // ✅ AJOUTÉ
      
      console.log("✅ Connexion réussie, redirection...");
      
      // Redirection vers le dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Erreur de connexion:", err);
      setError(
        err.response?.data?.message || "Email ou mot de passe incorrect"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-4">
      {/* Cercles décoratifs en arrière-plan */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-20 -left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-20 -right-20 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 100, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        />
      </div>

      {/* Container principal */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        {/* Card de connexion logo */}
        <div className="bg-slate-800 bg-opacity-50 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white border-opacity-10">
          {/* En-tête avec dégradé */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-b from-slate-700 to-slate-800 p-8 text-white border-b border-white border-opacity-10"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="flex justify-center mb-4"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-lg">
                <Shield size={40} className="text-white" />
              </div>
            </motion.div>
            <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              DGBF-PERFORM
            </h1>
            <p className="text-center text-slate-300 text-sm">
              Connectez-vous à votre espace
            </p>
            <div className="h-1 w-16 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mt-3 mx-auto"></div>
          </motion.div>

          {/* Formulaire */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Message d'erreur */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30 text-red-300 px-4 py-3 rounded-xl text-sm backdrop-blur-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Champ Email */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Adresse email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={20} className="text-slate-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    required
                    className="w-full pl-12 pr-4 py-3 bg-slate-700 bg-opacity-50 border-2 border-slate-600 text-white rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300 placeholder-slate-400"
                  />
                </div>
              </motion.div>

              {/* Champ Mot de passe */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={20} className="text-slate-400" />
                  </div>
                  <input
                    type={showPasswordd ? "text" : "passwordd"}
                    value={passwordd}
                    onChange={(e) => setPasswordd(e.target.value)}
                    placeholder="minimum 5 caractères"
                    required
                    className="w-full pl-12 pr-12 py-3 bg-slate-700 bg-opacity-50 border-2 border-slate-600 text-white rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300 placeholder-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordd(!showPasswordd)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white transition-colors"
                  >
                    {showPasswordd ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </motion.div>

              {/* Mot de passe oublié */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex items-center justify-end text-sm"
              >
                <a
                  href="/forgot-password"
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Mot de passe oublié ?
                </a>
              </motion.div>

              {/* Bouton de connexion */}
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>Connexion en cours...</span>
                  </>
                ) : (
                  <>
                    <LogIn size={20} />
                    <span>Se connecter</span>
                  </>
                )}
              </motion.button>
            </form>

            {/* Lien d'inscription */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center mt-6"
            >
              <p className="text-slate-400 text-sm">
                Vous n'avez pas de compte ?{" "}
                <a
                  href="/inscription"
                  className="text-blue-400 hover:text-blue-300 font-semibold transition-colors hover:underline"
                >
                  Créer un compte
                </a>
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="text-center mt-8 text-sm text-slate-400"
        >
          <p>© 2024 DGBF-PERFORM. Tous droits réservés.</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;