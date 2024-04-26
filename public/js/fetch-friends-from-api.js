function fetchData(url) {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed');
                }
                return response.json();
            })
            .then(data => resolve(data))
            .catch(error => reject(error));
    });
}

function renderData(friendsItems) {
    for (let friend of friendsItems) {
        const template = document.getElementsByClassName('friend-template')[0];
        const clone = template.content.cloneNode(true);
        if (friend.url !== null) {
            clone.querySelector('.friend-photo').setAttribute('src', friend.url)
        }
        clone.querySelector('.friend-name').textContent = friend.title;
        document.getElementsByClassName('friends-list')[0].appendChild(clone);
    }
}

window.addEventListener('load', () => {
    const preloader = document.getElementsByClassName('preloader')[0]

    let startId = Math.random();
    while (startId < 100) startId *= 10;
    startId = Math.floor(startId);

    let promises = [];
    for (let i = startId; i <= startId + 1000; i++) {
        const url = `https://jsonplaceholder.typicode.com/photos?id=${i}`;
        promises.push(fetchData(url));
    }

    Promise.all(promises)
    .then(dataArrays => {
        let data = [].concat(...dataArrays);
        preloader.setAttribute('style', 'display: none');
        renderData(data);
    })
    .catch(error => {
        preloader.setAttribute('style', 'display: none');
        const errorMessage = document.createElement('div');
        errorMessage.textContent = '⚠ Something went wrong';
        errorMessage.style.fontSize = '30px'
        document.getElementsByClassName('friends-list')[0].appendChild(errorMessage);
    });
});
