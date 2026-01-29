import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminService } from '../../services/adminService';
import { toast } from 'react-hot-toast';
import { FaUser, FaEnvelope, FaLock, FaTrash, FaSave, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import ConfirmModal from '../../components/common/ConfirmModal';

const Profile: React.FC = () => {
    const { administrator, updateAdministrator, signOut } = useAuth();
    

    const [name, setName] = useState(administrator?.name || '');
    const [email, setEmail] = useState(administrator?.email || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleUpdate(e: React.FormEvent) {
        e.preventDefault();

        if (!administrator) return;

        if (password && password !== confirmPassword) {
            toast.error('As senhas não coincidem!');
            return;
        }

        try {
            setLoading(true);
            const updated = await adminService.update(administrator.id, {
                name,
                email,
                ...(password ? { password } : {})
            });

            updateAdministrator({
                id: updated.id.toString(),
                name: updated.name,
                email: updated.email
            });

            toast.success('Perfil atualizado com sucesso!');
            setPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            console.error('Erro ao atualizar perfil:', error);
            const errorMessage = error.response?.data?.error || 'Erro ao atualizar perfil.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteAccount() {
        if (!administrator) return;

        try {
            await adminService.delete(administrator.id);
            toast.success('Sua conta foi removida com sucesso.');
            signOut();
        } catch (error: any) {
            console.error('Erro ao remover conta:', error);
            const errorMessage = error.response?.data?.error || 'Erro ao remover sua conta.';
            toast.error(errorMessage);
        }
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="d-flex align-items-center gap-3 mb-4">
                        <Link 
                            to="/admin/dashboard" 
                            className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center p-0 shadow-sm"
                            style={{ width: '38px', height: '38px' }}
                        >
                            <FaArrowLeft size={16} />
                        </Link>
                        <h2 className="mb-0 fs-4 fw-bold text-secondary">Voltar ao Dashboard</h2>
                    </div>

                    <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                        <div className="bg-primary text-white p-4 text-center">
                            <div className="bg-white bg-opacity-25 rounded-circle d-inline-flex p-3 mb-3">
                                <FaUser size={40} />
                            </div>
                            <h2 className="fw-bold mb-0">Meu Perfil</h2>
                            <p className="small opacity-75 mb-0">Gerencie suas informações de acesso</p>
                        </div>

                        <div className="card-body p-4 p-lg-5">
                            <form onSubmit={handleUpdate}>
                                <div className="mb-4">
                                    <label className="form-label small fw-bold text-muted text-uppercase">Nome Completo</label>
                                    <div className="input-group shadow-sm">
                                        <span className="input-group-text bg-white border-end-0"><FaUser /></span>
                                        <input 
                                            type="text" 
                                            className="form-control border-start-0" 
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            required 
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label small fw-bold text-muted text-uppercase">E-mail</label>
                                    <div className="input-group shadow-sm">
                                        <span className="input-group-text bg-white border-end-0"><FaEnvelope /></span>
                                        <input 
                                            type="email" 
                                            className="form-control border-start-0" 
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            required 
                                        />
                                    </div>
                                </div>

                                <hr className="my-4 opacity-10" />
                                <p className="small text-muted mb-4">Deixe as senhas em branco se não desejar alterá-las.</p>

                                <div className="row g-3">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label small fw-bold text-muted text-uppercase">Nova Senha</label>
                                        <div className="input-group shadow-sm">
                                            <span className="input-group-text bg-white border-end-0"><FaLock /></span>
                                            <input 
                                                type="password" 
                                                className="form-control border-start-0" 
                                                value={password}
                                                onChange={e => setPassword(e.target.value)}
                                                placeholder="••••••"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label small fw-bold text-muted text-uppercase">Confirmar Senha</label>
                                        <div className="input-group shadow-sm">
                                            <span className="input-group-text bg-white border-end-0"><FaLock /></span>
                                            <input 
                                                type="password" 
                                                className="form-control border-start-0" 
                                                value={confirmPassword}
                                                onChange={e => setConfirmPassword(e.target.value)}
                                                placeholder="••••••"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="d-grid gap-3 mt-4">
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary btn-lg py-3 br-12 fw-bold d-flex align-items-center justify-content-center gap-2 shadow"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <span className="spinner-border spinner-border-sm"></span>
                                        ) : (
                                            <FaSave />
                                        )}
                                        Salvar Alterações
                                    </button>

                                    <button 
                                        type="button" 
                                        className="btn btn-outline-danger btn-sm border-0 mt-3 d-flex align-items-center justify-content-center gap-2"
                                        onClick={() => setIsDeleting(true)}
                                    >
                                        <FaTrash size={12} /> Excluir minha conta permanentemente
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmModal 
                isOpen={isDeleting}
                title="Excluir Conta?"
                message="Esta ação é irreversível. Todos os seus dados de acesso serão removidos do sistema."
                confirmText="Sim, Excluir"
                type="danger"
                onConfirm={handleDeleteAccount}
                onCancel={() => setIsDeleting(false)}
            />
        </div>
    );
};

export default Profile;
