import axios from 'axios'

const ASTRO_URL = 'https://corsproxy.io/?http://api.open-notify.org/astros.json'

// ISS current position
export async function fetchISSPosition() {
  const res = await axios.get('https://api.wheretheiss.at/v1/satellites/25544', { timeout: 8000 })
  return {
    message: 'success',
    iss_position: {
      latitude: res.data.latitude.toString(),
      longitude: res.data.longitude.toString()
    }
  }
}

// People currently in space
export async function fetchAstronauts() {
  const res = await axios.get(ASTRO_URL, { timeout: 8000 })
  return res.data
}
