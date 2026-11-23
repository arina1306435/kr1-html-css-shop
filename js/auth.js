// Практика: простой аккаунт на localStorage (учебный, без реальной безопасности)
(function () {
  'use strict';

  var USERS_KEY = 'zd-users';
  var SESSION_KEY = 'zd-session';

  function getUsers() {
    try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
    catch (e) { return []; }
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function setSession(email) {
    localStorage.setItem(SESSION_KEY, email);
  }

  function getSession() {
    return localStorage.getItem(SESSION_KEY);
  }

  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
  }

  function show(el, on) { el.hidden = !on; }

  function showError(el, text) {
    el.textContent = text;
    el.hidden = false;
  }

  // Обновляет кнопку в шапке
  function refreshHeader() {
    var btnText = document.getElementById('account-btn-text');
    var btn = document.getElementById('account-btn');
    if (!btnText || !btn) return;
    var session = getSession();
    if (session) {
      var users = getUsers();
      var user = users.find(function (u) { return u.email === session; });
      btnText.textContent = user ? user.name : 'Аккаунт';
      btn.setAttribute('aria-label', 'Открыть аккаунт');
    } else {
      btnText.textContent = 'Войти';
      btn.setAttribute('aria-label', 'Войти в аккаунт');
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var dialog = document.getElementById('account-dialog');
    if (!dialog) return;

    var openBtn = document.getElementById('account-btn');
    var closeBtn = document.getElementById('close-account-dialog');
    var tabLogin = document.getElementById('tab-login');
    var tabRegister = document.getElementById('tab-register');
    var loginForm = document.getElementById('login-form');
    var registerForm = document.getElementById('register-form');
    var accountPanel = document.getElementById('account-panel');
    var loginError = document.getElementById('login-error');
    var registerError = document.getElementById('register-error');

    function showTab(isLogin) {
      tabLogin.classList.toggle('is-active', isLogin);
      tabRegister.classList.toggle('is-active', !isLogin);
      tabLogin.setAttribute('aria-selected', isLogin);
      tabRegister.setAttribute('aria-selected', !isLogin);
      show(loginForm, isLogin);
      show(registerForm, !isLogin);
      show(accountPanel, false);
      loginError.hidden = true;
      registerError.hidden = true;
    }

    function showPanel() {
      var session = getSession();
      var user = getUsers().find(function (u) { return u.email === session; });
      if (!user) { showTab(true); return; }
      document.getElementById('account-name').textContent = user.name;
      document.getElementById('account-email').textContent = user.email;
      show(loginForm, false);
      show(registerForm, false);
      show(accountPanel, true);
    }

    openBtn.addEventListener('click', function () {
      if (getSession()) { showPanel(); } else { showTab(true); }
      dialog.showModal();
    });

    closeBtn.addEventListener('click', function () { dialog.close(); });

    tabLogin.addEventListener('click', function () { showTab(true); });
    tabRegister.addEventListener('click', function () { showTab(false); });

    // Регистрация
    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('reg-name').value.trim();
      var email = document.getElementById('reg-email').value.trim().toLowerCase();
      var password = document.getElementById('reg-password').value;
      var consent = document.getElementById('reg-consent').checked;

      if (!name || !email || !password) {
        showError(registerError, 'Заполните все поля.'); return;
      }
      if (password.length < 6) {
        showError(registerError, 'Пароль должен быть не короче 6 символов.'); return;
      }
      if (!consent) {
        showError(registerError, 'Нужно согласие на обработку персональных данных.'); return;
      }
      var users = getUsers();
      if (users.some(function (u) { return u.email === email; })) {
        showError(registerError, 'Пользователь с таким email уже зарегистрирован.'); return;
      }
      users.push({ name: name, email: email, password: password });
      saveUsers(users);
      setSession(email);
      refreshHeader();
      showPanel();
    });

    // Вход
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = document.getElementById('login-email').value.trim().toLowerCase();
      var password = document.getElementById('login-password').value;
      var user = getUsers().find(function (u) { return u.email === email && u.password === password; });
      if (!user) {
        showError(loginError, 'Неверный email или пароль.'); return;
      }
      setSession(email);
      refreshHeader();
      showPanel();
    });

    // Выход
    document.getElementById('logout-btn').addEventListener('click', function () {
      clearSession();
      refreshHeader();
      dialog.close();
    });

    refreshHeader();
  });
})();
