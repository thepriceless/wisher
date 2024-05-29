async function signup(event) {
  event.preventDefault();
  const loader = document.querySelector('.loader-zone');
  loader.style.display = 'flex';

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
    loader.style.display = 'none';
  } else if (response.status === 400) {
    loader.style.display = 'none';
    if (responseData.message === 'Nickname already reserved') {
      alert('Account with this nickname already exists');
    } else if (responseData.message === 'Max file size reached') {
      alert('Max file size (10 MB) reached. Upload another photo');
    } else if (responseData.message === 'Incorrect file extension') {
      alert('Incorrect file extension. You can use only .jpg, .jpeg and .png');
    } else {
      alert(
        'Проверьте правильность введенных данных. Каждое поле может содержать не более 25 символов. Никнейм может содержать только заглавные и прописные буквы английского алфавита, а также цифры. Остальные поля могут еще содержать другие знаки препинания, например тире. Русские буквы использовать нельзя.',
      );
    }
  }
}
