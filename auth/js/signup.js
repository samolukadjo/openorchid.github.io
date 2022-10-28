var signUp = document.getElementById('signup');
var signUpUsername = document.getElementById('signup-username');
var signUpEmail = document.getElementById('signup-email');
var signUpPassword = document.getElementById('signup-password');
var signUpConfirmPassword = document.getElementById('signup-confirm-password');
var signUpBirthdate = document.getElementById('signup-birth-date');
var signUpCancelButton = document.getElementById('signup-cancel-button');
var signUpSubmitButton = document.getElementById('signup-submit-button');

signUpCancelButton.addEventListener('click', () => {
  location.href = '/';
});

signUp.addEventListener('submit', (evt) => {
  evt.preventDefault();

  console.log('Signing Up...');
  if (signUpPassword.value == signUpConfirmPassword.value) {
    try {
      OrchidServices.auth.signUp(signUpUsername.value, signUpEmail.value, signUpPassword.value, signUpBirthdate.value);
      location.href = '/';
    } catch(e) {
      triggerError('error-somethingWentWrong');
    }
  } else {
    triggerError('error-passwordNotMatching');
  }
});

var signUpError = document.getElementById('signup-error');
function triggerError(message) {
  signUpError.dataset.l10nId = message;
  signUpError.classList.add('visible');
  setTimeout(() => {
    signUpError.classList.remove('visible');
  }, 2000);
}