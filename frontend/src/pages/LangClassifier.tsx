import React, { useState, useEffect } from 'react';
import { useLangClassifier } from '../hooks/useLangClassifier'
import { useResizer } from '../hooks/useResizer';
import type { LangResponse } from '../api/types';
import { DEFAULT_FILE } from '../components/File';
import CodeEditor from '../components/Editor';

interface LangCardProps {
    prediction: LangResponse
}

const LangCard: React.FC<LangCardProps> = ({ prediction }: LangCardProps) => {
    const glassStyle = `
        bg-white/5
        backdrop-blur-md
        border border-white/10
        rounded-2xl
        p-4
        flex flex-col gap-4
        hover:bg-white/10
        transition-all
    `;

    const [isOpen, setOpen] = useState(false);

    return (
        <div className={`${glassStyle} `} onClick={() => { setOpen(!isOpen) }}>
            <p className="text-4xl font-semibold text-white">{prediction.language}</p>
            <p className="text-sm text-tsecondary">{prediction.model_name}</p>
            <span className="flex flex-row mx-auto gap-1 border-t border-white/5 pt-2">
                <p className="text-sm text-tsecondary">{prediction.is_confidence ? 'Confidence:' : 'Decision socres'}</p>
                <p className="text-sm text-tprimary">
                    {(prediction.confidence * 100).toFixed(2)}
                    {prediction.is_confidence ? '%' : ''}
                </p>
            </span>
            {isOpen && (
                <ul className="text-left mx-auto">
                    {Object.entries(prediction.confidences).map(([lang, confidence]) => (
                        <li
                            key={lang}
                            className="flex flex-row justify-between border-b border-white/5 gap-4"
                        >
                            <span>{lang}:</span>
                            <span>
                                {(confidence * 100).toFixed(2)}
                                {prediction.is_confidence ? '%' : ''}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
};

const LangClassifier: React.FC = () => {
    // Hooks
    const { models, data, loading, error, getModels, selectedModel, setSelectedModel, triggerClassifier, triggerClassifierAll } = useLangClassifier();
    const { leftWidth, containerRef, startResize, handleResize, stopResize } = useResizer();

    // States
    const [codeSnippet, setCodeSnippet] = useState<string>(DEFAULT_FILE.code);

    // Shared UI styling variables matching your global token schema
    const glassStyle = "bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl";

    useEffect(() => {
        getModels();
    }, [getModels]);

    // Resizing
    useEffect(() => {
        return () => {
            document.removeEventListener('mousemove', handleResize);
            document.removeEventListener('mouseup', stopResize);
        };
    }, [handleResize, stopResize]);


    const handleClassifier = async () => {
        triggerClassifier(codeSnippet);
    };

    const handleClassifierAll = async () => {
        triggerClassifierAll(codeSnippet);
    };

    return (
        <div className="md:h-screen bg-ternary text-tprimary px-4 sm:px-8 py-8 pt-24 relative overflow-y-auto  md:overflow-hidden overflow-x-hidden flex flex-col justify-center">
            {/* Ambient Accent Lights */}
            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-btn/5 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-purple-500/5 blur-[100px] pointer-events-none" />

            {/* Split Workspace Window Wrapper */}
            <div
                ref={containerRef}
                className={`w-full flex-1 flex flex-col md:flex-row overflow-hidden ${glassStyle}`}
            >
                {/* LEFT: Input panel */}
                <div
                    style={{ width: typeof window !== 'undefined' && window.innerWidth >= 768 ? `${leftWidth}%` : '100%' }}
                    className="p-6 flex-1 min-h-0 flex flex-col justify-between h-full min-w-[280px] md:border-r border-white/10"
                >
                    <div className="flex flex-col flex-1 min-h-0">
                        {/* Input Control bar */}
                        <div className="flex flex-wrap items-center justify-between gap-4 pb-1 border-b border-white/5 mb-2">
                            <h2 className="text-xl font-bold tracking-tight text-white mb-0">Input</h2>

                            <div className="flex items-center space-x-3 bg-black/20 px-3 py-1.5 rounded-xl border border-white/5">
                                <label htmlFor="model-select" className="text-xs text-tsecondary font-medium whitespace-nowrap">
                                    Select model:
                                </label>
                                {models.length > 0 ? (
                                    <select
                                        id="model-select"
                                        value={selectedModel}
                                        onChange={(e) => setSelectedModel(e.target.value)}
                                        className="bg-transparent text-xs text-white border-none outline-none cursor-pointer font-semibold rounded-lg p-1 focus:ring-0 hover:bg-btn/12 transition-all"
                                    >
                                        {models.map((model) => (
                                            <option key={model} value={model} className="bg-secondary text-white">
                                                {model}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <span className="text-xs text-red-400 font-bold">No models configured</span>
                                )}
                            </div>
                        </div>

                        <div className="w-full h-128 md:flex-1 md:h-full md:min-h-0 overflow-x-hidden">
                            <CodeEditor setCode={(val: string) => setCodeSnippet(val || '')} />
                        </div>
                    </div>

                    {/* Left Actions Footer Panel */}
                    <div className="flex items-center justify-between gap-4 mt-4 pt-4 border-t border-white/5">
                        {/* Placeholder for your previous structural component: parts/extract-code.html */}
                        <div className="text-xs text-tsecondary italic flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            Ready for execution
                        </div>

                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => handleClassifierAll()}
                                className="px-4 py-2 text-xs font-semibold rounded-xl text-tsecondary hover:text-white hover:bg-white/5 border border-white/10 transition-all transform active:scale-95"
                                type="button"
                                disabled={loading || !codeSnippet.trim()}
                            >
                                Predict All
                            </button>
                            <button
                                onClick={() => handleClassifier()}
                                className="px-5 py-2 text-xs font-bold rounded-xl text-white bg-btn/90 hover:bg-btn/75 transition-all shadow-md shadow-btn/10 transform active:scale-95"
                                type="button"
                                disabled={loading || !codeSnippet.trim()}
                            >
                                Predict
                            </button>
                        </div>
                    </div>
                </div>

                {/* DESKTOP RESIZER DRAG BAR */}
                <div
                    onMouseDown={startResize}
                    className="hidden md:flex items-center justify-center w-2 cursor-col-resize hover:bg-btn/50 group transition-colors relative z-20 border-x border-white/5"
                >
                    <div className="w-[2px] h-10 bg-white/10 group-hover:bg-white/40 rounded transition-colors" />
                </div>

                {/* RIGHT: Output Evaluation Window */}
                <div
                    style={{ width: typeof window !== 'undefined' && window.innerWidth >= 768 ? `${100 - leftWidth}%` : '100%' }}
                    className="w-full md:w-1/2 p-6 flex flex-col justify-between bg-black/10 h-full"
                >
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-white pb-4 border-b border-white/5 mb-6">
                            Output
                        </h2>

                        <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar my-auto max-h-100">
                            {loading ? (
                                <div className="relative w-12 h-12 m-auto">
                                    <div className="w-12 h-12 rounded-full border-4 border-white/5 border-t-btn animate-spin" />
                                </div>
                            ) : error ? (
                                <div className="text-red-400 font-medium px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl">
                                    ⚠️ {error}
                                </div>
                            ) : data ? (
                                <div
                                    className={`font-extrabold tracking-tight transition-all duration-200 text-transparent bg-clip-text bg-gradient-to-r from-btn to-orange-100 flex flex-col gap-4 overflow-scroll`}
                                >
                                    {data.map((prediction) => (
                                        <LangCard key={prediction.model_name} prediction={prediction} />
                                    ))}
                                </div>
                            ) : (
                                <h1
                                    className={`text-3xl sm:text-5xl font-extrabold tracking-tight transition-all duration-200 text-tsecondary/30`}
                                >
                                    Lang
                                </h1>
                            )}
                        </div>
                    </div>

                    {/* Operational system confirmation tag metadata */}
                    <div className="text-[10px] font-mono text-tsecondary/40 text-right uppercase tracking-wider">
                        • Engine Ready
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LangClassifier;
