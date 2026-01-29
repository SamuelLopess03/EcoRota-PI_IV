import React from 'react';
import { FaTimes, FaCalendarAlt, FaMapMarkerAlt, FaFileAlt, FaExclamationCircle, FaEnvelope } from 'react-icons/fa';
import type { ProblemReport } from '../../services/reportService';

interface ReportDetailsModalProps {
    isOpen: boolean;
    report: ProblemReport | null;
    neighborhoodName: string;
    subscriberEmail: string;
    onClose: () => void;
}

const ReportDetailsModal: React.FC<ReportDetailsModalProps> = ({ isOpen, report, neighborhoodName, subscriberEmail, onClose }) => {
    if (!isOpen || !report) return null;

    return (
        <div className="modal-entrance-wrapper">
            <div className="modal-dialog modal-lg w-100 mw-800">
                <div className="modal-content modal-entrance-content br-24 overflow-hidden border-0 shadow-lg">
                    <div className="bg-success text-white p-4 text-center position-relative btn-green-gradient">
                        <button 
                            onClick={onClose}
                            className="btn border-0 p-2 position-absolute top-0 end-0 mt-2 me-2 text-white hover-opacity"
                        >
                            <FaTimes size={20} />
                        </button>
                        <div className="mb-2 bg-white bg-opacity-25 rounded-circle d-inline-flex p-3">
                            <FaFileAlt size={30} />
                        </div>
                        <h4 className="fw-bold mb-0">Detalhes do Relato</h4>
                        <p className="small opacity-75 mb-0 mt-1">Protocolo: <span className="fw-bold">{report.protocol}</span></p>
                    </div>

                    <div className="p-4 bg-white overflow-auto" style={{ maxHeight: '70vh' }}>
                        <div className="row g-4">
                            <div className="col-md-6">
                                <div className="mb-4">
                                    <label className="form-label small fw-bold text-muted text-uppercase letter-spacing-1">
                                        <FaExclamationCircle className="me-2" /> Tipo de Problema
                                    </label>
                                    <div className="fw-bold text-dark fs-5">{report.problemType}</div>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label small fw-bold text-muted text-uppercase letter-spacing-1">
                                        <FaMapMarkerAlt className="me-2" /> Bairro
                                    </label>
                                    <div>
                                        <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 br-12">
                                            {neighborhoodName}
                                        </span>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label small fw-bold text-muted text-uppercase letter-spacing-1">
                                        <FaEnvelope className="me-2" /> E-mail do Assinante
                                    </label>
                                    <div className="text-dark fw-medium">{subscriberEmail}</div>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="mb-4">
                                    <label className="form-label small fw-bold text-muted text-uppercase letter-spacing-1">
                                        <FaCalendarAlt className="me-2" /> Data do Relato
                                    </label>
                                    <div className="text-dark">
                                        {new Date(report.createdAt).toLocaleString('pt-BR')}
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label small fw-bold text-muted text-uppercase letter-spacing-1">
                                        Status Atual
                                    </label>
                                    <div>
                                        {report.status === 'PENDING' && <span className="badge bg-warning text-dark px-3 py-2 br-12">Pendente</span>}
                                        {report.status === 'IN_ANALYSIS' && <span className="badge bg-info text-dark px-3 py-2 br-12">Em Análise</span>}
                                        {report.status === 'RESOLVED' && <span className="badge bg-success text-white px-3 py-2 br-12">Resolvido</span>}
                                        {report.status === 'REJECTED' && <span className="badge bg-danger text-white px-3 py-2 br-12">Rejeitado</span>}
                                    </div>
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="p-3 bg-light br-14 border">
                                    <label className="form-label small fw-bold text-muted text-uppercase letter-spacing-1 mb-2 d-block text-center border-bottom pb-2">
                                        Descrição Detalhada
                                    </label>
                                    <p className="mb-0 text-dark lh-lg" style={{ whiteSpace: 'pre-wrap' }}>
                                        {report.description}
                                    </p>
                                </div>
                            </div>

                            {report.justification && (
                                <div className="col-12">
                                    <div className="p-3 bg-warning-subtle br-14 border border-warning">
                                        <label className="form-label small fw-bold text-dark text-uppercase letter-spacing-1 mb-2 d-block text-center border-bottom border-warning pb-2">
                                            Justificativa da Resolução
                                        </label>
                                        <p className="mb-0 text-dark lh-lg" style={{ whiteSpace: 'pre-wrap' }}>
                                            {report.justification}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {report.attachments && report.attachments.length > 0 && (
                                <div className="col-12 mt-4">
                                    <label className="form-label small fw-bold text-muted text-uppercase letter-spacing-1 mb-3">
                                        Evidências ({report.attachments.length})
                                    </label>
                                    <div className="row g-2">
                                        {report.attachments.map((url, index) => (
                                            <div key={index} className="col-4">
                                                <a href={url} target="_blank" rel="noopener noreferrer" className="d-block hover-grow">
                                                    <img 
                                                        src={url} 
                                                        alt={`Evidence ${index + 1}`} 
                                                        className="w-100 rounded shadow-sm border" 
                                                        style={{ height: '150px', objectFit: 'cover' }}
                                                    />
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="form-text small mt-2">Clique na imagem para abrir em tamanho real.</div>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="p-3 bg-light text-center border-top">
                        <button onClick={onClose} className="btn btn-secondary px-5 br-12">Fechar</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportDetailsModal;
