import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/home/Home.jsx'
import About from './pages/about/About.jsx'
import Aside from './components/aside/Aside.jsx'

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Welcome to the React App</h1>
        <Aside />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
