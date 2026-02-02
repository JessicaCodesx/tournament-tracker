import { Link } from 'react-router-dom'
import Button from '../components/common/Button'
import Card from '../components/common/Card'

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-4 md:p-8">
      <div className="max-w-lg mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2">
          CoD Tournament Tracker
        </h1>
        <p className="text-[var(--text-muted)] mb-8">
          Run custom Black Ops 7 tournaments with friends. Share a code and everyone watches the leaderboard live.
        </p>
        <Card className="mb-6">
          <div className="space-y-4">
            <Link to="/host">
              <Button size="lg" fullWidth>
                Create Tournament
              </Button>
            </Link>
            <Link to="/watch">
              <Button variant="secondary" size="lg" fullWidth>
                Watch Tournament
              </Button>
            </Link>
          </div>
        </Card>
        <p className="text-sm text-[var(--text-muted)]">
          Enter 6 players, choose 3v3 or 2v2v2, then share the code so friends can follow along.
        </p>
      </div>
    </div>
  )
}
