/* ==========================================================================
   ApexPlanet — Login & Registration UI
   Vanilla JS: tab switching, validation, password UX, dummy AJAX check
   ========================================================================== */
(function () {
  'use strict';

  document.getElementById('year').textContent = new Date().getFullYear();

  /* ------------------------------------------------------------------
     1. Tab switching (Login <-> Register)
     ------------------------------------------------------------------ */
  const tabLoginBtn = document.getElementById('tabLoginBtn');
  const tabRegisterBtn = document.getElementById('tabRegisterBtn');
  const tabPill = document.getElementById('tabPill');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  function showTab(target) {
    const isRegister = target === 'register';

    tabLoginBtn.classList.toggle('active', !isRegister);
    tabRegisterBtn.classList.toggle('active', isRegister);
    tabLoginBtn.setAttribute('aria-selected', String(!isRegister));
    tabRegisterBtn.setAttribute('aria-selected', String(isRegister));
    tabPill.classList.toggle('to-register', isRegister);

    loginForm.classList.toggle('active', !isRegister);
    registerForm.classList.toggle('active', isRegister);
  }

  tabLoginBtn.addEventListener('click', () => showTab('login'));
  tabRegisterBtn.addEventListener('click', () => showTab('register'));

  document.querySelectorAll('.link-btn[data-target]').forEach((btn) => {
    btn.addEventListener('click', () => showTab(btn.dataset.target));
  });

  /* ------------------------------------------------------------------
     2. Show / hide password toggles
     ------------------------------------------------------------------ */
  document.querySelectorAll('.toggle-eye').forEach((btn) => {
    btn.addEventListener('click', () => {
      const input = document.getElementById(btn.dataset.target);
      const icon = btn.querySelector('i');
      const isHidden = input.type === 'password';
      input.type = isHidden ? 'text' : 'password';
      icon.classList.toggle('bi-eye', !isHidden);
      icon.classList.toggle('bi-eye-slash', isHidden);
      btn.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
    });
  });

  /* ------------------------------------------------------------------
     3. Field-level validators
     ------------------------------------------------------------------ */
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setValidity(input, valid) {
    input.classList.toggle('is-invalid', !valid);
    input.classList.toggle('is-valid', valid);
  }

  function validateField(input) {
    let valid = true;
    if (input.type === 'email') {
      valid = EMAIL_RE.test(input.value.trim());
    } else if (input.required) {
      valid = input.value.trim().length >= (input.minLength > 0 ? input.minLength : 1);
    }
    setValidity(input, valid);
    return valid;
  }

  ['loginEmail', 'loginPassword', 'regName', 'regEmail', 'regPassword'].forEach((id) => {
    const el = document.getElementById(id);
    el.addEventListener('blur', () => validateField(el));
    el.addEventListener('input', () => {
      if (el.classList.contains('is-invalid') || el.classList.contains('is-valid')) {
        validateField(el);
      }
    });
  });

  /* ------------------------------------------------------------------
     4. Password strength meter (registration)
     ------------------------------------------------------------------ */
  const regPassword = document.getElementById('regPassword');
  const strengthMeter = document.getElementById('strengthMeter');
  const strengthLabel = document.getElementById('strengthLabel');

  function scorePassword(pw) {
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 10) score++;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
    if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  }

  regPassword.addEventListener('input', () => {
    const pw = regPassword.value;
    strengthMeter.classList.remove('weak', 'medium', 'strong', 'very-strong');
    if (!pw) {
      strengthLabel.textContent = '\u00A0';
      return;
    }
    const score = scorePassword(pw);
    const levels = ['weak', 'weak', 'medium', 'strong', 'very-strong'];
    const labels = ['Too short', 'Weak password', 'Medium strength', 'Strong password', 'Very strong password'];
    const level = levels[score] || 'weak';
    strengthMeter.classList.add(level);
    strengthLabel.textContent = labels[score] || labels[0];
    checkPasswordMatch();
  });

  /* ------------------------------------------------------------------
     5. Confirm password match check (live)
     ------------------------------------------------------------------ */
  const regConfirm = document.getElementById('regConfirm');
  const confirmFeedback = document.getElementById('confirmFeedback');

  function checkPasswordMatch() {
    if (!regConfirm.value) return true;
    const match = regConfirm.value === regPassword.value;
    setValidity(regConfirm, match);
    confirmFeedback.textContent = match ? '' : 'Passwords do not match.';
    return match;
  }
  regConfirm.addEventListener('input', checkPasswordMatch);
  regConfirm.addEventListener('blur', checkPasswordMatch);

  /* ------------------------------------------------------------------
     6. AJAX-style username availability check (dummy, no reload)
        Simulates hitting a PHP endpoint like:
        fetch('check-username.php?u=' + username)
     ------------------------------------------------------------------ */
  const regUsername = document.getElementById('regUsername');
  const usernameStatus = document.getElementById('usernameStatus');
  const usernameFeedback = document.getElementById('usernameFeedback');
  const TAKEN_USERNAMES = ['admin', 'test', 'apexplanet', 'root', 'user', 'demo'];
  let usernameTimer = null;
  let usernameAvailable = false;

  function fakeCheckUsernameEndpoint(username) {
    // Stand-in for: fetch(`check-username.php?u=${username}`).then(r => r.json())
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ available: !TAKEN_USERNAMES.includes(username.toLowerCase()) });
      }, 600);
    });
  }

  regUsername.addEventListener('input', () => {
    const value = regUsername.value.trim();
    clearTimeout(usernameTimer);
    usernameAvailable = false;

    if (value.length < 3) {
      usernameStatus.innerHTML = '';
      setValidity(regUsername, false);
      return;
    }

    usernameStatus.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span>';

    usernameTimer = setTimeout(() => {
      fakeCheckUsernameEndpoint(value).then((res) => {
        if (regUsername.value.trim() !== value) return; // stale response, ignore
        usernameAvailable = res.available;
        setValidity(regUsername, res.available);
        if (res.available) {
          usernameStatus.innerHTML = '<i class="bi bi-check-circle-fill"></i>';
        } else {
          usernameStatus.innerHTML = '<i class="bi bi-x-circle-fill"></i>';
          usernameFeedback.textContent = 'That username is already taken.';
        }
      });
    }, 450);
  });

  /* ------------------------------------------------------------------
     7. Form submit handlers (frontend-only — simulated network delay)
     ------------------------------------------------------------------ */
  function toggleSubmitLoading(button, loading) {
    button.disabled = loading;
    button.querySelector('.btn-label').classList.toggle('d-none', loading);
    button.querySelector('.spinner-border').classList.toggle('d-none', !loading);
  }
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    const emailOk = validateField(document.getElementById('loginEmail'));
    const passOk = validateField(document.getElementById('loginPassword'));

    if (!emailOk || !passOk) return;

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
        u => u.email === email && u.password === password
    );

    if (!user) {
        alert("Invalid Email or Password. Please register first.");
        return;
    }

    // Hide any previous error and show success
    const successAlert = document.getElementById("loginSuccessAlert");
    successAlert.classList.remove("d-none");

    const btn = document.getElementById("loginSubmit");
    toggleSubmitLoading(btn, true);

    setTimeout(() => {
        toggleSubmitLoading(btn, false);

        // Optional: redirect after successful login
        // window.location.href = "dashboard.html";
    }, 1000);
});

  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const username = document.getElementById('regUsername').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = regPassword.value;
    const nameOk = validateField(document.getElementById('regName'));
    const emailOk = validateField(document.getElementById('regEmail'));
    const passOk = validateField(regPassword);
    const matchOk = checkPasswordMatch() && regConfirm.value.length > 0;
    const termsBox = document.getElementById('agreeTerms');
    const termsOk = termsBox.checked;
    let usernameOk = regUsername.value.trim().length >= 3;
    if (!usernameAvailable) {
        usernameOk = false;
    }
    if (!nameOk || !emailOk || !passOk || !matchOk || !termsOk || !usernameOk)
        return;
    // Read existing users
    let users = JSON.parse(localStorage.getItem("users")) || [];
    // Check duplicate email
    if (users.some(user => user.email === email)) {
        alert("Email already registered!");
        return;
    }
    // Save user
    users.push({
        name,
        username,
        email,
        password
    });
    localStorage.setItem("users", JSON.stringify(users));
    const btn = document.getElementById('registerSubmit');
    toggleSubmitLoading(btn, true);
    setTimeout(() => {
        toggleSubmitLoading(btn, false);
        document.getElementById('registerSuccessAlert').classList.remove('d-none');
        registerForm.reset();
        // Automatically switch to Login
        showTab('login');
    }, 900);
});
})();
