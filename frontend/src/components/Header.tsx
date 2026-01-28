import logo from '../images/logo2RC.png';

function Header() {
  return (
    <header className="bg-white border-bottom border-2 py-4">
      <div className="container d-flex align-items-center justify-content-center gap-4">
        {/* Logo com tamanho controlado */}
        <img
          src={logo}
          alt="Logo Recicratiú"
          style={{ width: '130px', height: 'auto' }}
        />

        <div className="text-center text-md-start">
          <h1 className="fw-bolder mb-0" style={{ color: '#2e7d32'}}>
            RECICRATIÚ
          </h1>
          <h2 className="fs-5 text-secondary mb-0 fw-medium" style={{ maxWidth: '400px' }}>
            Associação de Catadores de Materiais Recicláveis de Crateús
          </h2>
        </div>
      </div>
    </header>
  );
}

export default Header;