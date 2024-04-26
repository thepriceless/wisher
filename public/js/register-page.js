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
  const data = await response.json();
  console.log(data.access_token);
  localStorage.setItem('accessToken', data.access_token);
  window.location.href = '/';
}
