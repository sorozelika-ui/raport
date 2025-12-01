import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {Panel,Form,SelectPicker,Button,Message,toaster,Loader,Table,Tag,Modal,Input,} from "rsuite";
import { Award, CheckCircle, AlertCircle } from "lucide-react";
import axios from "axios";

const { Column, HeaderCell, Cell } = Table;

const Evaluation = () => {
  const [prestataires, setPrestataires] = useState([]);
  const [annees, setAnnees] = useState([]);
  const [criteres, setCriteres] = useState([]);
  const [notesDispo, setNotesDispo] = useState([]);

  const [selectedPrestataire, setSelectedPrestataire] = useState(null);
  const [selectedAnnee, setSelectedAnnee] = useState(null);
  const [selectedCriteres, setSelectedCriteres] = useState([]);
  const [notesParCritere, setNotesParCritere] = useState({});
  const [justifications, setJustifications] = useState({});

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [resultat, setResultat] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [prestRes, anneeRes, critereRes, noteRes] = await Promise.all([
        axios.get("http://127.0.0.1:8000/api/prestataire"),
        axios.get("http://127.0.0.1:8000/api/ANNEE"),
        axios.get("http://127.0.0.1:8000/api/criteres"),
        axios.get("http://127.0.0.1:8000/api/note"),
      ]);

      const prestData = Array.isArray(prestRes.data)
        ? prestRes.data
        : prestRes.data.data || [];
      setPrestataires(
        prestData.map((p) => ({
          label: `${p.nom} - ${p.specialite}`,
          value: p.id,
          nom: p.nom,
          specialite: p.specialite,
        }))
      );

      const anneeData = Array.isArray(anneeRes.data)
        ? anneeRes.data
        : anneeRes.data.data || [];
      setAnnees(
        anneeData.map((a) => ({
          label: String(a.liban || a.annee),
          value: a.id,
        }))
      );

      const critereData = Array.isArray(critereRes.data)
        ? critereRes.data
        : critereRes.data.data || [];
      setCriteres(
        critereData.map((c) => ({
          label: c.libcrit,
          value: c.id,
        }))
      );

      const noteData = Array.isArray(noteRes.data)
        ? noteRes.data
        : noteRes.data.data || [];
      setNotesDispo(
        noteData.map((n) => ({
          label: `${n.nt}/20`,
          value: n.id,
          nt: n.nt,
        }))
      );
    } catch (error) {
      toaster.push(
        <Message type="error" showIcon>
          Erreur de chargement
        </Message>
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddCritere = () => {
    if (selectedCriteres.length >= 5) {
      toaster.push(
        <Message type="warning" showIcon>
          Maximum 5 critères
        </Message>
      );
      return;
    }
    setSelectedCriteres([
      ...selectedCriteres,
      { critere_id: null, note_id: null },
    ]);
  };

  const handleRemoveCritere = (index) => {
    const newCriteres = selectedCriteres.filter((_, i) => i !== index);
    setSelectedCriteres(newCriteres);

    const newNotes = { ...notesParCritere };
    delete newNotes[index];
    setNotesParCritere(newNotes);

    const newJust = { ...justifications };
    delete newJust[index];
    setJustifications(newJust);
  };

  const handleCritereChange = (index, critereId) => {
    const newCriteres = [...selectedCriteres];
    newCriteres[index].critere_id = critereId;
    setSelectedCriteres(newCriteres);
  };

  const handleNoteChange = (index, noteId) => {
    const newCriteres = [...selectedCriteres];
    newCriteres[index].note_id = noteId;
    setSelectedCriteres(newCriteres);

    const noteObj = notesDispo.find((n) => n.value === noteId);
    const noteValue = noteObj?.nt || 0;

    setNotesParCritere({ ...notesParCritere, [index]: noteValue });

    if (noteValue >= 5) {
      const newJust = { ...justifications };
      delete newJust[index];
      setJustifications(newJust);
    }
  };

  const handleJustificationChange = (index, value) => {
    setJustifications({ ...justifications, [index]: value });
  };

  const calculerMoyenne = () => {
    const notes = Object.values(notesParCritere);
    if (!notes.length) return 0;
    const somme = notes.reduce((acc, n) => acc + parseFloat(n), 0);
    return (somme / notes.length).toFixed(2);
  };

  const validateForm = () => {
    if (!selectedPrestataire) return warn("Sélectionnez un prestataire");
    if (!selectedAnnee) return warn("Sélectionnez une année");
    if (selectedCriteres.length !== 5)
      return warn("Vous devez évaluer EXACTEMENT 5 critères");

    for (let i = 0; i < selectedCriteres.length; i++) {
      if (!selectedCriteres[i].critere_id)
        return warn("Tous les critères doivent être sélectionnés");
      if (!selectedCriteres[i].note_id)
        return warn("Toutes les notes doivent être attribuées");
      if (notesParCritere[i] < 5 && !justifications[i])
        return warn("Justification obligatoire pour note < 5");
    }
    return true;
  };

  const warn = (msg) =>
    toaster.push(
      <Message type="warning" showIcon>
        {msg}
      </Message>
    );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);

    const data = {
      type_prestataire_id: selectedPrestataire,
      annees_id: selectedAnnee,
      evaluations: selectedCriteres.map((c, i) => ({
        critere_id: c.critere_id,
        note_id: c.note_id,
        justification: justifications[i] || null,
      })),
    };

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/evaluations/create",
        data
      );

      setResultat(res.data);
      setShowResult(true);

      toaster.push(
        <Message type="success" showIcon>
          Évaluation enregistrée !
        </Message>
      );

      setSelectedPrestataire(null);
      setSelectedAnnee(null);
      setSelectedCriteres([]);
      setNotesParCritere({});
      setJustifications({});
    } catch (error) {
      toaster.push(
        <Message type="error" showIcon>
          Erreur lors de l’enregistrement
        </Message>
      );
    } finally {
      setSubmitting(false);
    }
  };

  const moyenne = calculerMoyenne();
  const selectedPrestataireData = prestataires.find(
    (p) => p.value === selectedPrestataire
  );

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "100px" }}>
        <Loader size="lg" content="Chargement..." />
      </div>
    );

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          fontSize: "32px",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Évaluation des Prestataires
      </motion.h2>

      <Panel bordered style={{ marginTop: "20px" }}>
        <Form fluid onSubmit={handleSubmit}>
          <Form.Group>
            <Form.ControlLabel>Prestataire *</Form.ControlLabel>
            <SelectPicker
              data={prestataires}
              value={selectedPrestataire}
              onChange={setSelectedPrestataire}
              block
              searchable
            />
          </Form.Group>

          {selectedPrestataireData && (
            <Panel bordered style={{ background: "#eef", marginBottom: 15 }}>
              <p>
                <strong>Spécialité :</strong>{" "}
                {selectedPrestataireData.specialite}
              </p>
            </Panel>
          )}

          <Form.Group>
            <Form.ControlLabel>Année *</Form.ControlLabel>
            <SelectPicker
              data={annees}
              value={selectedAnnee}
              onChange={setSelectedAnnee}
              block
              searchable
            />
          </Form.Group>

          {/* ✔ CORRECTION DU BOUTON */}
          <Panel
            header={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>Critères ({selectedCriteres.length}/5)</span>

                <Button
                  appearance="ghost"
                  color="blue"
                  onClick={handleAddCritere}
                  disabled={selectedCriteres.length >= 5}
                >
                  + Ajouter un critère
                </Button>
              </div>
            }
            bordered
            style={{ marginTop: 20 }}
          >
            {selectedCriteres.length === 0 ? (
              <p style={{ textAlign: "center", padding: 20 }}>
                Cliquez sur “Ajouter un critère”
              </p>
            ) : (
              selectedCriteres.map((item, index) => (
                <Panel
                  key={index}
                  bordered
                  style={{ marginBottom: 15, padding: 10 }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 10,
                    }}
                  >
                    <strong>Critère {index + 1}</strong>

                    <Button
                      color="red"
                      appearance="ghost"
                      size="xs"
                      onClick={() => handleRemoveCritere(index)}
                    >
                      Supprimer
                    </Button>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 20,
                    }}
                  >
                    <SelectPicker
                      data={criteres}
                      value={item.critere_id}
                      onChange={(value) => handleCritereChange(index, value)}
                      placeholder="Sélectionner un critère"
                      block
                    />

                    <SelectPicker
                      data={notesDispo}
                      value={item.note_id}
                      onChange={(value) => handleNoteChange(index, value)}
                      placeholder="Note"
                      block
                    />
                  </div>

                  {notesParCritere[index] !== undefined &&
                    notesParCritere[index] < 5 && (
                      <Input
                        as="textarea"
                        rows={3}
                        value={justifications[index] || ""}
                        onChange={(value) =>
                          handleJustificationChange(index, value)
                        }
                        placeholder="Justification obligatoire"
                        style={{ marginTop: 10, borderColor: "red" }}
                      />
                    )}
                </Panel>
              ))
            )}

            {Object.keys(notesParCritere).length > 0 && (
              <Panel bordered style={{ background: "#eef" }}>
                <h3 style={{ textAlign: "center" }}>Moyenne : {moyenne}/20</h3>
              </Panel>
            )}
          </Panel>

          <Button
            appearance="primary"
            type="submit"
            loading={submitting}
            disabled={selectedCriteres.length !== 5}
            block
            style={{ marginTop: 20 }}
          >
            Enregistrer l'évaluation
          </Button>
        </Form>
      </Panel>

      {/* MODAL */}
      <Modal open={showResult} onClose={() => setShowResult(false)} size="lg">
        <Modal.Header>
          <Modal.Title>Évaluation enregistrée</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {resultat && (
            <Panel bordered>
              <h2 style={{ textAlign: "center" }}>{resultat.moyenne}/20</h2>
              <p style={{ textAlign: "center" }}>
                {resultat.appreciation_systeme}
              </p>
            </Panel>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowResult(false)} appearance="primary">
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Evaluation;
