import React from 'react';
import { Link } from 'react-router-dom';


const glassStyle = "bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl";


const Hero: React.FC = () => {
    return (
        < header className="max-w-5xl mx-auto pt-24 pb-16 text-center relative z-10" >
            <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium text-btn bg-btn/10 rounded-full border border-btn/20 mb-6 animate-fade-in">
                {`✨ Introducing EmyCoder v${__APP_VERSION__}`}
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6">
                Predict, Run, and Refactor <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-btn to-purple-400">
                    Code Instantly.
                </span>
            </h1>
            <p className="max-w-2xl mx-auto text-tsecondary text-base sm:text-lg mb-10 leading-relaxed">
                An elegant AI-powered environment designed to analyze source syntax, identify execution languages, and execute micro-scripts seamlessly in the browser.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                <Link to="/run" className="w-full sm:w-auto px-6 py-3 font-semibold text-white bg-btn hover:bg-btn/90 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg shadow-btn/20 text-center">
                    Run a program
                </Link>
                <Link to="/lang-classifier" className={`w-full sm:w-auto px-6 py-3 font-semibold text-tprimary hover:bg-white/10 transition-all duration-200 rounded-xl text-center ${glassStyle}`}>
                    Start Classifying
                </Link>
            </div>
        </header >
    )
};

const Home: React.FC = () => {
    const previewSnippet = `
def sayHello(who: str) -> None:
    # Says Hello to somebody or something
    print(f"Hello {str}")
sayHello("World")`

    const supportedLanguages = [
        "py", "js", "c", "cpp",
    ];
    const languageItemStyle = `
        w-16 h-16
        rounded-xl
        bg-btn/10
        flex items-center justify-center
        border border-btn/20
        text-btn
        text-xl
        mb-4
    `;

    return (
        <div className="min-h-screen text-tprimary bg-[#1b1a19] relative overflow-hidden px-4 sm:px-8">
            {/* Ambient Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-btn/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-accent/10 blur-[150px] pointer-events-none" />

            <Hero />

            {/* Features */}
            <main className="max-w-6xl mx-auto pb-24 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Feature 1: Demo */}
                    <div className={`lg:col-span-2 p-6 sm:p-8 flex flex-col justify-between ${glassStyle}`}>
                        <div>
                            <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/70" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/70" />
                                </div>
                                <span className="text-xs font-mono text-tsecondary">main.py</span>
                            </div>
                            <pre className="font-mono text-sm text-left overflow-x-auto text-tsecondary p-2 rounded-lg bg-black/20">
                            {previewSnippet}
                            </pre>
                        </div>
                        <div className="mt-6 pt-4 border-t border-white/5">
                            <h3 className="text-lg font-semibold text-white mb-1">Clean, Readable Execution</h3>
                            <p className="text-sm text-tsecondary">Try it out!</p>
                        </div>
                    </div>

                    {/* Feature 2: Stats / Fast Analytics */}
                    <div className={`p-6 sm:p-8 flex flex-col justify-between items-start ${glassStyle}`}>
                        <div className="w-12 h-12 rounded-xl bg-btn/10 flex items-center justify-center border border-btn/20 text-btn text-xl mb-4">
                            ⚡
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">Sub-millisecond Inference</h3>
                            <p className="text-sm text-tsecondary mb-6">
                                Lightweight client-side models executes your snippet seamlessly without network overhead.
                            </p>
                        </div>
                        <div className="w-full bg-black/20 rounded-xl p-3 border border-white/5 flex justify-between items-center font-mono text-xs">
                            <span className="text-tsecondary">Latency:</span>
                            <span className="text-green-400 font-bold">0.42ms</span>
                        </div>
                    </div>

                    {/* Feature 3: Supported languages */}
                    <div className={`p-6 sm:p-8 flex flex-col justify-between items-start ${glassStyle}`}>
                        <div className="grid grid-cols-4 md:grid-cols-4 gap-2">

                            {supportedLanguages.map((item) => (
                                <div
                                    className={languageItemStyle}
                                    key={item}
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">Supported Languages</h3>
                        </div>
                    </div>

                    {/* Bento Grid Item 4: Secondary Feature */}
                    <div className={`p-6 sm:p-8 ${glassStyle}`}>
                        <div className="text-xl mb-3">🔒</div>
                        <h3 className="text-base font-semibold text-white mb-1">Sandboxed Runtime</h3>
                        <p className="text-xs text-tsecondary">Run your code experiments with peace of mind. Every script runs in a secure, isolated container so your main system stays protected.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;
