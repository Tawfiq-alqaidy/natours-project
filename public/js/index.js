import '@babel/polyfill';
import { login, logout } from './login';
import { updateUserData, updatePassword } from './updateSetting';

// DOM ELEMENTS
const loginForm = document.querySelector('.form--login');
const logoutButton = document.querySelector('#logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');

// LOGIN
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

// LOGOUT
if (logoutButton) {
  logoutButton.addEventListener('click', (e) => {
    e.preventDefault();
    logout();
  });
}

// UPDATE USER DATA
if (userDataForm) {
  userDataForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    console.log('Submitting user data update:', { name, email });
    await updateUserData(name, email);
  });
}

// UPDATE PASSWORD
if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const currentPassword = document.querySelector('#password-current').value;
    const password = document.querySelector('#password').value;
    const passwordConfirm = document.querySelector('#password-confirm').value;

    console.log('Submitting password update:', {
      currentPassword,
      password,
      passwordConfirm,
    });
    await updatePassword(currentPassword, password, passwordConfirm);
  });
}
