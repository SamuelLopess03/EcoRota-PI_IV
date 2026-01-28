import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

interface PartnerCardProps {
    nome: string;
    qtd: number;
}

const PartnerCard: React.FC<PartnerCardProps> = ({ nome, qtd }) => {
    return (
        <div className="col-md-4 col-lg-3">
            <div className="card h-100 border-0 shadow-sm text-center p-3 border-top border-success border-4">
                <div className="card-body">
                    <div className="text-success mb-3">
                        <FaMapMarkerAlt size={30} />
                    </div>
                    <h6 className="fw-bold mb-1">{nome}</h6>
                    <p className="badge bg-success rounded-pill mb-0">
                        {qtd} {qtd > 1 ? 'Ecopontos' : 'Ecoponto'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PartnerCard;
