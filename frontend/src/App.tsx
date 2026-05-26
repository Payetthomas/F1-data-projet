import './index.css'

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center gap-3 px-4 py-4">
          <span className="text-2xl font-black tracking-tight text-red-500">F1</span>
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <span className="ml-auto text-sm text-muted-foreground">Saison 2024</span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-2 text-sm font-medium text-muted-foreground">Classement pilotes</h2>
            <p className="text-2xl font-bold">—</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-2 text-sm font-medium text-muted-foreground">Classement constructeurs</h2>
            <p className="text-2xl font-bold">—</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-2 text-sm font-medium text-muted-foreground">Prochain Grand Prix</h2>
            <p className="text-2xl font-bold">—</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
