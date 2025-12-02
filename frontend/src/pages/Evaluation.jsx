import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Panel,
  Form,
  SelectPicker,
  Button,
  Message,
  toaster,
  Loader,
  Table,
  Tag,
  Modal,
  Input,
} from "rsuite";
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

      setPrestataires(
        prestRes.data.map((p) => ({
          label: `${p.nom} - ${p.specialite}`,
          value: p.id,
          nom: p.nom,
          specialite: p.specialite,
        }))
      );

      setAnnees(
        anneeRes.data.map((a) => ({
          label: String(a.liban || a.annee),
          value: a.id,
        }))
      );

      setCriteres(
        critereRes.data.map((c) => ({
          label: c.libcrit,
          value: c.id,
        }))
      );

      setNotesDispo(
        noteRes.data.map((n) => ({
          label: `${n.nt}/20`,
          value: n.id,
          nt: n.nt,
        }))
      );
    } catch (error) {
      toaster.push(
        <Message type="error" showIcon>
          Erreur de chargement: {error.message}
        </Message>
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddCritere = () => {
    if (selectedCriteres.length >= 5) return;
    setSelectedCriteres([...selectedCriteres, { criteres_id: null, note_id: null }]);
  };

  const handleRemoveCritere = (index) => {
    const newCriteres = selectedCriteres.filter((_, i) => i !== index);
    setSelectedCriteres(newCriteres);

    const newNotes = { ...notesParCritere };
    delete newNotes[index];
    setNotesParCritere(newNotes);

    const newJustifications = { ...justifications };
    delete newJustifications[index];
    setJustifications(newJustifications);
  };

  const handleCritereChange = (index, critereId) => {
    const newCriteres = [...selectedCriteres];
    newCriteres[index] = { ...newCriteres[index], criteres_id: critereId };
    setSelectedCriteres(newCriteres);
  };

  const handleNoteChange = (index, noteId) => {
    const newCriteres = [...selectedCriteres];
    newCriteres[index] = { ...newCriteres[index], note_id: noteId };
    setSelectedCriteres(newCriteres);

    const noteObj = notesDispo.find((n) => n.value === noteId);
    const noteValue = noteObj?.nt || 0;

    setNotesParCritere({ ...notesParCritere, [index]: noteValue });

    if (noteValue >= 5) {
      const newJustifications = { ...justifications };
      delete newJustifications[index];
      setJustifications(newJustifications);
    }
  };

  const handleJustificationChange = (index, value) => {
    setJustifications({ ...justifications, [index]: value });
  };

  const calculerMoyenne = () => {
    const notes = Object.values(notesParCritere);
    if (notes.length === 0) return 0;
    const somme = notes.reduce((acc, note) => acc + parseFloat(note), 0);
    return (somme / notes.length).toFixed(2);
  };

  const validateForm = () => {
    if (!selectedPrestataire) {
      toaster.push(<Message type="warning" showIcon>Sélectionnez un prestataire</Message>);
      return false;
    }
    if (!selectedAnnee) {
      toaster.push(<Message type="warning" showIcon>Sélectionnez une année</Message>);
      return false;
    }
    if (selectedCriteres.length !== 5) {
      toaster.push(<Message type="warning" showIcon>Vous devez évaluer exactement 5 critères</Message>);
      return false;
    }

    for (let i = 0; i < selectedCriteres.length; i++) {
      const critere = selectedCriteres[i];
      if (!critere.criteres_id) {
        toaster.push(<Message type="warning" showIcon>Sélectionnez tous les critères</Message>);
        return false;
      }
      if (!critere.note_id) {
        toaster.push(<Message type="warning" showIcon>Attribuez une note à tous les critères</Message>);
        return false;
      }
      if (notesParCritere[i] < 5 && !justifications[i]?.trim()) {
        toaster.push(<Message type="warning" showIcon>Justification requise pour les notes inférieures à 5</Message>);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);

    const evaluationData = {
      type_prestataire_id: selectedPrestataire,
      annees_id: selectedAnnee,
      evaluations: selectedCriteres.map((c, index) => ({
        criteres_id: c.criteres_id,
        note_id: c.note_id,
        justification: notesParCritere[index] < 5 ? justifications[index] || null : null,
      })),
    };

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/evaluations/create", evaluationData);
      setResultat(res.data);
      setShowResult(true);
      toaster.push(<Message type="success" showIcon>Évaluation enregistrée !</Message>);

      setSelectedPrestataire(null);
      setSelectedAnnee(null);
      setSelectedCriteres([]);
      setNotesParCritere({});
      setJustifications({});
    } catch (error) {
      toaster.push(
        <Message type="error" showIcon>
          {error.response?.data?.message || "Erreur lors de l'enregistrement"}
        </Message>
      );
    } finally {
      setSubmitting(false);
    }
  };

  const selectedPrestataireData = prestataires.find((p) => p.value === selectedPrestataire);
  const moyenne = calculerMoyenne();

  if (loading) {
    return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}><Loader size="lg" content="Chargement..." /></div>;
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          fontSize: "32px",
          fontWeight: "bold",
          background: "linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "30px",
          textAlign: "center",
        }}
      >
        Évaluation des Prestataires
      </motion.h2>

      <Panel bordered style={{ background: "white", marginBottom: "30px" }}>
        <Form fluid>
          <Form.Group>
            <Form.ControlLabel style={{ fontWeight: "600", color: "#1e40af" }}>Prestataire *</Form.ControlLabel>
            <SelectPicker
              data={prestataires}
              value={selectedPrestataire}
              onChange={setSelectedPrestataire}
              placeholder="Choisir un prestataire"
              block size="lg" searchable
            />
          </Form.Group>

          {selectedPrestataireData && (
            <Panel bordered style={{ background: "#f0f9ff", marginBottom: "15px" }}>
              <p style={{ margin: 0, color: "#1e40af" }}>
                <strong>Spécialité :</strong> {selectedPrestataireData.specialite}
              </p>
            </Panel>
          )}

          <Form.Group>
            <Form.ControlLabel style={{ fontWeight: "600", color: "#1e40af" }}>Année *</Form.ControlLabel>
            <SelectPicker
              data={annees}
              value={selectedAnnee}
              onChange={setSelectedAnnee}
              placeholder="Choisir une année"
              block size="lg" searchable
            />
          </Form.Group>

          <Panel
            header={
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>Critères et Notes ({selectedCriteres.length}/5)</span>
                {selectedCriteres.length < 5 && (
                  <Button appearance="ghost" color="blue" onClick={handleAddCritere}>
                    + Ajouter un critère
                  </Button>
                )}
              </div>
            }
            bordered style={{ marginTop: "20px", background: "#fafafa" }}
          >
            {selectedCriteres.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
                <p>Cliquez sur "Ajouter un critère" pour commencer l'évaluation</p>
                <p style={{ fontSize: "14px" }}>Vous devez évaluer sur exactement 5 critères</p>
              </div>
            ) : (
              selectedCriteres.map((item, index) => (
                <Panel key={index} bordered style={{ marginBottom: "15px", background: "white", borderLeft: "4px solid #3b82f6" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                    <h5 style={{ margin: 0, color: "#1e40af" }}>Critère {index + 1}</h5>
                    <Button appearance="ghost" color="red" size="sm" onClick={() => handleRemoveCritere(index)}>Supprimer</Button>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                    <Form.Group>
                      <Form.ControlLabel>Critère *</Form.ControlLabel>
                      <SelectPicker
                        data={criteres}
                        value={item.criteres_id}
                        onChange={(value) => handleCritereChange(index, value)}
                        placeholder="Choisir un critère"
                        block searchable
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.ControlLabel>Note *</Form.ControlLabel>
                      <SelectPicker
                        data={notesDispo}
                        value={item.note_id}
                        onChange={(value) => handleNoteChange(index, value)}
                        placeholder="Choisir une note"
                        block searchable
                      />
                    </Form.Group>
                  </div>

                  {notesParCritere[index] !== undefined && (
                    <div style={{ marginTop: "10px" }}>
                      <Tag color={notesParCritere[index] >= 10 ? "green" : "red"} size="lg">
                        Note: {notesParCritere[index]}/20
                      </Tag>
                    </div>
                  )}

                  {notesParCritere[index] !== undefined && notesParCritere[index] < 5 && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.3 }} style={{ marginTop: "15px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", color: "#dc2626" }}>
                        <AlertCircle size={20} />
                        <span style={{ fontWeight: "600" }}>Justification obligatoire (note {"<"} 5)</span>
                      </div>
                      <Input
                        as="textarea"
                        rows={3}
                        value={justifications[index] || ""}
                        onChange={(value) => handleJustificationChange(index, value)}
                        placeholder="Expliquez pourquoi cette note a été attribuée..."
                        style={{ width: "100%", border: "2px solid #fca5a5" }}
                      />
                    </motion.div>
                  )}
                </Panel>
              ))
            )}

            {selectedCriteres.length > 0 && Object.keys(notesParCritere).length > 0 && (
              <Panel bordered style={{ background: "#e0f2fe", marginTop: "20px" }}>
                <div style={{ textAlign: "center" }}>
                  <h3 style={{ margin: 0, color: "#1e40af", fontSize: "32px" }}>Moyenne : {moyenne}/20</h3>
                  <p style={{ margin: "10px 0 0", color: "#6b7280" }}>Calculée sur {Object.keys(notesParCritere).length} critère(s)</p>
                </div>
              </Panel>
            )}
          </Panel>

          <Form.Group style={{ marginTop: "30px" }}>
            <Button
              appearance="primary"
              onClick={handleSubmit}
              loading={submitting}
              disabled={submitting || selectedCriteres.length !== 5}
              size="lg"
              block
              style={{ background: "linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)", fontSize: "16px", fontWeight: "600" }}
            >
              {submitting ? "Enregistrement..." : "Enregistrer l'évaluation"}
            </Button>
          </Form.Group>
        </Form>
      </Panel>

      <Modal open={showResult} onClose={() => setShowResult(false)} size="lg">
        <Modal.Header>
          <Modal.Title>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <CheckCircle size={24} color="#10b981" />
              <span>Évaluation Enregistrée</span>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {resultat && (
            <div>
              <Panel bordered style={{ background: "#f0fdf4", marginBottom: "20px", textAlign: "center" }}>
                <Award size={48} color="#10b981" style={{ marginBottom: "15px" }} />
                <h2 style={{ margin: 0, color: "#1e40af", fontSize: "48px" }}>{resultat.moyenne}/20</h2>
                <p style={{ margin: "10px 0", fontSize: "18px" }}>Moyenne Générale</p>
                <Tag size="lg" color={resultat.moyenne >= 10 ? "green" : "red"}>{resultat.appreciation_systeme}</Tag>
              </Panel>

              <h4 style={{ marginBottom: "15px", color: "#1e40af" }}>Détails de l'évaluation</h4>
              <Table height={300} data={resultat.evaluations || []} bordered cellBordered>
                <Column width={200} flexGrow={1}>
                  <HeaderCell style={{ background: "#3b82f6", color: "white" }}>Prestataire</HeaderCell>
                  <Cell>{(row) => row.prestataire?.nom || "N/A"}</Cell>
                </Column>
                <Column width={150}>
                  <HeaderCell style={{ background: "#3b82f6", color: "white" }}>Spécialité</HeaderCell>
                  <Cell>{(row) => row.prestataire?.specialite || "N/A"}</Cell>
                </Column>
                <Column width={200} flexGrow={1}>
                  <HeaderCell style={{ background: "#3b82f6", color: "white" }}>Critère</HeaderCell>
                  <Cell>{(row) => row.critere?.libcrit || "N/A"}</Cell>
                </Column>
                <Column width={100} align="center">
                  <HeaderCell style={{ background: "#3b82f6", color: "white" }}>Note</HeaderCell>
                  <Cell>{(row) => <Tag color={row.note?.nt >= 10 ? "green" : "red"}>{row.note?.nt || 0}/20</Tag>}</Cell>
                </Column>
                <Column width={120} align="center">
                  <HeaderCell style={{ background: "#3b82f6", color: "white" }}>Année</HeaderCell>
                  <Cell>{(row) => row.annee?.liban || row.annee?.annee || "N/A"}</Cell>
                </Column>
              </Table>

              <Panel bordered style={{ marginTop: "20px", textAlign: "center" }}>
                <Button appearance="primary" onClick={() => setShowResult(false)}>Fermer</Button>
              </Panel>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Evaluation;
