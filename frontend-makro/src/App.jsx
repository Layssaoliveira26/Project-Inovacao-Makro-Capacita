import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login_Adm/Login'
import Solucoes from './pages/Solucoes_Adm/Solucoes';
import Contatos from "./pages/Contatos_Adm/Contatos"
import Home from './pages/Home/Home'
import Cadastro from './pages/Cadastro_adm/Cadastro'
import Desafios from './pages/Desafios/Desafios'
import Cases from './pages/Cases de Sucesso/Cases'
import './App.css'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login_adm" element={<Login/>} />
        <Route path="/solucoes_adm" element={<Solucoes />} />
        <Route path='/cadastro_adm' element={<Cadastro/>} />
        <Route path="/contatos_adm" element={<Contatos />} />
        <Route path="/desafios_adm" element={<Desafios/>} />
        <Route path="/cases_adm" element={<Cases/>} />
      </Routes>
    </Router>
  )
}

export default App
