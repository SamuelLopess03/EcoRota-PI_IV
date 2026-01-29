import React, { useEffect, useState } from 'react';
import { authService } from '../../services/authService';
import { FaUserShield, FaPlus, FaSearch, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

interface AdminUser {
    id: string;
    name: string;
    email: string;
}

const AdminsList: React.FC = () => {
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadAdmins();
    }, []);

    async function loadAdmins() {
        try {
            const data = await authService.list();
            setAdmins(data as unknown as AdminUser[]);
        } catch (error) {
            console.error('Erro ao carregar administradores:', error);
            toast.error('Não foi possível carregar a lista de administradores.');
        } finally {
            setLoading(false);
        }
    }

    const filteredAdmins = admins.filter(admin =>
        admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchTerm.toLowerCase())
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
                    <h2 className="fw-bold mb-0">Administradores do Sistema</h2>
                </div>
                <Link to="/admin/users/new" className="btn btn-success d-flex align-items-center gap-2 rounded-pill px-4">
                    <FaPlus /> Novo Admin
                </Link>
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="p-4 bg-light border-bottom">
                    <div className="input-group mw-400">
                        <span className="input-group-text bg-white border-end-0"><FaSearch className="text-muted" /></span>
                        <input
                            type="text"
                            className="form-control border-start-0"
                            placeholder="Buscar por nome ou email..."
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
                                <th>Email</th>
                                <th className="text-end pe-4">Permissão</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAdmins.map(admin => (
                                <tr key={admin.id}>
                                    <td className="ps-4 fw-bold">{admin.name}</td>
                                    <td>{admin.email}</td>
                                    <td className="text-end pe-4">
                                        <span className="badge bg-dark d-inline-flex align-items-center gap-1">
                                            <FaUserShield /> Acesso Total
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {filteredAdmins.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="text-center py-5 text-muted">
                                        Nenhum administrador encontrado.
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

export default AdminsList;
