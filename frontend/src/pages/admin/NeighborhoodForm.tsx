import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { neighborhoodService } from '../../services/neighborhoodService';
import { routeService, type Route } from '../../services/routeService';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const NeighborhoodForm: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [form, setForm] = useState({
        name: '',
        populationEstimate: '',
        postalCode: '',
        latitude: '',
        longitude: '',
        routeId: ''
    });

    const [routes, setRoutes] = useState<Route[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetchingRoutes, setFetchingRoutes] = useState(true);

    useEffect(() => {
        loadRoutes();
        if (isEditing) {
            loadNeighborhood();
        }
    }, [id]);

    async function loadRoutes() {
        try {
            const data = await routeService.list();
            setRoutes(data);
        } catch (error) {
            console.error('Erro ao carregar rotas:', error);
        } finally {
            setFetchingRoutes(false);
        }
    }

    async function loadNeighborhood() {
        try {
            const data = await neighborhoodService.findById(Number(id));
            setForm({
                name: data.name,
                populationEstimate: data.populationEstimate?.toString() || '',
                postalCode: formatCEP(data.postalCode),
                latitude: data.latitude.toString(),
                longitude: data.longitude.toString(),
                routeId: data.routeId.toString()
            });
        } catch (error) {
            console.error('Erro ao carregar bairro:', error);
            toast.error('Erro ao carregar dados do bairro.');
        }
    }

    function formatCEP(value: string) {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .replace(/(-\d{3})\d+?$/, '$1');
    }

    function handleCEPChange(e: React.ChangeEvent<HTMLInputElement>) {
        const formatted = formatCEP(e.target.value);
        setForm({ ...form, postalCode: formatted });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const payload = {
            name: form.name,
            populationEstimate: form.populationEstimate ? Number(form.populationEstimate) : null,
            postalCode: form.postalCode.replace(/\D/g, ''),
            latitude: Number(form.latitude),
            longitude: Number(form.longitude),
            routeId: Number(form.routeId)
        };

        try {
            if (isEditing) {
                await neighborhoodService.update(Number(id), payload);
                toast.success('Bairro atualizado com sucesso!');
            } else {
                await neighborhoodService.create(payload);
                toast.success('Bairro criado com sucesso!');
            }
            navigate('/admin/neighborhoods');
        } catch (error: any) {
            console.error('Erro ao salvar:', error);
            const message = error.response?.data?.error || 'Erro ao salvar os dados.';
            toast.error(message);
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
                            to="/admin/neighborhoods" 
                            className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center p-0 shadow-sm"
                            style={{ width: '38px', height: '38px' }}
                        >
                            <FaArrowLeft size={16} />
                        </Link>
                        <h2 className="fw-bold mb-0">{isEditing ? 'Editar Bairro' : 'Novo Bairro'}</h2>
                    </div>

                    <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                        <div className="card-body p-5">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Nome do Bairro</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        required 
                                        value={form.name}
                                        onChange={e => setForm({...form, name: e.target.value})}
                                    />
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold">CEP</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            required 
                                            value={form.postalCode}
                                            onChange={handleCEPChange}
                                            maxLength={9}
                                            placeholder="XXXXX-XXX"
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold">População Estimada</label>
                                        <input 
                                            type="number" 
                                            className="form-control" 
                                            value={form.populationEstimate}
                                            onChange={e => setForm({...form, populationEstimate: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold">Latitude</label>
                                        <input 
                                            type="number" 
                                            step="any"
                                            className="form-control" 
                                            required 
                                            value={form.latitude}
                                            onChange={e => setForm({...form, latitude: e.target.value})}
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold">Longitude</label>
                                        <input 
                                            type="number" 
                                            step="any"
                                            className="form-control" 
                                            required 
                                            value={form.longitude}
                                            onChange={e => setForm({...form, longitude: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-bold">Rota de Coleta</label>
                                    <select 
                                        className="form-select" 
                                        required 
                                        value={form.routeId}
                                        onChange={e => setForm({...form, routeId: e.target.value})}
                                        disabled={fetchingRoutes}
                                    >
                                        <option value="">Selecione uma rota</option>
                                        {routes.map(route => (
                                            <option key={route.id} value={route.id}>
                                                {route.name} ({route.collectionType})
                                            </option>
                                        ))}
                                    </select>
                                    {fetchingRoutes && <div className="form-text text-muted small mt-1">Carregando rotas...</div>}
                                </div>

                                <div className="d-grid">
                                    <button type="submit" className="btn btn-success py-3 fw-bold rounded-3" disabled={loading}>
                                        <FaSave className="me-2" />
                                        {loading ? 'Salvando...' : 'Salvar Bairro'}
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

export default NeighborhoodForm;
