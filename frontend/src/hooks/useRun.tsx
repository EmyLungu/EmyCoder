import { useCallback, useState } from 'react';
import { runService } from '../api/runService';
import type { RunResponse } from '../api/types';

export const useCodeRunner = () => {
    const [data, setData] = useState<RunResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const triggerRun = useCallback(async (snippet: string) => {
        if (!snippet.trim()) return;

        setLoading(true);
        setError(null);

        try {
            setLoading(true);
            setError(null);

            const result = await runService.runSnippet({ snippet });
            setData(result);
        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }, []);

    return { data, loading, error, triggerRun };
};
