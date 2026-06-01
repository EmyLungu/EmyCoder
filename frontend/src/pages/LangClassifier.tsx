import { useEffect, useState } from 'react';
import { useLangClassifier } from '../hooks/useLangClassifier';
import CodePageTemplate from './CodePageTemplate';
import CodeActions from '../components/CodeActions';
import { DEFAULT_FILE } from '../components/File';
import type { ButtonType } from '../components/ButtonType';
import type { LangResponse } from '../api/types';

interface ModelSelectProps {
    models: string[];
    selectedModel: string;
    setSelectedModel: (model: string) => void;
}
const ModelSelect: React.FC<ModelSelectProps> = (p: ModelSelectProps) => {
    return (
        <div className="flex items-center space-x-3 bg-black/20 px-3 py-1.5 rounded-xl border border-white/5">
            <label htmlFor="model-select" className="text-xs text-tsecondary font-medium whitespace-nowrap">
                Select model:
            </label>
            {p.models.length > 0 ? (
                <select
                    id="model-select"
                    value={p.selectedModel}
                    onChange={(e) => p.setSelectedModel(e.target.value)}
                    className="bg-transparent text-xs text-white border-none outline-none cursor-pointer font-semibold rounded-lg p-1 focus:ring-0 hover:bg-btn/12 transition-all"
                >
                    {p.models.map((model) => (
                        <option key={model} value={model} className="bg-secondary text-white">
                            {model}
                        </option>
                    ))}
                </select>
            ) : (
                <span className="text-xs text-red-400 font-bold">No models configured</span>
            )}
        </div>
    )
}

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
                <>
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
                    <p className="text-sm text-tsecondary">
                        Latency: {prediction.latency.toFixed(0)}ms
                    </p>
                </>
            )}
        </div>
    )
};

interface OutputContentProps {
    data: LangResponse[];
}

const OutputContent: React.FC<OutputContentProps> = ({ data }: OutputContentProps) => {
    if (data === null)
        return (
            <div className="flex flex-col items-center justify-center min-h-[200px] text-center">
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-tsecondary/20 animate-pulse">
                    ...
                </h1>
                <p className="text-xs text-tsecondary/40 font-mono mt-2">Awaiting execution</p>
            </div>
        )

    return (
        <>
            {data.map((prediction) => (
                <LangCard key={prediction.model_name} prediction={prediction} />
            ))}
        </>
    )
}

const LangClassifier: React.FC = () => {
    const { models, data, loading, error, getModels, selectedModel, setSelectedModel, triggerClassifier, triggerClassifierAll } = useLangClassifier();

    const [codeSnippet, setCodeSnippet] = useState<string>(DEFAULT_FILE.code);

    useEffect(() => {
        getModels();
    }, [getModels]);

    const handleClassifier = async () => {
        triggerClassifier(codeSnippet);
    };

    const handleClassifierAll = async () => {
        triggerClassifierAll(codeSnippet);
    };

    const codeButtons: ButtonType[] = [
        { name: 'Predict All', callback: handleClassifierAll, important: false },
        { name: 'Predict', callback: handleClassifier, important: true },
    ];

    return (
        <CodePageTemplate
            setCodeSnippet={setCodeSnippet}
            loading={loading}
            error={error}
            OutputContent={<OutputContent data={data} />}
            useFileControl={false}
            headerControl={
                <ModelSelect
                    models={models}
                    selectedModel={selectedModel}
                    setSelectedModel={setSelectedModel}
                />
            }
            actions={
                <CodeActions
                    disabled={loading || !codeSnippet.trim()}
                    buttons={codeButtons}
                />
            }
        />
    );
};

export default LangClassifier;
