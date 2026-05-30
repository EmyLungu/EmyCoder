import { useCallback, useState } from 'react';
import { langService } from '../api/langService';
import type { LangResponse } from '../api/types';

export const useLangClassifier = () => {
    const [models, setModels] = useState<Array<string>>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');

    const [data, setData] = useState<Array<LangResponse> | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getModels = useCallback(async () => {
        try {
            const result = await langService.getModels();
            setModels(result.models);
            if (result.models.length > 0) {
                setSelectedModel(result.models[0])
            }
        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }, []);

    const triggerClassifier = useCallback(async (snippet: string) => {
        if (!snippet.trim()) return;

        setLoading(true);
        setError(null);

        try {
            setLoading(true);
            setError(null);
            const result = await langService.classifyLanguage({ snippet, "model": selectedModel });
            setData([result]);
        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }, [selectedModel]);

    const triggerClassifierAll = useCallback(async (snippet: string) => {
        if (!snippet.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const result = await langService.classifyLanguageAll({ snippet });
            setData(result.predictions);
        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }, []);

    return { models, data, loading, error, selectedModel, setSelectedModel, getModels, triggerClassifier, triggerClassifierAll };
};
