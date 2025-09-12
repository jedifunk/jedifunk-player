export async function getYears() {
  const response = await fetch(`https://phish.in/api/v2/years`);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`);
  }
  const json = await response.json();
  return json;
}


export async function getShows(year) {
  const response = await fetch(`https://phish.in/api/v2/shows?year=${year}&per_page=300`)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`);
  }
  const json = await response.json();
  return json;
}

export async function getSingleShow(date) {
  try {
    const r = await fetch(`https://phish.in/api/v2/shows/${date}`)
    const data = await r.json()
    return data
  } catch (error) {
    console.error('Failed to fetch single show:', error)
  }
}

export async function getTracks(id) {
  try {
    const res = await fetch(`https://phish.in/api/v1/tracks/${id}`)
    const data = await res.json()
    return data
  } catch (error) {
    console.error('Failed to fetch tracks:', error)
  }
}