var loginBtn = document.getElementById('login-btn');
var checkoutBtn = document.getElementById('checkout-btn');
var loggedIn = document.getElementById('logged-in');
var form = document.getElementById('form');

const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});
if (params.t != null) {
    localStorage.setItem('token', params.t);
}

const token = localStorage.getItem('token');
var userId;
var username;

if (token != null) {
    fetch("https://spyoweb.herokuapp.com/get-user", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({'token': token})
    }).then(res => res.json()).then(data => {
        userId = data.user_id;
        if (userId === 'expired') {
            localStorage.removeItem('token');
            window.location.reload();
        }
        username = data.username;
        loggedIn.innerText = 'Logged in as ' + username;
        loginBtn.style.display = 'none';
        loggedIn.style.display = 'block'
        checkoutBtn.removeAttribute('disabled');
        checkoutBtn.classList.replace('disabled', 'enabled');
    });
}

loginBtn.addEventListener('click', () => {
    window.location.href = 'https://discord.com/api/oauth2/authorize?client_id=877644741339144244&redirect_uri=https://spyoweb.herokuapp.com/redirect&response_type=code&scope=identify'
});
checkoutBtn.addEventListener('click', () => {
    const hiddenField = document.createElement('input');
    hiddenField.type = 'hidden';
    hiddenField.name = 'userId';
    hiddenField.value = userId;
    form.appendChild(hiddenField);
    form.submit();
});