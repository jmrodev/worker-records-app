import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/home/Home.jsx'
import About from './pages/about/About.jsx'
import Aside from './components/aside/Aside.jsx'
import Footer from './components/footer/Footer.jsx'
import Header from './components/header/Header.jsx'

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Aside />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <Footer /> 
      </div>
    </Router>
  )
}

export default App
