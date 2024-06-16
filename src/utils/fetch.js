const token = import.meta.env.VITE_BEARER_TOKEN
const headers = {
  'Authorization': `Bearer ${token}`,
  'Accept': 'application/json' 
}

export async function getYears() {
  try {
    const response = await fetch(`http://phish.in/api/v1/years.json?include_show_counts=true`, {headers});
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Failed to fetch years:", error);
  }
}

export async function getShows(year) {
  try {
    const response = await fetch(`https://phish.in/api/v1/years/${year}`, {headers})
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Failed to fetch shows:", error);
  }
}

export async function getSingleShow(date) {
  try {
    const r = await fetch(`https://phish.in/api/v1/shows/${date}`, {headers})
    const data = await r.json()
    return data
  } catch (error) {
    console.error('Failed to fetch single show:', error)
  }
}

export async function getTracks(id) {
  try {
    const res = await fetch(`https://phish.in/api/v1/tracks/${id}`, {headers})
    const data = await res.json()
    return data
  } catch (error) {
    console.error('Failed to fetch tracks:', error)
  }
}