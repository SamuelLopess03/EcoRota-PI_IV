import React, { useEffect, useState } from 'react';
import { subscriberService } from '../../services/subscriberService';
import type { Subscriber } from '../../services/subscriberService';
import { neighborhoodService } from '../../services/neighborhoodService';
import type { Neighborhood } from '../../services/neighborhoodService';
import { FaTrash, FaPlus, FaSearch, FaFilter, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import ConfirmModal from '../../components/common/ConfirmModal';

const SubscribersList: React.FC = () => {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterNeighborhood, setFilterNeighborhood] = useState('');
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id?: number }>({ isOpen: false });

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const [subsData, neighborhoodsData] = await Promise.all([
                subscriberService.list(),
                neighborhoodService.list()
            ]);
            setSubscribers(subsData || []);
            setNeighborhoods(neighborhoodsData || []);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            toast.error('Não foi possível carregar a lista de assinantes.');
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteConfirmed() {
        if (!deleteModal.id) return;

        try {
            await subscriberService.unsubscribe(deleteModal.id);
            setSubscribers(subscribers.filter(s => s.id !== deleteModal.id));
            toast.success('Assinatura removida com sucesso!');
        } catch (error: any) {
            console.error('Erro ao excluir:', error);
            const message = error.response?.data?.error || 'Erro ao excluir assinante.';
            toast.error(message);
        } finally {
            setDeleteModal({ isOpen: false });
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
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div className="d-flex align-items-center gap-3">
                    <Link 
                        to="/admin/dashboard" 
                        className="btn btn-outline-success rounded-circle d-flex align-items-center justify-content-center p-0 shadow-sm" 
                        title="Voltar ao Dashboard"
                        style={{ width: '38px', height: '38px' }}
                    >
                        <FaArrowLeft size={16} />
                    </Link>
                    <h2 className="fw-bold mb-0">Gestão de Assinantes</h2>
                </div>
                <Link to="/admin/subscribers/new" className="btn btn-success d-flex align-items-center gap-2 rounded-pill px-4">
                    <FaPlus /> Novo Assinante
                </Link>
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="p-4 bg-light border-bottom">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <div className="input-group mw-400">
                                <span className="input-group-text bg-white border-end-0"><FaSearch className="text-muted" /></span>
                                <input 
                                    type="text" 
                                    className="form-control border-start-0" 
                                    placeholder="Buscar por email..." 
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        
                        <div className="col-md-6">
                            <div className="input-group">
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
                                        <div className="d-flex justify-content-end">
                                            <button 
                                                onClick={() => setDeleteModal({ isOpen: true, id: sub.id })} 
                                                className="btn btn-sm btn-outline-danger btn-circle-sm rounded-circle d-flex align-items-center justify-content-center"
                                                title="Cancelar assinatura"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
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

            <ConfirmModal 
                isOpen={deleteModal.isOpen}
                title="Remover Assinante"
                message="Tem certeza que deseja remover este assinante? Esta ação não pode ser desfeita."
                onConfirm={handleDeleteConfirmed}
                onCancel={() => setDeleteModal({ isOpen: false })}
            />
        </div>
    );
};

export default SubscribersList;
