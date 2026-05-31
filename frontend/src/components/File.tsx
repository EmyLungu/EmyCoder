export interface File {
    name: string;
    code: string;
    language: string;
}

export const DEFAULT_FILE: File = {
    name: 'main.py',
    code: 'print("Hello from Python! basic")',
    language: 'python'
}
