import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { subscriberService } from '../../services/subscriberService';
import { neighborhoodService } from '../../services/neighborhoodService';
import type { Neighborhood } from '../../services/neighborhoodService';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const SubscriberForm: React.FC = () => {
    const navigate = useNavigate();
    const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);

    const [form, setForm] = useState({
        email: '',
        street: '',
        number: '',
        complement: '',
        neighborhoodId: ''
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadNeighborhoods();
    }, []);

    async function loadNeighborhoods() {
        try {
            const data = await neighborhoodService.list();
            setNeighborhoods(data);
        } catch (error) {
            console.error('Erro ao carregar bairros:', error);
            toast.error('Não foi possível carregar a lista de bairros.');
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const payload = {
            email: form.email,
            street: form.street,
            number: form.number,
            complement: form.complement || undefined,
            neighborhoodId: Number(form.neighborhoodId)
        };

        try {
            await subscriberService.register(payload);
            toast.success('Assinante cadastrado com sucesso!');
            navigate('/admin/subscribers');
        } catch (error) {
            console.error('Erro ao salvar:', error);
            toast.error('Erro ao cadastrar assinante. Verifique os dados.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="d-flex align-items-center gap-3 mb-4">
                        <Link 
                            to="/admin/subscribers" 
                            className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center p-0 shadow-sm"
                            style={{ width: '38px', height: '38px' }}
                        >
                            <FaArrowLeft size={16} />
                        </Link>
                        <h2 className="fw-bold mb-0">Novo Assinante</h2>
                    </div>

                    <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                        <div className="card-body p-5">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">E-mail</label>
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        required 
                                        value={form.email}
                                        onChange={e => setForm({...form, email: e.target.value})}
                                        placeholder="cidadao@exemplo.com"
                                    />
                                </div>

                                <div className="row">
                                    <div className="col-md-8 mb-3">
                                        <label className="form-label fw-bold">Rua / Logradouro</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            required 
                                            value={form.street}
                                            onChange={e => setForm({...form, street: e.target.value})}
                                        />
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className="form-label fw-bold">Número</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            required 
                                            value={form.number}
                                            onChange={e => setForm({...form, number: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Complemento (Opcional)</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={form.complement}
                                        onChange={e => setForm({...form, complement: e.target.value})}
                                        placeholder="Ex: Apto 101, Próximo à praça"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-bold">Bairro</label>
                                    <select 
                                        className="form-select" 
                                        required
                                        value={form.neighborhoodId}
                                        onChange={e => setForm({...form, neighborhoodId: e.target.value})}
                                    >
                                        <option value="">Selecione um bairro...</option>
                                        {neighborhoods.map(n => (
                                            <option key={n.id} value={n.id}>{n.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="d-grid">
                                    <button type="submit" className="btn btn-success py-3 fw-bold rounded-3" disabled={loading}>
                                        <FaSave className="me-2" />
                                        {loading ? 'Salvando...' : 'Cadastrar Assinante'}
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

export default SubscriberForm;
