// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-analytics.js";
import { getDatabase, ref, set, get, child, onValue } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

/*
 Version: v4.2.0
 Deprecated: No longer tested, documented, or maintained.
 Apache License 2.0: Copyright (c) 2010-2018 LiosK
*/
export var UUID;
UUID=function(f){function a(){}a.generate=function(){var b=a._getRandomInt,c=a._hexAligner;return c(b(32),8)+"-"+c(b(16),4)+"-"+c(16384|b(12),4)+"-"+c(32768|b(14),4)+"-"+c(b(48),12)};a._getRandomInt=function(b){if(0>b||53<b)return NaN;var c=0|1073741824*Math.random();return 30<b?c+1073741824*(0|Math.random()*(1<<b-30)):c>>>30-b};a._hexAligner=function(b,c){for(var a=b.toString(16),d=c-a.length,e="0";0<d;d>>>=1,e+=e)d&1&&(a=e+a);return a};a.overwrittenUUID=f;"object"===typeof module&&"object"===typeof module.exports&&
(module.exports=a);return a}(UUID);

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD3yIHNzt1psa2IXoz6sIy_TzzoWilQ7AA",
  authDomain: "wos-services.firebaseapp.com",
  databaseURL: "https://wos-services-default-rtdb.firebaseio.com",
  projectId: "wos-services",
  storageBucket: "wos-services.appspot.com",
  messagingSenderId: "737034653059",
  appId: "1:737034653059:web:3356e900ef70fcaf5ffab6",
  measurementId: "G-VRCW9TP40R"
};

window.addEventListener('load', function() {
  setDBItem('users/' + loginId + '/is_online', true);
});
window.addEventListener('beforeunload', function() {
  setDBItem('users/' + loginId + '/is_online', false);
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const database = getDatabase();

export var loginId = localStorage.getItem('wos_login');
export var isUserLoggedIn = loginId !== null ? true : false;
export var userHref = '/';

var identifier = (navigator.appCodeName + navigator.appName + navigator.deviceMemory + window.outerWidth + window.outerHeight + navigator.platform).replaceAll(' ', '').toLowerCase();
if (isUserLoggedIn) {
  try {
    navigator.getBattery().then(function(battery) {
      updateInfo(battery);
    });
  } catch(e) {
    updateInfo({level: 0.75});
  };
}

function updateInfo(battery) {
  setInterval(function() {
    getDBItem('users/' + loginId + '/username', function(data) {
      var shortName = data.split(/(?=[A-Z])/);
      if (shortName.includes(' ')) {
        shortName = shortName[0].split(' ', '');
      }
      shortName = shortName[0].toString();

      setDBItem('users/' + loginId + '/devices/' + identifier + '/name', shortName);
      setDBItem('users/' + loginId + '/devices/' + identifier + '/model', navigator.platform);
      setDBItem('users/' + loginId + '/devices/' + identifier + '/userAgent', navigator.userAgent);
      setDBItem('users/' + loginId + '/devices/' + identifier + '/battery', battery.level);
    });
    setDBItem('users/' + loginId + '/last_active', Date.now());
  }, 3000);
}

// User data
export function getDBItem(path, callback) {
  var refrence = ref(database, path);
  onValue(refrence, function(snapshot) {
    const data = snapshot.val();
    callback(data);
  });
}
export function getDBItemOnce(path, callback) {
  var refrence = ref(database);
  get(child(refrence, path)).then((snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      callback(data);
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
}
export function setDBItem(path, text) {
  set(ref(database, path), text);
}

// Outer user calls
export function writeUserData(name, email, password) {
  var userId = UUID.generate();
  var dateCreated = Date.now();
  
  setDBItem('users/' + userId, {
    username: name,
    email: email,
    password: password,
    profile_picture: 'https://ui-avatars.com/api/?name=' + name.replaceAll(' ', '+') + '&background=random',
    preferences: {},
    description: '',
    phone_number: '',
    date_created: dateCreated,
    devices: {},
    is_moderator: false,
    is_verified: false,
    notifications: {},
    clipboard: {},
    shopping_list: {},
    is_developer: false,
    is_supporter: false,
    last_active: dateCreated,
    is_online: false,
    chat_groups: {},
    friends: {},
    is_typing: false,
    geolocation: {
      latitude: 0,
      longitude: 0
    },
    followers: {},
    chat_tag: chatTag,
    bookmarks: {},
    history: {},
    is_child: false,
    birth_date: 0
  });
  inputUserDataWithId(userId);
  location.href = '/';
}

export function inputUserDataWithId(userId) {
  localStorage.setItem('wos_login', userId);
  loginId = userId;
  isUserLoggedIn = loginId !== null ? true : false;
  console.log('Logging in as ' + userId);
};

export function inputUserData(username, password) {
  var users = ref(database, 'users');
  console.log('Fetching logins from servers...');

  onValue(users, function(snapshot) {
    const data = snapshot.val();
    var entries = Object.entries(data);
    entries.forEach(function(entry) {
      if (entry[1].username == username || entry[1].email == username) {
        if (entry[1].password == password) {
          localStorage.setItem('wos_login', entry[0]);
          console.log('Logging in as ' + entry[1].email + ' with password ' + entry[1].password);
        } else {
          console.log('Invalid login password.');
        }
      } else {
        console.error('Invalid login username.');
      }
    });
  });
};

export function openLoginPrompt(type = 'login', callback) {
  var style = document.createElement('style');
  style.type = 'text/css';
  document.body.appendChild(style);
  style.innerHTML = `
    .wosui-login {
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: end;
      background: rgba(0,0,0,0.5);
      z-index: 100;
      font-size: 1.6rem;
    }

    .wosui-login > section {
      width: calc(100% - 2rem);
      padding: 0 1.5rem;
      box-sizing: border-box;
      background: #fff;
      box-shadow: 0 1rem 2rem rgba(0,0,0,0.2), 0 0.3rem 0.6rem rgba(0,0,0,0.3), 0 0.1rem 0.2rem rgba(0,0,0,0.2);
      margin: 1rem;
      max-height: calc(100% - 5.5rem);
      border-radius: 1.2rem;
      color: #333;
    }

    .dark-mode-enabled .wosui-login > section {
      background: #303030;
      color: #fff;
    }

    .wosui-login > section.opening {
      animation: wosui-dialogOpen 0.3s cubic-bezier(0.2, 0.9, 0.1, 1.25) forwards;
    }

    .wosui-login > section.closing {
      animation: wosui-dialogClose 0.3s cubic-bezier(0.2, 0.9, 0.1, 1.0) forwards;
    }

    @keyframes wosui-dialogOpen {
      from {
        transform: scale(0.9);
        opacity: 0;
      }
      to {
        transform: scale(1.0);
        opacity: 1;
      }
    }

    @keyframes wosui-dialogClose {
      from {
        transform: scale(1.0);
        opacity: 1;
      }
      to {
        transform: scale(0.9);
        opacity: 0;
      }
    }

    .wosui-login > section h1 {
      font-weight: bold;
      font-size: 1.6rem;
      padding: 0 1.5rem;
      box-sizing: border-box;
      margin: 0;
      height: 4.4rem;
      line-height: 4.4rem;
      border-bottom: solid 0.1rem rgba(0,0,0,0.125);
      overflow: hidden;
      display: block;
    }

    .wosui-login > section label {
      font-weight: normal;
      font-size: 1.6rem;
      padding: 1rem 1.5rem;
      box-sizing: border-box;
      margin: 0;
      line-height: 2.4rem;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .wosui-login > section label > input {
      margin: 0;
      height: 4rem;
      line-height: 4rem;
      background: #f0f6ff;
      border-radius: 0.4rem;
      border: none;
      padding: 0 1.5rem;
      box-sizing: border-box;
      font-size: 1.6rem;
      color: #333;
    }

    .dark-mode-enabled .wosui-login > section label > input {
      color: #fff;
    }

    .wosui-login > section a {
      display: block;
      padding: 1rem 1.5rem;
      color: #0061e0;
    }

    .dark-mode-enabled .wosui-login > section a {
      color: #80c2ff;
    }

    .wosui-login menu {
      width: calc(100% + 22px);
      height: 70px;
      padding: 1.5rem 0.5rem 1.5rem 1.5rem;
      margin: 0 -1.1rem 0.4rem;
      display: flex;
      box-sizing: border-box;
      border-radius: 8px;
      background: #e7e7e7;
    }

    .dark-mode-enabled .wosui-login menu {
      background: #383838;
    }

    .wosui-login menu button {
      height: 4rem;
      line-height: 4rem;
      background: transparent;
      border-radius: 2rem;
      border: none;
      padding: 0 2rem;
      margin: 0 0 0 1rem;
      font-size: 1.6rem;
      color: #333;
      transition: background-color 0.2s;
      flex: 1
    }
    html[dir="rtl"] .wosui-login menu button {
      margin: 0 1rem 0 0;
    }

    .dark-mode-enabled .wosui-login menu button {
      color: #fff;
    }

    .wosui-login menu button.recommend {
      background: #0061e0;
      color: #fff;
    }

    .dark-mode-enabled .wosui-login menu button.recommend {
      background: #00ddff;
      color: #000;
    }

    .wosui-login menu button.recommend:hover {
      background: #0051d0;
    }

    .dark-mode-enabled .wosui-login menu button.recommend:hover {
      background: #00cdef;
    }

    .wosui-login menu button.recommend:active {
      background: #0041c0;
    }

    .dark-mode-enabled .wosui-login menu button.recommend:active {
      background: #00bddf;
    }

    .wosui-login menu button:hover {
      background-color: rgba(0,0,0,0.05);
      transition: none;
    }

    .wosui-login menu button:active {
      background-color: rgba(0,0,0,0.1);
      transition: none;
    }

    @media screen and (min-width: 600px) {
      .wosui-login {
        align-items: center;
      }

      .wosui-login > section {
        width: 400px;
      }
    }
  `;

  var container = document.createElement('div');
  container.classList.add('wosui-login');
  document.body.appendChild(container);
  document.body.style.overflow = 'hidden';

  container.addEventListener('keydown', function(evt) {
    switch (evt.keyCode) {
      case 27:
        close();
        break;
    }
  });

  var dialog = document.createElement('section');
  dialog.classList.add('opening');
  dialog.addEventListener('transitionend', function() {
    dialog.classList.remove('opening');
  });
  container.appendChild(dialog);

  function close() {
    dialog.classList.add('closing');
    setTimeout(function() {
      dialog.classList.remove('closing');

      container.remove();
      style.remove();
      document.body.style.overflow = null;
    }, 300);
  }

  if (type == 'login') {
    dialog.innerHTML = `
      <section>
        <h1 data-l10n-id="login">Login</h1>
        <label>
          <span data-l10n-id="login-email">Email</span>
          <input data-l10n-id="login-email-input" type="email" class="email-input" required>
        </label>
        <label>
          <span data-l10n-id="login-password">Password</span>
          <input data-l10n-id="login-password-input" type="password" class="password-input" required>
        </label>
        <a href="#" class="signup-instead" data-l10n-id="login-createNew">Create New Account</a>
      </section>
      <menu>
        <button class="cancel-button" data-l10n-id="cancel">Cancel</button>
        <button class="login-button recommend" data-l10n-id="login">Login</button>
      </menu>
    `;
    var email = dialog.querySelector('.email-input');
    var password = dialog.querySelector('.password-input');
    var signUpInstead = dialog.querySelector('.signup-instead');
    var submitButton = dialog.querySelector('.login-button');
    var cancelButton = dialog.querySelector('.cancel-button');

    signUpInstead.onclick = function(evt) {
      close();
      openLoginPrompt('signup');
    };
    submitButton.onclick = function(evt) {
      try {
        inputUserData(email.value, password.value);
      } catch(e) {
        alert('Something went wrong whilst trying to login...');
      }
      close();
      callback();
    };
    cancelButton.onclick = function(evt) {
      close();
    };
  } else if (type == 'signup') {
    dialog.innerHTML = `
      <section>
        <h1 data-l10n-id="signUp">Sign Up</h1>
        <label>
          <span data-l10n-id="signUp-username">Username</span>
          <input data-l10n-id="signUp-username-input" type="text" class="username-input" required>
        </label>
        <label>
          <span data-l10n-id="signUp-email">Email</span>
          <input data-l10n-id="signUp-email-input" type="email" class="email-input" required>
        </label>
        <label>
          <span data-l10n-id="signUp-password">Password</span>
          <input data-l10n-id="signUp-password-input" type="password" class="password-input" required>
        </label>
        <label>
          <span data-l10n-id="signUp-passwordConfirm">Confirm Password</span>
          <input data-l10n-id="signUp-passwordConfirm-input" type="password" class="passwordconfirm-input" required>
        </label>
        <a href="#" class="login-instead" data-l10n-id="signUp-useExisting">Use Existing Login</a>
      </section>
      <menu>
        <button class="cancel-button" data-l10n-id="cancel">Cancel</button>
        <button class="signup-button recommend" data-l10n-id="signUp">Sign Up</button>
      </menu>
    `;
    var username = dialog.querySelector('.username-input');
    var email = dialog.querySelector('.email-input');
    var password = dialog.querySelector('.password-input');
    var passwordConfirm = dialog.querySelector('.passwordconfirm-input');
    var loginInstead = dialog.querySelector('.login-instead');
    var submitButton = dialog.querySelector('.signup-button');
    var cancelButton = dialog.querySelector('.cancel-button');

    loginInstead.onclick = function(evt) {
      close();
      openLoginPrompt('login');
    };
    submitButton.onclick = function(evt) {
      try {
        if (password.value == passwordConfirm.value) {
          writeUserData(username.value, email.value, password.value);
        } else {
          console.error('Something went wrong whilst trying to sign up...');
        }
      } catch(e) {
        console.error('Something went wrong whilst trying to sign up...');
      }
      close();
      callback();
    };
    cancelButton.onclick = function(evt) {
      close();
    };
  }
}
