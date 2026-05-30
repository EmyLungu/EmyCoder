import { apiLang } from './lang';
import type { LangRequest, LangResponse, LangAllRequest, LangAllResponse, ModelListResponse } from './types';

export const langService = {
    getModels: async (): Promise<ModelListResponse> => {
        const response = await apiLang.get<ModelListResponse>('/models');
        return response.data;
    },

    classifyLanguage: async (payload: LangRequest): Promise<LangResponse> => {
        const response = await apiLang.post<LangResponse>('/predict', payload);
        return response.data;
    },

    classifyLanguageAll: async (payload: LangAllRequest): Promise<LangAllResponse> => {
        const response = await apiLang.post<LangAllResponse>('/predict-all', payload);
        return response.data;
    },
};
