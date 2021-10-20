import axios from 'axios';

export function toggleUploadSearch() {
  const buttonUpload = document.querySelector('#img');
  const instanSearch = document.querySelector('.ais-InstantSearch');
  const loader = document.querySelector('.lds-roller');
  console.log('LABEL', loader);

  buttonUpload.onchange = function (e) {
    console.log('Input', e);
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
    console.log('Form Data', formData);
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
        console.log('RESP', response.data.objects[0].object);
        let resp = response.data.objects[0].object;
        window.location.href = `./searchResults.html?flagship_transformed_index_V2%5Bquery%5D=${resp}`;
        loader.classList.remove('lds-roller-display');
        banner.classList.remove('hero-banner-opacity');
      })
      .catch((err) => {
        console.log('err', err);
      });
  };

  // function toggleModal(e) {
  //   console.log('COUCOU');
  //   const buttonUpload = document.querySelector('#img');
  //   e.preventDefault();
  //   buttonUpload.onchange = function (e) {
  //     console.log('Input', e);
  //     let url = URL.createObjectURL(e.target.files[0]);

  //     const files = e.target.files;
  //     const name = e.target.name;

  //     const formData = new FormData();
  //     // append the files to FormData
  //     Array.from(Array(files.length).keys()).map((x) => {
  //       formData.append(name, files[x], files[x].name);
  //     });
  //     // save it
  //     console.log('Form Data', formData);
  //     const config = {
  //       'Ocp-Apim-Subscription-Key': 'f1610ceebfb84847beee7031159a5c65',
  //       'Content-Type': 'multipart/form-data',
  //     };
  //     axios
  //       .post(
  //         'https://eastus.api.cognitive.microsoft.com/vision/v3.2/detect?model-version=latest',
  //         formData,
  //         { headers: config }
  //       )
  //       .then((response) => {
  //         console.log('RESP', response.data.objects[0].object);
  //         let resp = response.data.objects[0].object;
  //         window.location.href = `./searchResults.html?flagship_transformed_index_V2%5Bquery%5D=${resp}`;
  //       })
  //       .catch((err) => {
  //         console.log('err', err);
  //       });
  //   };
  //   if (upload.classList.contains('uploadFadeIn')) {
  //     upload.classList.add('uploadFadeOut');
  //     upload.classList.remove('uploadFadeIn');
  //     labelUpload.style.display = 'flex';
  //   } else {
  //     upload.classList.add('uploadFadeIn');
  //     upload.classList.remove('uploadFadeOut');
  //     labelUpload.style.display = 'none';
  //   }
  // }
}
