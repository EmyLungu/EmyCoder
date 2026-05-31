import { apiRun } from './run';
import type { RunRequest, RunResponse } from './types';

export const runService = {
    runSnippet: async (payload: RunRequest): Promise<RunResponse> => {
        const response = await apiRun.post<RunResponse>('/run-snippet', payload);
        return response.data;
    },
};
