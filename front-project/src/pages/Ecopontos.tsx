
import { FaHandshake, FaMapMarkerAlt, FaWhatsapp} from 'react-icons/fa';
import qrcode from '../images/QRCODE.png';

const Ecopontos = () => {
    const parceiros = [
        { nome: "NS Empreendimentos", qtd: 6 },
        { nome: "Cerâmica Mondubim", qtd: 3 },
        { nome: "ACM Britagem", qtd: 2 },
        { nome: "Nossa Ótica", qtd: 2 },
        { nome: "Nobre Lar", qtd: 2 },
        { nome: "Six Blades Academia", qtd: 1 },
        { nome: "Planeta Net Telecom", qtd: 1 },
    ];

    return (
        <div className="container py-5">
            {/* CABEÇALHO */}
            <section className="text-center mb-5">
                <h1 className="fw-bolder text-success display-4">Nossos Ecopontos</h1>
                <p className="lead text-secondary mx-auto" style={{ maxWidth: '800px' }}>
                    Encontre os pontos de entrega voluntária mantidos pelos nossos parceiros em Crateús.
                </p>
            </section>

            {/* GRID DE PARCEIROS */ }
            <div className="row g-4 mb-5">
                {parceiros.map((p, index) => (
                    <div className="col-md-4 col-lg-3" key={index}>
                        <div className="card h-100 border-0 shadow-sm text-center p-3 border-top border-success border-4">
                            <div className="card-body">
                                <div className="text-success mb-3">
                                    <FaMapMarkerAlt size={30} />
                                </div>
                                <h6 className="fw-bold mb-1">{p.nome}</h6>
                                <p className="badge bg-success rounded-pill mb-0">
                                    {p.qtd} {p.qtd > 1 ? 'Ecopontos' : 'Ecoponto'}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* SEÇÃO: COMO ADQUIRIR UM ECOPONTO */}
            <section className="bg-dark text-white rounded-4 p-5 shadow">
                <div className="row align-items-center">
                    <div className="col-lg-7">
                        <h2 className="fw-bold d-flex align-items-center gap-3">
                            <FaHandshake className="text-success" />
                            Quer ser um parceiro?
                        </h2>
                        <p className="text-secondary mt-3">
                            Sua empresa pode ajudar Crateús a ser mais sustentável. Entre em contato com o disque coleta e saiba como adquirir um ecoponto para o seu estabelecimento.
                        </p>
                        <div className="d-flex align-items-center gap-3 mt-4">
                            <div className="bg-success p-3 rounded-circle">
                                <FaWhatsapp size={30} />
                            </div>
                            <div>
                                <span className="d-block small text-secondary text-uppercase">Disque Coleta Seletiva</span>
                                <span className="fs-5 fw-bold">(88) 9 9452-5936</span>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-5 text-center mt-5 mt-lg-0">
                        <div className="bg-white p-4 rounded-4 d-inline-block shadow-lg">
                            <img
                                src={qrcode}
                                alt="QR Code para contacto"
                                style={{ width: '180px', height: '180px', objectFit: 'contain' }}
                            />
                            <p className="text-dark small fw-bold mb-0">Acesse o QR Code para contato direto!</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Ecopontos;