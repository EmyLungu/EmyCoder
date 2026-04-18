const runBtn = document.getElementById('run-btn');
const inputArea = document.getElementById("input-code");
const lang = document.getElementById("output");

runBtn.addEventListener('click', async () => {
    const url = '/run-snippet';
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
        const prediction = JSON.stringify(result['output']).slice(1, -1);
        const language = JSON.stringify(result['language']).slice(1, -1);
        lang.innerHTML = "[." + language + "]<br>"+ prediction.replaceAll("\\n", "<br>")
    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong.');
    }

    lang.style.color = 'var(--color-primary)';
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
