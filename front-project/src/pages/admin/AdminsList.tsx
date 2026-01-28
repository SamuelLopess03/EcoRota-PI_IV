import React, { useEffect, useState } from 'react';
import { authService } from '../../services/authService';
import { FaUserShield, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';

interface AdminUser {
    id: string;
    name: string;
    email: string;
}

const AdminsList: React.FC = () => {
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAdmins();
    }, []);

    async function loadAdmins() {
        try {
            const data = await authService.list();
            setAdmins(data as unknown as AdminUser[]);
        } catch (error) {
            console.error('Erro ao carregar administradores:', error);
            alert('Não foi possível carregar a lista de administradores.');
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <div className="text-center p-5"><div className="spinner-border text-success"></div></div>;

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold">Administradores do Sistema</h2>
                <Link to="/admin/users/new" className="btn btn-success d-flex align-items-center gap-2 rounded-pill px-4">
                    <FaPlus /> Novo Admin
                </Link>
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
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
                            {admins.map(admin => (
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
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminsList;
