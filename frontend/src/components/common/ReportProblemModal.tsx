import React, { useState } from 'react';
import { reportService } from '../../services/reportService';
import { toast } from 'react-hot-toast';
import { FaExclamationTriangle, FaTimes, FaCommentAlt, FaList, FaCamera, FaImage } from 'react-icons/fa';

interface ReportProblemModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ReportProblemModal: React.FC<ReportProblemModalProps> = ({ isOpen, onClose }) => {
    const [form, setForm] = useState({
        problemType: '',
        description: '',
    });
    const [attachments, setAttachments] = useState<{ file: File, preview: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const problemTypes = [
        "Coleta não realizada",
        "Lixeira danificada",
        "Lixo espalhado",
        "Outros"
    ];
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        if (attachments.length + files.length > 3) {
            toast.error('Gostaria de lembrar que o limite é de 3 imagens por relato.', { 
                icon: <FaExclamationTriangle className="text-warning" /> 
            });
            return;
        }

        Array.from(files).forEach(file => {
            if (file.size > 2 * 1024 * 1024) {
                toast.error(`A imagem ${file.name} excede o limite de 2MB.`);
                return;
            }

            const preview = URL.createObjectURL(file);
            setAttachments(prev => [...prev, { file, preview }]);
        });
        
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeAttachment = (index: number) => {
        const item = attachments[index];
        URL.revokeObjectURL(item.preview);
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };


    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        
        const storedData = localStorage.getItem('subscriberData');
        if (!storedData) {
            toast.error('Somente usuários inscritos podem relatar problemas.');
            onClose();
            return;
        }

        const subscriber = JSON.parse(storedData);
        
        setLoading(true);
        try {
            let imageUrls: string[] = [];
            
            if (attachments.length > 0) {
                imageUrls = await reportService.uploadImages(attachments.map(a => a.file));
            }

            await reportService.create({
                problemType: form.problemType,
                description: form.description,
                subscriberId: subscriber.id,
                attachments: imageUrls
            });
            
            toast.success('Problema relatado com sucesso! A administração foi notificada.');
            setForm({ problemType: '', description: '' });
            attachments.forEach(a => URL.revokeObjectURL(a.preview));
            setAttachments([]);
            onClose();
        } catch (error: any) {
            console.error('Erro ao relatar problema:', error);
            const message = error.response?.data?.error || 'Erro ao enviar relato. Tente novamente.';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }

    if (!isOpen) return null;

    return (
        <div className="modal-entrance-wrapper">
            <div className="modal-dialog modal-lg w-100 mw-800">
                <div className="modal-content modal-entrance-content br-24 overflow-hidden border-0">
                    <div className="bg-success text-white p-4 text-center position-relative btn-green-gradient">
                        <button 
                            onClick={onClose}
                            className="btn border-0 p-2 position-absolute top-0 end-0 mt-2 me-2 text-white hover-opacity"
                        >
                            <FaTimes size={20} />
                        </button>
                        <div className="mb-3 bg-white bg-opacity-25 rounded-circle d-inline-flex p-3">
                            <FaExclamationTriangle size={30} />
                        </div>
                        <h4 className="fw-bold mb-0">Relatar Problema</h4>
                        <p className="small opacity-75 mb-0 mt-1">Sua contribuição ajuda a melhorar Crateús</p>
                    </div>

                    <div className="p-4 bg-white">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-muted text-uppercase letter-spacing-1">
                                    <FaList className="me-2" /> Tipo de Problema
                                </label>
                                <select 
                                    className="form-select border-2 br-12"
                                    required
                                    value={form.problemType}
                                    onChange={e => setForm({...form, problemType: e.target.value})}
                                >
                                    <option value="">Selecione...</option>
                                    {problemTypes.map((type, index) => (
                                        <option key={index} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="form-label small fw-bold text-muted text-uppercase letter-spacing-1">
                                    <FaCommentAlt className="me-2" /> Descrição Detalhada
                                </label>
                                <textarea 
                                    className="form-control border-2 br-12" 
                                    rows={4} 
                                    required 
                                    minLength={10}
                                    placeholder="Descreva o que aconteceu..."
                                    value={form.description}
                                    onChange={e => setForm({...form, description: e.target.value})}
                                />
                                <div className="form-text small text-end">Mínimo 10 caracteres</div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label small fw-bold text-muted text-uppercase letter-spacing-1 d-flex justify-content-between">
                                    <span><FaImage className="me-2" /> Evidências (Opcional)</span>
                                    <span className="opacity-75">{attachments.length}/3</span>
                                </label>
                                
                                <div className="d-flex gap-2 flex-wrap">
                                    {attachments.map((item, index) => (
                                        <div key={index} className="position-relative" style={{ width: '80px', height: '80px' }}>
                                            <img 
                                                src={item.preview} 
                                                alt="Preview" 
                                                className="w-100 h-100 object-fit-cover rounded border"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeAttachment(index)}
                                                className="btn btn-danger btn-sm position-absolute top-0 end-0 p-0 d-flex align-items-center justify-content-center rounded-circle"
                                                style={{ width: '20px', height: '20px', marginTop: '-8px', marginRight: '-8px' }}
                                            >
                                                <FaTimes size={12} />
                                            </button>
                                        </div>
                                    ))}
                                    
                                    {attachments.length < 3 && (
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="btn btn-outline-dashed border-2 d-flex flex-column align-items-center justify-content-center text-muted hover-bg-light"
                                            style={{ width: '80px', height: '80px', borderStyle: 'dashed', borderRadius: '8px' }}
                                        >
                                            <FaCamera size={20} />
                                            <span style={{ fontSize: '10px' }}>Anexar</span>
                                        </button>
                                    )}
                                </div>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="d-none" 
                                    accept="image/*" 
                                    multiple 
                                    onChange={handleFileChange} 
                                />
                                <div className="form-text small py-1">Envie até 3 fotos do problema para agilizar a solução.</div>
                            </div>

                            <button 
                                type="submit" 
                                className="btn btn-success btn-lg w-100 fw-bold border-0 py-3 shadow-sm hover-grow br-14 btn-green-gradient" 
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                ) : 'Enviar Relato'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportProblemModal;
