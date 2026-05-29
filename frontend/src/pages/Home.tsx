import React from 'react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
    return (
        <header className="bg-secondary py-20 px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-tprimary tracking-tight mb-6">
                    Code with <span className="text-tbtn">Intelligence</span>, Execute with <span className="text-tbtn">Safety</span>
                </h1>
                <p className="text-lg sm:text-xl text-tsecondary max-w-2xl mx-auto mb-10 leading-relaxed">
                    EmyCoder is an MLOps-driven playground where AI-powered language classification meets secure Docker-based execution. Learn, train, and run code in a fully local, private environment.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                    <Link
                        to="/run"
                        className="bg-primary text-tbtn hover:bg-btn hover:text-primary font-medium px-8 py-3 rounded-xl shadow-lg border-3 border-btn shadow-btn"
                    >
                        Run a Program
                    </Link>
                    <Link
                        to="#explore"
                        className="text-tsecondary hover:text-tbtn font-medium px-8 py-3 rounded-xl"
                    >
                        Pages
                    </Link>
                </div>
            </div>
        </header>
    )
}

interface PageCard {
    title: string;
    description: string;
    icon: string;
    url: string;
}

const pages: PageCard[] = [
    {
        title: 'Home Page',
        description: '',
        icon: '⚡',
        url: '/'
    },
    {
        title: 'Language Classifier',
        description: 'Not sure what language that snippet is? Our built-in AI analyzes the code and identifies the programming language for you instantly.',
        icon: '🔍',
        url: '/lang-predict'
    },
    {
        title: 'Run a program',
        description: 'Run your code experiments with peace of mind. Every script runs in a secure, isolated container so your main system stays protected.',
        icon: '🚀',
        url: '/run'
    },
];

const Home: React.FC = () => {
    return (
        <div className="min-h-screen bg-primary text-gray-900">
            <Hero />

            <section id="explore" className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900">Page explorer</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {pages.map((page, index) => (
                        <Link to={page.url}
                            key={index}
                            className="special-btn p-8 rounded-3xl border-2 border-btn shadow-sm"
                        >
                            <div className="text-4xl mb-4 w-12 h-12 flex items-center justify-center rounded-xl">
                                {page.icon}
                            </div>
                            <h3 className="text-xl font-bold text-tprimary mb-2">{page.title}</h3>
                            <p className="text-tsecondary leading-relaxed">{page.description}</p>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
