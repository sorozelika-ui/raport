import React, { useEffect, useState } from "react";
import axios from "axios";

const Evaluation = () => {
  const [prestataires, setPrestataires] = useState([]);
  const [annees, setAnnees] = useState([]);
  const [typePrestataire, setTypePrestataire] = useState("");
  const [annee, setAnnee] = useState("");
  const [criteres, setCriteres] = useState([]);
  const [notesDispo, setNotesDispo] = useState([]);
  const [notes, setNotes] = useState({});
  const [resultat, setResultat] = useState(null);

  useEffect(() => {
    axios.get("/api/prestataire").then((res) => setPrestataires(res.data));
  }, []);
  useEffect(() => {
    axios.get("/api/ANNEE").then((res) => setAnnees(res.data));
  }, []);
  useEffect(() => {
    axios.get("/api/note").then((res) => setNotesDispo(res.data));
  }, []);

  useEffect(() => {
    if (typePrestataire && annee) {
      axios
        .get(`/api/criteres/${typePrestataire}/${annee}`)
        .then((res) => setCriteres(res.data));
    }
  }, [typePrestataire, annee]);

  const handleNote = (critereId, noteId) => {
    const noteObj = notesDispo.find((n) => n.id === parseInt(noteId));
    setNotes((prev) => ({
      ...prev,
      [critereId]: {
        note_id: noteId,
        justification: prev[critereId]?.justification || "",
        value: noteObj?.nt || 0,
      },
    }));
  };

  const handleJustification = (critereId, value) => {
    setNotes((prev) => ({
      ...prev,
      [critereId]: { ...prev[critereId], justification: value },
    }));
  };

  const submitEvaluation = (e) => {
    e.preventDefault();
    const payload = {
      type_prestataire_id: typePrestataire,
      annees_id: annee,
      notes: Object.entries(notes).map(([id, item]) => ({
        criteres_id: parseInt(id),
        note_id: parseInt(item.note_id),
        justification: item.justification,
      })),
    };
    axios
      .post("/api/evaluations", payload)
      .then((res) => setResultat(res.data))
      .catch((err) => alert(err.response?.data?.error || "Erreur serveur"));
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-lg">
        <div className="card-body">
          <h2 className="text-center mb-4 text-primary">
            Évaluation d’un prestataire
          </h2>
          <form onSubmit={submitEvaluation}>
            <div className="mb-3">
              <label>Prestataire</label>
              <select
                className="form-select"
                value={typePrestataire}
                onChange={(e) => setTypePrestataire(e.target.value)}
                required
              >
                <option value="">-- Choisir --</option>
                {prestataires.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nom} — {p.specialite}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label>Année</label>
              <select
                className="form-select"
                value={annee}
                onChange={(e) => setAnnee(e.target.value)}
                required
              >
                <option value="">-- Choisir --</option>
                {annees.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.liban}
                  </option>
                ))}
              </select>
            </div>

            <hr />

            {criteres.map((c) => (
              <div key={c.id} className="card p-3 mb-3 border-primary">
                <label className="fw-bold text-primary">{c.libcrit}</label>
                <select
                  className="form-select mt-2"
                  onChange={(e) => handleNote(c.id, e.target.value)}
                  required
                >
                  <option value="">-- Choisir une note --</option>
                  {notesDispo.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.nt} — {n.appreciation}
                    </option>
                  ))}
                </select>
                {notes[c.id]?.value < 5 && (
                  <textarea
                    className="form-control mt-2"
                    placeholder="Justification obligatoire"
                    onChange={(e) => handleJustification(c.id, e.target.value)}
                    required
                  />
                )}
              </div>
            ))}

            <button className="btn btn-primary w-100 mt-3">
              Enregistrer l’évaluation
            </button>
          </form>

          {resultat && (
            <div className="alert alert-info mt-4 text-center">
              <h4>Moyenne : {resultat.moyenne}</h4>
              <h4>Appréciation : {resultat.appréciation_système}</h4>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Evaluation;
