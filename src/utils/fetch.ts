import store from '../store'

const headers = {
  'Authorization': 'Bearer f69829bf3d5b00a736617449c384aa86af219f1a3fed3cbcddbf58bb06e4d5e1b9c38720f8786e8e1dc64d900fef8987',
  'Accept': 'application/json' 
}

export async function getYears(): Promise<any> {
  try {
    const response = await fetch(`https://phish.in/api/v1/years.json?include_show_counts=true`, {headers});
    const data = await response.json()
    store.dispatch('setYears', data)
    return data
  } catch (error) {
    console.error("Failed to fetch years:", error);
  }
}

export async function getShows(year: string): Promise<any> {
  try {
    const response = await fetch(`https://phish.in/api/v1/years/${year}`, {headers})
    const data = await response.json()
    store.dispatch('setShows', data)
    return data
  } catch (error) {
    console.error("Failed to fetch shows:", error);
  }
}

export async function getSingleShow(date: string): Promise<any> {
  try {
    const r = await fetch(`https://phish.in/api/v1/shows/${date}`, {headers})
    const data = await r.json()
    store.dispatch('setSingleShow', data)
    return data
  } catch (error) {
    console.error('Failed to fetch single show:', error)
  }
}