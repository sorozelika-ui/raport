import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {Panel,SelectPicker,Button,Message,toaster,Loader,Table,Tag,Divider,Avatar,} from "rsuite";
import {Search,Award,TrendingUp,Calendar,Star,FileText,} from "lucide-react";
import axios from "axios";

const { Column, HeaderCell, Cell } = Table;

const Consulter = () => {
  const [prestataires, setPrestataires] = useState([]);
  const [selectedPrestataire, setSelectedPrestataire] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [resultats, setResultats] = useState(null);

  useEffect(() => {
    loadPrestataires();
  }, []);

  const loadPrestataires = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/prestataire");
      const prestData = Array.isArray(res.data)
        ? res.data
        : res.data.data || [];
      setPrestataires(
        prestData.map((p) => ({
          label: `${p.nom} - ${p.specialite}`,
          value: p.id,
          data: p,
        }))
      );
    } catch (error) {
      toaster.push(
        <Message type="error" showIcon>
          Erreur de chargement des prestataires
        </Message>
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!selectedPrestataire) {
      toaster.push(
        <Message type="warning" showIcon>
          Veuillez sélectionner un prestataire
        </Message>
      );
      return;
    }

    setSearching(true);
    setResultats(null);

    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/evaluations/prestataire/${selectedPrestataire}`
      );

      if (
        res.data &&
        (res.data.evaluations?.length > 0 || res.data.length > 0)
      ) {
        setResultats(res.data);
        toaster.push(
          <Message type="success" showIcon>
            Résultats trouvés !
          </Message>
        );
      } else {
        toaster.push(
          <Message type="info" showIcon>
            Aucune évaluation trouvée pour ce prestataire
          </Message>
        );
      }
    } catch (error) {
      toaster.push(
        <Message type="error" showIcon>
          {error.response?.data?.message || "Erreur lors de la recherche"}
        </Message>
      );
    } finally {
      setSearching(false);
    }
  };

  const selectedPrestataireData = prestataires.find(
    (p) => p.value === selectedPrestataire
  )?.data;

  const groupByYear = (evaluations) => {
    const grouped = {};
    evaluations.forEach((evaluation) => {
      const year = evaluation.annee?.liban || evaluation.annee?.annee || "N/A";
      if (!grouped[year]) grouped[year] = [];
      grouped[year].push(evaluation);
    });
    return grouped;
  };

  const getAppreciation = (moyenne) => {
    if (moyenne >= 16) return { text: "Excellent", color: "green" };
    if (moyenne >= 14) return { text: "Très Bien", color: "cyan" };
    if (moyenne >= 12) return { text: "Bien", color: "blue" };
    if (moyenne >= 10) return { text: "Passable", color: "yellow" };
    if (moyenne >= 8) return { text: "Insuffisant", color: "orange" };
    return { text: "Très Insuffisant", color: "red" };
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <Loader size="lg" content="Chargement..." />
      </div>
    );
  }

  const evaluationsData = resultats?.evaluations || resultats || [];
  const groupedByYear =
    evaluationsData.length > 0 ? groupByYear(evaluationsData) : {};

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "20px" }}>
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
          📊 Consultation des Résultats
        </h1>
        <p
          style={{
            backgroundcolor: "rgba(59, 130, 246, 0.2)",
            color: "black",
            fontSize: "16px",
          }}
        >
          Consultez vos évaluations et performances
        </p>
      </motion.div>

      <Panel
        bordered
        style={{
          backgroundcolor: "rgba(59, 130, 246, 0.2)",
          color: "black",
          marginBottom: "30px",
          padding: "30px",
        }}
      >
        <div style={{ display: "flex", gap: "15px", alignItems: "flex-end" }}>
          <div style={{ flex: 1 }}>
            <label
              style={{
                color: "black",
                fontWeight: "600",
                marginBottom: "10px",
                display: "block",
              }}
            >
              Sélectionnez votre nom
            </label>
            <SelectPicker
              data={prestataires}
              value={selectedPrestataire}
              onChange={setSelectedPrestataire}
              placeholder="Rechercher un prestataire..."
              block
              size="lg"
              searchable
              style={{ width: "100%" }}
            />
          </div>
          <Button
            appearance="primary"
            size="lg"
            onClick={handleSearch}
            loading={searching}
            style={{
              background: "white",
              color: "blue",
              fontWeight: "600",
              minWidth: "150px",
            }}
          >
            <Search size={20} style={{ marginRight: "8px" }} />
            Rechercher
          </Button>
        </div>
      </Panel>

      <AnimatePresence>
        {resultats && selectedPrestataireData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Panel
              bordered
              style={{
                background: "white",
                marginBottom: "30px",
                borderTop: "4px solid #667eea",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "20px" }}
              >
                <Avatar
                  size="lg"
                  circle
                  style={{
                    backgroundcolor: "rgba(59, 130, 246, 0.2)",
                    color: "blue",
                    fontSize: "32px",
                  }}
                >
                  {selectedPrestataireData.nom?.charAt(0).toUpperCase()}
                </Avatar>
                <div style={{ flex: 1 }}>
                  <h2 style={{ margin: 0, color: "#1e293b", fontSize: "28px" }}>
                    {selectedPrestataireData.nom}
                  </h2>
                  <div
                    style={{
                      display: "flex",
                      gap: "20px",
                      marginTop: "10px",
                      flexWrap: "wrap",
                    }}
                  >
                    <Tag color="blue" size="lg">
                      <Star size={16} style={{ marginRight: "5px" }} />
                      {selectedPrestataireData.specialite}
                    </Tag>
                    {selectedPrestataireData.email && (
                      <span style={{ color: "black" }}>
                        📧 {selectedPrestataireData.email}
                      </span>
                    )}
                    {selectedPrestataireData.telephone && (
                      <span style={{ color: "black" }}>
                        📱 {selectedPrestataireData.telephone}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Panel>

            {Object.keys(groupedByYear).length > 0 ? (
              Object.entries(groupedByYear).map(([year, yearEvaluations]) => {
                // Utilisation de la moyenne stockée
                const moyenne = yearEvaluations[0]?.note?.moyenne || 0;
                const appreciation = getAppreciation(parseFloat(moyenne));

                return (
                  <motion.div
                    key={year}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ marginBottom: "30px" }}
                  >
                    <Panel
                      bordered
                      header={
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            <Calendar size={24} color="black" />
                            <span
                              style={{ fontSize: "20px", fontWeight: "600" }}
                            >
                              Année {year}
                            </span>
                          </div>
                          <Tag color={appreciation.color} size="lg">
                            {appreciation.text}
                          </Tag>
                        </div>
                      }
                      style={{ background: "white" }}
                    >
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fit, minmax(200px, 1fr))",
                          gap: "20px",
                          marginBottom: "30px",
                        }}
                      >
                        <div
                          style={{
                            background:
                              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            padding: "20px",
                            borderRadius: "12px",
                            color: "white",
                            textAlign: "center",
                          }}
                        >
                          <Award size={32} style={{ marginBottom: "10px" }} />
                          <div style={{ fontSize: "32px", fontWeight: "bold" }}>
                            {moyenne}
                          </div>
                          <div style={{ opacity: 0.9 }}>Moyenne Générale</div>
                        </div>

                        <div
                          style={{
                            background: "#f0f9ff",
                            padding: "20px",
                            borderRadius: "12px",
                            border: "2px solid #bfdbfe",
                            textAlign: "center",
                          }}
                        >
                          <FileText
                            size={32}
                            color="#3b82f6"
                            style={{ marginBottom: "10px" }}
                          />
                          <div
                            style={{
                              fontSize: "32px",
                              fontWeight: "bold",
                              color: "#1e40af",
                            }}
                          >
                            {yearEvaluations.length}
                          </div>
                          <div style={{ color: "#6b7280" }}>
                            Critères Évalués
                          </div>
                        </div>

                        <div
                          style={{
                            background: `linear-gradient(135deg, ${
                              appreciation.color === "green"
                                ? "#10b981"
                                : appreciation.color === "cyan"
                                ? "#06b6d4"
                                : appreciation.color === "blue"
                                ? "#3b82f6"
                                : appreciation.color === "yellow"
                                ? "#f59e0b"
                                : appreciation.color === "orange"
                                ? "#f97316"
                                : "#ef4444"
                            } 0%, ${
                              appreciation.color === "green"
                                ? "#059669"
                                : appreciation.color === "cyan"
                                ? "#0891b2"
                                : appreciation.color === "blue"
                                ? "#2563eb"
                                : appreciation.color === "yellow"
                                ? "#d97706"
                                : appreciation.color === "orange"
                                ? "#ea580c"
                                : "#dc2626"
                            } 100%)`,
                            padding: "20px",
                            borderRadius: "12px",
                            color: "white",
                            textAlign: "center",
                          }}
                        >
                          <TrendingUp
                            size={32}
                            style={{ marginBottom: "10px" }}
                          />
                          <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                            {appreciation.text}
                          </div>
                          <div style={{ opacity: 0.9 }}>Appréciation</div>
                        </div>
                      </div>

                      <Divider style={{ margin: "20px 0" }}>
                        Détails des Évaluations
                      </Divider>

                      <Table
                        data={yearEvaluations}
                        bordered
                        cellBordered
                        height={400}
                        style={{ borderRadius: "8px", overflow: "hidden" }}
                      >
                        <Column width={250} flexGrow={1}>
                          <HeaderCell
                            style={{
                              
                              color: "white",
                              fontWeight: "600",
                            }}
                          >
                            Critère
                          </HeaderCell>
                          <Cell dataKey="critere.libcrit">
                            {(row) => row.critere?.libcrit || "N/A"}
                          </Cell>
                        </Column>

                        <Column width={120} align="center">
                          <HeaderCell
                            style={{
                              
                              color: "white",
                              fontWeight: "600",
                            }}
                          >
                            Note
                          </HeaderCell>
                          <Cell>
                            {(row) => (
                              <Tag
                                color={row.note?.nts >= 10 ? "green" : "red"}
                                size="lg"
                              >
                                {row.note?.nts || 0}
                              </Tag>
                            )}
                          </Cell>
                        </Column>

                        <Column width={150} align="center">
                          <HeaderCell
                            style={{
                              
                              color: "white",
                              fontWeight: "600",
                            }}
                          >
                            Appréciation
                          </HeaderCell>
                          <Cell>
                            {(row) => {
                              const app = getAppreciation(row.note?.nts || 0);
                              return (
                                <Tag color={app.color} size="md">
                                  {app.text}
                                </Tag>
                              );
                            }}
                          </Cell>
                        </Column>
                      </Table>
                    </Panel>
                  </motion.div>
                );
              })
            ) : (
              <Panel
                bordered
                style={{
                  textAlign: "center",
                  padding: "60px",
                  background: "#f9fafb",
                }}
              >
                <FileText
                  size={64}
                  color="#d1d5db"
                  style={{ marginBottom: "20px" }}
                />
                <h3 style={{ color: "black", marginBottom: "10px" }}>
                  Aucune évaluation trouvée
                </h3>
                <p style={{ color: "black" }}>
                  Ce prestataire n'a pas encore été évalué
                </p>
              </Panel>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!resultats && !searching && (
        <Panel
          bordered
          style={{
            textAlign: "center",
            padding: "80px 20px",
            background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
          }}
        >
          <Search size={64} color="black" style={{ marginBottom: "20px" }} />
          <h3
            style={{
              backgroundcolor: "rgba(59, 130, 246, 0.2)",
              color: "black",
              marginBottom: "10px",
            }}
          >
            Recherchez votre résultat
          </h3>
          <p
            style={{
              backgroundcolor: "rgba(59, 130, 246, 0.2)",
              color: "black",
            }}
          >
            Sélectionnez votre nom dans la liste pour consulter votre résultat
          </p>
        </Panel>
      )}
    </div>
  );
};

export default Consulter;