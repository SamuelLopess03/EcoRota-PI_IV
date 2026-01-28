import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import Home from './pages/Home';
import Info from './pages/Info';
import Ecoponto from './pages/Ecopontos';
import AdminLogin from './pages/AdminLogin';

function App() {

  return (
    <Router>

      <div className="App">

        <Header />
        <Navbar />

        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/informacoes" element={< Info/>} />
            <Route path="/ecopontos" element={<Ecoponto/>} />
            <Route path="/admin-login" element={<AdminLogin />} />
          </Routes>
        </div>
        <Footer />
      </div>

    </Router>
  )
}

export default App
