function checkout(type) {
    window.location.href = 'https://discord.com/api/oauth2/authorize?client_id=877644741339144244&redirect_uri=https://spyoweb.herokuapp.com/redirect&response_type=code&scope=identify&state=' + type;
}