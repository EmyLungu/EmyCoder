const lang = document.getElementById("output");

export async function postAction(url, data, callback) {
    lang.style.color = 'red';

    await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            callback(response);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Something went wrong.');
        });

    lang.style.color = 'var(--color-primary)';
}
