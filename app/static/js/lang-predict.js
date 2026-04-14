const predictBtn = document.getElementById('predict-btn');
const predictAllBtn = document.getElementById('predict-all-btn');
const inputArea = document.getElementById("input-code");
const lang = document.getElementById("output");
const modelSelect = document.getElementById("model-select");

predictBtn.addEventListener('click', async () => {
    const url = '/predict';
    const data = {
        snippet: inputArea.value,
        selected_model: modelSelect.value
    };

    lang.style.color = 'red';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        const prediction = JSON.stringify(result['language'])
        lang.innerHTML = '.' + prediction.slice(1, -1)
    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong.');
    }

    lang.style.color = 'darkslategrey';
});


predictAllBtn.addEventListener('click', async () => {
    const url = '/predict-all';
    const data = {
        snippet: inputArea.value,
    };

    lang.style.color = 'red';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        let outputHtml = "";
        result.predictions.forEach(item => {
            outputHtml += `<li class="output-list"><p>${item.model_name}:</p> <h1 class="language">.${item.language}</h1></li>`;
        });

        lang.innerHTML = `<ul>${outputHtml}</ul>`;

    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong.');
    }

    lang.style.color = 'darkslategrey';
});


inputArea.addEventListener('keydown', function(e) {
    if (e.key == 'Tab') {
        e.preventDefault();

        var start = this.selectionStart;
        var end = this.selectionEnd;

        this.value = this.value.substring(0, start) +
            "\t" + this.value.substring(end);
        this.selectionStart =
            this.selectionEnd = start + 1;
    }
});
