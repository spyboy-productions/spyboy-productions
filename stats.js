function fetchData() {
  fetch('https://statcord.com/api/bots/877644741339144244/stats')
    .then(response => response.json())
    .then(data => {
      document.querySelector('#server-count').innerHTML = `<p>${data.guildCount}+</p>`;
      // Update other elements similarly:
      document.querySelector('#user-count').innerHTML = `<p>${data.userCount}+</p>`;
      document.querySelector('#active').innerHTML = `<p>${data.members}+</p>`;
      document.querySelector('#commands').innerHTML = `<p>${data.shardCount}+</p>`;
      document.querySelector('#cpuload').innerHTML = `<p>${data.cpuUsage}%</p>`;
      document.querySelector('#memload').innerHTML = `<p>${data.ramUsage}%</p>`;
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}
