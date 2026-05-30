import { useCallback, useRef, useState } from 'react';

export const useResizer = () => {
    const [leftWidth, setLeftWidth] = useState<number>(75);
    const containerRef = useRef<HTMLDivElement>(null);
    const isResizing = useRef<boolean>(false);

    const handleResize = useCallback((e: MouseEvent) => {
        if (!isResizing.current || !containerRef.current)
            return;
        const containerRect = containerRef.current.getBoundingClientRect();
        const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;

        if (newWidth >= 25 && newWidth <= 75) {
            setLeftWidth(newWidth);
        }
    }, []);

    const stopResize = useCallback(function removeListeners() {
        isResizing.current = false;
        document.removeEventListener('mousemove', handleResize);
        document.removeEventListener('mouseup', removeListeners);
    }, [handleResize]);

    const startResize = (e: React.MouseEvent) => {
        e.preventDefault();
        isResizing.current = true;
        document.addEventListener('mousemove', handleResize);
        document.addEventListener('mouseup', stopResize);
    };

    return { leftWidth, containerRef, startResize, handleResize, stopResize };
};
