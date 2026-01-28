import React from 'react';

const MapSection: React.FC = () => {
    return (
        <div id="mapa" className="shadow-sm bg-light" style={{ width: '100%', height: '350px', overflow: 'hidden' }}>
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63575.736269348825!2d-40.698428102633876!3d-5.186403600292874!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x796f04deb335aa7%3A0x1db43189e3269198!2sCrate%C3%BAs%2C%20CE!5e0!3m2!1spt-BR!2sbr!4v1764565561476!5m2!1spt-BR!2sbr"
                title="Mapa de Crateús"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
            ></iframe>
        </div>
    );
};

export default MapSection;
