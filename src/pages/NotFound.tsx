import { Link } from 'react-router-dom'
import Button from '../components/common/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Page not found</h1>
      <p className="text-[var(--text-muted)] mb-6">The page you’re looking for doesn’t exist.</p>
      <Link to="/">
        <Button>Go home</Button>
      </Link>
    </div>
  )
}
