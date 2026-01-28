import { Link } from "react-router-dom";

function Navbar() {
    const handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        const menu = e.currentTarget.closest('.dropdown-menu');
        if (menu) {
            menu.classList.add('closing');
        }
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLLIElement>) => {
        const menu = e.currentTarget.querySelector('.dropdown-menu');
        if (menu) {
            menu.classList.remove('closing');
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm" style={{ borderTop: '4px solid #4CAF50' }}>
            <div className="container">
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
                    <ul className="navbar-nav gap-lg-4">
                        {/* Home Dropdown */}
                        <li className="nav-item dropdown" onMouseLeave={handleMouseLeave}>
                            <Link className="nav-link dropdown-toggle text-white fw-bold" to="/" id="homeDrop">
                                Home
                            </Link>
                            <ul className="dropdown-menu shadow">
                                <li><Link className="dropdown-item" to="/#mapa" onClick={handleItemClick}>Mapa</Link></li>
                                <li><Link className="dropdown-item" to="/#calendario-rotas" onClick={handleItemClick}>Calendário</Link></li>
                                <li><Link className="dropdown-item" to="/#buscar-bairro" onClick={handleItemClick}>Buscar Bairro</Link></li>
                                <li><Link className="dropdown-item" to="/#relatar-problema" onClick={handleItemClick}>Relatar Problemas</Link></li>
                            </ul>
                        </li>

                        {/* Item: Informações */}
                        <li className="nav-item dropdown" onMouseLeave={handleMouseLeave}>
                            <Link className="nav-link dropdown-toggle text-white fw-bold" to="/informacoes" id="infoDrop">
                                Informações
                            </Link>
                            <ul className="dropdown-menu shadow">
                                <li><Link className="dropdown-item" to="/informacoes#historia" onClick={handleItemClick}>História da Recicratiu</Link></li>
                                <li><Link className="dropdown-item" to="/informacoes#coleta" onClick={handleItemClick}>Como Participar da Coleta</Link></li>
                                <li><Link className="dropdown-item" to="/informacoes#materiais" onClick={handleItemClick}>Guia de Descarte Correto</Link></li>
                            </ul>
                        </li>

                        {/* Item: Ecopontos */}
                        <li className="nav-item dropdown" onMouseLeave={handleMouseLeave}>
                            <Link className="nav-link dropdown-toggle text-white fw-bold" to="/ecopontos" id="ecopontosDrop">
                                Ecopontos
                            </Link>
                            <ul className="dropdown-menu shadow">
                                <li><Link className="dropdown-item" to="/ecopontos#parceiros" onClick={handleItemClick}>Parceiros</Link></li>
                                <li><Link className="dropdown-item" to="/ecopontos#como-contribuir" onClick={handleItemClick}>Como Contribuir?</Link></li>
                            </ul>
                        </li>


                        {/* Item: Portal do Servidor */}
                        <li className="nav-item dropdown" onMouseLeave={handleMouseLeave}>
                            <Link className="nav-link dropdown-toggle text-white fw-bold" to="#" id="adminDrop">
                                Portal do Servidor
                            </Link>
                            <ul className="dropdown-menu shadow">
                                <li><Link className="dropdown-item" to="/admin-login" onClick={handleItemClick}>Login Administrador</Link></li>
                            </ul>
                        </li>

                    </ul>
                </div>
            </div>
        </nav>
    );
}
export default Navbar;