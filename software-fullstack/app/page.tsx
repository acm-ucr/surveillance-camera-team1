import CameraFeed from "../components/cameraFeed"

const CameraFeedPage = () => {
    return (
        <div className="min-h-screen bg-white">

            <h1 className="text-[40px] font-bold text-forge-maroon text-center">
                ACM Forge Surveillance Camera
            </h1>

            <CameraFeed />

        </div>
    );
};

export default CameraFeedPage;