async function signup(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    body: formData,
  });
  const responseData = await response.json();
  if (response.ok) {
    const expirationTime = calculateExpirationTimeForJwt();
    document.cookie = `AccessToken=${responseData.accessToken}; path=/; expires=${expirationTime}`;
    window.location.href = '/';
  } else if (response.status === 400) {
    if (responseData.message === 'Nickname already reserved') {
      alert('Account with this nickname already exists');
    } else {
      alert(
        'Проверьте правильность введенных данных. Каждое поле может содержать не более 25 символов. Никнейм может содержать только заглавные и прописные буквы английского алфавита, а также цифры. Остальные поля могут еще содержать другие знаки препинания, например тире. Русские буквы использовать нельзя.',
      );
    }
  }
}
