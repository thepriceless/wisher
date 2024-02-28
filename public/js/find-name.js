window.addEventListener('load', () => {
    let promises = [];
    const url = `http://localhost:8080/api/wisher/name`;
    fetch(url)
        .then((response) => response.json())
        .then((json) => {
            const element = document.getElementsByClassName('suggestion-zone__title')[0];
            element.textContent = json["response"]
        })
});
