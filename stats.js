function fetchData() {
    fetch('https://statcord.com/api/bots/877644741339144244/stats')
        .then(response => response.json())
        .then(data => {
            const mainStats = data.mainStats;
            
            const shardsData = mainStats.stats.find(e => e.name === 'Shards').data.datasets[0].data;
            const shards = shardsData[shardsData.length - 1];

            const userData = mainStats.stats.find(e => e.name === 'User Count').data.datasets[0].data;
            const users = userData[userData.length - 1];

            const cpuData = mainStats.stats.find(e => e.name === 'CPU Usage').data.datasets[0].data;
            const cpu = cpuData[cpuData.length - 1];

            const ramData = mainStats.stats.find(e => e.name === 'Ram Usage').data.datasets[0].data;
            const ram = ramData[ramData.length - 1];

            const guildData = mainStats.stats.find(e => e.name === 'Guild Growth').data.datasets[0].data;
            const guilds = guildData[guildData.length - 1];

            const membersData = mainStats.stats.find(e => e.name === 'Members').data.datasets[0].data;
            const members = membersData[membersData.length - 1];

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

            console.log(guilds);
            document.querySelector('#server-count').innerHTML = `<p>${guilds}+</p>`;
        })
        .catch(error => {
            console.log("Error fetching data:", error);
        });
}

fetchData();
