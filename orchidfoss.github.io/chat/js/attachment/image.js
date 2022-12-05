'use strict';
// Code copy-pasted from:
// https://code.tutsplus.com/tutorials/how-to-crop-or-resize-an-image-with-javascript--cms-40446

function resizeImage(imagePath, callback) {
  var image = new Image();
  image.src = imagePath;

  var w = image.width || 256;
  var h = image.height || 256;
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');

  image.addEventListener('load', function() {
    w = image.width || 256;
    h = image.height || 256;

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = w;
    canvas.height = h;

    ctx.drawImage(image, 0, 0, w, h);

    var exported = canvas.toDataURL("image/jpg", 0.9);
    callback(exported);
  });
}
