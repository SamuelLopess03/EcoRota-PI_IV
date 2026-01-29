import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { routeService } from '../../services/routeService';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const RouteForm: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditing = !!id;

    const [form, setForm] = useState({
        name: '',
        collectionType: '',
        collectionDays: [] as string[],
        startTime: '',
        endTime: ''
    });

    const [loading, setLoading] = useState(false);

    const daysMap: { [key: string]: string } = {
        'monday': 'Segunda-feira',
        'tuesday': 'Terça-feira',
        'wednesday': 'Quarta-feira',
        'thursday': 'Quinta-feira',
        'friday': 'Sexta-feira',
        'saturday': 'Sábado',
        'sunday': 'Domingo'
    };

    const daysOfWeeks = Object.keys(daysMap);

    const collectionTypes = [
        "Coleta regular",
        "Coleta seletiva",
        "Coleta especial",
        "Coleta agendada"
    ];

    useEffect(() => {
        if (isEditing) {
            loadRoute();
        }
    }, [id]);

    async function loadRoute() {
        try {
            const data = await routeService.findById(Number(id));
            setForm({
                name: data.name,
                collectionType: data.collectionType,
                collectionDays: data.collectionDays,
                startTime: data.startTime,
                endTime: data.endTime
            });
        } catch (error) {
            console.error('Erro ao carregar rota:', error);
            toast.error('Erro ao carregar dados da rota.');
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (form.collectionDays.length === 0) {
            toast.error('Selecione pelo menos um dia de coleta.');
            return;
        }

        setLoading(true);

        const payload = {
            name: form.name,
            collectionType: form.collectionType,
            collectionDays: form.collectionDays,
            startTime: form.startTime,
            endTime: form.endTime
        };

        try {
            if (isEditing) {
                await routeService.update(Number(id), payload);
                toast.success('Rota atualizada com sucesso!');
            } else {
                await routeService.create(payload);
                toast.success('Rota criada com sucesso!');
            }
            navigate('/admin/routes');
        } catch (error: any) {
            console.error('Erro ao salvar:', error);
            const message = error.response?.data?.error || 'Erro ao salvar rota. Verifique os dados.';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }

    function handleDayToggle(day: string) {
        if (form.collectionDays.includes(day)) {
            setForm({ ...form, collectionDays: form.collectionDays.filter(d => d !== day) });
        } else {
            setForm({ ...form, collectionDays: [...form.collectionDays, day] });
        }
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="d-flex align-items-center gap-3 mb-4">
                        <Link 
                            to="/admin/routes" 
                            className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center p-0 shadow-sm"
                            style={{ width: '38px', height: '38px' }}
                        >
                            <FaArrowLeft size={16} />
                        </Link>
                        <h2 className="fw-bold mb-0">{isEditing ? 'Editar Rota' : 'Nova Rota'}</h2>
                    </div>

                    <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                        <div className="card-body p-5">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <h5 className="fw-bold border-bottom pb-2 mb-3">Informações Básicas</h5>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Nome da Rota</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            required
                                            value={form.name}
                                            onChange={e => setForm({ ...form, name: e.target.value })}
                                            placeholder="Ex: Rota do Bairro Centro"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Tipo de Coleta</label>
                                        <select
                                            className="form-select"
                                            required
                                            value={form.collectionType}
                                            onChange={e => setForm({ ...form, collectionType: e.target.value })}
                                        >
                                            <option value="">Selecione o tipo de coleta</option>
                                            {collectionTypes.map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h5 className="fw-bold border-bottom pb-2 mb-3">Horário de Coleta</h5>
                                    
                                    <div className="mb-4">
                                        <label className="form-label fw-bold">Dias de Coleta</label>
                                        <div className="d-flex flex-wrap gap-2 p-3 bg-light rounded-3">
                                            {daysOfWeeks.map(day => (
                                                <div key={day} className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id={day}
                                                        checked={form.collectionDays.includes(day)}
                                                        onChange={() => handleDayToggle(day)}
                                                    />
                                                    <label className="form-check-label" htmlFor={day}>
                                                        {daysMap[day]}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                        {form.collectionDays.length === 0 && (
                                            <div className="form-text text-danger mt-1">Selecione pelo menos um dia de coleta.</div>
                                        )}
                                    </div>

                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Horário de Início</label>
                                            <input
                                                type="time"
                                                className="form-control"
                                                required
                                                value={form.startTime}
                                                onChange={e => setForm({ ...form, startTime: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Horário de Término</label>
                                            <input
                                                type="time"
                                                className="form-control"
                                                required
                                                value={form.endTime}
                                                onChange={e => setForm({ ...form, endTime: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="d-grid mt-5">
                                    <button type="submit" className="btn btn-success py-3 fw-bold rounded-3 shadow-sm hover-grow" disabled={loading}>
                                        <FaSave className="me-2" />
                                        {loading ? 'Salvando...' : (isEditing ? 'Atualizar Rota' : 'Criar Rota')}
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

export default RouteForm;
