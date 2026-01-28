import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { FaSave, FaArrowLeft, FaUserShield } from 'react-icons/fa';

const AdminForm: React.FC = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            alert('As senhas não coincidem!');
            return;
        }

        setLoading(true);

        try {
            await authService.register({
                name: form.name,
                email: form.email,
                password: form.password
            });
            alert('Administrador cadastrado com sucesso!');
            navigate('/admin/users');
        } catch (error) {
            console.error('Erro ao cadastrar:', error);
            alert('Erro ao cadastrar administrador. Verifique se o email já está em uso.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-6">
                    <div className="d-flex align-items-center gap-3 mb-4">
                        <Link to="/admin/users" className="btn btn-outline-secondary rounded-circle p-2">
                            <FaArrowLeft />
                        </Link>
                        <h2 className="fw-bold mb-0">Novo Administrador</h2>
                    </div>

                    <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                        <div className="card-body p-5">
                            <div className="text-center mb-4">
                                <div className="bg-dark text-success d-inline-block p-3 rounded-circle shadow-sm">
                                    <FaUserShield size={32} />
                                </div>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Nome Completo</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        required 
                                        value={form.name}
                                        onChange={e => setForm({...form, name: e.target.value})}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">E-mail Corporativo</label>
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        required 
                                        value={form.email}
                                        onChange={e => setForm({...form, email: e.target.value})}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Senha de Acesso</label>
                                    <input 
                                        type="password" 
                                        className="form-control" 
                                        required 
                                        minLength={6}
                                        value={form.password}
                                        onChange={e => setForm({...form, password: e.target.value})}
                                    />
                                    <small className="text-muted">Mínimo de 6 caracteres</small>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-bold">Confirmar Senha</label>
                                    <input 
                                        type="password" 
                                        className="form-control" 
                                        required 
                                        value={form.confirmPassword}
                                        onChange={e => setForm({...form, confirmPassword: e.target.value})}
                                    />
                                </div>

                                <div className="d-grid">
                                    <button type="submit" className="btn btn-dark py-3 fw-bold rounded-3" disabled={loading}>
                                        <FaSave className="me-2" />
                                        {loading ? 'Cadastrando...' : 'Cadastrar Admin'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminForm;
