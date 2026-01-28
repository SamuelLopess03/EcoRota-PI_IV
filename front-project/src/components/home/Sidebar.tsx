import React from 'react';
import { FaSearch } from 'react-icons/fa';

const Sidebar: React.FC = () => {
    return (
        <aside className="col-lg-4 d-flex flex-column gap-3">
            <div id="buscar-bairro" className="input-group shadow-sm">
                <span className="input-group-text bg-white border-end-0">
                    <FaSearch className="text-muted" />
                </span>
                <input type="text" className="form-control border-start-0" placeholder="Procurar seu bairro..." />
            </div>

            <div id="relatar-problema" className="card bg-dark text-white p-4 text-center border-0 rounded-4 shadow">
                <h3 className="h5">Dúvidas sobre a coleta?</h3>
                <p className="small text-secondary mb-4">Consulte os horários ou relate problemas abaixo.</p>
                <button className="btn btn-success fw-bold w-100 py-2">
                    Relatar Problema
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
