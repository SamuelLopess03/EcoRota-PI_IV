import MapSection from '../components/home/MapSection';
import CalendarSection from '../components/home/CalendarSection';
import Sidebar from '../components/home/Sidebar';

function Home() {
    return (
        <div className="home-page">
            <MapSection />

            <div className="container py-5">
                <div className="row g-4">
                    <CalendarSection />
                    <Sidebar />
                </div>
            </div>
        </div>
    );
}

export default Home;