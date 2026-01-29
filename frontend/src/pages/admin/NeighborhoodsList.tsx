import React, { useEffect, useState } from 'react';
import { neighborhoodService } from '../../services/neighborhoodService';
import { routeService, type Route } from '../../services/routeService';
import type { Neighborhood } from '../../services/neighborhoodService';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import ConfirmModal from '../../components/common/ConfirmModal';

const NeighborhoodsList: React.FC = () => {
    const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
    const [routes, setRoutes] = useState<Route[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id?: number }>({ isOpen: false });

    useEffect(() => {
        loadNeighborhoods();
    }, []);

    async function loadNeighborhoods() {
        try {
            const [neighborhoodsData, routesData] = await Promise.all([
                neighborhoodService.list(),
                routeService.list()
            ]);
            setNeighborhoods(neighborhoodsData);
            setRoutes(routesData);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            toast.error('Não foi possível carregar os dados.');
        } finally {
            setLoading(false);
        }
    }

    const getRouteName = (routeId: number) => {
        return routes.find(r => r.id === routeId)?.name || `Rota ${routeId}`;
    };

    async function handleDeleteConfirmed() {
        if (!deleteModal.id) return;
        
        try {
            await neighborhoodService.delete(deleteModal.id);
            setNeighborhoods(neighborhoods.filter(n => n.id !== deleteModal.id));
            toast.success('Bairro excluído com sucesso!');
        } catch (error: any) {
            console.error('Erro ao excluir:', error);
            const message = error.response?.data?.error || 'Erro ao excluir bairro.';
            toast.error(message);
        } finally {
            setDeleteModal({ isOpen: false });
        }
    }

    const filteredNeighborhoods = neighborhoods.filter(n => 
        n.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.postalCode.includes(searchTerm)
    );

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
                    <h2 className="fw-bold mb-0">Gestão de Bairros</h2>
                </div>
                <Link to="/admin/neighborhoods/new" className="btn btn-success d-flex align-items-center gap-2 rounded-pill px-4">
                    <FaPlus /> Novo Bairro
                </Link>
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="p-4 bg-light border-bottom">
                    <div className="input-group mw-400">
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
                                <th>Nome da Rota</th>
                                <th className="text-end pe-4">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredNeighborhoods.map(neighborhood => (
                                <tr key={neighborhood.id}>
                                    <td className="ps-4 fw-bold">{neighborhood.name}</td>
                                    <td>{neighborhood.postalCode}</td>
                                    <td>{neighborhood.populationEstimate?.toLocaleString('pt-BR') || '-'}</td>
                                    <td><span className="badge bg-primary rounded-pill">{getRouteName(neighborhood.routeId)}</span></td>
                                    <td className="text-end pe-4">
                                        <div className="d-flex justify-content-end gap-2">
                                            <Link 
                                                to={`/admin/neighborhoods/${neighborhood.id}/edit`} 
                                                className="btn btn-sm btn-outline-primary btn-circle-sm rounded-circle d-flex align-items-center justify-content-center"
                                                title="Editar"
                                            >
                                                <FaEdit />
                                            </Link>
                                            <button 
                                                onClick={() => setDeleteModal({ isOpen: true, id: neighborhood.id })} 
                                                className="btn btn-sm btn-outline-danger btn-circle-sm rounded-circle d-flex align-items-center justify-content-center"
                                                title="Excluir"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
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

            <ConfirmModal 
                isOpen={deleteModal.isOpen}
                title="Excluir Bairro"
                message="Tem certeza que deseja excluir este bairro? Esta ação não pode ser desfeita."
                onConfirm={handleDeleteConfirmed}
                onCancel={() => setDeleteModal({ isOpen: false })}
            />
        </div>
    );
};

export default NeighborhoodsList;
