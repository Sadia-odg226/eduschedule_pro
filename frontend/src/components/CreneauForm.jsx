import React, { useState, useEffect } from "react";

function EmploiTempsPage() {
  const [creneaux, setCreneaux] = useState([]);
  const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

  useEffect(() => {
    fetch("http://localhost/eduschedule_pro/Backend/api/emploi_temps.php")
      .then((res) => res.json())
      .then((data) => setCreneaux(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="container mt-4">
      <h2>Emploi du Temps</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            {jours.map((jour) => (
              <th key={jour}>{jour}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {jours.map((jour) => (
              <td key={jour}>
                {creneaux
                  .filter((c) => c.jour === jour)
                  .map((c) => (
                    <div key={c.id}>{c.id_matiere}</div>
                  ))}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
