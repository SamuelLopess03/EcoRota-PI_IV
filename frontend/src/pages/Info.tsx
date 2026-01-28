import HistorySection from '../components/info/HistorySection';
import ParticipationSection from '../components/info/ParticipationSection';
import DisposalGuide from '../components/info/DisposalGuide';
import SpecialMaterials from '../components/info/SpecialMaterials';

const Info = () => {
    return (
        <div className="container py-5">
            <HistorySection />
            <ParticipationSection />
            <DisposalGuide />
            <SpecialMaterials />
        </div>
    );
};

export default Info;
