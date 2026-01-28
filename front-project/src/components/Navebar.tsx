import { Link } from "react-router-dom";

function Navebar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm" style={{ borderTop: '4px solid #4CAF50' }}>
            <div className="container">
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
                    <ul className="navbar-nav gap-lg-4">
                        {/* Home Dropdown */}
                        <li className="nav-item dropdown">
                            <Link className="nav-link dropdown-toggle text-white fw-bold" to="/" id="homeDrop">
                                Home
                            </Link>
                            <ul className="dropdown-menu ">
                                <li><Link className="dropdown-item" to="/">Mapa</Link></li>
                                <li><Link className="dropdown-item" to="/">Calendário</Link></li>
                                <li><Link className="dropdown-item" to="/">Buscar Bairro</Link></li>
                                <li><Link className="dropdown-item" to="/">Relatar Problemas</Link></li>
                            </ul>
                        </li>

                        {/* Item: Informações */}
                        <li className="nav-item dropdown">
                            <Link className="nav-link dropdown-toggle text-white fw-bold" to="/informacoes" id="homeDrop">
                                Informações
                            </Link>
                            <ul className="dropdown-menu">
                                <li><Link className="dropdown-item" to="/informacoes">História da Recicratiu</Link></li>
                                <li><Link className="dropdown-item" to="/informacoes">Como Participar da Coleta</Link></li>
                                <li><Link className="dropdown-item" to="/informacoes">Guia de Descarte Correto</Link></li>
                            </ul>
                        </li>

                        {/* Item: Ecopontos */}
                        <li className="nav-item dropdown">
                            <Link className="nav-link dropdown-toggle text-white fw-bold" to="/ecopontos" id="homeDrop">
                                Ecopontos
                            </Link>
                            <ul className="dropdown-menu">
                                <li><Link className="dropdown-item" to="/ecopontos">Parceiros</Link></li>
                                <li><Link className="dropdown-item" to="/ecopontos">Como Contribuir?</Link></li>
                            </ul>
                        </li>


                        {/* Item: Portal do Servidor */}
                        <li className="nav-item dropdown">
                            <Link className="nav-link dropdown-toggle text-white fw-bold" to="/" id="homeDrop">
                                Portal do Servidor
                            </Link>
                            <ul className="dropdown-menu">
                                <li><Link className="dropdown-item" to="/admin-login">Login Administrador</Link></li>
                            </ul>
                        </li>

                    </ul>
                </div>
            </div>
        </nav>
    );
}
export default Navebar;