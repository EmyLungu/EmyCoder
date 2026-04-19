import { postAction } from './post-action.js'

const predictBtn = document.getElementById('predict-btn');
const predictAllBtn = document.getElementById('predict-all-btn');
const inputArea = document.getElementById("input-code");
const lang = document.getElementById("output");
const modelSelect = document.getElementById("model-select");


async function predictCallback(response) {
    const result = await response.json();
    const prediction = JSON.stringify(result['language'])
    lang.innerHTML = '.' + prediction.slice(1, -1)
}

async function predictAllCallback(response) {
    const result = await response.json();
    let outputHtml = "";
    result.predictions.forEach(item => {
        outputHtml += `<li class="output-list"><p>${item.model_name}:</p> <h1 class="language">.${item.language}</h1></li>`;
    });

    lang.innerHTML = `<ul>${outputHtml}</ul>`;
}


predictBtn.addEventListener('click', async () => {
    const data = {
        snippet: inputArea.value,
        selected_model: modelSelect.value
    };

    postAction('/predict', data, predictCallback)
});

predictAllBtn.addEventListener('click', async () => {
    const data = {
        snippet: inputArea.value,
    };

    postAction('/predict-all', data, predictAllCallback)
});
