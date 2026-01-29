import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ecopointService } from '../../services/ecopointService';
import { neighborhoodService } from '../../services/neighborhoodService';
import type { Neighborhood } from '../../services/neighborhoodService';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const EcopointForm: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditing = !!id;

    const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
    const [form, setForm] = useState({
        name: '',
        partnerName: '',
        materials: [] as string[],
        latitude: '',
        longitude: '',
        collectionDays: [] as string[],
        startTime: '',
        endTime: '',
        neighborhoodId: ''
    });

    const [loading, setLoading] = useState(false);
    const [fetchingNeighborhoods, setFetchingNeighborhoods] = useState(true);

    const materialMap: { [key: string]: string } = {
        'glass': 'Vidro',
        'plastic': 'Plástico',
        'paper': 'Papel',
        'metal': 'Metal',
        'batteries': 'Pilhas/Baterias',
        'organic': 'Orgânico',
        'electronics': 'Eletrônicos',
    };

    const materialTypes = Object.keys(materialMap);

    const daysMap: { [key: string]: string } = {
        'monday': 'Segunda-feira',
        'tuesday': 'Terça-feira',
        'wednesday': 'Quarta-feira',
        'thursday': 'Quinta-feira',
        'friday': 'Sexta-feira',
        'saturday': 'Sábado',
        'sunday': 'Domingo'
    };

    const daysOfWeek = Object.keys(daysMap);

    useEffect(() => {
        loadNeighborhoods();
        if (isEditing) {
            loadEcopoint();
        }
    }, [id]);

    async function loadNeighborhoods() {
        try {
            const data = await neighborhoodService.list();
            setNeighborhoods(data);
        } catch (error) {
            console.error('Erro ao carregar bairros:', error);
        } finally {
            setFetchingNeighborhoods(false);
        }
    }

    async function loadEcopoint() {
        try {
            const data = await ecopointService.findById(Number(id));
            setForm({
                name: data.name,
                partnerName: data.partnerName || '',
                materials: data.materials,
                latitude: data.latitude.toString(),
                longitude: data.longitude.toString(),
                collectionDays: data.collectionDays,
                startTime: data.startTime,
                endTime: data.endTime,
                neighborhoodId: data.neighborhoodId.toString()
            });
        } catch (error) {
            console.error('Erro ao carregar ecoponto:', error);
            toast.error('Erro ao carregar dados do ecoponto.');
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const payload = {
            name: form.name,
            partnerName: form.partnerName || undefined,
            materials: form.materials,
            latitude: Number(form.latitude),
            longitude: Number(form.longitude),
            collectionDays: form.collectionDays,
            startTime: form.startTime,
            endTime: form.endTime,
            neighborhoodId: Number(form.neighborhoodId)
        };

        try {
            if (isEditing) {
                await ecopointService.update(Number(id), payload);
                toast.success('Ecoponto atualizado com sucesso!');
            } else {
                await ecopointService.create(payload);
                toast.success('Ecoponto criado com sucesso!');
            }
            navigate('/admin/ecopoints');
        } catch (error: any) {
            console.error('Erro ao salvar:', error);
            const message = error.response?.data?.error || 'Erro ao salvar ecoponto. Verifique os dados.';
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

    function handleMaterialToggle(material: string) {
        if (form.materials.includes(material)) {
            setForm({ ...form, materials: form.materials.filter(m => m !== material) });
        } else {
            setForm({ ...form, materials: [...form.materials, material] });
        }
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    <div className="d-flex align-items-center gap-3 mb-4">
                        <Link 
                            to="/admin/ecopoints" 
                            className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center p-0 shadow-sm"
                            style={{ width: '38px', height: '38px' }}
                        >
                            <FaArrowLeft size={16} />
                        </Link>
                        <h2 className="fw-bold mb-0">{isEditing ? 'Editar Ecoponto' : 'Novo Ecoponto'}</h2>
                    </div>

                    <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                        <div className="card-body p-5">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <h5 className="fw-bold border-bottom pb-2 mb-3">Informações Básicas</h5>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Nome do Ecoponto</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                required
                                                placeholder="Ex: Ecoponto Centro"
                                                value={form.name}
                                                onChange={e => setForm({ ...form, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Parceiro / Empresa (Opcional)</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Ex: Empresa de Reciclagem Silva"
                                                value={form.partnerName}
                                                onChange={e => setForm({ ...form, partnerName: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-bold">Materiais Aceitos</label>
                                    <div className="d-flex flex-wrap gap-3 p-3 bg-light rounded-3">
                                        {materialTypes.map(materialKey => (
                                            <div key={materialKey} className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id={`mat-${materialKey}`}
                                                    checked={form.materials.includes(materialKey)}
                                                    onChange={() => handleMaterialToggle(materialKey)}
                                                />
                                                <label className="form-check-label" htmlFor={`mat-${materialKey}`}>
                                                    {materialMap[materialKey]}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    {form.materials.length === 0 && (
                                        <div className="form-text text-danger mt-1">Selecione pelo menos um material.</div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-bold">Bairro Associado</label>
                                    <select
                                        className="form-select"
                                        required
                                        value={form.neighborhoodId}
                                        onChange={e => setForm({ ...form, neighborhoodId: e.target.value })}
                                        disabled={fetchingNeighborhoods}
                                    >
                                        <option value="">Selecione um bairro</option>
                                        {neighborhoods.map(n => (
                                            <option key={n.id} value={n.id}>{n.name}</option>
                                        ))}
                                    </select>
                                    {fetchingNeighborhoods && <div className="form-text text-muted small mt-1">Carregando bairros...</div>}
                                </div>

                                <div className="mb-4">
                                    <h5 className="fw-bold border-bottom pb-2 mb-3">Localização</h5>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Latitude</label>
                                            <input
                                                type="number"
                                                step="any"
                                                className="form-control"
                                                required
                                                value={form.latitude}
                                                onChange={e => setForm({ ...form, latitude: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Longitude</label>
                                            <input
                                                type="number"
                                                step="any"
                                                className="form-control"
                                                required
                                                value={form.longitude}
                                                onChange={e => setForm({ ...form, longitude: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h5 className="fw-bold border-bottom pb-2 mb-3">Horário de Funcionamento</h5>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Dias de Atendimento</label>
                                        <div className="d-flex flex-wrap gap-2 p-3 bg-light rounded-3">
                                            {daysOfWeek.map(dayKey => (
                                                <div key={dayKey} className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id={`eco-${dayKey}`}
                                                        checked={form.collectionDays.includes(dayKey)}
                                                        onChange={() => handleDayToggle(dayKey)}
                                                    />
                                                    <label className="form-check-label" htmlFor={`eco-${dayKey}`}>
                                                        {daysMap[dayKey]}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                        {form.collectionDays.length === 0 && (
                                            <div className="form-text text-danger mt-1">Selecione pelo menos um dia de funcionamento.</div>
                                        )}
                                    </div>

                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Horário de Abertura</label>
                                            <input
                                                type="time"
                                                className="form-control"
                                                required
                                                value={form.startTime}
                                                onChange={e => setForm({ ...form, startTime: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Horário de Fechamento</label>
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
                                        {loading ? 'Salvando...' : (isEditing ? 'Atualizar Ecoponto' : 'Criar Ecoponto')}
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

export default EcopointForm;
