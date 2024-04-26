const SECONDS_IN_A_DAY = 86400;

async function signup(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);
  const response = await fetch('/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(formData),
  });
  if (response.ok) {
    const data = await response.json();
    const expirationTime = calculateExpirationTimeForJwt();
    document.cookie = `AccessToken=${data.access_token}; path=/; expires=${expirationTime}`;
    window.location.href = '/';
  } else if (response.status === 400) {
    const mainElement = document.querySelector('main');
    const messageElement = document.createElement('p');
    messageElement.textContent = 'Account with this nickname already exists';
    mainElement.appendChild(messageElement);
  }
}

function calculateExpirationTimeForJwt() {
  let now = new Date();
  let time = now.getTime();
  let expireTime = time + SECONDS_IN_A_DAY * 1000;
  now.setTime(expireTime);
  return now.toUTCString();
}
