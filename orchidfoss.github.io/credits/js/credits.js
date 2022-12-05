var credits = document.getElementById('credits');

setInterval(() => {
  credits.style.top = (credits.offsetTop - 1) + 'px';
}, 1000 / 60);