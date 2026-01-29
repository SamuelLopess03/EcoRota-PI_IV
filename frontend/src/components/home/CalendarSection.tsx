import React, { useEffect, useState } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import CalendarDay from './CalendarDay';
import { routeService } from '../../services/routeService';
import { neighborhoodService } from '../../services/neighborhoodService';

interface DaySchedule {
    day: string;
    routes: {
        name: string;
        neighborhoods: string[];
        startTime: string;
        endTime: string;
    }[];
}

interface CalendarSectionProps {
    filterTerm: string;
}

const CalendarSection: React.FC<CalendarSectionProps> = ({ filterTerm }) => {
    const [allSchedule, setAllSchedule] = useState<DaySchedule[]>([]);
    const [filteredSchedule, setFilteredSchedule] = useState<DaySchedule[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSchedule();
    }, []);

    async function loadSchedule() {
        try {
            const routes = await routeService.list();
            const neighborhoods = await neighborhoodService.list();

            // Days of the week in order (technical values)
            const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
            
            // Labels for display
            const dayLabels: Record<string, string> = {
                monday: 'Segunda-feira',
                tuesday: 'Terça-feira',
                wednesday: 'Quarta-feira',
                thursday: 'Quinta-feira',
                friday: 'Sexta-feira',
            };
            
            // Group routes by day
            const scheduleByDay: DaySchedule[] = daysOfWeek.map(day => ({
                day: dayLabels[day],
                routes: []
            }));

            routes.forEach(route => {
                route.collectionDays.forEach(day => {
                    const dayIndex = daysOfWeek.indexOf(day);
                    if (dayIndex !== -1) {
                        // Find neighborhoods for this route
                        const routeNeighborhoods = neighborhoods
                            .filter(n => n.routeId === route.id)
                            .map(n => n.name);

                        scheduleByDay[dayIndex].routes.push({
                            name: route.name,
                            neighborhoods: routeNeighborhoods,
                            startTime: route.startTime || (route as any).start_time || '',
                            endTime: route.endTime || (route as any).end_time || ''
                        });
                    }
                });
            });

            setAllSchedule(scheduleByDay);
            setFilteredSchedule(scheduleByDay);
        } catch (error) {
            console.error('Erro ao carregar calendário:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!filterTerm.trim()) {
            setFilteredSchedule(allSchedule);
            return;
        }

        const filtered = allSchedule.map(day => ({
            ...day,
            routes: day.routes.filter(route => 
                route.neighborhoods.some(n => 
                    n.toLowerCase().includes(filterTerm.toLowerCase())
                )
            )
        })).filter(day => day.routes.length > 0);

        setFilteredSchedule(filtered);
    }, [filterTerm, allSchedule]);

    if (loading) {
        return (
            <section id="calendario-rotas" className="col-lg-8">
                <div className="card shadow-sm border-0 border-top border-success border-4 p-4">
                    <div className="text-center py-5">
                        <div className="spinner-border text-success" role="status">
                            <span className="visually-hidden">Carregando...</span>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="calendario-rotas" className="col-lg-8">
            <div className="card shadow-sm border-0 border-top border-success border-4 p-4">
                <h2 className="h4 text-success fw-bold border-bottom pb-3 mb-4 d-flex align-items-center gap-2">
                    <FaCalendarAlt /> Calendário de Rotas
                </h2>

                <div className="container-scrollable pe-2 max-h-300">
                    <div className="row g-3">
                        {filteredSchedule.length > 0 ? (
                            filteredSchedule.map((item, index) => (
                                <CalendarDay key={index} day={item.day} routes={item.routes} />
                            ))
                        ) : (
                            <div className="col-12 py-4 text-center text-muted">
                                <p className="mb-0">Nenhuma rota encontrada para este bairro.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CalendarSection;
