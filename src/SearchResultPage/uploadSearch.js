import axios from 'axios';

export function toggleUploadSearch() {
  const buttonUpload = document.querySelector('#img');
  const instanSearch = document.querySelector('.ais-InstantSearch');
  const loader = document.querySelector('.lds-roller');

  buttonUpload.onchange = function (e) {
    loader.classList.add('lds-roller-display');
    instanSearch.classList.add('opacity-instantsearch');
    let url = URL.createObjectURL(e.target.files[0]);

    const files = e.target.files;
    const name = e.target.name;

    const formData = new FormData();
    // append the files to FormData
    Array.from(Array(files.length).keys()).map((x) => {
      formData.append(name, files[x], files[x].name);
    });
    // save it
    const config = {
      'Ocp-Apim-Subscription-Key': 'f1610ceebfb84847beee7031159a5c65',
      'Content-Type': 'multipart/form-data',
    };
    axios
      .post(
        'https://eastus.api.cognitive.microsoft.com/vision/v3.2/detect?model-version=latest',
        formData,
        { headers: config }
      )
      .then((response) => {
        let resp = response.data.objects[0].object;
        window.location.href = `./searchResults.html?flagship_fashion%5Bquery%5D=${resp}`;
        loader.classList.remove('lds-roller-display');
        banner.classList.remove('hero-banner-opacity');
      })
      .catch((err) => {
        console.log('err', err);
      });
  };
}
