export async function postAction(url, data, callback, loader=null) {
    if (loader !== null) {
        loader.style.display = 'block';
    }

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

    if (loader !== null) {
        loader.style.display = 'none';
    }
}
