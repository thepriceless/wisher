window.addEventListener('load', () => {
  const photoInput = document.querySelector('.image-input');
  const uploadButton = document.querySelector('.upload-photo-button');

  if (uploadButton.classList.contains('image-attached')) {
    uploadButton.textContent = getButtonSuccessTextByElementId(photoInput.id);
    uploadButton.style.backgroundColor = '#ed8f2c';
  }

  photoInput.addEventListener('change', function () {
    if (photoInput.files.length > 0) {
      uploadButton.textContent = getButtonSuccessTextByElementId(photoInput.id);
      uploadButton.style.backgroundColor = '#ed8f2c';
    } else {
      uploadButton.classList.remove('image-attached');
      uploadButton.textContent = getButtonDefaultTextByElementId(photoInput.id);
      uploadButton.style.backgroundColor = '#f4f4f4';
    }
  });

  uploadButton.addEventListener('click', function () {
    photoInput.click();
  });

  uploadButton.addEventListener('mouseover', function () {
    if (
      photoInput.files.length === 0 &&
      !uploadButton.classList.contains('image-attached')
    ) {
      uploadButton.style.backgroundColor = '#f2a859';
    }
  });

  uploadButton.addEventListener('mouseout', function () {
    if (
      photoInput.files.length === 0 &&
      !uploadButton.classList.contains('image-attached')
    ) {
      uploadButton.style.backgroundColor = '#f4f4f4';
    }
  });
});

function getButtonSuccessTextByElementId(id) {
  switch (id) {
    case 'imageLink':
      return 'Image has been uploaded \u2713';

    default:
      return 'Profile photo has been uploaded \u2713';
  }
}

function getButtonDefaultTextByElementId(id) {
  switch (id) {
    case 'imageLink':
      return 'Attach wishitem image';

    default:
      return 'Upload profile photo';
  }
}
