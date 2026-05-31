import Editor from '@monaco-editor/react';
import type { OnChange } from '@monaco-editor/react';
import PopupMenu from './PopupMenu';
import React, { useState } from 'react';
import type { File } from './File'
import { DEFAULT_FILE } from './File'
import type { ButtonType } from './ButtonType';

interface FileTabProps {
    file: File;
    isActive: boolean;
    changeFile: (file: File) => void;
}

const ExtToLang: Record<string, string> = {
    "py": "python",
    "js": "javascript",
    "cpp": "cpp",
    "c": "c",
}

const getLang = (name: string) => {
    let ext: string = "python";
    const idx = name.lastIndexOf('.');
    if (idx !== -1)
        ext = name.slice(idx + 1);

    return ExtToLang[ext] || 'python'
}

const FileTab: React.FC<FileTabProps> = ({ file, isActive, changeFile }: FileTabProps) => {
    return (
        <button
            onClick={() => changeFile(file)}
            className={`
                text-xs font-mono px-4 h-8 flex items-center rounded-xl 
                transition-all duration-200 select-none cursor-pointer border
                ${isActive
                    ? 'bg-white/10 text-white border-white/15 font-semibold shadow-sm'
                    : 'bg-transparent text-tsecondary border-transparent hover:bg-white/5 hover:text-white'
                }
            `}
        >
            <span
                className={`w-1.5 h-1.5 rounded-full mr-2 transition-all ${isActive ? 'bg-btn' : 'bg-tsecondary/40'
                    }`}
            />
            {file.name}
        </button>
    )
}

interface CodeEditorProps {
    setCode: (value: string | undefined) => void;
    useFileControl: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
    setCode,
    useFileControl,
}: CodeEditorProps) => {

    const [files, setFiles] = useState<File[]>([
        DEFAULT_FILE,
        { name: 'main2.py', code: 'print("Hello from Python twoooo!")', language: 'python' },
    ]);
    const [currentFile, setCurrentFile] = useState<File>(files[0]);

    const handleEditorChange: OnChange = (newValue) => {
        const updatedCode = newValue ?? '';
        setCode(updatedCode);

        setCurrentFile((prev) => ({ ...prev, code: updatedCode }));
        setFiles((prevFiles) =>
            prevFiles.map((f) => (f.name === currentFile.name ? { ...f, code: updatedCode } : f))
        );
    };

    const changeFile = (file: File) => {
        setCurrentFile(file);
        setCode(file.code);
    }

    const handleNewFile = () => {
        if (files.length >= 5) return;
        const name = prompt("Enter file name:", `main${files.length + 1}.py`);
        if (!name) return;

        if (files.some(f => f.name === name)) {
            console.warn(`File ${name} already exists!`);
            return;
        }

        const lang = getLang(name);

        const newFile: File = {
            name: name,
            code: '# New file created\n',
            language: lang
        };

        setFiles((prevFiles) => [...prevFiles, newFile]);

        setCurrentFile(newFile);
        setCode(newFile.code);
    }

    const handleRenameFile = () => {
        const newName = prompt("Enter new file name:", currentFile.name);
        if (!newName || newName === currentFile.name) return;

        const lang = getLang(newName);

        setFiles((prevFiles) =>
            prevFiles.map((f) => (f.name === currentFile.name ? { ...f, name: newName, language: lang } : f))
        );
        setCurrentFile((prev) => ({ ...prev, name: newName, language: lang }));
    };

    const handleDeleteFile = () => {
        if (files.length === 1) return;

        setFiles(f => f.filter(item => item.name !== currentFile.name));
        setCurrentFile((prev) => ({ ...prev, code: '' }));
        setCode("");
    };

    const popupButtons: ButtonType[] = [
        { name: 'New File', callback: handleNewFile },
        { name: 'Rename File', callback: handleRenameFile },
        { name: 'Delete File', callback: handleDeleteFile },
    ];

    return (
        <div className="flex flex-col w-full h-full min-h-0 border border-slate-700/10 rounded-lg overflow-hidden bg-ternary shadow-lg">
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700">
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/70" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                    <div className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
                <div className="mr-auto flex flex-row gap-1 mx-8 h-full overflow-x-auto">
                    {useFileControl && files.map((file) => (
                        <FileTab key={file.name} file={file} changeFile={changeFile} isActive={file.name === currentFile.name} />
                    ))}
                </div>
                {useFileControl && <PopupMenu buttons={popupButtons} />}
            </div>

            <Editor
                height="100%"
                language={currentFile.language}
                theme="vs-dark"
                value={currentFile.code}
                onChange={handleEditorChange}
                options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    lineNumbers: 'on',
                    roundedSelection: true,
                    scrollBeyondLastLine: false,
                    readOnly: false,
                    automaticLayout: true,
                }}
                className="w-full h-full mt-4"
            />
        </div>
    )
};

export default CodeEditor;
