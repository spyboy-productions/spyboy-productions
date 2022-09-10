function checkout(type) {
    window.location.href = 'https://discord.com/api/oauth2/authorize?client_id=877644741339144244&redirect_uri=https://spyoweb.herokuapp.com/redirect&response_type=code&scope=identify&state=' + type;
}
function openPortal() {
    window.location.href = 'https://discord.com/api/oauth2/authorize?client_id=877644741339144244&redirect_uri=https://spyoweb.herokuapp.com/redirect&response_type=code&scope=identify&state=P';
}

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
if (urlParams.get('t') === '1') {
    alert('Your discord account does not have a premium subscription.');
}