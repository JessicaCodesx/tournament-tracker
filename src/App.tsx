import { Routes, Route } from 'react-router-dom'
import { TournamentProvider } from './context/TournamentContext'
import Home from './pages/Home'
import Host from './pages/Host'
import Watch from './pages/Watch'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <TournamentProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/host" element={<Host />} />
        <Route path="/watch/:code" element={<Watch />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TournamentProvider>
  )
}
