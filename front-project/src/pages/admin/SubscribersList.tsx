import React, { useEffect, useState } from 'react';
import { subscriberService } from '../../services/subscriberService';
import type { Subscriber } from '../../services/subscriberService';
import { neighborhoodService } from '../../services/neighborhoodService';
import type { Neighborhood } from '../../services/neighborhoodService';
import { FaTrash, FaPlus, FaSearch, FaFilter } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const SubscribersList: React.FC = () => {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterNeighborhood, setFilterNeighborhood] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const [subsData, neighborhoodsData] = await Promise.all([
                subscriberService.list(),
                neighborhoodService.list()
            ]);
            setSubscribers(subsData);
            setNeighborhoods(neighborhoodsData);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            alert('Não foi possível carregar a lista de assinantes.');
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: number) {
        if (confirm('Tem certeza que deseja remover este assinante?')) {
            try {
                await subscriberService.unsubscribe(id);
                setSubscribers(subscribers.filter(s => s.id !== id));
            } catch (error) {
                console.error('Erro ao excluir:', error);
                alert('Erro ao excluir assinante.');
            }
        }
    }

    // Helper to get neighborhood name
    const getNeighborhoodName = (id: number) => {
        return neighborhoods.find(n => n.id === id)?.name || 'Desconhecido';
    };

    const filteredSubscribers = subscribers.filter(s => {
        const matchesSearch = s.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              s.street.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesNeighborhood = filterNeighborhood ? s.neighborhoodId.toString() === filterNeighborhood : true;
        
        return matchesSearch && matchesNeighborhood;
    });

    if (loading) return <div className="text-center p-5"><div className="spinner-border text-success"></div></div>;

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold">Gestão de Assinantes</h2>
                <Link to="/admin/subscribers/new" className="btn btn-success d-flex align-items-center gap-2 rounded-pill px-4">
                    <FaPlus /> Novo Assinante
                </Link>
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="p-4 bg-light border-bottom d-flex flex-wrap gap-3">
                    <div className="input-group" style={{ maxWidth: '300px' }}>
                        <span className="input-group-text bg-white border-end-0"><FaSearch className="text-muted" /></span>
                        <input 
                            type="text" 
                            className="form-control border-start-0" 
                            placeholder="Buscar por email..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <div className="input-group" style={{ maxWidth: '250px' }}>
                        <span className="input-group-text bg-white border-end-0"><FaFilter className="text-muted" /></span>
                        <select 
                            className="form-select border-start-0"
                            value={filterNeighborhood}
                            onChange={e => setFilterNeighborhood(e.target.value)}
                        >
                            <option value="">Todos os Bairros</option>
                            {neighborhoods.map(n => (
                                <option key={n.id} value={n.id}>{n.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                
                <div className="table-responsive">
                    <table className="table table-hover mb-0 align-middle">
                        <thead className="bg-light">
                            <tr>
                                <th className="ps-4">Email</th>
                                <th>Endereço</th>
                                <th>Bairro</th>
                                <th className="text-end pe-4">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSubscribers.map(sub => (
                                <tr key={sub.id}>
                                    <td className="ps-4 fw-bold">{sub.email}</td>
                                    <td>{sub.street}, {sub.number} {sub.complement ? `(${sub.complement})` : ''}</td>
                                    <td><span className="badge bg-secondary">{getNeighborhoodName(sub.neighborhoodId)}</span></td>
                                    <td className="text-end pe-4">
                                        <button onClick={() => handleDelete(sub.id)} className="btn btn-sm btn-outline-danger rounded-circle p-2" title="Cancelar assinatura">
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredSubscribers.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center py-5 text-muted">
                                        Nenhum assinante encontrado.
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

export default SubscribersList;
