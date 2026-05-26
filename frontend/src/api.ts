const BASE_URL = "http://localhost:8000"

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`)
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`)
  return res.json() as Promise<T>
}

// --- Types ---

export interface DriverStanding {
  position: number
  driver: string
  team: string
  points: number
}

export interface RaceResult {
  position: number
  driver: string
  team: string
  time: string
  fastest_lap: boolean
}

export interface LapTime {
  lap: number
  driver: string
  time_ms: number
}

export interface Race {
  round: number
  name: string
  circuit: string
  date: string
}

// --- Endpoints (placeholders — routes backend à définir) ---

export const getDriverStandings = (season: number) =>
  fetchJson<DriverStanding[]>(`/standings/drivers?season=${season}`)

export const getConstructorStandings = (season: number) =>
  fetchJson<{ position: number; team: string; points: number }[]>(
    `/standings/constructors?season=${season}`
  )

export const getRaceCalendar = (season: number) =>
  fetchJson<Race[]>(`/races?season=${season}`)

export const getRaceResults = (season: number, round: number) =>
  fetchJson<RaceResult[]>(`/races/${season}/${round}/results`)

export const getLapTimes = (season: number, round: number, driver: string) =>
  fetchJson<LapTime[]>(`/races/${season}/${round}/laps?driver=${driver}`)

// --- Prédiction ---

export interface PredictionInput {
  grid: number
  driverId: number
  raceId: number
}

export interface PredictionOutput {
  predicted_position: number
  input: PredictionInput
}

export const postPredict = async (data: PredictionInput): Promise<PredictionOutput> => {
  const res = await fetch(`${BASE_URL}/api/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(`API error ${res.status}: /api/predict`)
  return res.json()
}