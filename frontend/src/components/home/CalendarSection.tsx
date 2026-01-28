import React from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import CalendarDay from './CalendarDay';

const CalendarSection: React.FC = () => {
    const schedule = [
        {
            day: "Segunda-feira",
            routes: [
                { name: "Rota 01", neighborhoods: ["Tucuns, Queimadas, Marinhos", "Barro Vermelho, Santa Luzia"] },
                { name: "Rota 02", neighborhoods: ["São José, Ponte Preta, Altamira e Centro"] },
                { name: "Rota 03", neighborhoods: ["Ibiapaba, Poti, Cabaças e Boqueirão", "Lagoas das Pedras e Estação"] }
            ]
        },
        {
            day: "Terça-feira",
            routes: [
                { name: "Rota 01", neighborhoods: ["Planalto, Planaltina, Morada dos Ventos II", "Campo Verde e Campo Velho"] },
                { name: "Rota 02", neighborhoods: ["São Vicente, Fatima I", "Várzea Grande, Pocinhos, Boa Vista", "São João e Jardim"] }
            ]
        },
        {
            day: "Quarta-feira",
            routes: [
                { name: "Rota 01", neighborhoods: ["Venâncios", "Pendencia, Salgado, Queimadas, Barro Vermelho e Xavier"] },
                { name: "Rota 02", neighborhoods: ["Assis e Curral Velho", "Vaca Morta"] }
            ]
        },
        {
            day: "Quinta-feira",
            routes: [
                { name: "Rota 01", neighborhoods: ["Ponto-X, Nova Terra, Rodoviária, Região da CSU e BNB", "Santo Antônio dos Azevedos, Águas Belas e São João"] },
                { name: "Rota 02", neighborhoods: ["Dom Fragoso, Centro Residencial e Maratoan", "Realejo, Pé do Morro e Barra do Simão"] }
            ]
        },
        {
            day: "Sexta-feira",
            routes: [
                { name: "Rota 01", neighborhoods: ["Curral do Meio, Várzea da Palha", "Realejo, Pé do Morro e Barra do Simão"] },
                { name: "Rota 02", neighborhoods: ["Cidade Nova, Cajás, Patriarcas e Cidade 2000", "Frei Damião, Vila José Rosa e Vida Nova"] }
            ]
        }
    ];

    return (
        <section id="calendario-rotas" className="col-lg-8">
            <div className="card shadow-sm border-0 border-top border-success border-4 p-4">
                <h2 className="h4 text-success fw-bold border-bottom pb-3 mb-4 d-flex align-items-center gap-2">
                    <FaCalendarAlt /> Calendário de Rotas
                </h2>

                <div className="container-scrollable pe-2" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    <div className="row g-3">
                        {schedule.map((item, index) => (
                            <CalendarDay key={index} day={item.day} routes={item.routes} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CalendarSection;
