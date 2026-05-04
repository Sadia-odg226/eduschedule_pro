const BASE_URL = "http://localhost/Backend/api"

// Fonction utilitaire pour les appels API
async function apiCall(endpoint, method = "GET", body = null) {
  const token = localStorage.getItem("token")
  
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` })
    },
    ...(body && { body: JSON.stringify(body) })
  }

  const response = await fetch(`${BASE_URL}/${endpoint}`, options)
  return await response.json()
}

// Auth
export const login = (email, password) =>
  apiCall("auth.php", "POST", { action: "login", email, password })

// Classes
export const getClasses = () => apiCall("classes.php")

// Enseignants
export const getEnseignants = () => apiCall("enseignants.php")

// Emploi du temps
export const getEmploiTemps = (id_classe) =>
  apiCall(`emploi_temps.php?id_classe=${id_classe}`)

// Vacations
export const getVacations = (id_enseignant) =>
  apiCall(`vacations.php${id_enseignant ? `?id_enseignant=${id_enseignant}` : ""}`)

export const genererVacation = (id_enseignant, mois, annee) =>
  apiCall("vacations.php", "POST", { action: "generer", id_enseignant, mois, annee })