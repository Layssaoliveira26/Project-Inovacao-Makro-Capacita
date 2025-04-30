import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login_Adm/Login'
import Solucoes from './pages/Solucoes_Adm/Solucoes';
import './App.css'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/login_adm" element={<Login/>} />
        <Route path="/solucoes_adm" element={<Solucoes />} />
      </Routes>
    </Router>
  )
}

export default App
