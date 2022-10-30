'use strict';
// Code copy-pasted from:
// https://code.tutsplus.com/tutorials/how-to-crop-or-resize-an-image-with-javascript--cms-40446

function resizeImage(imagePath, width, height, callback) {
  var image = new Image();
  image.src = imagePath;

  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  canvas.width = width;
  canvas.height = height;

  image.addEventListener('load', function() {
    ctx.drawImage(image, 0, 0, width, height);

    var exported = canvas.toDataURL("image/jpg", 0.9);
    callback(exported);
  });
}
