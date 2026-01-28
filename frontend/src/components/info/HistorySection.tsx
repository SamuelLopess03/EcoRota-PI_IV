import React from 'react';
import { FaHistory } from 'react-icons/fa';

const HistorySection: React.FC = () => {
    return (
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
    );
};

export default HistorySection;
