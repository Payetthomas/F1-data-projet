import { useQuery } from "@tanstack/react-query";
import { getDriverStandings, getUpcomingRaces } from "./api";
import PredictForm from "./components/PredictForm";
import "./index.css";

function App() {
  const { data: standings, isLoading: loadingStandings, isError: standingsError, error: standingsErr } = useQuery({
    queryKey: ["standings", 2024],
    queryFn: () => getDriverStandings(2024),
  });

  const { data: upcomingData, isLoading: loadingCalendar, isError: calendarError, error: calendarErr } = useQuery({
    queryKey: ["upcoming-races"],
    queryFn: getUpcomingRaces,
  });

  const nextRace = upcomingData?.races?.[0];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center gap-3 px-4 py-4">
          <span className="text-2xl font-black tracking-tight text-red-500">
            F1
          </span>
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Classement pilotes */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Classement pilotes
            </h2>
            {loadingStandings ? (
              <p className="text-muted-foreground animate-pulse text-sm">
                Chargement...
              </p>
            ) : standingsError ? (
              <p className="text-red-500 text-xs break-all">
                Erreur : {standingsErr?.message}
              </p>
            ) : standings && standings.length > 0 ? (
              <ul className="space-y-2">
                {standings.slice(0, 5).map((s) => (
                  <li
                    key={s.position}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-muted-foreground w-5">
                      {s.position}.
                    </span>
                    <span className="flex-1 font-medium">{s.driver}</span>
                    <span className="text-red-400 font-bold">
                      {s.points} pts
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm">Aucune donnée</p>
            )}
          </div>

          {/* Classement constructeurs — placeholder */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-2 text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Classement constructeurs
            </h2>
            <p className="text-2xl font-bold">—</p>
            <p className="text-xs text-muted-foreground mt-1">À venir</p>
          </div>

          {/* Prochain Grand Prix */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-2 text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Prochain Grand Prix
            </h2>
            {loadingCalendar ? (
              <p className="text-muted-foreground animate-pulse text-sm">
                Chargement...
              </p>
            ) : calendarError ? (
              <p className="text-red-500 text-xs break-all">
                Erreur : {calendarErr?.message}
              </p>
            ) : nextRace ? (
              <div>
                <p className="text-xl font-bold">{nextRace.name}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {nextRace.circuit}
                </p>
                <p className="text-sm text-red-400 mt-1">{nextRace.date}</p>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">Aucune donnée</p>
            )}
          </div>

          <div className="mt-8">
            <PredictForm />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
