'use client';

const NotFoundPage: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-6xl">404</h1>
            <p className="text-2xl">Page Not Found</p>
            <button 
            onClick={() => window.location.href = '/'} 
            className="mt-5 px-4 py-2 text-white bg-blue-500 rounded"
            >
            Home
            </button>
        </div>
    );
};

export default NotFoundPage;