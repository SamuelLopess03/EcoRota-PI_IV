import React, { useEffect, useState } from 'react';
import { neighborhoodService } from '../../services/neighborhoodService';
import type { Neighborhood } from '../../services/neighborhoodService';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const NeighborhoodsList: React.FC = () => {
    const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadNeighborhoods();
    }, []);

    async function loadNeighborhoods() {
        try {
            const data = await neighborhoodService.list();
            setNeighborhoods(data);
        } catch (error) {
            console.error('Erro ao carregar bairros:', error);
            alert('Não foi possível carregar a lista de bairros.');
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: number) {
        if (confirm('Tem certeza que deseja excluir este bairro?')) {
            try {
                await neighborhoodService.delete(id);
                setNeighborhoods(neighborhoods.filter(n => n.id !== id));
            } catch (error) {
                console.error('Erro ao excluir:', error);
                alert('Erro ao excluir bairro.');
            }
        }
    }

    const filteredNeighborhoods = neighborhoods.filter(n => 
        n.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.postalCode.includes(searchTerm)
    );

    if (loading) return <div className="text-center p-5"><div className="spinner-border text-success"></div></div>;

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold">Gestão de Bairros</h2>
                <Link to="/admin/neighborhoods/new" className="btn btn-success d-flex align-items-center gap-2 rounded-pill px-4">
                    <FaPlus /> Novo Bairro
                </Link>
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="p-4 bg-light border-bottom">
                    <div className="input-group" style={{ maxWidth: '400px' }}>
                        <span className="input-group-text bg-white border-end-0"><FaSearch className="text-muted" /></span>
                        <input 
                            type="text" 
                            className="form-control border-start-0" 
                            placeholder="Buscar por nome ou CEP..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="table-responsive">
                    <table className="table table-hover mb-0 align-middle">
                        <thead className="bg-light">
                            <tr>
                                <th className="ps-4">Nome</th>
                                <th>CEP</th>
                                <th>Pop. Estimada</th>
                                <th>Rota ID</th>
                                <th className="text-end pe-4">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredNeighborhoods.map(neighborhood => (
                                <tr key={neighborhood.id}>
                                    <td className="ps-4 fw-bold">{neighborhood.name}</td>
                                    <td>{neighborhood.postalCode}</td>
                                    <td>{neighborhood.populationEstimate?.toLocaleString('pt-BR') || '-'}</td>
                                    <td><span className="badge bg-primary rounded-pill">Rota {neighborhood.routeId}</span></td>
                                    <td className="text-end pe-4">
                                        <Link to={`/admin/neighborhoods/${neighborhood.id}/edit`} className="btn btn-sm btn-outline-primary me-2 rounded-circle p-2">
                                            <FaEdit />
                                        </Link>
                                        <button onClick={() => handleDelete(neighborhood.id)} className="btn btn-sm btn-outline-danger rounded-circle p-2">
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredNeighborhoods.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-5 text-muted">
                                        Nenhum bairro encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default NeighborhoodsList;
