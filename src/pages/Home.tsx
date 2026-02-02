import { Link } from 'react-router-dom'
import Button from '../components/common/Button'
import Card from '../components/common/Card'

export default function Home() {
  return (
    <div className="min-h-screen px-4 py-8 sm:py-12 md:py-16 max-w-lg mx-auto">
      <div className="text-center">
        <h1 className="text-display text-3xl sm:text-4xl md:text-5xl text-[var(--text-primary)] mb-4">
          Sinful Gaming Tournament Tracker
        </h1>
        <p className="text-[var(--text-secondary)] mb-8 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
          Run custom tournaments with friends. Share a code and everyone watches the leaderboard live.
        </p>
        <Card className="mb-6" elevated>
          <div className="space-y-3">
            <Link to="/host">
              <Button size="lg" fullWidth>
                Create Tournament
              </Button>
            </Link>
            <Link to="/watch">
              <Button variant="secondary" size="lg" fullWidth>
                Watch live or view past
              </Button>
            </Link>
          </div>
        </Card>
        <Card className="mb-8">
          <p className="text-caption mb-3">
            Have two tournament codes? Compare the same players’ stats across different days.
          </p>
          <Link to="/compare">
            <Button variant="secondary" fullWidth>
              Compare two tournaments
            </Button>
          </Link>
        </Card>
        <p className="text-caption">
          Enter 6 players, choose 3v3 or 2v2v2, then share the code. Revisit any tournament later with its code.
        </p>
      </div>
    </div>
  )
}
