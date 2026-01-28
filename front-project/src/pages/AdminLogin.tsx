import React, { useState } from 'react';
import { FaLock, FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';

const AdminLogin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Login attempt:', { email, password });
        // Lógica de login será implementada posteriormente na integração com a API
    };

    return (
        <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
            <div className="card shadow-lg border-0 border-top border-success border-4 rounded-4" style={{ maxWidth: '400px', width: '100%' }}>
                <div className="card-body p-5">
                    <div className="text-center mb-4">
                        <div className="bg-dark text-success d-inline-block p-3 rounded-circle shadow-sm mb-3">
                            <FaLock size={30} />
                        </div>
                        <h2 className="fw-bold text-dark mb-1">Acesso Restrito</h2>
                        <p className="text-muted small">Portal do Servidor - Recicratiú</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label small fw-bold text-secondary text-uppercase">E-mail Corporativo</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light border-end-0">
                                    <FaEnvelope className="text-muted" />
                                </span>
                                <input 
                                    id="email"
                                    type="email" 
                                    className="form-control border-start-0" 
                                    placeholder="admin@exemplo.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="form-label small fw-bold text-secondary text-uppercase">Senha</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light border-end-0">
                                    <FaLock className="text-muted" />
                                </span>
                                <input 
                                    id="password"
                                    type={showPassword ? "text" : "password"} 
                                    className="form-control border-start-0 border-end-0" 
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button 
                                    type="button"
                                    className="input-group-text bg-white border-start-0 text-muted"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ cursor: 'pointer' }}
                                    aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-success w-100 py-3 fw-bold rounded-3 shadow-sm mb-3">
                            Entrar no Portal
                        </button>

                        <div className="text-center">
                            <a href="/" className="text-decoration-none small text-secondary">
                                Voltar para a Home
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
