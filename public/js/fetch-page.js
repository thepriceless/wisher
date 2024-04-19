window.addEventListener('load', () => {
  const clientTime = performance.mark('pageEnd').startTime;

  fetch(window.location.pathname)
    .then((response) => {
      const serverTime = response.headers.get('X-Response-Time');

      const timeElement = document.getElementById('load-time');
      if (timeElement) {
        timeElement.textContent = `Page load time: ${serverTime.toString()} ms (server), ${clientTime.toString()} ms (client).`;
      }
    })
    .catch((error) => console.error('Error:', error));
});
