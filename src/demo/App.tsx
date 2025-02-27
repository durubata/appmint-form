import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import DemoPage from './pages/DemoPage';
import { demoRegistry } from './demos';

// Define the types for our app
type Route = 'home' | string;

const App: React.FC = () => {
    // State to track the current route
    const [currentRoute, setCurrentRoute] = useState<Route>('home');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Function to handle navigation
    const navigateTo = (route: Route) => {
        setCurrentRoute(route);
    };

    // Toggle sidebar
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Render the appropriate content based on the current route
    const renderContent = () => {
        if (currentRoute === 'home') {
            return <Home onNavigate={navigateTo} />;
        }

        // Find the demo in the registry
        const demo = demoRegistry.find(d => d.id === currentRoute);
        if (demo) {
            return <DemoPage demo={demo} />;
        }

        // Fallback to home if route not found
        return <Home onNavigate={navigateTo} />;
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar
                isOpen={sidebarOpen}
                onToggle={toggleSidebar}
                currentRoute={currentRoute}
                onNavigate={navigateTo}
            />

            {/* Main Content */}
            <div className={`flex-1 overflow-auto transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
                <header className="bg-white shadow-sm">
                    <div className="px-4 py-3 flex items-center">
                        <button
                            onClick={toggleSidebar}
                            className="mr-4 p-2 rounded-md hover:bg-gray-100"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <h1 className="text-xl font-semibold text-gray-800">
                            {currentRoute === 'home' ? 'AppMint Form Library Demo' : demoRegistry.find(d => d.id === currentRoute)?.title}
                        </h1>
                    </div>
                </header>
                <main className="p-6">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default App;
