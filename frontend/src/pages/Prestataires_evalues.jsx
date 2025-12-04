import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Loader, Panel } from "rsuite";

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
        setData(res.data);
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
        borderBottom: "2px solid transparent",
        borderImage: "rgba(59, 131, 246, 0.2) ",
      }}
    >
      <h2
        style={{
          fontSize: "32px",
          fontWeight: "bold",
          backgroundcolor: "rgba(59, 130, 246, 0.2)",
          WebkitBackgroundClip: "text",
          marginBottom: "25px",
        }}
      >
        Liste des Prestataires evalués
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
          {/* PRESTATAIRE */}
          <Column width={150} fixed>
            <HeaderCell>Prestataire</HeaderCell>
            <Cell>{(row) => row.prestataire?.nom}</Cell>
          </Column>

          {/* ANNEE */}
          <Column width={100} align="center">
            <HeaderCell>Année</HeaderCell>
            <Cell>{(row) => row.annee?.liban}</Cell>
          </Column>

          {/* SPECIALITE */}
          <Column width={200}>
            <HeaderCell>Spécialité</HeaderCell>
            <Cell>{(row) => row.prestataire?.specialite}</Cell>
          </Column>

          {/* CRITERE */}
          <Column width={180}>
            <HeaderCell>Critère</HeaderCell>
            <Cell>{(row) => row.critere?.libcrit}</Cell>
          </Column>

          {/* NOTE */}
          <Column width={100} align="center">
            <HeaderCell>Note</HeaderCell>
            <Cell>{(row) => row.note?.nt}</Cell>
          </Column>
        </Table>
      )}
    </div>
  );
};

export default PrestatairesEvalues;
