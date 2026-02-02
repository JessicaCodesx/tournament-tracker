import { Routes, Route } from 'react-router-dom'
import { TournamentProvider } from './context/TournamentContext'
import Home from './pages/Home'
import Host from './pages/Host'
import Watch from './pages/Watch'
import Compare from './pages/Compare'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <TournamentProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/host" element={<Host />} />
        <Route path="/watch/:code" element={<Watch />} />
        <Route path="/watch" element={<Watch />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TournamentProvider>
  )
}
