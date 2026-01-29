import React, { useEffect, useState } from 'react';
import { ecopointService } from '../../services/ecopointService';
import type { Ecopoint } from '../../services/ecopointService';
import { neighborhoodService } from '../../services/neighborhoodService';
import type { Neighborhood } from '../../services/neighborhoodService';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaFilter, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import ConfirmModal from '../../components/common/ConfirmModal';

const EcopointsList: React.FC = () => {
    const [ecopoints, setEcopoints] = useState<Ecopoint[]>([]);
    const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterNeighborhood, setFilterNeighborhood] = useState<number | undefined>();
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id?: number }>({ isOpen: false });

    const materialLabels: Record<string, string> = {
        glass: 'Vidro',
        plastic: 'Plástico',
        paper: 'Papel',
        metal: 'Metal',
        batteries: 'Pilhas/Baterias',
        organic: 'Orgânico',
        electronics: 'Eletrônicos',
    };

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const [ecopointsData, neighborhoodsData] = await Promise.all([
                ecopointService.list(),
                neighborhoodService.list()
            ]);
            setEcopoints(ecopointsData);
            setNeighborhoods(neighborhoodsData);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            toast.error('Não foi possível carregar a lista de ecopontos.');
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteConfirmed() {
        if (!deleteModal.id) return;

        try {
            await ecopointService.delete(deleteModal.id);
            setEcopoints(ecopoints.filter(e => e.id !== deleteModal.id));
            toast.success('Ecoponto excluído com sucesso!');
        } catch (error: any) {
            console.error('Erro ao excluir:', error);
            const message = error.response?.data?.error || 'Erro ao excluir ecoponto.';
            toast.error(message);
        } finally {
            setDeleteModal({ isOpen: false });
        }
    }

    const filteredEcopoints = ecopoints.filter(e => {
        const matchesSearch = 
            e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (e.partnerName && e.partnerName.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesNeighborhood = !filterNeighborhood || e.neighborhoodId === filterNeighborhood;
        return matchesSearch && matchesNeighborhood;
    });

    function getNeighborhoodName(id: number): string {
        return neighborhoods.find(n => n.id === id)?.name || 'N/A';
    }

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
                    <h2 className="fw-bold mb-0">Gestão de Ecopontos</h2>
                </div>
                <Link to="/admin/ecopoints/new" className="btn btn-success d-flex align-items-center gap-2 rounded-pill px-4">
                    <FaPlus /> Novo Ecoponto
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
                                    placeholder="Buscar por nome ou parceiro..."
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
                                    value={filterNeighborhood || ''}
                                    onChange={e => setFilterNeighborhood(e.target.value ? Number(e.target.value) : undefined)}
                                >
                                    <option value="">Todos os bairros</option>
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
                                <th className="ps-4">Nome do Ecoponto</th>
                                <th>Parceiro / Empresa</th>
                                <th>Bairro</th>
                                <th>Materiais</th>
                                <th className="text-end pe-4">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEcopoints.map(ecopoint => (
                                <tr key={ecopoint.id}>
                                    <td className="ps-4 fw-bold">{ecopoint.name}</td>
                                    <td>{ecopoint.partnerName || <span className="text-muted small">Sem parceiro</span>}</td>
                                    <td><span className="badge bg-secondary">{getNeighborhoodName(ecopoint.neighborhoodId)}</span></td>
                                    <td>
                                        <small className="text-muted">
                                            {ecopoint.materials.slice(0, 2).map(m => materialLabels[m] || m).join(', ')}
                                            {ecopoint.materials.length > 2 && ` +${ecopoint.materials.length - 2}`}
                                        </small>
                                    </td>
                                    <td className="text-end pe-4">
                                        <div className="d-flex justify-content-end gap-2">
                                            <Link 
                                                to={`/admin/ecopoints/${ecopoint.id}/edit`} 
                                                className="btn btn-sm btn-outline-primary btn-circle-sm rounded-circle d-flex align-items-center justify-content-center"
                                                title="Editar"
                                            >
                                                <FaEdit />
                                            </Link>
                                            <button 
                                                onClick={() => setDeleteModal({ isOpen: true, id: ecopoint.id })} 
                                                className="btn btn-sm btn-outline-danger btn-circle-sm rounded-circle d-flex align-items-center justify-content-center"
                                                title="Excluir"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredEcopoints.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-5 text-muted">
                                        Nenhum ecoponto encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ConfirmModal 
                isOpen={deleteModal.isOpen}
                title="Excluir Ecoponto"
                message="Tem certeza que deseja excluir este ecoponto? Esta ação não pode ser desfeita."
                onConfirm={handleDeleteConfirmed}
                onCancel={() => setDeleteModal({ isOpen: false })}
            />
        </div>
    );
};

export default EcopointsList;
