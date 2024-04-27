async function login(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);
  console.log('wewer');
  const response = await fetch('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(formData),
  });
  if (response.ok) {
    const data = await response.json();
    document.cookie = `AccessToken=${data.access_token}; path=/; expires=${calculateExpirationTimeForJwt()}`;
    window.location.href = '/';
  } else if (response.status === 401) {
    const mainElement = document.querySelector('main');
    const messageElement = document.createElement('p');
    messageElement.textContent = 'Unauthorized: Invalid username or password';
    mainElement.appendChild(messageElement);
  }
}
