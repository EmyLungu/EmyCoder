const inputArea = document.getElementById("input-code");

inputArea.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        e.preventDefault();

        const start = this.selectionStart;
        const end = this.selectionEnd;
        const value = this.value;
        const tabSize = 4;

        const lineStart = value.lastIndexOf('\n', start - 1) + 1;
        const lineEnd = value.indexOf('\n', end);
        const actualEnd = lineEnd === -1 ? value.length : lineEnd;

        const lines = value.substring(lineStart, actualEnd).split('\n');
        let newText = "";
        let totalOffset = 0;

        if (e.shiftKey) {
            // Shift+Tab
            newText = lines.map(line => {
                const match = line.match(new RegExp(`^ {1,${tabSize}}`));
                const lengthToRemove = match ? match[0].length : 0;
                totalOffset -= lengthToRemove;
                return line.substring(lengthToRemove);
            }).join('\n');
        } else {
            // No text selection
            if (start === end) {
                const col = start - lineStart;
                const spacesNeeded = tabSize - (col % tabSize);
                insertTextAtCursor(this, " ".repeat(spacesNeeded));
                return;
            }
            
            // Text selection
            newText = lines.map(line => " ".repeat(tabSize) + line).join('\n');
            totalOffset = lines.length * tabSize;
        }

        this.setSelectionRange(lineStart, actualEnd);
        insertTextAtCursor(this, newText);

        const newStart = Math.max(lineStart, start + (e.shiftKey ? -tabSize : tabSize));
        this.setSelectionRange(newStart, lineStart + newText.length);
    }
});

function insertTextAtCursor(el, text) {
    if (!document.execCommand('insertText', false, text)) {
        el.setRangeText(text, el.selectionStart, el.selectionEnd, 'end');
    }

    // const start = el.selectionStart;
    // const end = el.selectionEnd;
    // el.setRangeText(text, start, end, 'end');
    // el.dispatchEvent(new Event('input', { bubbles: true }));
}
