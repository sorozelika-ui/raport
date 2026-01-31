import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Panel,
  Button,
  Message,
  toaster,
  Loader,
  CheckPicker,
  Toggle,
  Divider,
} from "rsuite";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Users, Calendar, Award, BarChart3 } from "lucide-react";
import axios from "axios";

const GraphiqueEvolution = () => {
  /* ✅ STYLE PERSONNALISÉ POUR LES PICKERS */
  const pickerStyle = {
    width: "100%",
    minHeight: "42px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
  };

  const [prestataires, setPrestataires] = useState([]);
  const [annees, setAnnees] = useState([]);
  const [selectedPrestataires, setSelectedPrestataires] = useState([]);
  const [selectedAnnees, setSelectedAnnees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingGraph, setLoadingGraph] = useState(false);
  const [graphData, setGraphData] = useState([]);
  const [showBarChart, setShowBarChart] = useState(false);
  const [statistics, setStatistics] = useState(null);

  const colors = [
    "#667eea",
    "#764ba2",
    "#f093fb",
    "#4facfe",
    "#43e97b",
    "#fa709a",
    "#30cfd0",
    "#a8edea",
  ];

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [prestRes, anneeRes] = await Promise.all([
        axios.get("http://127.0.0.1:8000/api/prestataire"),
        axios.get("http://127.0.0.1:8000/api/ANNEE"),
      ]);

      setPrestataires(
        (prestRes.data?.data || prestRes.data || []).map((p) => ({
          label: `${p.nom} - ${p.specialite}`,
          value: p.id,
          data: p,
        }))
      );

      setAnnees(
        (anneeRes.data?.data || anneeRes.data || []).map((a) => ({
          label: String(a.liban || a.annee),
          value: a.id,
          annee: a.liban || a.annee,
        }))
      );
    } catch {
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
    if (!selectedPrestataires.length || !selectedAnnees.length) {
      toaster.push(
        <Message type="warning" showIcon>
          Sélectionnez les prestataires et les années
        </Message>
      );
      return;
    }

    setLoadingGraph(true);

    try {
      const responses = await Promise.all(
        selectedPrestataires.map((id) =>
          axios.get(`http://127.0.0.1:8000/api/evaluations/prestataire/${id}`)
        )
      );

      const chartData = [];
      let total = 0,
        count = 0;

      selectedAnnees.forEach((anneeId) => {
        const anneeLabel =
          annees.find((a) => a.value === anneeId)?.annee || anneeId;

        const point = { annee: anneeLabel };

        selectedPrestataires.forEach((prestId, i) => {
          const prestNom =
            prestataires.find((p) => p.value === prestId)?.data?.nom ||
            `Prestataire ${prestId}`;

          const evals = responses[i].data?.evaluations || [];
          const yearEvals = evals.filter(
            (e) => (e.annee?.liban || e.annee?.annee) == anneeLabel
          );

          if (yearEvals.length) {
            const avg =
              yearEvals.reduce(
                (s, e) => s + parseFloat(e.note?.nts || 0),
                0
              ) / yearEvals.length;
            point[prestNom] = Number(avg.toFixed(2));
            total += avg;
            count++;
          }
        });

        chartData.push(point);
      });

      setGraphData(chartData);
      setStatistics({ moyenneGlobale: (total / count).toFixed(2) });

      toaster.push(
        <Message type="success" showIcon>
          Graphique généré avec succès
        </Message>
      );
    } catch {
      toaster.push(
        <Message type="error" showIcon>
          Erreur lors de la génération
        </Message>
      );
    } finally {
      setLoadingGraph(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: 400, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader size="lg" content="Chargement..." />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1500, margin: "auto", padding: 20 }}>
      <Panel bordered>
        <label><Users size={16} /> Prestataires</label>
        <CheckPicker
          data={prestataires}
          value={selectedPrestataires}
          onChange={setSelectedPrestataires}
          block
          searchable
          style={pickerStyle}
        />

        <label style={{ marginTop: 15 }}><Calendar size={16} /> Années</label>
        <CheckPicker
          data={annees}
          value={selectedAnnees}
          onChange={setSelectedAnnees}
          block
          searchable
          style={pickerStyle}
        />

        <Divider />

        <Toggle
          checked={showBarChart}
          onChange={setShowBarChart}
          checkedChildren="Barres"
          unCheckedChildren="Courbes"
        />

        <Button
          appearance="primary"
          onClick={handleGenerateGraph}
          loading={loadingGraph}
          style={{ marginTop: 15 }}
        >
          <TrendingUp /> Générer
        </Button>
      </Panel>

      {graphData.length > 0 && (
        <Panel bordered style={{ marginTop: 30 }}>
          <ResponsiveContainer width="100%" height={450}>
            {showBarChart ? (
              <BarChart data={graphData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="annee" />
                <YAxis domain={[0, 20]} />
                <Tooltip />
                <Legend />
                {selectedPrestataires.map((id, i) => {
                  const name =
                    prestataires.find((p) => p.value === id)?.data?.nom ||
                    `Prestataire ${id}`;
                  return (
                    <Bar
                      key={id}
                      dataKey={name}
                      fill={colors[i % colors.length]}
                    />
                  );
                })}
              </BarChart>
            ) : (
              <LineChart data={graphData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="annee" />
                <YAxis domain={[0, 20]} />
                <Tooltip />
                <Legend />
                {selectedPrestataires.map((id, i) => {
                  const name =
                    prestataires.find((p) => p.value === id)?.data?.nom ||
                    `Prestataire ${id}`;
                  return (
                    <Line
                      key={id}
                      dataKey={name}
                      stroke={colors[i % colors.length]}
                      strokeWidth={3}
                    />
                  );
                })}
              </LineChart>
            )}
          </ResponsiveContainer>
        </Panel>
      )}
    </div>
  );
};

export default GraphiqueEvolution;
