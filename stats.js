function fetchData() {
    fetch('https://statcord.com/api/bots/877644741339144244/stats')
        .then(response => response.json())
        .then(data => {
            const shards = data.mainStats.stats.find(e => e.name === 'Shards').data.datasets[0].data.slice(-1)[0];
            const users = data.mainStats.stats.find(e => e.name === 'User Count').data.datasets[0].data.slice(-1)[0];
            const cpu = data.mainStats.stats.find(e => e.name === 'CPU Usage').data.datasets[0].data.slice(-1)[0];
            const ram = data.mainStats.stats.find(e => e.name === 'Ram Usage').data.datasets[0].data.slice(-1)[0];
            const guilds = data.mainStats.stats.find(e => e.name === 'Guild Growth').data.datasets[0].data.slice(-1)[0];
            const members = data.mainStats.stats.find(e => e.name === 'Members').data.datasets[0].data.slice(-1)[0];

            console.log(users);
            document.querySelector('#user-count').innerHTML = `<p>${users}+</p>`;

            console.log(members);
            document.querySelector('#active').innerHTML = `<p>${members}+</p>`;

            console.log(shards);
            document.querySelector('#commands').innerHTML = `<p>${shards}+</p>`;

            console.log(cpu);
            document.querySelector('#cpuload').innerHTML = `<p>${cpu}%</p>`;

            console.log(ram);
            document.querySelector('#memload').innerHTML = `<p>${ram}%</p>`;
        })
        .catch(error => {
            console.log(error);
        });
}

fetchData();
