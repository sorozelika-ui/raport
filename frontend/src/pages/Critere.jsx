import EditIcon from '@rsuite/icons/Edit';
import TrashIcon from '@rsuite/icons/Trash';
import VisibleIcon from '@rsuite/icons/Visible';
import SearchIcon from '@rsuite/icons/Search';
import { IconButton } from 'rsuite';
import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, ButtonToolbar, Loader } from "rsuite";
import axios from "axios";

//pour le tableau 
const { Column, HeaderCell, Cell } = Table;
//pour le button rechercher les prestataires 


//pour recuperer les donnees de la table type_prestataires
const Critere = () => {
  const [data, setData] = useState([]);
  //afficher le loding avant de voir les donnes
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
    licrit: "",
    designlib: "",
    
  });

  //recherche 
  const [search, setSearch] = useState("");

  // Fetch API data
  const fetchCritere = () => {
    setLoading(true);
    axios
      .get("http://127.0.0.1:8000/api/criteres")
      .then((res) => {
        setData(Array.isArray(res.data) ? res.data : res.data.data);
      })
      .catch(console.log)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCritere();
  }, []);

  //rechercher les prestataires
  const handleSearch = () => {
  axios
    .get(`http://127.0.0.1:8000/api/criteres?search=${search}`)
    .then((res) => setData(res.data))
    .catch((err) => console.log(err));
};


  // Add
  const handleAdd = () => {
    axios
      .post("http://127.0.0.1:8000/api/criteres", form)
      .then(() => {
        setOpenAdd(false);
        fetchCritere();
      })
      .catch(console.log);
  };

  // Edit
  const handleEdit = () => {
    axios
      .put(`http://127.0.0.1:8000/api/criteres/${selected.id}`, form)
      .then(() => {
        setOpenEdit(false);
        fetchCritere();
      })
      .catch(console.log);
  };

  // Delete
  const handleDelete = () => {
    axios
      .delete(`http://127.0.0.1:8000/api/criteres/${selected.id}`)
      .then(() => {
        setOpenDelete(false);
        fetchCritere();
      })
      .catch(console.log);
  };

  return (
    <div style={{
      marginBottom: "35px",
      paddingBottom: "20px",
      borderBottom: "2px solid transparent",
      borderImage: "linear-gradient(90deg, #3b82f6, #8b5cf6) 1"
    }}>
      <h2 style={{
        fontSize: "32px", 
        fontWeight: "bold",
        background: "linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent"
         }}>
        Liste des criteres
      </h2>

      {/* Bouton SEARCH */}
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px" }}>
  <input 
    type="text"
    placeholder="Rechercher un critere..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    style={{
      backgroundColor: "white",
  padding: "8px",
  borderRadius: "12px",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  display: "flex",
  gap: "12px"
    }}
  />

  <IconButton
    appearance="primary"
    color="green"
    icon={<SearchIcon />}
    onClick={handleSearch}
  >
    Search
  </IconButton>
</div>


      {/* Bouton ajouter */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "15px" }}>
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
          Ajouter un critere 
        </Button>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", paddingTop: "80px" }}>
          <Loader size="lg" content="Chargement..." />
        </div>
      ) : (
        <Table
          height={300}
          data={data}
          bordered
          cellBordered
          style={{ background: "white", borderRadius: "10px" }}
        >
          <Column width={70} align="center">
            <HeaderCell style={{ 
  background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", 
  color: "white",
  fontWeight: "bold"}}>ID</HeaderCell>
            <Cell dataKey="id" />
          </Column>

          <Column width={200}>
            <HeaderCell style={{ 
  background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", 
  color: "white",
  fontWeight: "bold"
}}>libellé</HeaderCell>
            <Cell dataKey="nom" />
          </Column>

          <Column width={200}>
            <HeaderCell style={{ 
  background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", 
  color: "white",
  fontWeight: "bold"
}}>designation</HeaderCell>
            <Cell dataKey="specialite" />
          </Column>

          <Column width={200}>
            <HeaderCell style={{ 
  background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", 
  color: "white",
  fontWeight: "bold"
}}>Actions</HeaderCell>
            <Cell>
              {(rowData) => (
                <ButtonToolbar>

                <Button
                  appearance="primary"
                  style={{
                      backgroundColor: "white",
                      color: "orange",
                      borderRadius: "5px",
                      marginRight: "5px",
                    }}
                  onClick={() => {
                  setSelected(rowData); // stocke la ligne sélectionnée
                  setOpenView(true);     // ouvre le modal
                    }}>
                <VisibleIcon/>
               </Button>
                  {/* Modifier */}
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
                      < EditIcon  />
                  </Button>

                  {/* Supprimer */}
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
                    <TrashIcon/>
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
          <Modal.Title>Ajouter un critere</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid onChange={(v) => setForm(v)} formValue={form}>
            <Form.Group>
              <Form.ControlLabel>libellé</Form.ControlLabel>
              <Form.Control name="nom" />
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>designation</Form.ControlLabel>
              <Form.Control name="specialite" />
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
          <Modal.Title>Modifier le critere</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid onChange={(v) => setForm(v)} formValue={form}>
            <Form.Group>
              <Form.ControlLabel>libellé</Form.ControlLabel>
              <Form.Control name="nom" />
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>designation</Form.ControlLabel>
              <Form.Control name="specialite" />
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
        <Modal.Body>
          Voulez-vous vraiment supprimer ce critere ?
        </Modal.Body>
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
    <Modal.Title>Détails du Critere</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {selected && (
      <div>
        <p><strong>ID:</strong> {selected.id}</p>
        <p><strong>libellé:</strong> {selected.nom}</p>
        <p><strong>designation:</strong> {selected.specialite}</p>
        <p><strong>Créé le:</strong> {selected.created_at}</p>
        <p><strong>Mis à jour le:</strong> {selected.updated_at}</p>
      </div>
      )}
      </Modal.Body>
       <Modal.Footer>
      <Button onClick={() => setOpenView(false)} appearance="subtle">Fermer</Button>
     </Modal.Footer>
     </Modal>
 </div>
  );
};

export default Critere;
