// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {Send,Bell,CheckCircle,AlertCircle,Users,FileText,Calendar,Search,ilter,} from "lucide-react";
// import axios from "axios";

// const Notification = () => {
//   const [selectedPrestataires, setSelectedPrestataires] = useState([]);
//   const [prestataires, setPrestataires] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [notificationData, setNotificationData] = useState({
//     titre: "",
//     message: "",
//     type: "evaluation",
//     annee: new Date().getFullYear(),
//     details: "",
//   });
//   const [sending, setSending] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterSpecialite, setFilterSpecialite] = useState("all");

//   // Charger les prestataires au démarrage
//   useEffect(() => {
//     loadPrestataires();
//   }, []);

//   const loadPrestataires = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get("http://127.0.0.1:8000/api/prestataire");
//       const prestData = Array.isArray(response.data)
//         ? response.data
//         : response.data.data || [];

//       console.log("Prestataires chargés:", prestData);
//       setPrestataires(prestData);
//     } catch (err) {
//       console.error("Erreur chargement prestataires:", err);
//       setError("Erreur lors du chargement des prestataires");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const specialites = [
//     "all",
//     ...new Set(prestataires.map((p) => p.specialite)),
//   ];

//   const filteredPrestataires = prestataires.filter((p) => {
//     const matchesSearch =
//       p.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       p.email.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesFilter =
//       filterSpecialite === "all" || p.specialite === filterSpecialite;
//     return matchesSearch && matchesFilter;
//   });

//   const handleSelectPrestataire = (id) => {
//     setSelectedPrestataires((prev) =>
//       prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
//     );
//   };

//   const handleSelectAll = () => {
//     if (selectedPrestataires.length === filteredPrestataires.length) {
//       setSelectedPrestataires([]);
//     } else {
//       setSelectedPrestataires(filteredPrestataires.map((p) => p.id));
//     }
//   };

//   const handleChange = (e) => {
//     setNotificationData({
//       ...notificationData,
//       [e.target.name]: e.target.value,
//     });
//     setError("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (selectedPrestataires.length === 0) {
//       setError("Veuillez sélectionner au moins un prestataire");
//       return;
//     }

//     if (!notificationData.titre || !notificationData.message) {
//       setError("Veuillez remplir tous les champs obligatoires");
//       return;
//     }

//     setSending(true);
//     setError("");

//     try {
//       const response = await axios.post(
//         "http://127.0.0.1:8000/api/notifications/send",
//         {
//           prestataire_ids: selectedPrestataires,
//           titre: notificationData.titre,
//           message: notificationData.message,
//           type: notificationData.type,
//           annee: notificationData.annee,
//           details: notificationData.details,
//         }
//       );

//       console.log("Réponse:", response.data);
//       setSuccess(true);

//       // Reset après succès
//       setTimeout(() => {
//         setSuccess(false);
//         setSelectedPrestataires([]);
//         setNotificationData({
//           titre: "",
//           message: "",
//           type: "evaluation",
//           annee: new Date().getFullYear(),
//           details: "",
//         });
//       }, 3000);
//     } catch (err) {
//       console.error("Erreur envoi:", err);
//       setError(
//         err.response?.data?.message ||
//           "Erreur lors de l'envoi des notifications"
//       );
//     } finally {
//       setSending(false);
//     }
//   };

//   const getTypeColor = (type) => {
//     switch (type) {
//       case "evaluation":
//         return "from-blue-500 to-indigo-500";
//       case "alerte":
//         return "from-red-500 to-orange-500";
//       case "info":
//         return "from-green-500 to-emerald-500";
//       default:
//         return "from-blue-500 to-indigo-500";
//     }
//   };

//   if (loading) {
//     return (
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           minHeight: "400px",
//         }}
//       >
//         <div style={{ textAlign: "center" }}>
//           <div
//             style={{
//               width: "50px",
//               height: "50px",
//               border: "4px solid #e5e7eb",
//               borderTop: "4px solid #667eea",
//               borderRadius: "50%",
//               animation: "spin 1s linear infinite",
//               margin: "0 auto 20px",
//             }}
//           />
//           <p style={{ color: "#6b7280" }}>Chargement des prestataires...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: "linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)",
//         padding: "24px",
//       }}
//     >
//       <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
//         {/* En-tête */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           style={{ marginBottom: "32px" }}
//         >
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: "12px",
//               marginBottom: "8px",
//             }}
//           >
//             <div
//               style={{
//                 padding: "12px",
//                 background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//                 borderRadius: "12px",
//               }}
//             >
//               <Bell size={28} color="white" />
//             </div>
//             <div>
//               <h1
//                 style={{
//                   fontSize: "30px",
//                   fontWeight: "bold",
//                   color: "#1e293b",
//                   margin: 0,
//                 }}
//               >
//                 Notifications aux Prestataires
//               </h1>
//               <p style={{ color: "#64748b", margin: 0 }}>
//                 Envoyez des notifications concernant les évaluations
//               </p>
//             </div>
//           </div>
//         </motion.div>

//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "1fr 2fr",
//             gap: "24px",
//           }}
//         >
//           {/* Section Sélection des Prestataires */}
//           <motion.div
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//           >
//             <div
//               style={{
//                 background: "white",
//                 borderRadius: "16px",
//                 boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//                 padding: "24px",
//                 border: "1px solid #e2e8f0",
//               }}
//             >
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                   marginBottom: "16px",
//                 }}
//               >
//                 <h2
//                   style={{
//                     fontSize: "20px",
//                     fontWeight: "bold",
//                     color: "#1e293b",
//                     margin: 0,
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "8px",
//                   }}
//                 >
//                   <Users size={20} color="#667eea" />
//                   Destinataires
//                 </h2>
//                 <span
//                   style={{
//                     padding: "4px 12px",
//                     background: "#dbeafe",
//                     color: "#1e40af",
//                     borderRadius: "20px",
//                     fontSize: "14px",
//                     fontWeight: "600",
//                   }}
//                 >
//                   {selectedPrestataires.length}
//                 </span>
//               </div>

//               {/* Recherche et Filtres */}
//               <div style={{ marginBottom: "16px" }}>
//                 <div style={{ position: "relative", marginBottom: "12px" }}>
//                   <Search
//                     style={{
//                       position: "absolute",
//                       left: "12px",
//                       top: "50%",
//                       transform: "translateY(-50%)",
//                       color: "#94a3b8",
//                     }}
//                     size={18}
//                   />
//                   <input
//                     type="text"
//                     placeholder="Rechercher..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     style={{
//                       width: "100%",
//                       padding: "10px 10px 10px 40px",
//                       border: "2px solid #e2e8f0",
//                       borderRadius: "8px",
//                       outline: "none",
//                       fontSize: "14px",
//                     }}
//                   />
//                 </div>

//                 <div style={{ position: "relative" }}>
//                   <Filter
//                     style={{
//                       position: "absolute",
//                       left: "12px",
//                       top: "50%",
//                       transform: "translateY(-50%)",
//                       color: "#94a3b8",
//                     }}
//                     size={18}
//                   />
//                   <select
//                     value={filterSpecialite}
//                     onChange={(e) => setFilterSpecialite(e.target.value)}
//                     style={{
//                       width: "100%",
//                       padding: "10px 10px 10px 40px",
//                       border: "2px solid #e2e8f0",
//                       borderRadius: "8px",
//                       outline: "none",
//                       fontSize: "14px",
//                     }}
//                   >
//                     {specialites.map((spec) => (
//                       <option key={spec} value={spec}>
//                         {spec === "all" ? "Toutes les spécialités" : spec}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <button
//                 onClick={handleSelectAll}
//                 style={{
//                   width: "100%",
//                   marginBottom: "12px",
//                   padding: "10px 16px",
//                   background: "#f1f5f9",
//                   border: "none",
//                   borderRadius: "8px",
//                   fontSize: "14px",
//                   fontWeight: "500",
//                   cursor: "pointer",
//                   color: "#475569",
//                 }}
//               >
//                 {selectedPrestataires.length === filteredPrestataires.length
//                   ? "Tout désélectionner"
//                   : "Tout sélectionner"}
//               </button>

//               {/* Liste des prestataires */}
//               <div
//                 style={{
//                   maxHeight: "400px",
//                   overflowY: "auto",
//                   display: "flex",
//                   flexDirection: "column",
//                   gap: "8px",
//                 }}
//               >
//                 {filteredPrestataires.map((prestataire) => (
//                   <motion.div
//                     key={prestataire.id}
//                     whileHover={{ scale: 1.02 }}
//                     style={{
//                       padding: "12px",
//                       borderRadius: "8px",
//                       border: selectedPrestataires.includes(prestataire.id)
//                         ? "2px solid #667eea"
//                         : "2px solid #e2e8f0",
//                       background: selectedPrestataires.includes(prestataire.id)
//                         ? "#f0f9ff"
//                         : "white",
//                       cursor: "pointer",
//                       transition: "all 0.2s",
//                     }}
//                     onClick={() => handleSelectPrestataire(prestataire.id)}
//                   >
//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         alignItems: "start",
//                       }}
//                     >
//                       <div style={{ flex: 1 }}>
//                         <p
//                           style={{
//                             fontWeight: "600",
//                             color: "#1e293b",
//                             fontSize: "14px",
//                             margin: "0 0 4px 0",
//                           }}
//                         >
//                           {prestataire.nom}
//                         </p>
//                         <p
//                           style={{
//                             fontSize: "12px",
//                             color: "#64748b",
//                             margin: "0 0 6px 0",
//                           }}
//                         >
//                           {prestataire.email}
//                         </p>
//                         <span
//                           style={{
//                             padding: "2px 8px",
//                             background: "#e0e7ff",
//                             color: "#4338ca",
//                             borderRadius: "4px",
//                             fontSize: "11px",
//                             display: "inline-block",
//                           }}
//                         >
//                           {prestataire.specialite}
//                         </span>
//                       </div>
//                       <div
//                         style={{
//                           width: "20px",
//                           height: "20px",
//                           borderRadius: "4px",
//                           border: "2px solid",
//                           borderColor: selectedPrestataires.includes(
//                             prestataire.id
//                           )
//                             ? "#667eea"
//                             : "#cbd5e1",
//                           background: selectedPrestataires.includes(
//                             prestataire.id
//                           )
//                             ? "#667eea"
//                             : "transparent",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                         }}
//                       >
//                         {selectedPrestataires.includes(prestataire.id) && (
//                           <CheckCircle size={16} color="white" />
//                         )}
//                       </div>
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>
//             </div>
//           </motion.div>

//           {/* Section Formulaire */}
//           <motion.div
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//           >
//             <div
//               style={{
//                 background: "white",
//                 borderRadius: "16px",
//                 boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//                 padding: "24px",
//                 border: "1px solid #e2e8f0",
//               }}
//             >
//               <h2
//                 style={{
//                   fontSize: "20px",
//                   fontWeight: "bold",
//                   color: "#1e293b",
//                   marginBottom: "24px",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "8px",
//                 }}
//               >
//                 <FileText size={20} color="#667eea" />
//                 Contenu de la Notification
//               </h2>

//               <form
//                 onSubmit={handleSubmit}
//                 style={{
//                   display: "flex",
//                   flexDirection: "column",
//                   gap: "20px",
//                 }}
//               >
//                 {/* Messages */}
//                 <AnimatePresence>
//                   {success && (
//                     <motion.div
//                       initial={{ opacity: 0, y: -10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0 }}
//                       style={{
//                         background: "#f0fdf4",
//                         border: "1px solid #bbf7d0",
//                         color: "#15803d",
//                         padding: "12px 16px",
//                         borderRadius: "8px",
//                         display: "flex",
//                         alignItems: "center",
//                         gap: "8px",
//                       }}
//                     >
//                       <CheckCircle size={20} />
//                       <span>Notifications envoyées avec succès !</span>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>

//                 {error && (
//                   <motion.div
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     style={{
//                       background: "#fef2f2",
//                       border: "1px solid #fecaca",
//                       color: "#dc2626",
//                       padding: "12px 16px",
//                       borderRadius: "8px",
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "8px",
//                     }}
//                   >
//                     <AlertCircle size={20} />
//                     <span>{error}</span>
//                   </motion.div>
//                 )}

//                 {/* Type */}
//                 <div>
//                   <label
//                     style={{
//                       display: "block",
//                       fontSize: "14px",
//                       fontWeight: "600",
//                       color: "#475569",
//                       marginBottom: "8px",
//                     }}
//                   >
//                     Type de notification
//                   </label>
//                   <select
//                     name="type"
//                     value={notificationData.type}
//                     onChange={handleChange}
//                     style={{
//                       width: "100%",
//                       padding: "12px 16px",
//                       border: "2px solid #e2e8f0",
//                       borderRadius: "8px",
//                       outline: "none",
//                       fontSize: "14px",
//                     }}
//                   >
//                     <option value="evaluation">📊 Résultat d'évaluation</option>
//                     <option value="alerte">⚠️ Alerte importante</option>
//                     <option value="info">ℹ️ Information générale</option>
//                   </select>
//                 </div>

//                 {/* Titre */}
//                 <div>
//                   <label
//                     style={{
//                       display: "block",
//                       fontSize: "14px",
//                       fontWeight: "600",
//                       color: "#475569",
//                       marginBottom: "8px",
//                     }}
//                   >
//                     Titre <span style={{ color: "#ef4444" }}>*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="titre"
//                     value={notificationData.titre}
//                     onChange={handleChange}
//                     placeholder="Ex: Résultats de votre évaluation 2024"
//                     style={{
//                       width: "100%",
//                       padding: "12px 16px",
//                       border: "2px solid #e2e8f0",
//                       borderRadius: "8px",
//                       outline: "none",
//                       fontSize: "14px",
//                     }}
//                   />
//                 </div>

//                 {/* Année */}
//                 <div>
//                   <label
//                     style={{
//                       display: "block",
//                       fontSize: "14px",
//                       fontWeight: "600",
//                       color: "#475569",
//                       marginBottom: "8px",
//                     }}
//                   >
//                     <Calendar
//                       size={16}
//                       style={{ marginRight: "4px", verticalAlign: "middle" }}
//                     />
//                     Année d'évaluation
//                   </label>
//                   <input
//                     type="number"
//                     name="annee"
//                     value={notificationData.annee}
//                     onChange={handleChange}
//                     style={{
//                       width: "100%",
//                       padding: "12px 16px",
//                       border: "2px solid #e2e8f0",
//                       borderRadius: "8px",
//                       outline: "none",
//                       fontSize: "14px",
//                     }}
//                   />
//                 </div>

//                 {/* Message */}
//                 <div>
//                   <label
//                     style={{
//                       display: "block",
//                       fontSize: "14px",
//                       fontWeight: "600",
//                       color: "#475569",
//                       marginBottom: "8px",
//                     }}
//                   >
//                     Message principal{" "}
//                     <span style={{ color: "#ef4444" }}>*</span>
//                   </label>
//                   <textarea
//                     name="message"
//                     value={notificationData.message}
//                     onChange={handleChange}
//                     rows="6"
//                     placeholder="Rédigez votre message ici..."
//                     style={{
//                       width: "100%",
//                       padding: "12px 16px",
//                       border: "2px solid #e2e8f0",
//                       borderRadius: "8px",
//                       outline: "none",
//                       fontSize: "14px",
//                       resize: "vertical",
//                     }}
//                   />
//                 </div>

//                 {/* Détails */}
//                 <div>
//                   <label
//                     style={{
//                       display: "block",
//                       fontSize: "14px",
//                       fontWeight: "600",
//                       color: "#475569",
//                       marginBottom: "8px",
//                     }}
//                   >
//                     Détails supplémentaires (optionnel)
//                   </label>
//                   <textarea
//                     name="details"
//                     value={notificationData.details}
//                     onChange={handleChange}
//                     rows="4"
//                     placeholder="Ajoutez des informations complémentaires..."
//                     style={{
//                       width: "100%",
//                       padding: "12px 16px",
//                       border: "2px solid #e2e8f0",
//                       borderRadius: "8px",
//                       outline: "none",
//                       fontSize: "14px",
//                       resize: "vertical",
//                     }}
//                   />
//                 </div>

//                 {/* Aperçu */}
//                 <div
//                   style={{
//                     padding: "16px",
//                     borderRadius: "12px",
//                     background: `linear-gradient(135deg, ${
//                       notificationData.type === "evaluation"
//                         ? "#dbeafe"
//                         : notificationData.type === "alerte"
//                         ? "#fee2e2"
//                         : "#dcfce7"
//                     }, white)`,
//                     border: "2px solid",
//                     borderColor:
//                       notificationData.type === "evaluation"
//                         ? "#93c5fd"
//                         : notificationData.type === "alerte"
//                         ? "#fca5a5"
//                         : "#86efac",
//                   }}
//                 >
//                   <p
//                     style={{
//                       fontSize: "14px",
//                       fontWeight: "600",
//                       color: "#64748b",
//                       marginBottom: "12px",
//                     }}
//                   >
//                     📧 Aperçu de la notification
//                   </p>
//                   <div
//                     style={{
//                       background: "white",
//                       padding: "16px",
//                       borderRadius: "8px",
//                     }}
//                   >
//                     <h3
//                       style={{
//                         fontWeight: "bold",
//                         color: "#1e293b",
//                         marginBottom: "8px",
//                       }}
//                     >
//                       {notificationData.titre || "Titre de la notification"}
//                     </h3>
//                     <p
//                       style={{
//                         fontSize: "14px",
//                         color: "#64748b",
//                         whiteSpace: "pre-line",
//                         margin: 0,
//                       }}
//                     >
//                       {notificationData.message ||
//                         "Votre message apparaîtra ici..."}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Bouton */}
//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   type="submit"
//                   disabled={sending || selectedPrestataires.length === 0}
//                   style={{
//                     width: "100%",
//                     padding: "14px",
//                     borderRadius: "12px",
//                     fontWeight: "600",
//                     fontSize: "16px",
//                     border: "none",
//                     cursor:
//                       sending || selectedPrestataires.length === 0
//                         ? "not-allowed"
//                         : "pointer",
//                     background:
//                       sending || selectedPrestataires.length === 0
//                         ? "#cbd5e1"
//                         : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//                     color: "white",
//                     boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     gap: "8px",
//                   }}
//                 >
//                   {sending ? (
//                     <>
//                       <motion.div
//                         animate={{ rotate: 360 }}
//                         transition={{
//                           duration: 1,
//                           repeat: Infinity,
//                           ease: "linear",
//                         }}
//                         style={{
//                           width: "20px",
//                           height: "20px",
//                           border: "2px solid white",
//                           borderTopColor: "transparent",
//                           borderRadius: "50%",
//                         }}
//                       />
//                       <span>Envoi en cours...</span>
//                     </>
//                   ) : (
//                     <>
//                       <Send size={20} />
//                       <span>
//                         Envoyer à {selectedPrestataires.length} prestataire(s)
//                       </span>
//                     </>
//                   )}
//                 </motion.button>
//               </form>
//             </div>
//           </motion.div>
//         </div>
//       </div>

//       <style>{`
//         @keyframes spin {
//           from { transform: rotate(0deg); }
//           to { transform: rotate(360deg); }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Notification;
