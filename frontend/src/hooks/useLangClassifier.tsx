import { useCallback, useState } from 'react';
import { langService } from '../api/langService';
import type { LangResponse } from '../api/types';

export const useLangClassifier = () => {
    const [models, setModels] = useState<Array<string>>([]);
    const [data, setData] = useState<Array<LangResponse> | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getModels = useCallback(async () => {
        try {
            const result = await langService.getModels();
            setModels(result.models);
        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }, []);

    const triggerClassifier = useCallback(async (snippet: string, model: string) => {
        if (!snippet.trim()) return;

        setLoading(true);
        setError(null);

        try {
            setLoading(true);
            setError(null);
            const result = await langService.classifyLanguage({ snippet, model });
            setData([result]);
        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }, []);

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

    return { models, data, loading, error, getModels, triggerClassifier, triggerClassifierAll};
};
