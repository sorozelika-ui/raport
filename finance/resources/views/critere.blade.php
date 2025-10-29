<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Gestion des Critères</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 40px;
            background: #f5f5f5;
        }
        h2 {
            text-align: center;
            color: #333;
        }
        form {
            background: white;
            padding: 20px;
            width: 400px;
            margin: auto;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        input {
            width: 100%;
            padding: 10px;
            margin: 8px 0;
            border: 1px solid #ccc;
            border-radius: 5px;
        }
        button {
            background: #007bff;
            color: white;
            padding: 10px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        button:hover {
            background: #0056b3;
        }
        #message {
            text-align: center;
            margin-top: 15px;
        }
        table {
            width: 80%;
            margin: 30px auto;
            border-collapse: collapse;
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        th, td {
            padding: 10px;
            border: 1px solid #ddd;
            text-align: center;
        }
        th {
            background: #007bff;
            color: white;
        }
    </style>
</head>
<body>

    <h2>Ajouter un Critère</h2>

    <form id="critereForm">
        <label for="libcrit">Libellé :</label>
        <input type="text" id="libcrit" name="libcrit" required>

        <label for="designlib">Désignation :</label>
        <input type="text" id="designlib" name="designlib">

        <button type="submit">Enregistrer</button>
    </form>

    <div id="message"></div>

    <h2>Liste des Critères</h2>
    <table id="critereTable">
        <thead>
            <tr>
                <th>ID</th>
                <th>Libellé</th>
                <th>Désignation</th>
            </tr>
        </thead>
        <tbody></tbody>
    </table>

    <script>
        const API_URL = "http://127.0.0.1:8000/api/criteres";

        // 🔹 Charger la liste des critères
        async function chargerCriteres() {
            const response = await fetch(API_URL);
            const data = await response.json();
            const tbody = document.querySelector("#critereTable tbody");
            tbody.innerHTML = "";
            data.forEach(c => {
                const row = `
                    <tr>
                        <td>${c.id}</td>
                        <td>${c.libcrit}</td>
                        <td>${c.designlib ?? ''}</td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        }

        // 🔹 Enregistrer un critère
        const form = document.getElementById('critereForm');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const data = {
                libcrit: document.getElementById('libcrit').value,
                designlib: document.getElementById('designlib').value
            };

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                document.getElementById('message').innerHTML = "<p style='color:green;'>✅ Critère ajouté avec succès</p>";
                form.reset();
                chargerCriteres();
            } else {
                document.getElementById('message').innerHTML = "<p style='color:red;'>❌ Erreur lors de l'ajout</p>";
            }
        });

        // Charger automatiquement les critères au démarrage
        chargerCriteres();
    </script>
</body>
</html>
