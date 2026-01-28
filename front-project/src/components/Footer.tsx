import { FaPhone, FaInstagram, FaMapMarkerAlt } from 'react-icons/fa';

function Footer() {
    return (
        <footer className="bg-dark text-white py-5 border-top border-success border-4 mt-auto">
            <div className="container">
                <div className="row text-center g-4">

                    {/* Telefone */}
                    <div className="col-md-4">
                        <div className="mb-2">
                            <FaPhone className="text-success fs-3" />
                        </div>
                        <h5 className="text-success fw-bold small text-uppercase">Telefone</h5>
                        <p className="mb-0">(88) 9 9452-5936</p>
                    </div>

                    {/* Email */}
                    <div className="col-md-4">
                        <div className="mb-2">
                            <FaInstagram className="text-success fs-3" />
                        </div>
                        <h5 className="text-success fw-bold small text-uppercase">Instagram</h5>
                        <p className="mb-0">@recicratiu_</p>
                    </div>

                    {/* Endereço */}
                    <div className="col-md-4">
                        <div className="mb-2">
                            <FaMapMarkerAlt className="text-success fs-3" />
                        </div>
                        <h5 className="text-success fw-bold small text-uppercase">Endereço</h5>
                        <p className="mb-0">Crateús, CE - Distrito Industrial</p>
                    </div>

                </div>

                <div className="text-center mt-5 pt-4 border-top border-secondary">
                    <p className="small text-secondary mb-0">© 2024 Projeto Recicratiú - Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;