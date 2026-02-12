import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import QuotationModal from './QuotationModal';
import { useState } from 'react';

const Layout = ({ children }) => {
    const location = useLocation();
    const [isQuotationOpen, setIsQuotationOpen] = useState(false);

    // Check if the current path starts with /admin or /login (Admin Login)
    // Adjust logic based on exact admin routes
    const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname === '/login';

    return (
        <>
            {!isAdminRoute && (
                <>
                    <Navbar onOpenQuotation={() => setIsQuotationOpen(true)} />
                    <QuotationModal isOpen={isQuotationOpen} onClose={() => setIsQuotationOpen(false)} />
                </>
            )}
            <main className="">
                {children}
            </main>
            {!isAdminRoute && <Footer />}
        </>
    );
};

export default Layout;
