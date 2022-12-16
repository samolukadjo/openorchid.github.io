var login = document.getElementById('login');
var loginEmail = document.getElementById('login-email');
var loginPassword = document.getElementById('login-password');
var loginCancelButton = document.getElementById('login-cancel-button');
var loginSubmitButton = document.getElementById('login-submit-button');

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
  }, 2000);
}
