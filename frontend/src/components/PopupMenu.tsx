import { useState, useEffect, useRef } from "react";
import type { ButtonType } from "./ButtonType";

interface PopupMenuProps {
    buttons: ButtonType[];
}

const PopupMenu: React.FC<PopupMenuProps> = ({ buttons }: PopupMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    const glassStyle = "bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl";

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block text-left
        " ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex justify-center w-full rounded-sm border border-black/50 shadow-sm p-1 text-sm font-medium text-gray-700 focus:outline-none focus:ring-0 hover:bg-btn/12 transition-all bg-slate-500/20 rounded-xl border border-white/5 cursor-pointer"
            >
                <svg className="h-6 w-8">
                    <use href={`/icons.svg#dropdown-icon`} />
                </svg>
            </button>

            {isOpen && (
                <div className={`origin-top-right absolute right-0 mt-1 w-48 rounded-md shadow-lg divide-y divide-gray-100 focus:outline-none z-50 transition-all duration-200 ${glassStyle}`}>
                    <div className="py-1">
                        {buttons.map(button => (
                            <button
                                key={button.name}
                                className="block w-full px-4 py-2 text-sm text-tprimary rounded-xs hover:bg-btn/10"
                                onClick={button.callback}
                            >
                            {button.name}
                            </button>
                        ))
                        }
                    </div>
                </div>
            )}
        </div>
    );
}

export default PopupMenu;
