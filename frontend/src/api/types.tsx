export interface ModelListResponse {
    models: string[];
}

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
    predictions: LangResponse[];
}

export interface RunRequest {
    snippet: string;
}

export interface RunResponse {
    output: string;
    language: string;
    model: string;
    status: string;
}

export interface ChatRequest {
    messages: string[];
    snippet: string;
    output: string;
}
