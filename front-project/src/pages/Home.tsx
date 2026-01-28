import { FaSearch, FaCalendarAlt } from 'react-icons/fa';

function Home() {
    return (
        <div className="home-page">
            {/* Seção do Mapa */}
            <div className="shadow-sm bg-light" style={{ width: '100%', height: '350px', overflow: 'hidden' }}>
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63575.736269348825!2d-40.698428102633876!3d-5.186403600292874!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x796f04deb335aa7%3A0x1db43189e3269198!2sCrate%C3%BAs%2C%20CE!5e0!3m2!1spt-BR!2sbr!4v1764565561476!5m2!1spt-BR!2sbr"
                    title="Mapa de Crateús"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                ></iframe>
            </div>

            <div className="container py-5">
                <div className="row g-4">

                    {/* COLUNA DO CALENDÁRIO */}
                    <section id="calendario-rotas" className="col-lg-8">
                        <div className="card shadow-sm border-0 border-top border-success border-4 p-4">
                            <h2 className="h4 text-success fw-bold border-bottom pb-3 mb-4 d-flex align-items-center gap-2">
                                <FaCalendarAlt /> Calendário de Rotas
                            </h2>

                            {/* Área com Scroll Interno */}
                            <div className="container-scrollable pe-2" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                <div className="row g-3">

                                    {/* SEGUNDA-FEIRA */}
                                    <div className="col-12">
                                        <div className="card bg-light border-0 p-3 shadow-sm border-start border-success border-3">
                                            <h3 className="h6 text-success fw-bold mb-3">Segunda-feira</h3>
                                            <div className="row">
                                                <div className="col-md-6 border-end">
                                                    <p className="mb-1 small"><strong>Rota 01 :</strong></p>
                                                    <ul className="small text-muted ps-3">
                                                        <li>Tucuns, Queimadas, Marinhos </li>
                                                        <li>Barro Vermelho, Santa Luzia </li>
                                                    </ul>

                                                    <p className="mb-1 small"><strong>Rota 02 :</strong></p>
                                                    <ul className="small text-muted ps-3">
                                                        <li>São José, Ponte Preta, Altamira e Centro </li>
                                                    </ul>

                                                </div>
                                                <div className="col-md-6">
                                                    <p className="mb-1 small"><strong>Rota 03 :</strong> </p>
                                                    <ul className="small text-muted ps-3">
                                                        <li>Ibiapaba, Poti, Cabaças e Boqueirão </li>
                                                        <li>Lagoas das Pedras e Estação </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* TERÇA-FEIRA */}
                                    <div className="col-12">
                                        <div className="card bg-light border-0 p-3 shadow-sm border-start border-success border-3">
                                            <h3 className="h6 text-success fw-bold mb-3">Terça-feira</h3>
                                            <div className="row">
                                                <div className="col-md-6 border-end">
                                                    <p className="mb-1 small"><strong>Rota 01:</strong> </p>
                                                    <ul className="small text-muted ps-3">
                                                        <li>Planalto, Planaltina, Morada dos Ventos II </li>
                                                        <li>Campo Verde e Campo Velho </li>
                                                    </ul>
                                                </div>
                                                <div className="col-md-6">
                                                    <p className="mb-1 small"><strong>Rota 02:</strong> </p>
                                                    <ul className="small text-muted ps-3">
                                                        <li>São Vicente, Fatima I</li>
                                                        <li>Várzea Grande, Pocinhos, Boa Vista</li>
                                                        <li>São João e Jardim</li>

                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* QUARTA-FEIRA */}
                                    <div className="col-12">
                                        <div className="card bg-light border-0 p-3 shadow-sm border-start border-success border-3">
                                            <h3 className="h6 text-success fw-bold mb-3">Quarta-feira</h3>
                                            <div className="row">
                                                <div className="col-md-6 border-end">
                                                    <p className="mb-1 small"><strong>Rota 01:</strong> </p>
                                                    <ul className="small text-muted ps-3">
                                                        <li>Venâncios</li>
                                                        <li>Pendencia, Salgado, Queimadas, Barro Vermelho e Xavier</li>
                                                    </ul>
                                                </div>
                                                <div className="col-md-6">
                                                    <p className="mb-1 small"><strong>Rota 02:</strong> </p>
                                                    <ul className="small text-muted ps-3">
                                                        <li>Assis e Curral Velho</li>
                                                        <li>Vaca Morta</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* QUINTA-FEIRA */}
                                    <div className="col-12">
                                        <div className="card bg-light border-0 p-3 shadow-sm border-start border-success border-3">
                                            <h3 className="h6 text-success fw-bold mb-3">Quinta-feira</h3>
                                            <div className="row">
                                                <div className="col-md-6 border-end">
                                                    <p className="mb-1 small"><strong>Rota 01:</strong> </p>
                                                    <ul className="small text-muted ps-3">
                                                        <li>Ponto-X, Nova Terra, Rodoviária, Região da CSU e BNB</li>
                                                        <li>Santo Antônio dos Azevedos, Águas Belas e São João</li>
                                                    </ul>
                                                </div>
                                                <div className="col-md-6">
                                                    <p className="mb-1 small"><strong>Rota 02:</strong></p>
                                                    <ul className="small text-muted ps-3">
                                                        <li>Dom Fragoso, Centro Residencial e Maratoan </li>
                                                        <li>Realejo, Pé do Morro e Barra do Simão </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* SEXTA E SÁBADO */}
                                    <div className="col-12">
                                        <div className="card bg-light border-0 p-3 shadow-sm border-start border-success border-3">
                                            <h3 className="h6 text-success fw-bold mb-3">Sexta-feira</h3>
                                            <div className="row">
                                                <div className="col-md-6 border-end">
                                                    <p className="mb-1 small"><strong>Rota 01:</strong> </p>
                                                    <ul className="small text-muted ps-3">
                                                        <li>Curral do Meio, Várzea da Palha</li>
                                                        <li>Realejo, Pé do Morro e Barra do Simão </li>
                                                    </ul>
                                                </div>
                                                <div className="col-md-6">
                                                    <p className="mb-1 small"><strong>Rota 02:</strong></p>
                                                    <ul className="small text-muted ps-3">
                                                        <li>Cidade Nova, Cajás, Patriarcas e Cidade 2000</li>
                                                        <li>Frei Damião, Vila José Rosa e Vida Nova </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </section>

                    {/* PAINEL LATERAL */}
                    <aside className="col-lg-4 d-flex flex-column gap-3">
                        <div className="input-group shadow-sm">
                            <span className="input-group-text bg-white border-end-0">
                                <FaSearch className="text-muted" />
                            </span>
                            <input type="text" className="form-control border-start-0" placeholder="Procurar seu bairro..." />
                        </div>

                        <div className="card bg-dark text-white p-4 text-center border-0 rounded-4 shadow">
                            <h3 className="h5">Dúvidas sobre a coleta?</h3>
                            <p className="small text-secondary mb-4">Consulte os horários ou relate problemas abaixo. </p>
                            <button className="btn btn-success fw-bold w-100 py-2">
                                Relatar Problema
                            </button>
                        </div>
                    </aside>

                </div>
            </div>
        </div>
    );
}

export default Home;