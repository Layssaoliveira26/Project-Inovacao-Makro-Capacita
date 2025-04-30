import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login_Adm/Login'
import './App.css'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/login_adm" element={<Login/>} />
      </Routes>
    </Router>
  )
}

export default App
