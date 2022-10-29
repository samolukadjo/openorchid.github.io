window.addEventListener('load', function() {
  var form = content.querySelector('#swa');
  var appIcon = content.querySelector('#swa-icon');
  var appTeaser = content.querySelector('#swa-teaser');
  var appName = content.querySelector('#swa-name');
  var appDescription = content.querySelector('#swa-description');
  var appScreenshots = content.querySelector('#swa-screenshots');
  var appDownload = content.querySelector('#swa-download');
  var appHasAds = content.querySelector('#swa-has-ads');
  var appHasTracking = content.querySelector('#swa-has-tracking');
  var appCategories = content.querySelector('#swa-categories');
  var appTags = content.querySelector('#swa-tags');
  var appJsonData = content.querySelector('#swa-json');

  var inputChange = [appIcon, appTeaser, appName, appDescription, appScreenshots, appDownload, appHasAds, appHasTracking, appCategories, appTags];
  inputChange.forEach((item) => {
    item.addEventListener('change', () => {
      updateJson();
    });
  });

  var object;

  function getBase64(file, callback) {
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        callback(reader.result);
      };
      reader.onerror = function (error) {
        console.log('Error: ', error);
        callback('about:blank');
      };
    } else {
      callback('about:blank');
    }
  }

  function updateJson() {
    var base64 = {};
    getBase64(appIcon.files[0], function(result) {
      base64.icon = result;

      getBase64(appDownload.files[0], function(result2) {
        base64.download = result2;

        object = {
          token: 'Will be randomly generated after uploading.',
          author_id: OrchidServices.userId().replaceAll(/\w(?=(?:[A-Za-z0-9]){4})/g, '#'),
          teaser_url: appTeaser.value,
          icon: base64.icon,
          name: appName.value,
          description: appDescription.value,
          published_at: Date.now(),
          download: base64.download,
          has_ads: appHasAds.checked,
          has_tracking: appHasTracking.checked,
          categories: appCategories.value.split(';'),
          tags: appTags.value.split(';'),
          comments: []
        };
        appJsonData.textContent = JSON.stringify(object, undefined, 2);
      });
    });
  }
  updateJson();

  form.addEventListener('submit', (evt) => {
    evt.preventDefault();
    OrchidServices.custom.createStoreApp(object);
    form.innerHTML = `<p>App uploaded successfully.</p>`
  });
});