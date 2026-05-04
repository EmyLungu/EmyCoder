const extractCodeBtn = document.getElementById('extract-code-btn');
const imgCode = document.getElementById('img-code');
const inputArea = document.getElementById("input-code");

const extractLoader = document.getElementById("extract-loader");

extractCodeBtn.addEventListener('click', async () => {
    const formData = new FormData();
    extractLoader.style.display = "block";

    formData.append('file', imgCode.files[0]);

    await fetch('/code-extractor', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(result => {
            const snippet = JSON.stringify(result['snippet'])
                .slice(1, -1)
                .replaceAll("\\n", "\n")
                .replaceAll("\\\"", "\"");
            inputArea.value += snippet
        })
        .catch(error => {
            console.error('Error:', error)
            alert('Something went wrong.');
        });

    extractLoader.style.display = "none";
});

