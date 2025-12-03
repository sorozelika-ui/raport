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
    <div style={{ padding: 30 }}>
      <Panel
        header="Liste des prestataires évalués"
        bordered
        style={{ marginBottom: 20 }}
      />

      {loading ? (
        <Loader size="lg" content="Chargement..." />
      ) : (
        <Table
          data={data}
          height={9300}
          bordered
          cellBordered
          autoHeight={false}
        >
          <Column width={150} fixed>
            <HeaderCell>Prestataire</HeaderCell>
            <Cell>{(row) => row.prestataire?.nom}</Cell>
          </Column>

          <Column width={200}>
            <HeaderCell>Spécialité</HeaderCell>
            <Cell>{(row) => row.prestataire?.specialite}</Cell>
          </Column>

          <Column width={180} align="center">
            <HeaderCell>Critère</HeaderCell>
            <Cell>{(row) => row.critere?.libcrit}</Cell>
          </Column>

          <Column width={100} align="center">
            <HeaderCell>Note</HeaderCell>
            <Cell>{(row) => row.note?.nt}</Cell>
          </Column>

          <Column width={100} align="center">
            <HeaderCell>Année</HeaderCell>
            <Cell>{(row) => row.annee?.liban}</Cell>
          </Column>
        </Table>
      )}
    </div>
  );
};

export default PrestatairesEvalues;
