export function toggleUpload() {
  const btnUpload = document.querySelector('.btnUploadImage');
  const upload = document.querySelector('.userUploadImage');
  const closeUpload = document.querySelector('.closeUpload');
  const labelUpload = document.querySelector('.labelUserUpload');
  console.log('Event', upload);

  btnUpload.addEventListener('click', toggleModal);
  closeUpload.addEventListener('click', toggleModal);
  labelUpload.addEventListener('click', toggleModal);

  function toggleModal(e) {
    console.log('Event', upload);
    e.preventDefault();
    if (upload.classList.contains('userFadeIn')) {
      upload.classList.add('userFadeOut');
      upload.classList.remove('userFadeIn');
      labelUpload.style.display = 'flex';
    } else {
      upload.classList.add('userFadeIn');
      upload.classList.remove('userFadeOut');
      labelUpload.style.display = 'none';
    }
  }
}
