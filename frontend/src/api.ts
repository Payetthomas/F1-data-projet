const BASE_URL = "http://localhost:8000"

async function fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, options)
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`)
  return res.json() as Promise<T>
}

// --- Types standings & résultats ---

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

// --- Types prédiction ---

export interface PredictionInput {
  grid: number
  driverId: number
  constructorId: number
  circuitId: number
  year: number
  quali_position: number
  temp_mean: number
  precipitation: number
  wind_speed: number
}

export interface PredictionOutput {
  predicted_position: number
  input: PredictionInput
}

// --- Types courses à venir ---

export interface UpcomingRace {
  round: number
  name: string
  circuit: string
  date: string
  lat: number
  lng: number
  circuitId: number
}

export interface WeatherForecast {
  temp_mean: number | null
  precipitation: number | null
  wind_speed: number | null
}

// --- Endpoints ---

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

export const getUpcomingRaces = () =>
  fetchJson<{ season: number; races: UpcomingRace[] }>("/api/upcoming-races")

export const getWeatherForecast = (lat: number, lng: number, date: string) =>
  fetchJson<WeatherForecast>(`/api/weather-forecast?lat=${lat}&lng=${lng}&date=${date}`)

export const postPredict = (data: PredictionInput) =>
  fetchJson<PredictionOutput>("/api/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })