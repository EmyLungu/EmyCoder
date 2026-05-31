import type { ButtonType } from "./ButtonType";

interface ActionProps {
    disabled: boolean;
    buttons: ButtonType[];
}

const CodeActions: React.FC<ActionProps> = ({ disabled, buttons }: ActionProps) => {
    const both = "px-5 py-2 text-xs rounded-xl transition-all transform active:scale-95 border border-white/10";
    const nonImportantStype = "font-semibold text-tsecondary hover:text-white hover:bg-white/5 border";
    const importantStype = "font-bold text-tprimary bg-btn/90 hover:bg-btn/75 shadow-md shadow-btn/10";

    return (
        <div className="flex items-center gap-3">
            {buttons.map(button => (
                <button
                    onClick={button.callback}
                    className={`${both} ` + (button.important ? importantStype : nonImportantStype)}
                    type="button"
                    disabled={disabled}
                >
                    {button.name}
                </button>
            ))}
        </div>
    )
}

export default CodeActions;
