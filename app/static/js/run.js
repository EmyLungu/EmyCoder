import { postAction } from './post-action.js'

const runBtn = document.getElementById('run-btn');
const inputArea = document.getElementById("input-code");
const output = document.getElementById("output");
const outputClassifier = document.getElementById("output-classifier");
const outputStatus = document.getElementById("output-status");
const outputLoader = document.getElementById("output-loader");

async function runCallback(response) {
    const result = await response.json();

    outputClassifier.innerHTML = "[." + result['language'] + "]";
    output.innerHTML = result['output'].replaceAll("\\n", "\n");

    if (result['status'] === 'success') {
        outputStatus.innerHTML = 'Execution: Success';
        outputStatus.classList.remove('error');
        outputStatus.classList.add('success');
    } else {
        outputStatus.innerHTML = 'Execution: Error';
        outputStatus.classList.remove('success');
        outputStatus.classList.add('error');
    }
}


runBtn.addEventListener('click', async () => {
    const data = {
        snippet: inputArea.value,
    };
    output.innerText = ""

    postAction('/run-snippet', data, runCallback, outputLoader);
});



// import { EditorView, basicSetup } from "https://esm.sh/codemirror";
// import { python } from "https://esm.sh/@codemirror/lang-python";
//
// const editor = new EditorView({
//     doc: "print('Hello, CodeMirror!')\n",
//     extensions: [
//         basicSetup,
//         python(),
//     ],
//     parent: document.getElementById("editor-container")
// });
