import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface NavItem {
    label: string;
    url: string;
}

const navItems: NavItem[] = [
    { label: 'Home', url: '/' },
    { label: 'Classify', url: '/lang-predict' },
    { label: 'Run', url: '/run' },
];

const Logo: React.FC = () => {
    return (
        <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-xl font-bold text-tbtn tracking-tight">
                EmyCoder
            </Link>
        </div>
    )
}

const DesktopMenu: React.FC = () => {
    const itemStyle = `
        text-tsecondary
        hover:text-btn
        px-3 py-2
        rounded-md
        text-sm
        font-medium
        transition-colors
    `
    return (
        <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
                <Link
                    key={item.label}
                    to={item.url}
                    className={itemStyle}
                >
                    {item.label}
                </Link>
            ))}
            <Link to="/" className="text-tbtn bg-secondary hover:text-primary hover:bg-btn border-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                TBD
            </Link>
        </div>
    )
}

interface OpenProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
}

const MobileMenuButton: React.FC<OpenProps> = ({ isOpen, setIsOpen }: OpenProps) => {
    return (
        <div className="flex items-center md:hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-tprimary hover:bg-btn focus:outline-none"
                aria-controls="mobile-menu"
                aria-expanded="false"
            >
                <span className="sr-only">Open main menu</span>
                {!isOpen ? (
                    <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                ) : (
                    <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                )}
            </button>
        </div>
    )
}

const MobileMenu: React.FC<OpenProps> = ({ isOpen }: OpenProps) => {
    return (
        <>
            {isOpen && (
                <div className="md:hidden id=mobile-menu bg-primary">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                to={item.url}
                                className="block text-tprimary hover:bg-btn px-3 py-2 rounded-md text-base font-medium"
                            >
                                {item.label}
                            </Link>
                        ))}
                        <div className="pt-4 pb-2 px-3">
                            <button className="w-full text-tbtn bg-secondary hover:bg-btn hover:text-primary px-4 py-2 rounded-lg text-base font-medium transition-colors">
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <nav className="bg-primary sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <Logo />
                    <DesktopMenu />
                    <MobileMenuButton isOpen={isOpen} setIsOpen={setIsOpen} />
                </div>
            </div>
            <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} />
        </nav>
    )
};

export default Navbar;
