import React from 'react';
import { FaOilCan, FaMicrochip } from 'react-icons/fa';

const SpecialMaterials: React.FC = () => {
    return (
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
    );
};

export default SpecialMaterials;
