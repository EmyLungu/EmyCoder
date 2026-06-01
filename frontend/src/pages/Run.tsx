import CodePageTemplate from './CodePageTemplate';
import { DEFAULT_FILE } from '../components/File';
import type { ButtonType } from '../components/ButtonType';
import CodeActions from '../components/CodeActions';
import ChatOverlay from '../components/Chat';
import { useCodeRunner } from '../hooks/useRun';
import { useState } from 'react';
import type { RunResponse } from '../api/types';

interface OutputContentProps {
    data: RunResponse | null;
}

const OutputContent: React.FC<OutputContentProps> = ({ data }: OutputContentProps) => {
    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[200px] text-center">
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-tsecondary/20 animate-pulse">
                    ...
                </h1>
                <p className="text-xs text-tsecondary/40 font-mono mt-2">Awaiting execution</p>
            </div>
        );
    }

    const isSuccess = data.status?.toLowerCase() === 'success';

    return (
        <div className="w-full flex flex-col gap-4 text-left font-normal tracking-normal text-white normal-case">
            <div className="flex flex-wrap items-center gap-2 border-b border-white/5 pb-3">
                <span className="px-2.5 py-1 text-xs font-mono rounded-md bg-white/5 border border-white/10 text-white/80">
                    {data.language}
                </span>
                <span className="px-2.5 py-1 text-xs font-mono rounded-md bg-white/5 border border-white/10 text-tsecondary">
                    {data.model}
                </span>
                <span className={`ml-auto px-2.5 py-1 text-xs font-semibold rounded-full border ${isSuccess
                    ? 'bg-green-500/10 border-green-500/30 text-green-400'
                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                    }`}>
                    {data.status.toUpperCase()}
                </span>
            </div>

            <div className="flex flex-col flex-1 w-full bg-black/40 border border-white/5 rounded-xl overflow-hidden font-mono text-sm shadow-inner">
                <div className="flex items-center justify-between px-4 py-2 bg-white/[0.02] border-b border-white/5 text-[11px] text-tsecondary/50">
                    <span>{isSuccess ? "STDOUT" : "STDERR"}</span>
                </div>

                <pre className="p-4 overflow-x-auto whitespace-pre-wrap break-all text-gray-200 selection:bg-white/20 leading-relaxed min-h-[150px]">
                    {data.output || <span className="text-tsecondary/30 italic">Process finished with no output.</span>}
                </pre>
            </div>
        </div>
    );
};

const Run: React.FC = () => {
    const { data, loading, error, triggerRun } = useCodeRunner();

    const [codeSnippet, setCodeSnippet] = useState<string>(DEFAULT_FILE.code);

    const handleRun = async () => {
        triggerRun(codeSnippet);
    };

    const codeButtons: ButtonType[] = [
        { name: 'Run', callback: handleRun, important: true },
    ];

    return (
        <>
            <CodePageTemplate
                setCodeSnippet={setCodeSnippet}
                loading={loading}
                error={error}
                OutputContent={<OutputContent data={data} />}
                useFileControl={true}
                resizerMaxLimit={65}
                actions={
                    <CodeActions
                        disabled={loading || !codeSnippet.trim()}
                        buttons={codeButtons}
                    />
                }
            />
            <ChatOverlay
                currentCode={codeSnippet}
                currentOutput={data?.output || ""}
            />
        </>
    );
};

export default Run;
