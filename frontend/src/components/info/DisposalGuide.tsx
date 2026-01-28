import React from 'react';
import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';

const DisposalGuide: React.FC = () => {
    return (
        <section id="materiais" className="mb-5">
            <h2 className="text-center fw-bold mb-4">Guia de Descarte Correto</h2>
            <div className="row g-4">
                {/* O QUE COLOCAR */}
                <div className="col-md-6">
                    <div className="card h-100 border-0 shadow-sm border-top border-success border-4">
                        <div className="card-header bg-white border-0 pt-4 px-4">
                            <h4 className="text-success d-flex align-items-center gap-2 mb-0">
                                < FaCheckCircle /> O que colocar (Recicláveis)
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

                {/* O QUE NÃO COLOCAR */}
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
    );
};

export default DisposalGuide;
