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

window.addEventListener('load', () => {
  const photoInput = document.getElementById('photoInput');
  const uploadButton = document.getElementById('uploadButton');
  photoInput.addEventListener('change', function () {
    // If a file is selected, change the text of the button
    if (photoInput.files.length > 0) {
      uploadButton.textContent = 'Photo uploaded \u2713';
      uploadButton.style.backgroundColor = '#3ABE46';
    }
  });

  uploadButton.addEventListener('click', function () {
    photoInput.click();
  });

  uploadButton.addEventListener('mouseover', function () {
    if (photoInput.files.length === 0) {
      uploadButton.style.backgroundColor = '#bbc1c5';
    }
  });
  uploadButton.addEventListener('mouseout', function () {
    if (photoInput.files.length === 0) {
      uploadButton.style.backgroundColor = '#2c89ed';
    }
  });
});
