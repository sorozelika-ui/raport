import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Loader } from "rsuite";

const { Column, HeaderCell, Cell } = Table;

const PrestatairesEvalues = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    axios
      .get("http://127.0.0.1:8000/api/prestataires-evalues")
      .then((res) => {
        const formatted = res.data.map((item) => ({
          id: item.id,
          prestataire: item.prestataire?.nom,
          specialite: item.prestataire?.specialite,
          annee: item.annee?.liban,
          critere: item.critere?.libcrit,
          note: item.note?.nts,
          moyenne:
            item.note?.moyenne != null ? Number(item.note.moyenne) : null,
        }));

        setData(formatted);
      })
      .catch((err) => {
        console.log("Erreur chargement :", err);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px",
        marginBottom: "35px",
        paddingBottom: "20px",
      }}
    >
      <h2
        style={{
          fontSize: "32px",
          fontWeight: "bold",
          marginBottom: "25px",
        }}
      >
        Liste des Prestataires évalués
      </h2>

      {loading ? (
        <Loader size="lg" content="Chargement..." />
      ) : (
        <Table
          data={data}
          height={730}
          bordered
          cellBordered
          autoHeight={false}
        >

          
          <Column width={150} fixed>
            <HeaderCell
              style={{
                background: "rgba(59, 131, 246, 0.2)",
                color: "black",
                fontWeight: "bold",
              }}>Prestataire</HeaderCell>
            <Cell dataKey="prestataire" />
          </Column>

         
          <Column width={100} align="center">
            <HeaderCell
              style={{
                background: "rgba(59, 131, 246, 0.2)",
                color: "black",
                fontWeight: "bold",
              }}>Année</HeaderCell>
            <Cell dataKey="annee" />
          </Column>

          
          <Column width={200}>
             <HeaderCell
              style={{
                background: "rgba(59, 131, 246, 0.2)",
                color: "black",
                fontWeight: "bold",
              }}>Spécialité</HeaderCell>
            <Cell dataKey="specialite" />
          </Column>

          
          <Column width={220}>
             <HeaderCell
              style={{
                background: "rgba(59, 131, 246, 0.2)",
                color: "black",
                fontWeight: "bold",
              }}>Critères & Note</HeaderCell>
            <Cell>
              {(row) =>
                row.critere && row.note
                  ? `${row.critere} ${row.note}`
                  : "-"
              }
            </Cell>
          </Column>

         
          <Column width={120} align="center">
             <HeaderCell
              style={{
                background: "rgba(59, 131, 246, 0.2)",
                color: "black",
                fontWeight: "bold",
              }}>Moyenne</HeaderCell>
            <Cell>
              {(row) =>
                row.moyenne != null ? Number(row.moyenne).toFixed(2) : "-"
              }
            </Cell>
          </Column>

        </Table>
      )}
    </div>
  );
};

export default PrestatairesEvalues;
