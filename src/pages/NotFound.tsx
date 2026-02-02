import { Link } from 'react-router-dom'
import Button from '../components/common/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <p className="section-label text-[var(--text-muted)] mb-2">404</p>
      <h1 className="text-display text-2xl sm:text-3xl text-[var(--text-primary)] mb-2 text-center">
        Page not found
      </h1>
      <p className="text-caption mb-8 text-center max-w-sm">
        The page you're looking for doesn't exist.
      </p>
      <Link to="/">
        <Button size="lg">Go home</Button>
      </Link>
    </div>
  )
}
