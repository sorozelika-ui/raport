import React, { useState } from "react";
import { motion } from "framer-motion";
import {User,Mail,MapPin,Briefcase,Phone,Lock,Eye,EyeOff,CheckCircle,UserPlus} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Inscription = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    specialite: "",
    addresse: "",
    passwordd: "",
    confirmPasswordd: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.nom || !formData.email || !formData.telephone || 
        !formData.specialite || !formData.addresse || !formData.passwordd) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    if (formData.passwordd !== formData.confirmPasswordd) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (formData.passwordd.length < 5) {
      setError("Le mot de passe doit contenir au moins 5 caractères");
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://127.0.0.1:8000/api/inscription", {
        nom: formData.nom,
        email: formData.email,
        telephone: formData.telephone,
        specialite: formData.specialite,
        addresse: formData.addresse,
        passwordd: formData.passwordd
      });

      setSuccess(true);

      // Redirection après 2 secondes
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      console.error("Erreur:", err.response?.data);
      setError(err.response?.data?.message || "Une erreur s'est produite lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center p-6">
      {/* Cercles décoratifs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-20 -right-20 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-xl"
      >
        {/* Card */}
        <div className="bg-slate-800 bg-opacity-50 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white border-opacity-10">
          {/* En-tête */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-b from-slate-700 to-slate-800 p-8 text-white text-center border-b border-white border-opacity-10"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
            >
              <UserPlus size={40} />
            </motion.div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              DGBF-PERFORM
            </h1>
            <p className="text-slate-300">Inscription Prestataire</p>
            <div className="h-1 w-16 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mt-3 mx-auto"></div>
          </motion.div>

          {/* Contenu */}
          <div className="p-8">
            {success ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500 border-opacity-30">
                  <CheckCircle size={48} className="text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Inscription réussie</h3>
                <p className="text-slate-300">Redirection vers la page de connexion...</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Message d'erreur */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30 text-red-300 px-4 py-3 rounded-xl text-sm backdrop-blur-sm"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Nom */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Nom complet <span className="text-red-400"></span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-slate-700 bg-opacity-50 border-2 border-slate-600 text-white rounded-xl focus:border-blue-500 focus:outline-none transition-all placeholder-slate-400"
                      placeholder="Entrez votre nom complet"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Email <span className="text-red-400"></span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-slate-700 bg-opacity-50 border-2 border-slate-600 text-white rounded-xl focus:border-blue-500 focus:outline-none transition-all placeholder-slate-400"
                      placeholder="exemple@email.com"
                    />
                  </div>
                </div>

                {/* Téléphone */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Téléphone <span className="text-red-400"></span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-slate-700 bg-opacity-50 border-2 border-slate-600 text-white rounded-xl focus:border-blue-500 focus:outline-none transition-all placeholder-slate-400"
                      placeholder="+225 XX XX XX XX XX"
                    />
                  </div>
                </div>

                {/* Spécialité */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Spécialité <span className="text-red-400"></span>
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      type="text"
                      name="specialite"
                      value={formData.specialite}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-slate-700 bg-opacity-50 border-2 border-slate-600 text-white rounded-xl focus:border-blue-500 focus:outline-none transition-all placeholder-slate-400"
                      placeholder="Ex: entrez votre service"
                    />
                  </div>
                </div>

                {/* Adresse */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Adresse <span className="text-red-400"></span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      type="text"
                      name="addresse"
                      value={formData.addresse}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-slate-700 bg-opacity-50 border-2 border-slate-600 text-white rounded-xl focus:border-blue-500 focus:outline-none transition-all placeholder-slate-400"
                      placeholder="Votre adresse complète"
                    />
                  </div>
                </div>

                {/* Mot de passe */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Mot de passe <span className="text-red-400"></span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="passwordd"
                      value={formData.passwordd}
                      onChange={handleChange}
                      className="w-full pl-12 pr-12 py-3 bg-slate-700 bg-opacity-50 border-2 border-slate-600 text-white rounded-xl focus:border-blue-500 focus:outline-none transition-all placeholder-slate-400"
                      placeholder="Minimum 5 caractères"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Confirmer mot de passe */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Confirmer le mot de passe <span className="text-red-400"></span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPasswordd"
                      value={formData.confirmPasswordd}
                      onChange={handleChange}
                      className="w-full pl-12 pr-12 py-3 bg-slate-700 bg-opacity-50 border-2 border-slate-600 text-white rounded-xl focus:border-blue-500 focus:outline-none transition-all placeholder-slate-400"
                      placeholder="Confirmez votre mot de passe"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Bouton Submit */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Inscription en cours...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus size={20} />
                      <span>S'inscrire</span>
                    </>
                  )}
                </motion.button>

                {/* Lien connexion */}
                <div className="text-center text-sm text-slate-400 pt-4">
                  Vous avez déjà un compte ?{" "}
                  <a href="/login" className="text-blue-400 font-semibold hover:text-blue-300 hover:underline transition-colors">
                    Se connecter
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-8 text-sm text-slate-400"
        >
          <p>© 2024 DGBF-PERFORM. Tous droits réservés.</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Inscription;