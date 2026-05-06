import { postAction } from './post-action.js'

const runBtn = document.getElementById('run-btn');
const inputArea = document.getElementById("input-code");
const output = document.getElementById("output");

async function runCallback(response) {
    const result = await response.json();
    const prediction = JSON.stringify(result['output']).slice(1, -1);
    const language = JSON.stringify(result['language']).slice(1, -1);
    output.innerHTML = "[." + language + "]<br>"+ prediction.replaceAll("\\n", "<br>")
}


runBtn.addEventListener('click', async () => {
    const data = {
        snippet: inputArea.value,
    };

    postAction('/run-snippet', data, runCallback);
});

