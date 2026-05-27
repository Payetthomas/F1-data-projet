import { useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import {
  getUpcomingRaces,
  getWeatherForecast,
  postPredict,
  type UpcomingRace,
  type WeatherForecast,
} from "../api"

// Liste simplifiée des pilotes 2026
const DRIVERS = [
  { id: 1,   name: "Max Verstappen",    constructorId: 3  },
  { id: 830, name: "Lando Norris",      constructorId: 1  },
  { id: 844, name: "Charles Leclerc",   constructorId: 6  },
  { id: 846, name: "Carlos Sainz",      constructorId: 3  },
  { id: 857, name: "George Russell",    constructorId: 131},
  { id: 847, name: "Lewis Hamilton",    constructorId: 6  },
  { id: 832, name: "Fernando Alonso",   constructorId: 117},
  { id: 840, name: "Lance Stroll",      constructorId: 117},
  { id: 839, name: "Esteban Ocon",      constructorId: 9  },
  { id: 841, name: "Pierre Gasly",      constructorId: 9  },
]

export default function PredictForm() {
  const [selectedRace, setSelectedRace] = useState<UpcomingRace | null>(null)
  const [selectedDriverId, setSelectedDriverId] = useState<number>(1)
  const [grid, setGrid] = useState<number>(1)
  const [qualiPosition, setQualiPosition] = useState<number>(1)
  const [weather, setWeather] = useState<WeatherForecast | null>(null)
  const [weatherLoading, setWeatherLoading] = useState(false)

  // Chargement des courses à venir
  const { data: racesData, isLoading: loadingRaces } = useQuery({
    queryKey: ["upcoming-races"],
    queryFn: getUpcomingRaces,
  })

  // Mutation pour la prédiction
  const { mutate: predict, data: result, isPending, reset } = useMutation({
    mutationFn: postPredict,
  })

  // Quand on sélectionne une course → récupère la météo
  const handleRaceChange = async (raceId: number) => {
    const race = racesData?.races.find(r => r.round === raceId) ?? null
    setSelectedRace(race)
    setWeather(null)
    reset()

    if (race) {
      setWeatherLoading(true)
      try {
        const w = await getWeatherForecast(race.lat, race.lng, race.date)
        setWeather(w)
      } catch {
        setWeather({ temp_mean: null, precipitation: null, wind_speed: null })
      } finally {
        setWeatherLoading(false)
      }
    }
  }

  // Lancement de la prédiction
  const handleSubmit = () => {
    if (!selectedRace || !weather) return

    const driver = DRIVERS.find(d => d.id === selectedDriverId)!

    predict({
      grid,
      driverId: selectedDriverId,
      constructorId: driver.constructorId,
      circuitId: selectedRace.circuitId,
      year: 2026,
      quali_position: qualiPosition,
      temp_mean:     weather.temp_mean     ?? 20,
      precipitation: weather.precipitation ?? 0,
      wind_speed:    weather.wind_speed    ?? 10,
    })
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-6">
      <h2 className="text-lg font-semibold">🏎️ Prédire un résultat</h2>

      {/* Sélection de la course */}
      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">Course</label>
        {loadingRaces ? (
          <p className="text-sm text-muted-foreground animate-pulse">Chargement...</p>
        ) : (
          <select
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            onChange={e => handleRaceChange(Number(e.target.value))}
            defaultValue=""
          >
            <option value="" disabled>Sélectionne un Grand Prix</option>
            {racesData?.races.map(race => (
              <option key={race.round} value={race.round}>
                Round {race.round} — {race.name} ({race.date})
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Météo prévue */}
      {selectedRace && (
        <div className="rounded-lg bg-muted/40 px-4 py-3 text-sm space-y-1">
          <p className="font-medium text-muted-foreground uppercase text-xs tracking-wide">
            Météo prévue
          </p>
          {weatherLoading ? (
            <p className="animate-pulse text-muted-foreground">Récupération météo...</p>
          ) : weather?.temp_mean !== null ? (
            <div className="flex gap-6">
              <span>🌡️ {weather?.temp_mean}°C</span>
              <span>🌧️ {weather?.precipitation} mm</span>
              <span>💨 {weather?.wind_speed} km/h</span>
            </div>
          ) : (
            <p className="text-muted-foreground">Météo non disponible (course trop lointaine)</p>
          )}
        </div>
      )}

      {/* Sélection du pilote */}
      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">Pilote</label>
        <select
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          value={selectedDriverId}
          onChange={e => setSelectedDriverId(Number(e.target.value))}
        >
          {DRIVERS.map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </div>

      {/* Position grille et qualif */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Position grille</label>
          <input
            type="number" min={1} max={20} value={grid}
            onChange={e => setGrid(Number(e.target.value))}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Position qualif</label>
          <input
            type="number" min={1} max={20} value={qualiPosition}
            onChange={e => setQualiPosition(Number(e.target.value))}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* Bouton prédire */}
      <button
        onClick={handleSubmit}
        disabled={!selectedRace || !weather || isPending}
        className="w-full rounded-md bg-red-600 hover:bg-red-700 disabled:opacity-50 
                   px-4 py-2 text-sm font-semibold transition-colors"
      >
        {isPending ? "Calcul en cours..." : "Prédire la position"}
      </button>

      {/* Résultat */}
      {result && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-5 py-4 text-center">
          <p className="text-sm text-muted-foreground mb-1">Position prédite</p>
          <p className="text-5xl font-black text-red-400">P{Math.round(result.predicted_position)}</p>
        </div>
      )}
    </div>
  )
}