async function signup(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    body: formData,
  });
  if (response.ok) {
    const data = await response.json();
    const expirationTime = calculateExpirationTimeForJwt();
    document.cookie = `AccessToken=${data.accessToken}; path=/; expires=${expirationTime}`;
    window.location.href = '/';
  } else if (response.status === 400) {
    alert('Account with this nickname already exists');
  }
}
