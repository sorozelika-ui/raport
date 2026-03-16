// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Send, Bell, CheckCircle, AlertCircle, Users, FileText,
//   Calendar, Search, Filter, Clock, Eye, Trash2, ChevronRight,
//   BarChart2, X
// } from "lucide-react";
// import axios from "axios";

// const API = "http://127.0.0.1:8000/api";

// const TYPE_CONFIG = {
//   evaluation: { label: "Résultat d'évaluation", color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
//   alerte:     { label: "Alerte importante", color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
//   info:       { label: "Information générale",color: "#059669", bg: "#f0fdf4", border: "#bbf7d0" },
// };

// /* ── Pill badge ── */
// const TypeBadge = ({ type }) => {
//   const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.info;
//   return (
//     <span style={{
//       display: "inline-flex", alignItems: "center", gap: "4px",
//       padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: 600,
//       background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
//     }}>
//       {/* {cfg.emoji}  */}
//       {cfg.label}
//     </span>
//   );
// };


// //    COMPOSANT PRINCIPAL — ADMIN

// const NotificationAdmin = () => {
//   const [tab, setTab] = useState("send"); // "send" | "history"
//   const [prestataires, setPrestataires] = useState([]);
//   const [historique, setHistorique] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [histLoading, setHistLoading] = useState(false);

//   const [selected, setSelected] = useState([]);
//   const [search, setSearch] = useState("");
//   const [filterSpec, setFilterSpec] = useState("all");

//   const [form, setForm] = useState({
//     titre: "", message: "", type: "evaluation",
//     annee: new Date().getFullYear(), details: "",
//   });

//   const [sending, setSending] = useState(false);
//   const [feedback, setFeedback] = useState(null); // { type: "success"|"error", msg }

//   useEffect(() => { loadPrestataires(); }, []);
//   useEffect(() => { if (tab === "history") loadHistorique(); }, [tab]);

//   const loadPrestataires = async () => {
//     setLoading(true);
//     try {
//       const r = await axios.get(`${API}/prestataire`);
//       setPrestataires(Array.isArray(r.data) ? r.data : r.data.data || []);
//     } catch { setFeedback({ type: "error", msg: "Impossible de charger les prestataires." }); }
//     finally { setLoading(false); }
//   };

//   const loadHistorique = async () => {
//     setHistLoading(true);
//     // /notifications/prestataire/all
//     try {
//       const r = await axios.get(`${API}/notifications/prestataire/{id}`);
//       const data = r.data.notifications ?? r.data.data ?? r.data ?? [];
//       setHistorique(Array.isArray(data) ? data : []);
//     } catch { setHistorique([]); }
//     finally { setHistLoading(false); }
//   };

//   const specialites = ["all", ...new Set(prestataires.map(p => p.specialite).filter(Boolean))];

//   const filtered = prestataires.filter(p => {
//     const q = search.toLowerCase();
//     return (
//       (p.nom?.toLowerCase().includes(q) || p.email?.toLowerCase().includes(q)) &&
//       (filterSpec === "all" || p.specialite === filterSpec)
//     );
//   });

//   const toggleSelect = id => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
//   const toggleAll = () => setSelected(selected.length === filtered.length ? [] : filtered.map(p => p.id));

//   const handleSubmit = async e => {
//     e.preventDefault();
//     if (!selected.length) { setFeedback({ type: "error", msg: "Sélectionnez au moins un prestataire." }); return; }
//     if (!form.titre || !form.message) { setFeedback({ type: "error", msg: "Titre et message sont obligatoires." }); return; }

//     setSending(true);
//     setFeedback(null);
//     try {
//       await axios.post(`${API}/notifications/send`, {
//         prestataire_ids: selected, ...form,
//       });
//       setFeedback({ type: "success", msg: `Notification envoyée à ${selected.length} prestataire(s) !` });
//       setSelected([]);
//       setForm({ titre: "", message: "", type: "evaluation", annee: new Date().getFullYear(), details: "" });
//     } catch (err) {
//       setFeedback({ type: "error", msg: err.response?.data?.message || "Erreur lors de l'envoi." });
//     } finally { setSending(false); }
//   };

// //   const deleteNotif = async id => {
// //     try {
// //       await axios.delete(`${API}/notifications/${id}`);
// //       setHistorique(h => h.filter(n => n.id !== id));
// //     } catch {}
// //   };

//   /* ── Stats rapides ── */
//   const stats = [
//     { label: "Prestataires", value: prestataires.length, icon: Users, color: "#2563eb" },
//     { label: "Notifs envoyées", value: historique.length, icon: Bell, color: "#7c3aed" },
//     { label: "Non lues", value: historique.filter(n => !n.lu).length, icon: Eye, color: "#dc2626" },
//   ];

//   return (
//     <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
//       <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display&display=swap" rel="stylesheet" />

//       {/* ── Header ── */}
//       <div style={{ background: "white", borderBottom: "1px solid #e2e8f0", padding: "0 32px" }}>
//         <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "72px" }}>
//           <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
//             <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "linear-gradient(135deg, #1d4ed8, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(59,130,246,0.3)" }}>
//               <Bell size={22} color="white" />
//             </div>
//             <div>
//               <h1 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#0f172a", fontFamily: "'DM Serif Display', serif" }}>
//                 Centre de Notifications
//               </h1>
//               <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>Administration des communications prestataires</p>
//             </div>
//           </div>

//           {/* Tabs */}
//           <div style={{ display: "flex", gap: "4px", background: "#f1f5f9", borderRadius: "10px", padding: "4px" }}>
//             {[{ id: "send", label: "Envoyer", icon: Send }, { id: "history", label: "Historique", icon: Clock }].map(t => (
//               <button key={t.id} onClick={() => setTab(t.id)}
//                 style={{
//                   display: "flex", alignItems: "center", gap: "6px",
//                   padding: "8px 16px", borderRadius: "8px", border: "none", cursor: "pointer",
//                   fontSize: "14px", fontWeight: 600, transition: "all 0.2s",
//                   background: tab === t.id ? "white" : "transparent",
//                   color: tab === t.id ? "#1d4ed8" : "#64748b",
//                   boxShadow: tab === t.id ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
//                 }}>
//                 <t.icon size={15} /> {t.label}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "28px 32px" }}>

//         {/* Stats */}
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "28px" }}>
//           {stats.map((s, i) => (
//             <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
//               style={{ background: "white", borderRadius: "14px", padding: "20px 24px", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "16px" }}>
//               <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: `${s.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
//                 <s.icon size={22} color={s.color} />
//               </div>
//               <div>
//                 <p style={{ margin: 0, fontSize: "28px", fontWeight: 700, color: "#0f172a", lineHeight: 1 }}>{s.value}</p>
//                 <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#64748b" }}>{s.label}</p>
//               </div>
//             </motion.div>
//           ))}
//         </div>

//         <AnimatePresence mode="wait">

//           {/* ══ TAB : ENVOYER ══ */}
//           {tab === "send" && (
//             <motion.div key="send" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
//               style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: "24px" }}>

//               {/* Colonne gauche : sélection prestataires */}
//               <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden", display: "flex", flexDirection: "column", maxHeight: "720px" }}>
//                 <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid #f1f5f9" }}>
//                   <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
//                     <h2 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
//                       <Users size={16} color="#2563eb" /> Destinataires
//                     </h2>
//                     <span style={{ background: "#dbeafe", color: "#1d4ed8", padding: "2px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: 700 }}>
//                       {selected.length} / {prestataires.length}
//                     </span>
//                   </div>

//                   <div style={{ position: "relative", marginBottom: "10px" }}>
//                     <Search size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
//                     <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..."
//                       style={{ width: "100%", padding: "9px 12px 9px 36px", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", outline: "none", boxSizing: "border-box", color: "#0f172a" }} />
//                   </div>

//                   <select value={filterSpec} onChange={e => setFilterSpec(e.target.value)}
//                     style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", outline: "none", color: "#475569" }}>
//                     {specialites.map(s => <option key={s} value={s}>{s === "all" ? "Toutes les spécialités" : s}</option>)}
//                   </select>
//                 </div>

//                 <div style={{ padding: "10px 20px 8px" }}>
//                   <button onClick={toggleAll} style={{ width: "100%", padding: "8px", border: "1.5px dashed #cbd5e1", borderRadius: "8px", background: "transparent", fontSize: "13px", fontWeight: 600, color: "#475569", cursor: "pointer" }}>
//                     {selected.length === filtered.length && filtered.length > 0 ? "✕ Tout désélectionner" : "✓ Tout sélectionner"}
//                   </button>
//                 </div>

//                 <div style={{ flex: 1, overflowY: "auto", padding: "0 12px 12px" }}>
//                   {loading ? (
//                     <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8", fontSize: "13px" }}>Chargement...</div>
//                   ) : filtered.length === 0 ? (
//                     <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8", fontSize: "13px" }}>Aucun prestataire trouvé</div>
//                   ) : filtered.map((p, i) => {
//                     const isSel = selected.includes(p.id);
//                     return (
//                       <motion.div key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
//                         onClick={() => toggleSelect(p.id)}
//                         style={{
//                           padding: "12px", marginBottom: "6px", borderRadius: "10px", cursor: "pointer",
//                           border: `1.5px solid ${isSel ? "#3b82f6" : "#f1f5f9"}`,
//                           background: isSel ? "#eff6ff" : "#fafafa",
//                           transition: "all 0.15s", display: "flex", alignItems: "center", gap: "12px",
//                         }}>
//                         <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: isSel ? "#2563eb" : "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "15px", fontWeight: 700, color: isSel ? "white" : "#64748b", transition: "all 0.15s" }}>
//                           {p.nom?.charAt(0)?.toUpperCase() || "?"}
//                         </div>
//                         <div style={{ flex: 1, minWidth: 0 }}>
//                           <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.nom}</p>
//                           <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#94a3b8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.email}</p>
//                           <span style={{ fontSize: "10px", color: "#6366f1", background: "#eef2ff", padding: "1px 6px", borderRadius: "4px", marginTop: "4px", display: "inline-block" }}>{p.specialite}</span>
//                         </div>
//                         <div style={{ width: "18px", height: "18px", borderRadius: "5px", border: `2px solid ${isSel ? "#2563eb" : "#cbd5e1"}`, background: isSel ? "#2563eb" : "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
//                           {isSel && <CheckCircle size={12} color="white" />}
//                         </div>
//                       </motion.div>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* Colonne droite : formulaire */}
//               <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "28px" }}>
//                 <h2 style={{ margin: "0 0 24px", fontSize: "15px", fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
//                   <FileText size={16} color="#2563eb" /> Rédiger la notification
//                 </h2>

//                 <AnimatePresence>
//                   {feedback && (
//                     <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
//                       style={{ marginBottom: "20px", padding: "12px 16px", borderRadius: "10px", display: "flex", alignItems: "center", gap: "10px",
//                         background: feedback.type === "success" ? "#f0fdf4" : "#fef2f2",
//                         border: `1px solid ${feedback.type === "success" ? "#bbf7d0" : "#fecaca"}`,
//                         color: feedback.type === "success" ? "#15803d" : "#dc2626",
//                       }}>
//                       {feedback.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
//                       <span style={{ fontSize: "14px", fontWeight: 500 }}>{feedback.msg}</span>
//                       <button onClick={() => setFeedback(null)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "inherit" }}><X size={16} /></button>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>

//                 <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

//                   {/* Type + Année */}
//                   <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
//                     <div>
//                       <label style={labelStyle}>Type de notification</label>
//                       <select name="type" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={inputStyle}>
//                         {Object.entries(TYPE_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.emoji} {v.label}</option>)}
//                       </select>
//                     </div>
//                     <div>
//                       <label style={labelStyle}><Calendar size={13} style={{ marginRight: "4px", verticalAlign: "middle" }} />Année</label>
//                       <input type="number" value={form.annee} onChange={e => setForm({ ...form, annee: e.target.value })} style={inputStyle} />
//                     </div>
//                   </div>

//                   {/* Titre */}
//                   <div>
//                     <label style={labelStyle}>Titre <span style={{ color: "#ef4444" }}>*</span></label>
//                     <input type="text" value={form.titre} onChange={e => setForm({ ...form, titre: e.target.value })}
//                       placeholder="Ex : Résultats de votre évaluation 2024"
//                       style={inputStyle} />
//                   </div>

//                   {/* Message */}
//                   <div>
//                     <label style={labelStyle}>Message <span style={{ color: "#ef4444" }}>*</span></label>
//                     <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
//                       rows={5} placeholder="Rédigez votre message ici..."
//                       style={{ ...inputStyle, resize: "vertical" }} />
//                   </div>

//                   {/* Détails */}
//                   <div>
//                     <label style={labelStyle}>Détails supplémentaires <span style={{ color: "#94a3b8", fontWeight: 400 }}>(optionnel)</span></label>
//                     <textarea value={form.details} onChange={e => setForm({ ...form, details: e.target.value })}
//                       rows={3} placeholder="Informations complémentaires..."
//                       style={{ ...inputStyle, resize: "vertical" }} />
//                   </div>

//                   {/* Aperçu */}
//                   {(form.titre || form.message) && (
//                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
//                       style={{ padding: "16px 20px", borderRadius: "12px", background: TYPE_CONFIG[form.type]?.bg, border: `1px solid ${TYPE_CONFIG[form.type]?.border}` }}>
//                       <p style={{ margin: "0 0 10px", fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>Aperçu</p>
//                       <p style={{ margin: "0 0 6px", fontSize: "15px", fontWeight: 700, color: "#0f172a" }}>{form.titre || "—"}</p>
//                       <p style={{ margin: 0, fontSize: "13px", color: "#475569", whiteSpace: "pre-line", lineHeight: 1.6 }}>{form.message || "—"}</p>
//                     </motion.div>
//                   )}

//                   {/* Submit */}
//                   <motion.button type="submit" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
//                     disabled={sending || !selected.length}
//                     style={{
//                       padding: "14px", borderRadius: "12px", border: "none", cursor: sending || !selected.length ? "not-allowed" : "pointer",
//                       background: sending || !selected.length ? "#e2e8f0" : "linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)",
//                       color: sending || !selected.length ? "#94a3b8" : "white",
//                       fontSize: "15px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
//                       boxShadow: sending || !selected.length ? "none" : "0 4px 14px rgba(59,130,246,0.4)",
//                       transition: "all 0.2s",
//                     }}>
//                     {sending ? (
//                       <><motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
//                         style={{ width: "18px", height: "18px", border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%" }} />
//                         Envoi en cours...</>
//                     ) : (
//                       <><Send size={18} /> Envoyer à {selected.length || 0} prestataire{selected.length > 1 ? "s" : ""}</>
//                     )}
//                   </motion.button>
//                 </form>
//               </div>
//             </motion.div>
//           )}

//           {/* ══ TAB : HISTORIQUE ══ */}
//           {tab === "history" && (
//             <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
//               <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
//                 <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                   <h2 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
//                     <Clock size={16} color="#2563eb" /> Historique des notifications
//                   </h2>
//                   <span style={{ fontSize: "13px", color: "#64748b" }}>{historique.length} notification(s)</span>
//                 </div>

//                 {histLoading ? (
//                   <div style={{ padding: "60px", textAlign: "center", color: "#94a3b8" }}>Chargement...</div>
//                 ) : historique.length === 0 ? (
//                   <div style={{ padding: "60px", textAlign: "center", color: "#94a3b8" }}>
//                     <Bell size={40} style={{ marginBottom: "12px", opacity: 0.3 }} />
//                     <p style={{ margin: 0, fontSize: "14px" }}>Aucune notification envoyée</p>
//                   </div>
//                 ) : (
//                   <div>
//                     {historique.map((n, i) => (
//                       <motion.div key={n.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
//                         style={{ padding: "16px 24px", borderBottom: "1px solid #f8fafc", display: "flex", alignItems: "center", gap: "16px", "&:hover": { background: "#f8fafc" } }}>
//                         <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: TYPE_CONFIG[n.type]?.bg || "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>
//                           {TYPE_CONFIG[n.type]?.emoji || "📬"}
//                         </div>
//                         <div style={{ flex: 1, minWidth: 0 }}>
//                           <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
//                             <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>{n.titre}</p>
//                             <TypeBadge type={n.type} />
//                             {!n.lu && <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#ef4444", flexShrink: 0 }} />}
//                           </div>
//                           <p style={{ margin: 0, fontSize: "12px", color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.message}</p>
//                           <p style={{ margin: "4px 0 0", fontSize: "11px", color: "#94a3b8" }}>
//                             {n.prestataire?.nom || `Prestataire #${n.type_prestataire_id}`} · {new Date(n.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
//                           </p>
//                         </div>
//                         <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
//                           <button onClick={() => deleteNotif(n.id)}
//                             style={{ width: "34px", height: "34px", borderRadius: "8px", border: "1px solid #fecaca", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
//                             <Trash2 size={15} color="#ef4444" />
//                           </button>
//                         </div>
//                       </motion.div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </motion.div>
//           )}

//         </AnimatePresence>
//       </div>
//     </div>
//   );
// };

// const labelStyle = {
//   display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px",
// };

// const inputStyle = {
//   width: "100%", padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: "9px",
//   fontSize: "14px", outline: "none", color: "#0f172a", boxSizing: "border-box",
//   fontFamily: "inherit", background: "#fafafa", transition: "border-color 0.15s",
// };

// export default NotificationAdmin;


import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Bell, CheckCircle, AlertCircle, Users, FileText,
  Calendar, Search, Clock, Eye, Trash2, X
} from "lucide-react";
import axios from "axios";

const API = "http://127.0.0.1:8000/api";

const TYPE_CONFIG = {
  evaluation: { label: "Résultat d'évaluation", color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
  alerte:     { label: "Alerte importante",      color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
  info:       { label: "Information générale",   color: "#059669", bg: "#f0fdf4", border: "#bbf7d0" },
};

const TypeBadge = ({ type }) => {
  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.info;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "4px",
      padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: 600,
      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
    }}>
      {cfg.label}
    </span>
  );
};

const labelStyle = {
  display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px",
};

const inputStyle = {
  width: "100%", padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: "9px",
  fontSize: "14px", outline: "none", color: "#0f172a", boxSizing: "border-box",
  fontFamily: "inherit", background: "#fafafa", transition: "border-color 0.15s",
};

const NotificationAdmin = () => {
  const [tab, setTab] = useState("send");
  const [prestataires, setPrestataires] = useState([]);
  const [historique, setHistorique] = useState([]);
  const [loading, setLoading] = useState(true);
  const [histLoading, setHistLoading] = useState(false);

  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [filterSpec, setFilterSpec] = useState("all");

  const [form, setForm] = useState({
    titre: "", message: "", type: "evaluation",
    annee: new Date().getFullYear(), details: "",
  });

  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => { loadPrestataires(); }, []);
  useEffect(() => { if (tab === "history") loadHistorique(); }, [tab]);

  const loadPrestataires = async () => {
    setLoading(true);
    try {
      const r = await axios.get(`${API}/prestataire`);
      setPrestataires(Array.isArray(r.data) ? r.data : r.data.data || []);
    } catch {
      setFeedback({ type: "error", msg: "Impossible de charger les prestataires." });
    } finally {
      setLoading(false);
    }
  };

  // ✅ CORRIGÉ : utilise la route /notifications/all au lieu de /notifications/prestataire/{id}
  const loadHistorique = async () => {
    setHistLoading(true);
    try {
      const r = await axios.get(`${API}/notifications/all`);
      const data = r.data.notifications ?? r.data.data ?? r.data ?? [];
      setHistorique(Array.isArray(data) ? data : []);
    } catch {
      setHistorique([]);
    } finally {
      setHistLoading(false);
    }
  };

  const specialites = ["all", ...new Set(prestataires.map(p => p.specialite).filter(Boolean))];

  const filtered = prestataires.filter(p => {
    const q = search.toLowerCase();
    return (
      (p.nom?.toLowerCase().includes(q) || p.email?.toLowerCase().includes(q)) &&
      (filterSpec === "all" || p.specialite === filterSpec)
    );
  });

  const toggleSelect = id => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleAll   = () => setSelected(selected.length === filtered.length ? [] : filtered.map(p => p.id));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!selected.length) { setFeedback({ type: "error", msg: "Sélectionnez au moins un prestataire." }); return; }
    if (!form.titre || !form.message) { setFeedback({ type: "error", msg: "Titre et message sont obligatoires." }); return; }

    setSending(true);
    setFeedback(null);
    try {
      await axios.post(`${API}/notifications/send`, {
        prestataire_ids: selected, ...form,
      });
      setFeedback({ type: "success", msg: `Notification envoyée à ${selected.length} prestataire(s) !` });
      setSelected([]);
      setForm({ titre: "", message: "", type: "evaluation", annee: new Date().getFullYear(), details: "" });
    } catch (err) {
      setFeedback({ type: "error", msg: err.response?.data?.message || "Erreur lors de l'envoi." });
    } finally {
      setSending(false);
    }
  };

  const deleteNotif = async id => {
    try {
      await axios.delete(`${API}/notifications/${id}`);
      setHistorique(h => h.filter(n => n.id !== id));
    } catch {}
  };

  // ✅ CORRIGÉ : stats calculées sur historique chargé depuis /all
  const stats = [
    { label: "Prestataires",    value: prestataires.length,                        icon: Users, color: "#2563eb" },
    { label: "Notifs envoyées", value: historique.length,                          icon: Bell,  color: "#7c3aed" },
    { label: "Non lues",        value: historique.filter(n => !n.lu).length,       icon: Eye,   color: "#dc2626" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background: "white", borderBottom: "1px solid #e2e8f0", padding: "0 32px" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "72px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ width: "50px", height: "50px",
                   borderRadius: "14px", 
                   background: "rgba(59, 130, 246, 0.2)", 
                   display: "flex", 
                   alignItems: "center", justifyContent: "center", 
                   boxShadow: "0 4px 14px rgba(59,130,246,0.35)"  }}>
              <Bell size={22} color="black" />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#0f172a", fontFamily: "'DM Serif Display', serif" }}>
                Centre de Notifications
              </h1>
              {/* <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>Administration des communications prestataires</p> */}
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: "4px", background: "#f1f5f9", borderRadius: "10px", padding: "4px" }}>
            {[{ id: "send", label: "Envoyer", icon: Send }, { id: "history", label: "Historique", icon: Clock }].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  padding: "8px 16px", borderRadius: "8px", border: "none", cursor: "pointer",
                  fontSize: "14px", fontWeight: 600, transition: "all 0.2s",
                  background: tab === t.id ? "white" : "transparent",
                  color: tab === t.id ? "#1d4ed8" : "#64748b",
                  boxShadow: tab === t.id ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
                }}>
                <t.icon size={15} /> {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "28px 32px" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "28px" }}>
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              style={{ background: "white", borderRadius: "14px", padding: "20px 24px", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: `${s.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <s.icon size={22} color={s.color} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: "28px", fontWeight: 700, color: "#0f172a", lineHeight: 1 }}>{s.value}</p>
                <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#64748b" }}>{s.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* TAB : ENVOYER */}
          {tab === "send" && (
            <motion.div key="send" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: "24px" }}>

              {/* Colonne gauche : sélection prestataires */}
              <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", 
                overflow: "hidden", display: "flex", flexDirection: "column", maxHeight: "720px" }}>
                <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid #f1f5f9" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                    <h2 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
                      <Users size={16} color="black" /> Destinataires
                    </h2>
                    <span style={{ background: "rgba(59, 130, 246, 0.2)", color: "black", padding: "2px 10px", 
                      borderRadius: "20px", fontSize: "12px", fontWeight: 700 }}>
                      {selected.length} / {prestataires.length}
                    </span>
                  </div>

                  <div style={{ position: "relative", marginBottom: "10px" }}>
                    <Search size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..."
                      style={{ width: "100%", padding: "9px 12px 9px 36px", border: "1.5px solid #e2e8f0", borderRadius: "8px", 
                      fontSize: "13px", outline: "none", boxSizing: "border-box", color: "#0f172a" }} />
                  </div>

                  <select value={filterSpec} onChange={e => setFilterSpec(e.target.value)}
                    style={{alignItems: "center", justifyContent: "center",
                    width: "100%", padding: "9px 12px", 
                    border: "1.5px solid #e2e8f0", borderRadius: "8px", 
                    fontSize: "13px", outline: "none", color: "#475569" }}>
                    {specialites.map(s => <option key={s} value={s}>{s === "all" ? "Spécialité" : s}</option>)}
                  </select>
                </div>

                <div style={{ padding: "10px 20px 8px" }}>
                  <button onClick={toggleAll}
                    style={{ width: "100%", padding: "8px", 
                      border: "1.5px dashed #cbd5e1", 
                    borderRadius: "8px", background: "rgba(59, 130, 246, 0.2)", 
                    fontSize: "13px", fontWeight: 600, 
                    color: "black", cursor: "pointer" }}>
                    {selected.length === filtered.length && filtered.length > 0 ? "✕ Tout désélectionner" : "✓ Tout sélectionner"}
                  </button>
                </div>

                <div style={{ flex: 1, overflowY: "auto", padding: "0 12px 12px" }}>
                  {loading ? (
                    <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8", fontSize: "13px" }}>Chargement...</div>
                  ) : filtered.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8", fontSize: "13px" }}>Aucun prestataire trouvé</div>
                  ) : filtered.map((p, i) => {
                    const isSel = selected.includes(p.id);
                    return (
                      <motion.div key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                        onClick={() => toggleSelect(p.id)}
                        style={{
                          padding: "12px", marginBottom: "6px", borderRadius: "10px", cursor: "pointer",
                          border: `1.5px solid ${isSel ? "#3b82f6" : "#f1f5f9"}`,
                          background: isSel ? "white" : "white",
                          transition: "all 0.15s", display: "flex", alignItems: "center", gap: "12px",
                        }}>
                        <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: isSel ? "#2563eb" : "#e2e8f0", display: "flex", 
                          alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "15px", fontWeight: 700, 
                          color: isSel ? "white" : "white", transition: "all 0.15s" }}>
                          {p.nom?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.nom}</p>
                          <p style={{ margin: "2px 0 0", fontSize: "11px", color: "black", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.email}</p>
                          <span style={{ fontSize: "10px", color: "black", background: "rgba(59, 130, 246, 0.2)", 
                            padding: "1px 6px", borderRadius: "4px", marginTop: "4px", display: "inline-block" }}>{p.specialite}</span>
                        </div>
                        <div style={{ width: "18px", height: "18px", borderRadius: "5px", border: `2px solid ${isSel ? "white" : "black"}`, 
                        background: isSel ? "white" : "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
                          {isSel && <CheckCircle size={12} color="black" />}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Colonne droite : formulaire */}
              <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "28px" }}>
                <h2 style={{ margin: "0 0 24px", fontSize: "15px", fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
                  <FileText size={16} color="#2563eb" /> Rédiger la notification
                </h2>

                <AnimatePresence>
                  {feedback && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                      style={{
                        marginBottom: "20px", padding: "12px 16px", borderRadius: "10px", display: "flex", alignItems: "center", gap: "10px",
                        background: feedback.type === "success" ? "#f0fdf4" : "#fef2f2",
                        border: `1px solid ${feedback.type === "success" ? "#bbf7d0" : "#fecaca"}`,
                        color: feedback.type === "success" ? "#15803d" : "#dc2626",
                      }}>
                      {feedback.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                      <span style={{ fontSize: "14px", fontWeight: 500 }}>{feedback.msg}</span>
                      <button onClick={() => setFeedback(null)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "inherit" }}><X size={16} /></button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={labelStyle}>Type de notification</label>
                      <select name="type" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={inputStyle}>
                        {Object.entries(TYPE_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}><Calendar size={13} style={{ marginRight: "4px", verticalAlign: "middle" }} />Année</label>
                      <input type="number" value={form.annee} onChange={e => setForm({ ...form, annee: e.target.value })} style={inputStyle} />
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Titre <span style={{ color: "#ef4444" }}>*</span></label>
                    <input type="text" value={form.titre} onChange={e => setForm({ ...form, titre: e.target.value })}
                      placeholder="Ex : Résultats de votre évaluation 2024" style={inputStyle} />
                  </div>

                  <div>
                    <label style={labelStyle}>Message <span style={{ color: "#ef4444" }}>*</span></label>
                    <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                      rows={5} placeholder="Rédigez votre message ici..."
                      style={{ ...inputStyle, resize: "vertical" }} />
                  </div>

                  <div>
                    <label style={labelStyle}>Détails supplémentaires <span style={{ color: "#94a3b8", fontWeight: 400 }}>(optionnel)</span></label>
                    <textarea value={form.details} onChange={e => setForm({ ...form, details: e.target.value })}
                      rows={3} placeholder="Informations complémentaires..."
                      style={{ ...inputStyle, resize: "vertical" }} />
                  </div>

                  {(form.titre || form.message) && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      style={{ padding: "16px 20px", borderRadius: "12px", background: TYPE_CONFIG[form.type]?.bg, border: `1px solid ${TYPE_CONFIG[form.type]?.border}` }}>
                      <p style={{ margin: "0 0 10px", fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>Aperçu</p>
                      <p style={{ margin: "0 0 6px", fontSize: "15px", fontWeight: 700, color: "#0f172a" }}>{form.titre || "—"}</p>
                      <p style={{ margin: 0, fontSize: "13px", color: "#475569", whiteSpace: "pre-line", lineHeight: 1.6 }}>{form.message || "—"}</p>
                    </motion.div>
                  )}

                  <motion.button type="submit" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                    disabled={sending || !selected.length}
                    style={{
                      padding: "14px", borderRadius: "12px", border: "none", cursor: sending || !selected.length ? "not-allowed" : "pointer",
                      background: sending || !selected.length ? "#e2e8f0" : "linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)",
                      color: sending || !selected.length ? "#94a3b8" : "white",
                      fontSize: "15px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                      boxShadow: sending || !selected.length ? "none" : "0 4px 14px rgba(59,130,246,0.4)",
                      transition: "all 0.2s",
                    }}>
                    {sending ? (
                      <><motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        style={{ width: "18px", height: "18px", border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%" }} />
                        Envoi en cours...</>
                    ) : (
                      <><Send size={18} /> Envoyer à {selected.length || 0} prestataire{selected.length > 1 ? "s" : ""}</>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          )}

          {/* TAB : HISTORIQUE */}
          {tab === "history" && (
            <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
                <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h2 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
                    <Clock size={16} color="#2563eb" /> Historique des notifications
                  </h2>
                  <span style={{ fontSize: "13px", color: "#64748b" }}>{historique.length} notification(s)</span>
                </div>

                {histLoading ? (
                  <div style={{ padding: "60px", textAlign: "center", color: "#94a3b8" }}>Chargement...</div>
                ) : historique.length === 0 ? (
                  <div style={{ padding: "60px", textAlign: "center", color: "#94a3b8" }}>
                    <Bell size={40} style={{ marginBottom: "12px", opacity: 0.3 }} />
                    <p style={{ margin: 0, fontSize: "14px" }}>Aucune notification envoyée</p>
                  </div>
                ) : (
                  <div>
                    {historique.map((n, i) => (
                      <motion.div key={n.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                        style={{ padding: "16px 24px", borderBottom: "1px solid #f8fafc", display: "flex", alignItems: "center", gap: "16px" }}>
                        <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: TYPE_CONFIG[n.type]?.bg || "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Bell size={18} color={TYPE_CONFIG[n.type]?.color || "#64748b"} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                            <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>{n.titre}</p>
                            <TypeBadge type={n.type} />
                            {!n.lu && (
                              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#ef4444", flexShrink: 0 }} />
                            )}
                          </div>
                          <p style={{ margin: 0, fontSize: "12px", color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.message}</p>
                          <p style={{ margin: "4px 0 0", fontSize: "11px", color: "#94a3b8" }}>
                            {/* ✅ CORRIGÉ : accès au nom via prestataire (relation eager loaded) */}
                            {n.prestataire?.nom || `Prestataire #${n.type_prestataire_id}`}
                            {" · "}
                            {new Date(n.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                        </div>
                        <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                          <button onClick={() => deleteNotif(n.id)}
                            style={{ width: "34px", height: "34px", borderRadius: "8px", border: "1px solid #fecaca", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                            <Trash2 size={15} color="#ef4444" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default NotificationAdmin;