import React from 'react';
import { FaBullhorn } from 'react-icons/fa';

const ParticipationSection: React.FC = () => {
    const steps = [
        { id: 1, title: "Separação", description: "Use recipientes distintos para resíduos secos (recicláveis) e úmidos (orgânicos)." },
        { id: 2, title: "Higienização", description: "Lave e seque embalagens como garrafas e latas antes de descartar." },
        { id: 3, title: "Compactação", description: "Amasse garrafas PET e caixas para economizar espaço." }
    ];

    return (
        <section id="coleta" className="mb-5">
            <h2 className="text-center fw-bold mb-4">Como Participar da Coleta Seletiva</h2>
            <div className="row g-4">
                {steps.map((step) => (
                    <div className="col-md-4" key={step.id}>
                        <div className="card h-100 border-0 shadow-sm text-center p-3">
                            <div className="card-body">
                                <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>{step.id}</div>
                                <h5>{step.title}</h5>
                                <p className="small text-muted">{step.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="alert alert-success mt-4 d-flex align-items-center rounded-pill">
                <FaBullhorn className="me-3 fs-4" />
                <span><strong>Dica Importante:</strong> Fique atento à "musiquinha de flauta" que o caminhão toca ao passar!</span>
            </div>
        </section>
    );
};

export default ParticipationSection;
