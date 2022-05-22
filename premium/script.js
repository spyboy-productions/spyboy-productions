var loginBtn = document.getElementById('login-btn');
var checkoutBtn = document.getElementById('checkout-btn');
var loggedIn = document.getElementById('logged-in');

const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});
if (params.di != null && params.du != null) {
    localStorage.setItem('discordId', params.di);
    localStorage.setItem('discordUsername', params.du);
}

const discordUsername = localStorage.getItem('discordUsername');
const discordId = localStorage.getItem('discordId')

if (discordUsername != null && discordId != null) {
    loggedIn.innerText = 'Logged in as ' + discordUsername
    loginBtn.style.display = 'none';
    loggedIn.style.display = 'block'
    checkoutBtn.removeAttribute('disabled');
    checkoutBtn.classList.replace('disabled', 'enabled');
}

loginBtn.addEventListener('click', () => {
    fetch("https://discord.com/api/oauth2/authorize?client_id=877644741339144244&redirect_uri=https://spyoweb.herokuapp.com/redirect&response_type=code&scope=identify", {
      method: "GET",
      mode: 'no-cors',
    }).then(res => {
      console.log("Request complete! response:", res);
    });
});
checkoutBtn.addEventListener('click', () => {
    fetch("https://spyoweb.herokuapp.com/create-checkout-session", {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({'discord_id': discordId})
    }).then(res => {
      console.log("Request complete! response:", res);
    });
});