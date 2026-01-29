import React, { useEffect, useState } from 'react';
import { reportService } from '../../services/reportService';
import type { ProblemReport } from '../../services/reportService';
import { neighborhoodService } from '../../services/neighborhoodService';
import type { Neighborhood } from '../../services/neighborhoodService';
import { subscriberService } from '../../services/subscriberService';
import type { Subscriber } from '../../services/subscriberService';
import { Link } from 'react-router-dom';
import { FaTrash, FaFilter, FaEye, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import ConfirmModal from '../../components/common/ConfirmModal';
import ReportDetailsModal from '../../components/common/ReportDetailsModal';
import JustificationModal from '../../components/common/JustificationModal';

const ReportsList: React.FC = () => {
    const [reports, setReports] = useState<ProblemReport[]>([]);
    const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>('');
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id?: number }>({ isOpen: false });
    const [detailsModal, setDetailsModal] = useState<{ isOpen: boolean; report: ProblemReport | null }>({ isOpen: false, report: null });
    const [justificationModal, setJustificationModal] = useState<{
        isOpen: boolean;
        pendingStatus?: ProblemReport['status'];
        pendingId?: number;
    }>({ isOpen: false });

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const [reportsData, neighborhoodsData, subscribersData] = await Promise.all([
                reportService.list(),
                neighborhoodService.list(),
                subscriberService.list()
            ]);
            setReports(reportsData);
            setNeighborhoods(neighborhoodsData);
            setSubscribers(subscribersData);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            toast.error('Não foi possível carregar a lista de relatos.');
        } finally {
            setLoading(false);
        }
    }

    async function handleStatusChange(id: number, newStatus: ProblemReport['status']) {
        if (newStatus === 'RESOLVED' || newStatus === 'REJECTED') {
            setJustificationModal({
                isOpen: true,
                pendingStatus: newStatus,
                pendingId: id
            });
            return;
        }

        await updateStatus(id, newStatus);
    }

    async function handleJustificationConfirm(justification: string) {
        if (justificationModal.pendingId && justificationModal.pendingStatus) {
            await updateStatus(justificationModal.pendingId, justificationModal.pendingStatus, justification);
            setJustificationModal({ isOpen: false });
        }
    }

    async function updateStatus(id: number, status: ProblemReport['status'], justification?: string) {
        try {
            await reportService.updateStatus(id, status, justification);
            await loadData();
            toast.success('Status atualizado com sucesso!');
        } catch (error: any) {
            console.error('Erro ao atualizar status:', error);
            const message = error.response?.data?.error || 'Erro ao atualizar status do relato.';
            toast.error(message);
        }
    }

    async function handleDeleteConfirmed() {
        if (!deleteModal.id) return;

        try {
            await reportService.delete(deleteModal.id);
            setReports(reports.filter(r => r.id !== deleteModal.id));
            toast.success('Relato excluído com sucesso!');
        } catch (error: any) {
            console.error('Erro ao excluir:', error);
            const message = error.response?.data?.error || 'Erro ao excluir relato.';
            toast.error(message);
        } finally {
            setDeleteModal({ isOpen: false });
        }
    }

    function getNeighborhoodName(subscriberId: number): string {
        const sub = subscribers.find(s => s.id === subscriberId);
        if (!sub) return 'Assinante não encontrado';
        
        return neighborhoods.find(n => n.id === sub.neighborhoodId)?.name || 'Bairro N/A';
    }

    function getSubscriberEmail(subscriberId: number): string {
        return subscribers.find(s => s.id === subscriberId)?.email || 'E-mail não encontrado';
    }

    const filteredReports = filterStatus
        ? reports.filter(r => r.status === filterStatus)
        : reports;

    if (loading) return <div className="text-center p-5"><div className="spinner-border text-success"></div></div>;

    return (
        <div className="container py-5">
            <div className="d-flex align-items-center gap-3 mb-4">
                <Link 
                    to="/admin/dashboard" 
                    className="btn btn-outline-success rounded-circle d-flex align-items-center justify-content-center p-0 shadow-sm" 
                    title="Voltar ao Dashboard"
                    style={{ width: '38px', height: '38px' }}
                >
                    <FaArrowLeft size={16} />
                </Link>
                <h2 className="fw-bold mb-0">Problemas Reportados</h2>
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="p-4 bg-light border-bottom">
                    <div className="row g-3">
                        <div className="col-md-4">
                            <div className="input-group mw-400">
                                <span className="input-group-text bg-white border-end-0"><FaFilter className="text-muted" /></span>
                                <select
                                    className="form-select border-start-0"
                                    value={filterStatus}
                                    onChange={e => setFilterStatus(e.target.value)}
                                >
                                    <option value="">Todos os status</option>
                                    <option value="PENDING">Pendente</option>
                                    <option value="IN_ANALYSIS">Em Análise</option>
                                    <option value="RESOLVED">Resolvido</option>
                                    <option value="REJECTED">Rejeitado</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover mb-0 align-middle">
                        <thead className="bg-light">
                            <tr>
                                <th className="ps-4">Protocolo</th>
                                <th>Descrição Preview</th>
                                <th>Bairro</th>
                                <th>Data</th>
                                <th>Status</th>
                                <th className="text-end pe-4">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReports.map(report => (
                                <tr key={report.id}>
                                    <td className="ps-4">
                                        <span className="fw-bold text-success">{report.protocol}</span>
                                    </td>
                                    <td className="mw-300">
                                        <div className="text-truncate" title={report.description}>
                                            {report.description}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge bg-secondary-subtle text-secondary border px-2 py-1">
                                            {getNeighborhoodName(report.subscriberId)}
                                        </span>
                                    </td>
                                    <td><small className="text-muted">{new Date(report.createdAt).toLocaleDateString('pt-BR')}</small></td>
                                    <td>
                                        <select
                                            className="form-select form-select-sm w-auto"
                                            value={report.status}
                                            onChange={e => handleStatusChange(report.id, e.target.value as ProblemReport['status'])}
                                        >
                                            <option value="PENDING">Pendente</option>
                                            <option value="IN_ANALYSIS">Em Análise</option>
                                            <option value="RESOLVED">Resolvido</option>
                                            <option value="REJECTED">Rejeitado</option>
                                        </select>
                                    </td>
                                    <td className="text-end pe-4">
                                        <div className="d-flex justify-content-end gap-2">
                                            <button 
                                                onClick={() => setDetailsModal({ isOpen: true, report })} 
                                                className="btn btn-sm btn-outline-success btn-circle-sm rounded-circle d-flex align-items-center justify-content-center"
                                                title="Visualizar Detalhes"
                                            >
                                                <FaEye />
                                            </button>
                                            <button 
                                                onClick={() => setDeleteModal({ isOpen: true, id: report.id })} 
                                                className="btn btn-sm btn-outline-danger btn-circle-sm rounded-circle d-flex align-items-center justify-content-center"
                                                title="Excluir"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredReports.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center py-5 text-muted">
                                        Nenhum relato encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <JustificationModal
                isOpen={justificationModal.isOpen}
                title={`Justificar ${justificationModal.pendingStatus === 'RESOLVED' ? 'Resolução' : 'Rejeição'}`}
                message={`Por favor, forneça uma justificativa para marcar este relato como "${justificationModal.pendingStatus === 'RESOLVED' ? 'Resolvido' : 'Rejeitado'}":`}
                onConfirm={handleJustificationConfirm}
                onCancel={() => setJustificationModal({ isOpen: false })}
                confirmText="Salvar Status"
            />
            
            <ReportDetailsModal 
                isOpen={detailsModal.isOpen} 
                report={detailsModal.report}
                neighborhoodName={detailsModal.report ? getNeighborhoodName(detailsModal.report.subscriberId) : ''}
                subscriberEmail={detailsModal.report ? getSubscriberEmail(detailsModal.report.subscriberId) : ''}
                onClose={() => setDetailsModal({ isOpen: false, report: null })}
            />

            <ConfirmModal 
                isOpen={deleteModal.isOpen}
                title="Excluir Relato"
                message="Tem certeza que deseja excluir este relato? Esta ação não pode ser desfeita."
                onConfirm={handleDeleteConfirmed}
                onCancel={() => setDeleteModal({ isOpen: false })}
            />
        </div>
    );
};

export default ReportsList;
