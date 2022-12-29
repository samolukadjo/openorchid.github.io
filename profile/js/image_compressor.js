'use strict';
// Code copy-pasted from:
// https://code.tutsplus.com/tutorials/how-to-crop-or-resize-an-image-with-javascript--cms-40446

function compressImage(imagePath, width, height, callback) {
  var image = new Image();
  image.src = imagePath;

  var w = width || image.width || 256;
  var h = height || image.height || 256;

  image.addEventListener('load', function() {
    w = width || image.width || 256;
    h = height || image.height || 256;

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = w;
    canvas.height = h;

    ctx.drawImage(image, 0, 0, w, h);

    var exported = canvas.toDataURL("image/jpg", 0.9);
    callback(exported);
  });
}
