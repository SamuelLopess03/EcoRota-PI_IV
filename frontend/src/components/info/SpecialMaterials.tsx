import React from 'react';
import { FaOilCan, FaMicrochip, FaExclamationCircle, FaCheck, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';

const SpecialMaterials: React.FC = () => {
    return (
        <section id="especiais" className="mb-5">
            <h2 className="text-center fw-bold mb-4 display-6">Materiais Especiais</h2>
            <p className="text-center text-muted mb-5 mx-auto mw-600">
                Alguns itens exigem cuidado redobrado e locais específicos para descarte devido ao seu potencial poluente ou necessidade de processamento técnico.
            </p>
            
            <div className="row g-4">
                <div className="col-md-6">
                    <div className="card h-100 border-0 shadow-sm rounded-4 bg-dark text-white overflow-hidden">
                        <div className="card-body p-4 p-lg-5">
                            <div className="d-flex align-items-center gap-3 mb-3">
                                <div className="bg-warning text-dark p-3 rounded-3 shadow-sm">
                                    <FaOilCan size={32} />
                                </div>
                                <h3 className="fw-bold mb-0">Óleo de Cozinha</h3>
                            </div>
                            <p className="text-white text-opacity-75 lead fs-6 mb-4">
                                Um único litro de óleo pode poluir até 1 milhão de litros de água se descartado incorretamente.
                            </p>
                            <div className="bg-white bg-opacity-10 p-3 rounded-3 border border-white border-opacity-10">
                                <h6 className="fw-bold text-warning mb-3">Como descartar:</h6>
                                <ul className="small mb-0 list-unstyled d-flex flex-column gap-3">
                                    <li className="d-flex gap-3 align-items-start">
                                        <FaCheck className="text-warning mt-1 flex-shrink-0" /> 
                                        <span>Espere o óleo esfriar completamente.</span>
                                    </li>
                                    <li className="d-flex gap-3 align-items-start">
                                        <FaCheck className="text-warning mt-1 flex-shrink-0" /> 
                                        <span>Filtre as impurezas e coloque em uma <strong>garrafa PET</strong>.</span>
                                    </li>
                                    <li className="d-flex gap-3 align-items-start">
                                        <FaCheck className="text-warning mt-1 flex-shrink-0" /> 
                                        <span>Leve ao Ecoponto da <strong>SEMAM</strong> ou parceiros autorizados.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="col-md-6">
                    <div className="card h-100 border-0 shadow-sm rounded-4 bg-secondary text-white overflow-hidden">
                        <div className="card-body p-4 p-lg-5">
                            <div className="d-flex align-items-center gap-3 mb-3">
                                <div className="bg-info text-white p-3 rounded-3 shadow-sm">
                                    <FaMicrochip size={32} />
                                </div>
                                <h3 className="fw-bold mb-0">Eletrônicos (Lixo E-lixo)</h3>
                            </div>
                            <p className="text-white text-opacity-75 lead fs-6 mb-4">
                                Computadores, celulares e pilhas contêm metais pesados tóxicos ao solo e aos seres vivos.
                            </p>
                            <div className="bg-white bg-opacity-10 p-3 rounded-3 border border-white border-opacity-10">
                                <h6 className="fw-bold text-info mb-3">Orientações:</h6>
                                <p className="small mb-3 text-white text-opacity-90 fst-italic">
                                    Estes itens <strong>não devem</strong> ser deixados na calçada. O descarte deve ser feito:
                                </p>
                                <ul className="small mb-0 list-unstyled d-flex flex-column gap-3">
                                    <li className="d-flex gap-3 align-items-start">
                                        <FaMapMarkerAlt className="text-info mt-1 flex-shrink-0" /> 
                                        <span>Entregar diretamente no <strong>Ecoponto da SEMAM</strong>.</span>
                                    </li>
                                    <li className="d-flex gap-3 align-items-start">
                                        <FaMapMarkerAlt className="text-info mt-1 flex-shrink-0" /> 
                                        <span>Participar de mutirões de descarte eletrônico.</span>
                                    </li>
                                    <li className="d-flex gap-3 align-items-start">
                                        <FaPhoneAlt className="text-info mt-1 flex-shrink-0" /> 
                                        <span>Solicitar informações via canais de atendimento da prefeitura.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-5 p-4 bg-white rounded-4 shadow-sm border-start border-warning border-5">
                <div className="d-flex gap-3">
                    <FaExclamationCircle className="text-warning fs-1 flex-shrink-0" />
                    <div>
                        <h5 className="fw-bold mb-1">Atenção</h5>
                        <p className="text-muted mb-0">
                            Alguns materiais recicláveis como vidros quebrados devem ser embalados em caixas de papelão ou garrafas PET cortadas para evitar cortes e acidentes com os profissionais da coleta.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SpecialMaterials;
