export interface ButtonType {
    name: string;
    callback: (args?: unknown) => void
    important?: boolean;
}
