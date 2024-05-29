async function login(event) {
  event.preventDefault();
  const loader = document.querySelector('.loader-zone');
  loader.style.display = 'flex';
  const form = event.target;
  const formData = new FormData(form);
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(formData),
  });
  if (response.ok) {
    const data = await response.json();
    document.cookie = `AccessToken=${data.accessToken}; path=/; expires=${calculateExpirationTimeForJwt()}`;
    window.location.href = '/';
    loader.style.display = 'none';
  } else if (response.status === 401) {
    loader.style.display = 'none';
    const mainElement = document.querySelector('main');
    const messageElement = document.createElement('p');
    messageElement.textContent = 'Unauthorized: Invalid username or password';
    mainElement.appendChild(messageElement);
  }
}
