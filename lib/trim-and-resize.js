(function() {
  window.trimAndResize = trimAndResize;

  function trimAndResize(canvas, size) {
    return faceapi.nets.tinyFaceDetector.load('./weights').then(function() {
      return faceapi.detectAllFaces(canvas, new faceapi.TinyFaceDetectorOptions()).then(function(list) {
        if (list.length) {
          return render(list, canvas, size);
        }

        return resize(trim(canvas), size);
      }).catch(function(err) {
        console.error(err);
      });
    }).catch(function(err) {
      console.error(err);
    });
  }

  function render(list, src, size) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var face = list[0];

    canvas.width = Math.min(face.box.width * 2, src.width);
    canvas.height = Math.min(face.box.height * 2, src.height);

    ctx.drawImage(
      src,
      Math.max(Math.min(face.box.width / 2 - face.box.left, 0), canvas.width - src.width),
      Math.max(Math.min(face.box.height / 2 - face.box.top, 0), canvas.height -src.height)
    );

    return resize(trim(canvas), size);
  }

  function trim(canvas) {
    var squareCanvas = document.createElement('canvas');
    var squareCtx = squareCanvas.getContext('2d');
    var size = Math.min(canvas.width, canvas.height);

    squareCanvas.width = squareCanvas.height = size;

    squareCtx.drawImage(
      canvas,
      (squareCanvas.width - canvas.width) / 2,
      (squareCanvas.height - canvas.height) / 2
    );

    return squareCanvas;
  }

  function resize(canvas, size) {
    var resizeCanvas = document.createElement('canvas');
    var resizeCtx = resizeCanvas.getContext('2d');
    var size = Math.min(size, 320);

    resizeCanvas.width = resizeCanvas.height = size;

    resizeCtx.drawImage(
      canvas,
      0,
      0,
      size,
      size
    );

    return resizeCanvas;
  }
})();