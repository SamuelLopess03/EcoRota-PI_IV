import React, { useEffect, useState } from 'react';
import { routeService } from '../../services/routeService';
import type { Route } from '../../services/routeService';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import ConfirmModal from '../../components/common/ConfirmModal';

const RoutesList: React.FC = () => {
    const [routes, setRoutes] = useState<Route[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id?: number }>({ isOpen: false });

    useEffect(() => {
        loadRoutes();
    }, []);

    async function loadRoutes() {
        try {
            const data = await routeService.list();
            setRoutes(data);
        } catch (error) {
            console.error('Erro ao carregar rotas:', error);
            toast.error('Não foi possível carregar a lista de rotas.');
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteConfirmed() {
        if (!deleteModal.id) return;

        try {
            await routeService.delete(deleteModal.id);
            setRoutes(routes.filter(r => r.id !== deleteModal.id));
            toast.success('Rota excluída com sucesso!');
        } catch (error: any) {
            console.error('Erro ao excluir:', error);
            const message = error.response?.data?.error || 'Erro ao excluir rota.';
            toast.error(message);
        } finally {
            setDeleteModal({ isOpen: false });
        }
    }

    const filteredRoutes = routes.filter(r =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.collectionType.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const daysMap: { [key: string]: string } = {
        'monday': 'Segunda-feira',
        'tuesday': 'Terça-feira',
        'wednesday': 'Quarta-feira',
        'thursday': 'Quinta-feira',
        'friday': 'Sexta-feira',
        'saturday': 'Sábado',
        'sunday': 'Domingo'
    };

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
                    <h2 className="fw-bold mb-0">Gestão de Rotas</h2>
                </div>
                <Link to="/admin/routes/new" className="btn btn-success d-flex align-items-center gap-2 rounded-pill px-4">
                    <FaPlus /> Nova Rota
                </Link>
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="p-4 bg-light border-bottom">
                    <div className="input-group mw-400">
                        <span className="input-group-text bg-white border-end-0"><FaSearch className="text-muted" /></span>
                        <input
                            type="text"
                            className="form-control border-start-0"
                            placeholder="Buscar por nome ou tipo..."
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
                                <th>Tipo de Coleta</th>
                                <th>Dias</th>
                                <th>Horário</th>
                                <th className="text-end pe-4">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRoutes.map(route => (
                                <tr key={route.id}>
                                    <td className="ps-4 fw-bold">{route.name}</td>
                                    <td><span className="badge bg-info">{route.collectionType}</span></td>
                                    <td>{route.collectionDays.map(day => daysMap[day] || day).join(', ')}</td>
                                    <td>{route.startTime} - {route.endTime}</td>
                                    <td className="text-end pe-4">
                                        <div className="d-flex justify-content-end gap-2">
                                            <Link 
                                                to={`/admin/routes/${route.id}/edit`} 
                                                className="btn btn-sm btn-outline-primary btn-circle-sm rounded-circle d-flex align-items-center justify-content-center"
                                                title="Editar"
                                            >
                                                <FaEdit />
                                            </Link>
                                            <button 
                                                onClick={() => setDeleteModal({ isOpen: true, id: route.id })} 
                                                className="btn btn-sm btn-outline-danger btn-circle-sm rounded-circle d-flex align-items-center justify-content-center"
                                                title="Excluir"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredRoutes.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-5 text-muted">
                                        Nenhuma rota encontrada.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ConfirmModal 
                isOpen={deleteModal.isOpen}
                title="Excluir Rota"
                message="Tem certeza que deseja excluir esta rota? Esta ação não pode ser desfeita."
                onConfirm={handleDeleteConfirmed}
                onCancel={() => setDeleteModal({ isOpen: false })}
            />
        </div>
    );
};

export default RoutesList;
