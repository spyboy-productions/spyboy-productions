function fetchData() {
    fetch('https://statcord.com/api/bots/877644741339144244/stats')
        .then(response => response.json())
        .then(data => {
            console.log("API Response:", data); // Log the entire API response for debugging

            const mainStats = data.mainStats;

            if (!mainStats || !mainStats.stats) {
                console.error("Invalid data structure or missing stats in API response.");
                return;
            }

            const shardsData = mainStats.stats.find(e => e.name === 'Shards')?.data.datasets[0]?.data || [];
            const shards = shardsData.length > 0 ? shardsData[shardsData.length - 1] : 0;

            const userData = mainStats.stats.find(e => e.name === 'User Count')?.data.datasets[0]?.data || [];
            const users = userData.length > 0 ? userData[userData.length - 1] : 0;

            const cpuData = mainStats.stats.find(e => e.name === 'CPU Usage')?.data.datasets[0]?.data || [];
            const cpu = cpuData.length > 0 ? cpuData[cpuData.length - 1] : 0;

            const ramData = mainStats.stats.find(e => e.name === 'Ram Usage')?.data.datasets[0]?.data || [];
            const ram = ramData.length > 0 ? ramData[ramData.length - 1] : 0;

            const guildData = mainStats.stats.find(e => e.name === 'Guild Growth')?.data.datasets[0]?.data || [];
            const guilds = guildData.length > 0 ? guildData[guildData.length - 1] : 0;

            const membersData = mainStats.stats.find(e => e.name === 'Members')?.data.datasets[0]?.data || [];
            const members = membersData.length > 0 ? membersData[membersData.length - 1] : 0;

            console.log("Users:", users);
            document.querySelector('#user-count').innerHTML = `<p>${users}+</p>`;

            console.log("Active Members:", members);
            document.querySelector('#active').innerHTML = `<p>${members}+</p>`;

            console.log("Shards:", shards);
            document.querySelector('#commands').innerHTML = `<p>${shards}+</p>`;

            console.log("CPU Load:", cpu);
            document.querySelector('#cpuload').innerHTML = `<p>${cpu}%</p>`;

            console.log("RAM Load:", ram);
            document.querySelector('#memload').innerHTML = `<p>${ram}%</p>`;

            console.log("Guilds:", guilds);
            document.querySelector('#server-count').innerHTML = `<p>${guilds}+</p>`;
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
}

fetchData();
