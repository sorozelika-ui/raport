import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Send, CheckCircle, Shield } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/forgot-password",
        { email }
      );

      // Si la requête réussit
      setSuccess(true);
      console.log("✅ Email de récupération envoyé");
    } catch (err) {
      console.error("❌ Erreur:", err);
      setError(
        err.response?.data?.message ||
          "Une erreur est survenue. Veuillez réessayer."
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
          className="absolute -top-20 -left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
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
          className="absolute -bottom-20 -right-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
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
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        />
      </div>

      {/* Container principal */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        {/* Bouton retour */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => navigate("/login")}
          className="mb-6 flex items-center gap-2 text-slate-300 hover:text-white transition-colors group"
        >
          <ArrowLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span>Retour à la connexion</span>
        </motion.button>

        {/* Card principale */}
        <div className="bg-slate-800 bg-opacity-50 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white border-opacity-10">
          {/* En-tête */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-b from-slate-700 to-slate-800 p-8 text-white border-b border-white border-opacity-10"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="flex justify-center mb-4"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-lg">
                <Shield size={40} className="text-white" />
              </div>
            </motion.div>

            {!success ? (
              <>
                <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Mot de passe oublié ?
                </h1>
                <p className="text-center text-slate-300 text-sm">
                  Entrez votre email pour réinitialiser votre mot de passe
                </p>
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Email envoyé !
                </h1>
                <p className="text-center text-slate-300 text-sm">
                  Vérifiez votre boîte de réception
                </p>
              </>
            )}
            <div className="h-1 w-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mt-3 mx-auto"></div>
          </motion.div>

          {/* Contenu */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="p-8"
          >
            {!success ? (
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
                  transition={{ delay: 0.6 }}
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
                      className="w-full pl-12 pr-4 py-3 bg-slate-700 bg-opacity-50 border-2 border-slate-600 text-white rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-300 placeholder-slate-400"
                    />
                  </div>
                  <p className="mt-2 text-xs text-slate-400">
                    Nous vous enverrons un lien pour réinitialiser votre mot de
                    passe
                  </p>
                </motion.div>

                {/* Bouton d'envoi */}
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
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
                      <span>Envoi en cours...</span>
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      <span>Envoyer le lien</span>
                    </>
                  )}
                </motion.button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center space-y-6"
              >
                {/* Icône de succès */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring", bounce: 0.5 }}
                  className="flex justify-center"
                >
                  <div className="w-20 h-20 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center">
                    <CheckCircle size={50} className="text-green-400" />
                  </div>
                </motion.div>

                {/* Message de succès */}
                <div className="space-y-3">
                  <p className="text-slate-200 text-lg font-medium">
                    Un email a été envoyé à :
                  </p>
                  <p className="text-purple-400 font-semibold text-xl">
                    {email}
                  </p>
                  <p className="text-slate-400 text-sm">
                    Cliquez sur le lien dans l'email pour réinitialiser votre
                    mot de passe.
                  </p>
                  <p className="text-slate-500 text-xs mt-4">
                    Vous n'avez pas reçu l'email ? Vérifiez vos spams ou{" "}
                    <button
                      onClick={() => setSuccess(false)}
                      className="text-purple-400 hover:text-purple-300 underline"
                    >
                      réessayez
                    </button>
                  </p>
                </div>

                {/* Bouton retour à la connexion */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/login")}
                  className="w-full bg-slate-700 bg-opacity-50 text-white font-semibold py-3 px-6 rounded-xl border-2 border-slate-600 hover:border-purple-500 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <ArrowLeft size={20} />
                  <span>Retour à la connexion</span>
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8 text-sm text-slate-400"
        >
          <p>© 2024 DGBF-PERFORM. Tous droits réservés.</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;