export interface LangRequest {
    snippet: string;
    model: string;
}

export interface LangResponse {
    model_name: string;
    language: string;
    is_confidence: boolean;
    confidence: number;
    confidences: Record<string, number>
    latencyMs: number;
}

export interface LangAllRequest {
    snippet: string;
}

export interface LangAllResponse {
    predictions: Array<LangResponse>;
}

// export interface LangAllResponse {
//     predictions: Array<LangResponse>;
// }

export interface ModelListResponse {
    models: string[];
}
