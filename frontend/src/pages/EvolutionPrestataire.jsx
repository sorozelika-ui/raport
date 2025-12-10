import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {Panel,SelectPicker,Button,Message,toaster,Loader,CheckPicker,Toggle,Divider} from "rsuite";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Users, Calendar, Award, BarChart3 } from "lucide-react";
import axios from "axios";

const GraphiqueEvolution = () => {
  const [prestataires, setPrestataires] = useState([]);
  const [annees, setAnnees] = useState([]);
  const [selectedPrestataires, setSelectedPrestataires] = useState([]);
  const [selectedAnnees, setSelectedAnnees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingGraph, setLoadingGraph] = useState(false);
  const [graphData, setGraphData] = useState([]);
  const [showBarChart, setShowBarChart] = useState(false);
  const [statistics, setStatistics] = useState(null);

  // Couleurs pour les différents prestataires
  const colors = [
    "#667eea", "#764ba2", "#f093fb", "#4facfe", 
    "#43e97b", "#fa709a", "#30cfd0", "#a8edea",
    "#ff6b6b", "#4ecdc4", "#45b7d1", "#f7b731"
  ];

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [prestRes, anneeRes] = await Promise.all([
        axios.get("http://127.0.0.1:8000/api/prestataire"),
        axios.get("http://127.0.0.1:8000/api/ANNEE")
      ]);

      const prestData = Array.isArray(prestRes.data) ? prestRes.data : prestRes.data.data || [];
      setPrestataires(
        prestData.map((p) => ({
          label: `${p.nom} - ${p.specialite}`,
          value: p.id,
          data: p
        }))
      );

      const anneeData = Array.isArray(anneeRes.data) ? anneeRes.data : anneeRes.data.data || [];
      setAnnees(
        anneeData.map((a) => ({
          label: String(a.liban || a.annee),
          value: a.id,
          annee: a.liban || a.annee
        }))
      );
    } catch (error) {
      console.error("Erreur:", error);
      toaster.push(
        <Message type="error" showIcon>
          Erreur de chargement des données
        </Message>
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateGraph = async () => {
    if (selectedPrestataires.length === 0) {
      toaster.push(
        <Message type="warning" showIcon>
          Sélectionnez au moins un prestataire
        </Message>
      );
      return;
    }

    if (selectedAnnees.length === 0) {
      toaster.push(
        <Message type="warning" showIcon>
          Sélectionnez au moins une année
        </Message>
      );
      return;
    }

    setLoadingGraph(true);

    try {
      // Récupérer les données pour chaque prestataire sélectionné
      const promises = selectedPrestataires.map((prestId) =>
        axios.get(`http://127.0.0.1:8000/api/evaluations/prestataire/${prestId}`)
      );

      const responses = await Promise.all(promises);

      // Préparer les données pour le graphique
      const chartData = [];
      const stats = {
        totalEvaluations: 0,
        prestatairesMoyenneMax: null,
        prestatairesMoyenneMin: null,
        moyenneGlobale: 0
      };

      let totalMoyennes = 0;
      let countMoyennes = 0;
      let maxMoyenne = -Infinity;
      let minMoyenne = Infinity;

      selectedAnnees.forEach((anneeId) => {
        const anneeInfo = annees.find((a) => a.value === anneeId);
        const anneeLabel = anneeInfo?.annee || anneeId;

        const dataPoint = {
          annee: anneeLabel
        };

        selectedPrestataires.forEach((prestId, index) => {
          const prestInfo = prestataires.find((p) => p.value === prestId);
          const prestNom = prestInfo?.data?.nom || `Prestataire ${prestId}`;

          const response = responses[index];
          const evaluations = response.data?.evaluations || [];

          // Filtrer les évaluations de cette année
          const evalsPourAnnee = evaluations.filter(
            (ev) => (ev.annee?.liban || ev.annee?.annee) == anneeLabel
          );

          if (evalsPourAnnee.length > 0) {
            // Calculer la moyenne pour cette année
            const somme = evalsPourAnnee.reduce(
              (acc, ev) => acc + parseFloat(ev.note?.nts || 0),
              0
            );
            const moyenne = (somme / evalsPourAnnee.length).toFixed(2);
            dataPoint[prestNom] = parseFloat(moyenne);

            stats.totalEvaluations += evalsPourAnnee.length;
            totalMoyennes += parseFloat(moyenne);
            countMoyennes++;

            if (parseFloat(moyenne) > maxMoyenne) {
              maxMoyenne = parseFloat(moyenne);
              stats.prestatairesMoyenneMax = { nom: prestNom, moyenne: parseFloat(moyenne) };
            }

            if (parseFloat(moyenne) < minMoyenne) {
              minMoyenne = parseFloat(moyenne);
              stats.prestatairesMoyenneMin = { nom: prestNom, moyenne: parseFloat(moyenne) };
            }
          } else {
            dataPoint[prestNom] = null; // Pas évalué cette année
          }
        });

        chartData.push(dataPoint);
      });

      stats.moyenneGlobale = countMoyennes > 0 ? (totalMoyennes / countMoyennes).toFixed(2) : 0;

      setGraphData(chartData);
      setStatistics(stats);

      toaster.push(
        <Message type="success" showIcon>
          Graphique généré avec succès !
        </Message>
      );
    } catch (error) {
      console.error("Erreur:", error);
      toaster.push(
        <Message type="error" showIcon>
          Erreur lors de la génération du graphique
        </Message>
      );
    } finally {
      setLoadingGraph(false);
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: "white",
            padding: "15px",
            border: "2px solid #667eea",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
          }}
        >
          <p style={{ fontWeight: "bold", marginBottom: "10px", color: "#1e293b" }}>
            Année {label}
          </p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color, margin: "5px 0" }}>
              <strong>{entry.name}:</strong> {entry.value !== null ? `${entry.value}/20` : "Non évalué"}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
        <Loader size="lg" content="Chargement..." />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1600px", margin: "0 auto", padding: "20px" }}>
      {/* En-tête */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: "center", marginBottom: "40px" }}
      >
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            backgroundcolor: "rgba(59, 130, 246, 0.2)",
            WebkitBackgroundClip: "text",
            marginBottom: "25px",
          }}
        >
          📈 Évolution des Performances
        </h1>
        <p
          style={{
            backgroundcolor: "rgba(59, 130, 246, 0.2)",
            color: "black",
            fontSize: "16px",
          }}
        >
          Analysez l'évolution des prestataires sur des années
        </p>
      </motion.div>

      {/* Formulaire de sélection */}
      <Panel
        bordered
        style={{
          background: "white",
          marginBottom: "30px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          <div>
            <label
              style={{
                fontWeight: "600",
                color: "#1e293b",
                marginBottom: "10px",
                display: "block",
              }}
            >
              <Users
                size={20}
                style={{ marginRight: "8px", verticalAlign: "middle" }}
              />
              Sélectionnez les prestataires
            </label>
            <CheckPicker
              data={prestataires}
              value={selectedPrestataires}
              onChange={setSelectedPrestataires}
              placeholder="Choisir les prestataires..."
              block
              searchable
              style={{ width: "100%" }}
            />
          </div>

          <div>
            <label
              style={{
                fontWeight: "600",
                color: "#1e293b",
                marginBottom: "10px",
                display: "block",
              }}
            >
              <Calendar
                size={20}
                style={{ marginRight: "8px", verticalAlign: "middle" }}
              />
              Sélectionnez les années
            </label>
            <CheckPicker
              data={annees}
              value={selectedAnnees}
              onChange={setSelectedAnnees}
              placeholder="Choisir les années..."
              block
              searchable
              style={{ width: "100%" }}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Toggle
              checked={showBarChart}
              onChange={setShowBarChart}
              checkedChildren="Barres"
              unCheckedChildren="Courbes"
            />
            <span
              style={{
                backgroundcolor: "rgba(59, 130, 246, 0.2)",
                color: "black",
              }}
            >
              Type de graphique
            </span>
          </div>

          <Button
            appearance="primary"
            size="lg"
            onClick={handleGenerateGraph}
            loading={loadingGraph}
            style={{
              backgroundColor: "rgba(59, 131, 246, 0.2)",
              color: "black",
              fontWeight: "600",
            }}
          >
            <TrendingUp size={20} style={{ marginRight: "8px" }} />
            Générer le graphique
          </Button>
        </div>
      </Panel>

      {/* Statistiques */}
      {statistics && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          <Panel
            bordered
            style={{
              backgroundcolor: "rgba(59, 130, 246, 0.2)",
              color: "black",
              textAlign: "center",
              padding: "20px",
            }}
          >
            <Award size={32} style={{ marginBottom: "10px" }} />
            <div style={{ fontSize: "32px", fontWeight: "bold" }}>
              {statistics.moyenneGlobale}/20
            </div>
            <div style={{ opacity: 0.9 }}>Moyenne Globale</div>
          </Panel>

          <Panel
            bordered
            style={{
              background: "#10b981",
              color: "white",
              textAlign: "center",
              padding: "20px",
            }}
          >
            <TrendingUp size={32} style={{ marginBottom: "10px" }} />
            <div style={{ fontSize: "20px", fontWeight: "bold" }}>
              {statistics.prestatairesMoyenneMax?.nom || "N/A"}
            </div>
            <div style={{ fontSize: "24px", fontWeight: "bold" }}>
              {statistics.prestatairesMoyenneMax?.moyenne || 0}/20
            </div>
            <div style={{ opacity: 0.9 }}>Meilleure Performance</div>
          </Panel>

          <Panel
            bordered
            style={{
              background: "#3b82f6",
              color: "white",
              textAlign: "center",
              padding: "20px",
            }}
          >
            <BarChart3 size={32} style={{ marginBottom: "10px" }} />
            <div style={{ fontSize: "32px", fontWeight: "bold" }}>
              {statistics.totalEvaluations}
            </div>
            <div style={{ opacity: 0.9 }}>Total des évaluations</div>
          </Panel>
        </motion.div>
      )}

      {/* Graphique */}
      {graphData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Panel
            bordered
            header={
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  color: "#1e293b",
                }}
              >
                {showBarChart
                  ? "📊 Graphique en barre"
                  : "📈 Graphique de l'évolution"}
              </div>
            }
            style={{
              background: "white",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <ResponsiveContainer width="100%" height={500}>
              {showBarChart ? (
                <BarChart
                  data={graphData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="annee"
                    tick={{ fill: "#6b7280" }}
                    label={{
                      value: "Années",
                      position: "insideBottom",
                      offset: -10,
                    }}
                  />
                  <YAxis
                    domain={[0, 20]}
                    tick={{ fill: "#6b7280" }}
                    label={{
                      value: "Moyenne",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: "20px" }} />
                  {selectedPrestataires.map((prestId, index) => {
                    const prestInfo = prestataires.find(
                      (p) => p.value === prestId
                    );
                    const prestNom =
                      prestInfo?.data?.nom || `Prestataire ${prestId}`;
                    return (
                      <Bar
                        key={prestId}
                        dataKey={prestNom}
                        fill={colors[index % colors.length]}
                        radius={[8, 8, 0, 0]}
                      />
                    );
                  })}
                </BarChart>
              ) : (
                <LineChart
                  data={graphData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="annee"
                    tick={{ fill: "#6b7280" }}
                    label={{
                      value: "Années",
                      position: "insideBottom",
                      offset: -10,
                    }}
                  />
                  <YAxis
                    domain={[0, 20]}
                    tick={{ fill: "#6b7280" }}
                    label={{
                      value: "Moyenne",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: "20px" }} />
                  {selectedPrestataires.map((prestId, index) => {
                    const prestInfo = prestataires.find(
                      (p) => p.value === prestId
                    );
                    const prestNom =
                      prestInfo?.data?.nom || `Prestataire ${prestId}`;
                    return (
                      <Line
                        key={prestId}
                        type="monotone"
                        dataKey={prestNom}
                        stroke={colors[index % colors.length]}
                        strokeWidth={3}
                        dot={{ r: 6, fill: colors[index % colors.length] }}
                        activeDot={{ r: 8 }}
                        connectNulls={false}
                      />
                    );
                  })}
                </LineChart>
              )}
            </ResponsiveContainer>

            <Divider style={{ margin: "20px 0" }} />

            <div
              style={{
                background: "#f9fafb",
                padding: "15px",
                borderRadius: "8px",
              }}
            >
              <h4 style={{ margin: "0 0 10px 0", color: "#1e293b" }}>
                LEGENDE
              </h4>
              <p
                style={{ margin: "5px 0", color: "#6b7280", fontSize: "14px" }}
              >
                • Les points/barres représentent la moyenne de chaque
                prestataire
              </p>
              <p
                style={{ margin: "5px 0", color: "#6b7280", fontSize: "14px" }}
              >
                • Les prestataires non évalués pour une année donnée
                n'apparaissent pas sur le graphique
              </p>
              <p
                style={{ margin: "5px 0", color: "#6b7280", fontSize: "14px" }}
              >
                • La moyenne est calculée sur tous les critères évalués pour
                l'année
              </p>
            </div>
          </Panel>
        </motion.div>
      )}

      {/* Message par défaut */}
      {graphData.length === 0 && !loadingGraph && (
        <Panel
          bordered
          style={{
            textAlign: "center",
            padding: "80px 20px",
            background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
          }}
        >
          <h3
            style={{
              backgroundcolor: "rgba(59, 130, 246, 0.2)",
              color: "black",
              marginBottom: "10px",
            }}
          >
            Générez votre graphique
          </h3>
          <p style={{ color: "black" }}>
            Sélectionnez les prestataires et les années, puis cliquez sur le
            bouton "Générer le graphique"
          </p>
        </Panel>
      )}
    </div>
  );
};

export default GraphiqueEvolution;