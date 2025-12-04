import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Mail,
  Bell,
  CheckCircle,
  AlertCircle,
  Users,
  FileText,
  Calendar,
  Award,
  X,
  Search,
  Filter,
} from "lucide-react";

const NotificationSystem = () => {
  const [selectedPrestataires, setSelectedPrestataires] = useState([]);
  const [notificationData, setNotificationData] = useState({
    titre: "",
    message: "",
    type: "evaluation",
    noteGlobale: "",
    annee: new Date().getFullYear(),
    details: "",
  });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecialite, setFilterSpecialite] = useState("all");

  // Données exemple de prestataires
  const [prestataires] = useState([
    {
      id: 1,
      nom: "Entreprise ABC",
      email: "abc@example.com",
      specialite: "Construction",
      noteGlobale: 85,
    },
    {
      id: 2,
      nom: "Services XYZ",
      email: "xyz@example.com",
      specialite: "Consulting",
      noteGlobale: 92,
    },
    {
      id: 3,
      nom: "Tech Solutions",
      email: "tech@example.com",
      specialite: "Informatique",
      noteGlobale: 78,
    },
    {
      id: 4,
      nom: "Green Energy",
      email: "green@example.com",
      specialite: "Énergie",
      noteGlobale: 88,
    },
    {
      id: 5,
      nom: "Build Masters",
      email: "build@example.com",
      specialite: "Construction",
      noteGlobale: 95,
    },
  ]);

  const specialites = [
    "all",
    ...new Set(prestataires.map((p) => p.specialite)),
  ];

  const filteredPrestataires = prestataires.filter((p) => {
    const matchesSearch =
      p.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterSpecialite === "all" || p.specialite === filterSpecialite;
    return matchesSearch && matchesFilter;
  });

  const handleSelectPrestataire = (id) => {
    setSelectedPrestataires((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedPrestataires.length === filteredPrestataires.length) {
      setSelectedPrestataires([]);
    } else {
      setSelectedPrestataires(filteredPrestataires.map((p) => p.id));
    }
  };

  const handleChange = (e) => {
    setNotificationData({
      ...notificationData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedPrestataires.length === 0) {
      setError("Veuillez sélectionner au moins un prestataire");
      return;
    }

    if (!notificationData.titre || !notificationData.message) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setSending(true);
    setError("");

    try {
      // Simulation d'envoi - Remplacez par votre appel API
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = await axios.post("http://127.0.0.1:8000/api/notifications/send", {
         prestataires: selectedPrestataires,
         ...notificationData
       });

      setSuccess(true);

      // Reset après succès
      setTimeout(() => {
        setSuccess(false);
        setSelectedPrestataires([]);
        setNotificationData({
          titre: "",
          message: "",
          type: "evaluation",
          noteGlobale: "",
          annee: new Date().getFullYear(),
          details: "",
        });
      }, 3000);
    } catch (err) {
      setError("Erreur lors de l'envoi des notifications");
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "evaluation":
        return "from-blue-500 to-indigo-500";
      case "alerte":
        return "from-red-500 to-orange-500";
      case "info":
        return "from-green-500 to-emerald-500";
      default:
        return "from-blue-500 to-indigo-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl">
              <Bell size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                Notifications aux Prestataires
              </h1>
              <p className="text-slate-600">
                Envoyez des notifications concernant les évaluations
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Section Sélection des Prestataires */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Users size={20} className="text-blue-500" />
                  Destinataires
                </h2>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                  {selectedPrestataires.length}
                </span>
              </div>

              {/* Recherche et Filtres */}
              <div className="space-y-3 mb-4">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                  />
                </div>

                <div className="relative">
                  <Filter
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <select
                    value={filterSpecialite}
                    onChange={(e) => setFilterSpecialite(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm appearance-none"
                  >
                    {specialites.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec === "all" ? "Toutes les spécialités" : spec}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleSelectAll}
                className="w-full mb-3 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
              >
                {selectedPrestataires.length === filteredPrestataires.length
                  ? "Tout désélectionner"
                  : "Tout sélectionner"}
              </button>

              {/* Liste des prestataires */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredPrestataires.map((prestataire) => (
                  <motion.div
                    key={prestataire.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedPrestataires.includes(prestataire.id)
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                    onClick={() => handleSelectPrestataire(prestataire.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800 text-sm">
                          {prestataire.nom}
                        </p>
                        <p className="text-xs text-slate-500">
                          {prestataire.email}
                        </p>
                        <div className="flex gap-2 mt-1">
                          <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs">
                            {prestataire.specialite}
                          </span>
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                            Note: {prestataire.noteGlobale}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          selectedPrestataires.includes(prestataire.id)
                            ? "border-blue-500 bg-blue-500"
                            : "border-slate-300"
                        }`}
                      >
                        {selectedPrestataires.includes(prestataire.id) && (
                          <CheckCircle size={16} className="text-white" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Section Formulaire de Notification */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <FileText size={20} className="text-blue-500" />
                Contenu de la Notification
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Message de succès */}
                <AnimatePresence>
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2"
                    >
                      <CheckCircle size={20} />
                      <span>Notifications envoyées avec succès !</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Message d'erreur */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2"
                  >
                    <AlertCircle size={20} />
                    <span>{error}</span>
                  </motion.div>
                )}

                {/* Type de notification */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Type de notification
                  </label>
                  <select
                    name="type"
                    value={notificationData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
                  >
                    <option value="evaluation">📊 Résultat d'évaluation</option>
                    <option value="alerte">⚠️ Alerte importante</option>
                    <option value="info">ℹ️ Information générale</option>
                  </select>
                </div>

                {/* Titre */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Titre <span className="text-red-500"></span>
                  </label>
                  <input
                    type="text"
                    name="titre"
                    value={notificationData.titre}
                    onChange={handleChange}
                    placeholder="Ex: Résultats de votre évaluation 2024"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
                  />
                </div>

                {/* Année */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      <Calendar size={16} className="inline mr-1" />
                      Année d'évaluation
                    </label>
                    <input
                      type="number"
                      name="annee"
                      value={notificationData.annee}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      <Award size={16} className="inline mr-1" />
                      Note globale (optionnel)
                    </label>
                    <input
                      type="text"
                      name="noteGlobale"
                      value={notificationData.noteGlobale}
                      onChange={handleChange}
                      placeholder="Ex: 85/100"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Message principal */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Message principal <span className="text-red-500"></span>
                  </label>
                  <textarea
                    name="message"
                    value={notificationData.message}
                    onChange={handleChange}
                    rows="6"
                    placeholder="Rédigez votre message ici..."
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all resize-none"
                  />
                </div>

                {/* Détails supplémentaires */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Détails supplémentaires (optionnel)
                  </label>
                  <textarea
                    name="details"
                    value={notificationData.details}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Ajoutez des informations complémentaires..."
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all resize-none"
                  />
                </div>

                {/* Aperçu */}
                <div
                  className={`p-4 rounded-xl bg-gradient-to-r ${getTypeColor(
                    notificationData.type
                  )} bg-opacity-10 border-2 border-opacity-20`}
                >
                  <p className="text-sm font-semibold text-slate-600 mb-2">
                    📧 Aperçu de la notification
                  </p>
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="font-bold text-slate-800 mb-2">
                      {notificationData.titre || "Titre de la notification"}
                    </h3>
                    <p className="text-sm text-slate-600 whitespace-pre-line">
                      {notificationData.message ||
                        "Votre message apparaîtra ici..."}
                    </p>
                    {notificationData.noteGlobale && (
                      <div className="mt-3 flex items-center gap-2">
                        <Award size={16} className="text-yellow-500" />
                        <span className="text-sm font-semibold">
                          Note: {notificationData.noteGlobale}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bouton d'envoi */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={sending || selectedPrestataires.length === 0}
                  className={`w-full py-3 rounded-xl font-semibold shadow-lg transition-all flex items-center justify-center gap-2 ${
                    sending || selectedPrestataires.length === 0
                      ? "bg-slate-300 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
                  }`}
                >
                  {sending ? (
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
                      <span>
                        Envoyer à {selectedPrestataires.length} prestataire(s)
                      </span>
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSystem;
