import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MailQuestionMark, CheckCircle, Clock, Eye, EyeOff, SquareMousePointer, ChevronDown, ChevronUp, X } from "lucide-react";
import axios from "axios";

const API = "http://127.0.0.1:8000/api";

const TYPE_CONFIG = {
  evaluation: { label: "Évaluation",  color: "#2563eb", bg: "#eff6ff",  border: "#bfdbfe" },
  alerte:     { label: "Alerte", color: "#dc2626", bg: "#fef2f2",  border: "#fecaca" },
  info:       { label: "Information", color: "#059669", bg: "#f0fdf4",  border: "#bbf7d0" },
};

/* ── Carte d'une notification ── */
const NotifCard = ({ notif, onRead, onDelete }) => {
  const [open, setOpen] = useState(false);
  const cfg = TYPE_CONFIG[notif.type] || TYPE_CONFIG.info;

  const handleOpen = () => {
    setOpen(o => !o);
    if (!notif.lu && !open) onRead(notif.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      style={{
        background: "white",
        borderRadius: "14px",
        border: `1.5px solid ${notif.lu ? "#f1f5f9" : cfg.border}`,
        overflow: "hidden",
        transition: "border-color 0.2s",
        boxShadow: notif.lu ? "none" : "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      {/* En-tête cliquable */}
      <div
        onClick={handleOpen}
        style={{
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          gap: "14px",
          cursor: "pointer",
          background: notif.lu ? "white" : `${cfg.bg}`,
          transition: "background 0.2s",
        }}
      >
        {/* Icône type */}
        <div style={{
          width: "44px", height: "44px", borderRadius: "12px", flexShrink: 0,
          background: cfg.bg, border: `1px solid ${cfg.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "20px",
        }}>
          {/* {cfg.emoji} */}
        </div>

        {/* Contenu */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
            {!notif.lu && (
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: cfg.color, flexShrink: 0 }} />
            )}
            <p style={{ margin: 0, fontSize: "15px", fontWeight: notif.lu ? 500 : 700, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {notif.titre}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "11px", color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`, padding: "1px 8px", borderRadius: "10px", fontWeight: 600 }}>
              {/* {cfg.emoji} */}
               {cfg.label}
            </span>
            {notif.annee && (
              <span style={{ fontSize: "11px", color: "#94a3b8" }}>Année {notif.annee}</span>
            )}
            <span style={{ fontSize: "11px", color: "#94a3b8" }}>
              {new Date(notif.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
            </span>
          </div>
        </div>

        {/* Actions droite */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
          {notif.lu
            ? <EyeOff size={15} color="#cbd5e1" />
            : <Eye size={15} color={cfg.color} />
          }
          <div style={{ color: "#94a3b8" }}>
            {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </div>
      </div>

      {/* Corps déplié */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ padding: "0 20px 20px", borderTop: `1px solid ${cfg.border}` }}>
              <p style={{ margin: "16px 0 8px", fontSize: "13px", fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.06em" }}>Message</p>
              <p style={{ margin: 0, fontSize: "14px", color: "#374151", lineHeight: 1.7, whiteSpace: "pre-line" }}>{notif.message}</p>

              {notif.details && (
                <>
                  <p style={{ margin: "16px 0 8px", fontSize: "13px", fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.06em" }}>Détails</p>
                  <p style={{ margin: 0, fontSize: "13px", color: "#64748b", lineHeight: 1.7, whiteSpace: "pre-line" }}>{notif.details}</p>
                </>
              )}

              <div style={{ marginTop: "16px", display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={e => { e.stopPropagation(); onDelete(notif.id); }}
                  style={{ padding: "6px 14px", borderRadius: "8px", border: "1px solid #fecaca", background: "#fef2f2", color: "#ef4444", fontSize: "12px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                  <X size={13} /> Supprimer
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* 
   COMPOSANT PRINCIPAL — BOÎTE DE RÉCEPTION
*/
const NotificationInbox = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const prestataireId = user?.id;
  
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [stats, setStats] = useState({ total: 0, nonLues: 0 });

  useEffect(() => {
    if (prestataireId) loadNotifications();
  }, [prestataireId]);
  const loadNotifications = async () => {
    setLoading(true);
    try {
      const r = await axios.get(`${API}/notifications/prestataire/${prestataireId}`);
      const data = r.data.notifications ?? r.data ?? [];
      const list = Array.isArray(data) ? data : [];
      setNotifications(list);
      setStats({ total: r.data.total ?? list.length, nonLues: r.data.non_lues ?? list.filter(n => !n.lu).length });
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRead = async id => {
    try {
      await axios.put(`${API}/notifications/${id}/read`);
      setNotifications(ns => ns.map(n => n.id === id ? { ...n, lu: true } : n));
      setStats(s => ({ ...s, nonLues: Math.max(0, s.nonLues - 1) }));
    } catch {}
  };

  const handleReadAll = async () => {
    try {
      await axios.put(`${API}/notifications/prestataire/${prestataireId}/read-all`);
      setNotifications(ns => ns.map(n => ({ ...n, lu: true })));
      setStats(s => ({ ...s, nonLues: 0 }));
    } catch {}
  };

  const handleDelete = async id => {
    try {
      await axios.delete(`${API}/notifications/${id}`);
      const deleted = notifications.find(n => n.id === id);
      setNotifications(ns => ns.filter(n => n.id !== id));
      if (deleted && !deleted.lu) setStats(s => ({ ...s, nonLues: Math.max(0, s.nonLues - 1), total: s.total - 1 }));
      else setStats(s => ({ ...s, total: s.total - 1 }));
    } catch {}
  };

  const filtered = notifications.filter(n => {
    if (filter === "unread") return !n.lu;
    if (filter === "all") return true;
    return n.type === filter;
  });

  const filters = [
    { id: "all",        label: "Toutes",      count: notifications.length },
    { id: "unread",     label: "Non lues",    count: stats.nonLues },
    { id: "evaluation", label: "Évaluations", count: notifications.filter(n => n.type === "evaluation").length },
    { id: "alerte",     label: "Alertes",     count: notifications.filter(n => n.type === "alerte").length },
    { id: "info",       label: "Infos",       count: notifications.filter(n => n.type === "info").length },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "32px 24px" }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: "28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ position: "relative" }}>
                <div style={{ width: "50px", height: "50px",
                   borderRadius: "14px", 
                   background: "rgba(59, 130, 246, 0.2)", 
                   display: "flex", 
                   alignItems: "center", justifyContent: "center", 
                   boxShadow: "0 4px 14px rgba(59,130,246,0.35)" 
                  }}>
                  <MailQuestionMark size={24} color="black" />
                </div>
                {stats.nonLues > 0 && (
                  <motion.span
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    style={{ position: "absolute", top: "-6px", right: "-6px", background: "#ef4444", color: "white", borderRadius: "10px", padding: "1px 6px", fontSize: "11px", fontWeight: 800, minWidth: "18px", textAlign: "center", border: "2px solid #f8fafc" }}>
                    {stats.nonLues}
                  </motion.span>
                )}
              </div>
              <div>
                <h1 style={{ margin: 0, fontSize: "22px", fontWeight: 700, color: "#0f172a", fontFamily: "'DM Serif Display', serif" }}>
                Boîte de reception
                </h1>
                <p style={{ margin: "3px 0 0", fontSize: "13px", color: "#64748b" }}>
                  {stats.nonLues > 0 ? `${stats.nonLues} non lue${stats.nonLues > 1 ? "s" : ""}` : "Tout est lu"} · {stats.total} au total
                </p>
              </div>
            </div>

            {stats.nonLues > 0 && (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleReadAll}
                style={{ padding: "9px 16px", borderRadius: "10px", border: "1.5px solid #bfdbfe", background: "#eff6ff", color: "#1d4ed8", fontSize: "13px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle size={15} /> Tout marquer lu
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Filtres */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
          {filters.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              style={{
                padding: "7px 14px", borderRadius: "20px", border: "1.5px solid",
                borderColor: filter === f.id ? "#2563eb" : "#e2e8f0",
                background: filter === f.id ? "#eff6ff" : "white",
                color: filter === f.id ? "#1d4ed8" : "#64748b",
                fontSize: "13px", fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
                display: "flex", alignItems: "center", gap: "6px",
              }}>
              {f.label}
              {f.count > 0 && (
                <span style={{ background: filter === f.id ? "#2563eb" : "#f1f5f9", color: filter === f.id ? "white" : "#64748b", borderRadius: "10px", padding: "0 6px", fontSize: "11px", fontWeight: 700 }}>
                  {f.count}
                </span>
              )}
            </button>
          ))}
        </motion.div>

        {/* Liste */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#94a3b8" }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              style={{ width: "36px", height: "36px", border: "3px solid #e2e8f0", borderTopColor: "#3b82f6", borderRadius: "50%", margin: "0 auto 14px" }} />
            <p style={{ margin: 0, fontSize: "14px" }}>Chargement...</p>
          </div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ textAlign: "center", padding: "80px 0", 
            color: "black",backgroundcolor:"rgba(59, 130, 246, 0.2)" }}>
            <SquareMousePointer size={48} style={{ backgroundcolor:"rgba(59, 130, 246, 0.2)",
              color:"black",marginBottom: "14px", opacity: 0.3 }} />
            <p style={{ margin: "0 0 4px", fontSize: "16px", fontWeight: 600, color: "#cbd5e1" }}>Aucune notification</p>
            {/* <p style={{ margin: 0, fontSize: "13px" }}>
              {filter === "unread" ? "Vous avez tout lu !" : "Rien ici pour le moment."}
            </p> */}
          </motion.div>
        ) : (
          <motion.div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <AnimatePresence>
              {filtered.map(n => (
                <NotifCard key={n.id} notif={n} onRead={handleRead} onDelete={handleDelete} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NotificationInbox;