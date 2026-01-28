
import { 
  FaHistory, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaExclamationTriangle, 
  FaBullhorn,
  FaOilCan,
  FaMicrochip 
} from 'react-icons/fa';


const Info = () => {
    return (
        <div className="container py-5">
            {/* SEÇÃO 1: HISTÓRIA DA RECICRATIÚ */}
            <section id="historia" className="mb-5">
                <div className="row align-items-center bg-light rounded-4 p-4 shadow-sm border-start border-success border-5">
                    <div className="col-md-2 text-center text-success">
                        <FaHistory size={60} />
                    </div>
                    <div className="col-md-10">
                        <h2 className="fw-bold text-success">História da RECICRATIÚ</h2>
                        <p className="text-dark">
                            Surgida em 2010, a Associação de Catadores de Materiais Recicláveis tem o objetivo de ampliar a coleta em Crateús, gerando renda, inclusão social e sustentabilidade.
                            Em 2013, o projeto foi premiado com o <strong>Selo Pró-catador</strong> do Governo Federal.
                        </p>
                    </div>
                </div>
            </section>

            {/* SEÇÃO 2: COMO PARTICIPAR DA COLETA SELETIVA */}
            <section id="coleta" className="mb-5">
                <h2 className="text-center fw-bold mb-4">Como Participar da Coleta Seletiva</h2>
                <div className="row g-4">
                    <div className="col-md-4">
                        <div className="card h-100 border-0 shadow-sm text-center p-3">
                            <div className="card-body">
                                <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>1</div>
                                <h5>Separação</h5>
                                <p className="small text-muted">Use recipientes distintos para resíduos secos (recicláveis) e úmidos (orgânicos).</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card h-100 border-0 shadow-sm text-center p-3">
                            <div className="card-body">
                                <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>2</div>
                                <h5>Higienização</h5>
                                <p className="small text-muted">Lave e seque embalagens como garrafas e latas antes de descartar.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card h-100 border-0 shadow-sm text-center p-3">
                            <div className="card-body">
                                <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>3</div>
                                <h5>Compactação</h5>
                                <p className="small text-muted">Amasse garrafas PET e caixas para economizar espaço.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dica do Som do Caminhão */}
                <div className="alert alert-success mt-4 d-flex align-items-center rounded-pill">
                    <FaBullhorn className="me-3 fs-4" />
                    <span><strong>Dica Importante:</strong> Fique atento à "musiquinha de flauta" que o caminhão toca ao passar!</span>
                </div>
            </section>

            {/* 2. O QUE COLOCAR VS. O QUE NÃO COLOCAR */}
            <section id="materiais" className="mb-5">
                <h2 className="text-center fw-bold mb-4">Guia de Descarte Correto</h2>
                <div className="row g-4">

                    {/* O QUE COLOCAR (RECICLÁVEIS) */}
                    <div className="col-md-6">
                        <div className="card h-100 border-0 shadow-sm border-top border-success border-4">
                            <div className="card-header bg-white border-0 pt-4 px-4">
                                <h4 className="text-success d-flex align-items-center gap-2 mb-0">
                                    <FaCheckCircle /> O que colocar (Recicláveis)
                                </h4>
                            </div>
                            <div className="card-body px-4">
                                <p className="text-muted small">Estes materiais devem ser separados para a coleta seletiva:</p>
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item border-0 px-0"><strong>Papel:</strong> Papelão, jornais e revistas.</li>
                                    <li className="list-group-item border-0 px-0"><strong>Plástico:</strong> Garrafas PET e embalagens.</li>
                                    <li className="list-group-item border-0 px-0"><strong>Vidro:</strong> Frascos e garrafas (limpos e inteiros).</li>
                                    <li className="list-group-item border-0 px-0"><strong>Metal:</strong> Latas de alumínio e arames.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* O QUE NÃO COLOCAR (REJEITOS/PERIGOSOS) */}
                    <div className="col-md-6">
                        <div className="card h-100 border-0 shadow-sm border-top border-danger border-4">
                            <div className="card-header bg-white border-0 pt-4 px-4">
                                <h4 className="text-danger d-flex align-items-center gap-2 mb-0">
                                    <FaTimesCircle /> O que NÃO colocar
                                </h4>
                            </div>
                            <div className="card-body px-4">
                                <p className="text-muted small">Estes itens NÃO vão para a coleta seletiva comum:</p>
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item border-0 px-0"><strong>Orgânicos:</strong> Restos de comida.</li>
                                    <li className="list-group-item border-0 px-0"><strong>Perigosos:</strong> Pilhas, baterias e lâmpadas.</li>
                                    <li className="list-group-item border-0 px-0"><strong>Hospitalares:</strong> Seringas e resíduos médicos.</li>
                                    <li className="list-group-item border-0 px-0"><strong>Rejeitos:</strong> Papel higiênico e fraldas usadas.</li>
                                </ul>
                                <div className="mt-3 p-2 bg-light rounded d-flex align-items-center gap-2">
                                    <FaExclamationTriangle className="text-warning" />
                                    <small className="text-dark fw-bold">Pilhas e lâmpadas exigem descarte especial na SEMAM!</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SEÇÃO 3: ÓLEO E ELETRÔNICOS */}
            <section id="especiais" className="row g-4 mb-5">
                <div className="col-md-6">
                    <div className="p-4 bg-dark text-white rounded-4 h-100 shadow">
                        <h3 className="d-flex align-items-center mb-3"><FaOilCan className="me-2 text-warning" /> Óleo de Cozinha</h3>
                        <p>Armazene em garrafas PET após esfriar e leve ao Ecoponto da SEMAM.</p>
                        <ul className="small text-light opacity-75">
                            <li>Evita entupimentos e poluição da água.</li>
                            <li>Pode ser transformado em sabão ou biodiesel.</li>
                        </ul>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="p-4 bg-secondary text-white rounded-4 h-100 shadow">
                        <h3 className="d-flex align-items-center mb-3"><FaMicrochip className="me-2 text-info" /> Eletrônicos</h3>
                        <p>Devem ser entregues no Ecoponto da SEMAM ou solicitados via canais de atendimento.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Info;