var redirectUrl = '';

var login = document.getElementById('login');
var loginEmail = document.getElementById('login-email');
var loginPassword = document.getElementById('login-password');
var loginCancelButton = document.getElementById('login-cancel-button');
var loginSubmitButton = document.getElementById('login-submit-button');
var signUpLink = document.getElementById('signup-link');

loginCancelButton.addEventListener('click', () => {
  location.href = '/';
});

login.addEventListener('submit', (evt) => {
  evt.preventDefault();

  console.log('Logging In...');
  try {
    OrchidServices.auth.login(loginEmail.value, loginPassword.value);
    setTimeout(() => {
      location.href = '/';
    }, 500);
  } catch(e) {
    triggerError('error-somethingWentWrong');
  }
});

var loginError = document.getElementById('login-error');
function triggerError(message) {
  loginError.dataset.l10nId = message;
  loginError.classList.add('visible');
  setTimeout(() => {
    loginError.classList.remove('visible');
  }, 3000);
}

if (location.search !== "") {
  var pramaters = location.search.split("?")[1];
  let params_arr = pramaters.split("&");
  for (let i = 0; i < params_arr.length; i++) {
    let pair = params_arr[i].split("=");
    if (pair[0] == "redirect") {
      if (pair[1]) {
        redirectUrl = pair[1];
        signUpLink.href = '/auth/signup.html?redirect=' + pair[1];
      }
    }
  }
}
