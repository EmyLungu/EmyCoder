import React, { useEffect } from 'react';
import { useResizer } from '../hooks/useResizer';
import CodeEditor from '../components/Editor';

interface CodePageTemplateProps {
    setCodeSnippet: (val: string) => void;
    loading: boolean;
    error: string | null;
    OutputContent?: React.ReactNode;
    useFileControl: boolean;
    headerControl?: React.ReactNode;
    actions?: React.ReactNode;
    resizerMaxLimit?: number;
}

const CodePageTemplate: React.FC<CodePageTemplateProps> = ({
    setCodeSnippet, loading, error, OutputContent,
    useFileControl,
    headerControl,
    actions,
    resizerMaxLimit = 75
}: CodePageTemplateProps) => {
    // Hooks
    const { leftWidth, containerRef, startResize, handleResize, stopResize } = useResizer(resizerMaxLimit);

    // Shared UI styling variables matching your global token schema
    const glassStyle = "bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl";

    // Resizing
    useEffect(() => {
        return () => {
            document.removeEventListener('mousemove', handleResize);
            document.removeEventListener('mouseup', stopResize);
        };
    }, [handleResize, stopResize]);

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

                            {headerControl}
                        </div>

                        <div className="w-full h-128 md:flex-1 md:h-full md:min-h-0 overflow-x-hidden">
                            <CodeEditor
                                setCode={(val: string) => setCodeSnippet(val || '')}
                                useFileControl={useFileControl}
                            />
                        </div>
                    </div>

                    {/* Left Actions Footer Panel */}
                    <div className="flex items-center justify-between gap-4 mt-4 pt-4 border-t border-white/5">
                        {/* Placeholder for your previous structural component: parts/extract-code.html */}
                        <div className="text-xs text-tsecondary italic flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            Ready for execution
                        </div>

                        {actions}
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
                            ) : (
                                <div
                                    className={`font-extrabold tracking-tight transition-all duration-200 text-transparent bg-clip-text bg-gradient-to-r from-btn to-orange-100 flex flex-col gap-4 overflow-scroll`}
                                >
                                    {OutputContent}
                                </div>
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

export default CodePageTemplate;
