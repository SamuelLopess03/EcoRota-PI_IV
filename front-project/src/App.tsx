import './App.css'
// import { HashRouter as Router, Routes, Route } from 'react-router-dom';
// import Home from './components/Home'
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header'
import Footer from './components/Footer'
import Navebar from './components/Navebar'
import Home from './pages/Home';
import Info from './pages/Info';
import Ecoponto from './pages/Ecopontos';

function App() {

  return (
    <Router>

      <div className="App">

        <Header />
        <Navebar />

        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/informacoes" element={< Info/>} />
            <Route path="/ecopontos" element={<Ecoponto/>} />
            
          </Routes>
        </div>
        <Footer />
      </div>

    </Router>
  )
}

export default App
