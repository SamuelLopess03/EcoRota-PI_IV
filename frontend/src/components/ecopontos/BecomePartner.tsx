import React from 'react';
import { FaHandshake, FaWhatsapp } from 'react-icons/fa';
import qrcode from '../../images/QRCODE.png';

const BecomePartner: React.FC = () => {
    return (
        <section id="como-contribuir" className="bg-dark text-white rounded-4 p-5 shadow">
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
    );
};

export default BecomePartner;
