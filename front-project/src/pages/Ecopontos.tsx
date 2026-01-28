import PartnerCard from '../components/ecopontos/PartnerCard';
import BecomePartner from '../components/ecopontos/BecomePartner';

const Ecopontos = () => {
    const parceiros = [
        { nome: "NS Empreendimentos", qtd: 6 },
        { nome: "Cerâmica Mondubim", qtd: 3 },
        { nome: "ACM Britagem", qtd: 2 },
        { nome: "Nossa Ótica", qtd: 2 },
        { nome: "Nobre Lar", qtd: 2 },
        { nome: "Six Blades Academia", qtd: 1 },
        { nome: "Planeta Net Telecom", qtd: 1 },
    ];

    return (
        <div className="container py-5">
            {/* CABEÇALHO */}
            <section className="text-center mb-5">
                <h1 className="fw-bolder text-success display-4">Nossos Ecopontos</h1>
                <p className="lead text-secondary mx-auto" style={{ maxWidth: '800px' }}>
                    Encontre os pontos de entrega voluntária mantidos pelos nossos parceiros em Crateús.
                </p>
            </section>

            {/* GRID DE PARCEIROS */}
            <div id="parceiros" className="row g-4 mb-5">
                {parceiros.map((p, index) => (
                    <PartnerCard key={index} nome={p.nome} qtd={p.qtd} />
                ))}
            </div>

            <BecomePartner />
        </div>
    );
};

export default Ecopontos;