import React from 'react';

interface Route {
    name: string;
    neighborhoods: string[];
}

interface CalendarDayProps {
    day: string;
    routes: Route[];
}

const CalendarDay: React.FC<CalendarDayProps> = ({ day, routes }) => {
    return (
        <div className="col-12">
            <div className="card bg-light border-0 p-3 shadow-sm border-start border-success border-3">
                <h3 className="h6 text-success fw-bold mb-3">{day}</h3>
                <div className="row">
                    {routes.map((route, index) => (
                        <div key={index} className={`col-md-6 ${index === 0 && routes.length > 1 ? 'border-end' : ''}`}>
                            <p className="mb-1 small"><strong>{route.name}:</strong></p>
                            <ul className="small text-muted ps-3">
                                {route.neighborhoods.map((n, i) => (
                                    <li key={i}>{n}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CalendarDay;
