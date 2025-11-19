import EditIcon from "@rsuite/icons/Edit";
import TrashIcon from "@rsuite/icons/Trash";
import VisibleIcon from "@rsuite/icons/Visible";
import SearchIcon from "@rsuite/icons/Search";
import { IconButton } from "rsuite";
import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, ButtonToolbar, Loader } from "rsuite";
import axios from "axios";

const { Column, HeaderCell, Cell } = Table;

const Prestataires = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);

  // Selected row
  const [selected, setSelected] = useState(null);

  // Form
  const [form, setForm] = useState({
    nom: "",
    specialite: "",
    addresse: "",
  });

  // Recherche
  const [search, setSearch] = useState("");

  // Fetch API data
  const fetchPrestataires = () => {
    setLoading(true);
    axios
      .get("http://127.0.0.1:8000/api/prestataire")
      .then((res) => {
        setData(Array.isArray(res.data) ? res.data : res.data.data);
      })
      .catch(console.log)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPrestataires();
  }, []);

  // Rechercher les prestataires
  const handleSearch = () => {
    axios
      .get(`http://127.0.0.1:8000/api/prestataire?search=${search}`)
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  };

  // Add
  const handleAdd = () => {
    axios
      .post("http://127.0.0.1:8000/api/prestataire", form)
      .then(() => {
        setOpenAdd(false);
        fetchPrestataires();
      })
      .catch(console.log);
  };

  // Edit
  const handleEdit = () => {
    axios
      .put(`http://127.0.0.1:8000/api/prestataire/${selected.id}`, form)
      .then(() => {
        setOpenEdit(false);
        fetchPrestataires();
      })
      .catch(console.log);
  };

  // Delete
  const handleDelete = () => {
    axios
      .delete(`http://127.0.0.1:8000/api/prestataire/${selected.id}`)
      .then(() => {
        setOpenDelete(false);
        fetchPrestataires();
      })
      .catch(console.log);
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
        borderImage: "linear-gradient(90deg, #3b82f6, #8b5cf6) 1",
      }}
    >
      <h2
        style={{
          fontSize: "32px",
          fontWeight: "bold",
          background: "linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "25px",
        }}
      >
        Liste des Prestataires
      </h2>

      {/* Bouton SEARCH */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Rechercher un prestataire..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            backgroundColor: "white",
            padding: "8px 16px",
            borderRadius: "12px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            border: "1px solid #e5e7eb",
            minWidth: "300px",
            fontSize: "14px",
          }}
        />
        <IconButton
          appearance="primary"
          color="green"
          icon={<SearchIcon />}
          onClick={handleSearch}
        >
          Rechercher
        </IconButton>
      </div>

      {/* Bouton ajouter */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "15px",
        }}
      >
        <Button
          appearance="primary"
          style={{
            backgroundColor: "#1e40af",
            color: "white",
            borderRadius: "6px",
            padding: "8px 14px",
          }}
          onClick={() => {
            setForm({ nom: "", specialite: "", addresse: "" });
            setOpenAdd(true);
          }}
        >
          Ajouter un prestataire
        </Button>
      </div>

      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "80px",
          }}
        >
          <Loader size="lg" content="Chargement..." />
        </div>
      ) : (
        <Table
          height={400}
          data={data}
          bordered
          cellBordered
          style={{
            background: "white",
            borderRadius: "10px",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
          }}
        >
          <Column width={70} align="center" fixed>
            <HeaderCell
              style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                color: "white",
                fontWeight: "bold",
              }}
            >
              ID
            </HeaderCell>
            <Cell dataKey="id" />
          </Column>

          <Column flexGrow={1} minWidth={150}>
            <HeaderCell
              style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                color: "white",
                fontWeight: "bold",
              }}
            >
              Nom
            </HeaderCell>
            <Cell dataKey="nom" />
          </Column>

          <Column flexGrow={1} minWidth={150}>
            <HeaderCell
              style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                color: "white",
                fontWeight: "bold",
              }}
            >
              Spécialité
            </HeaderCell>
            <Cell dataKey="specialite" />
          </Column>

          <Column flexGrow={1} minWidth={200}>
            <HeaderCell
              style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                color: "white",
                fontWeight: "bold",
              }}
            >
              Adresse
            </HeaderCell>
            <Cell dataKey="addresse" />
          </Column>

          <Column width={180} fixed="right">
            <HeaderCell
              style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                color: "white",
                fontWeight: "bold",
              }}
            >
              Actions
            </HeaderCell>
            <Cell>
              {(rowData) => (
                <ButtonToolbar>
                  <Button
                    appearance="primary"
                    size="sm"
                    style={{
                      backgroundColor: "white",
                      color: "orange",
                      borderRadius: "5px",
                      marginRight: "5px",
                    }}
                    onClick={() => {
                      setSelected(rowData);
                      setOpenView(true);
                    }}
                  >
                    <VisibleIcon />
                  </Button>

                  <Button
                    appearance="primary"
                    size="sm"
                    style={{
                      backgroundColor: "white",
                      color: "#2563eb",
                      borderRadius: "5px",
                      marginRight: "5px",
                    }}
                    onClick={() => {
                      setSelected(rowData);
                      setForm(rowData);
                      setOpenEdit(true);
                    }}
                  >
                    <EditIcon />
                  </Button>

                  <Button
                    appearance="primary"
                    size="sm"
                    style={{
                      backgroundColor: "white",
                      borderRadius: "5px",
                      marginRight: "5px",
                      color: "red",
                    }}
                    onClick={() => {
                      setSelected(rowData);
                      setOpenDelete(true);
                    }}
                  >
                    <TrashIcon />
                  </Button>
                </ButtonToolbar>
              )}
            </Cell>
          </Column>
        </Table>
      )}

      {/* Modal Ajouter */}
      <Modal open={openAdd} onClose={() => setOpenAdd(false)}>
        <Modal.Header>
          <Modal.Title>Ajouter un prestataire</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid onChange={(v) => setForm(v)} formValue={form}>
            <Form.Group>
              <Form.ControlLabel>Nom</Form.ControlLabel>
              <Form.Control name="nom" />
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>Spécialité</Form.ControlLabel>
              <Form.Control name="specialite" />
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>Adresse</Form.ControlLabel>
              <Form.Control name="addresse" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button appearance="primary" onClick={handleAdd}>
            Enregistrer
          </Button>
          <Button appearance="subtle" onClick={() => setOpenAdd(false)}>
            Annuler
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Modifier */}
      <Modal open={openEdit} onClose={() => setOpenEdit(false)}>
        <Modal.Header>
          <Modal.Title>Modifier le prestataire</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid onChange={(v) => setForm(v)} formValue={form}>
            <Form.Group>
              <Form.ControlLabel>Nom</Form.ControlLabel>
              <Form.Control name="nom" />
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>Spécialité</Form.ControlLabel>
              <Form.Control name="specialite" />
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>Adresse</Form.ControlLabel>
              <Form.Control name="addresse" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button appearance="primary" onClick={handleEdit}>
            Modifier
          </Button>
          <Button appearance="subtle" onClick={() => setOpenEdit(false)}>
            Annuler
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Supprimer */}
      <Modal open={openDelete} onClose={() => setOpenDelete(false)}>
        <Modal.Header>
          <Modal.Title>Supprimer</Modal.Title>
        </Modal.Header>
        <Modal.Body>Voulez-vous vraiment supprimer ce prestataire ?</Modal.Body>
        <Modal.Footer>
          <Button color="red" appearance="primary" onClick={handleDelete}>
            Supprimer
          </Button>
          <Button appearance="subtle" onClick={() => setOpenDelete(false)}>
            Annuler
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal voir */}
      <Modal open={openView} onClose={() => setOpenView(false)}>
        <Modal.Header>
          <Modal.Title>Détails du Prestataire</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selected && (
            <div>
              <p>
                <strong>ID:</strong> {selected.id}
              </p>
              <p>
                <strong>Nom:</strong> {selected.nom}
              </p>
              <p>
                <strong>Spécialité:</strong> {selected.specialite}
              </p>
              <p>
                <strong>Adresse:</strong> {selected.addresse}
              </p>
              <p>
                <strong>Créé le:</strong> {selected.created_at}
              </p>
              <p>
                <strong>Mis à jour le:</strong> {selected.updated_at}
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setOpenView(false)} appearance="subtle">
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Prestataires;
