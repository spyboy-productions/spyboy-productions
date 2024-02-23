function fetchData() {
    fetch('https://statcord.com/api/bots/877644741339144244/stats')
        .then(response => response.json())
        .then(data => {
            const stats = data.data[0];

            const serverCount = stats.guildCount || 0;
            const userCount = stats.userCount || 0;
            const cpuLoad = stats.cpuUsage || 0;
            const memLoad = stats.ramUsage || 0;
            const activeMembers = stats.members || 0;
            const commandsExecuted = stats.shardCount || 0;

            console.log(userCount);
            document.querySelector('#user-count').innerHTML = `<p>${userCount}+</p>`;

            console.log(activeMembers);
            document.querySelector('#active').innerHTML = `<p>${activeMembers}+</p>`;

            console.log(commandsExecuted);
            document.querySelector('#commands').innerHTML = `<p>${commandsExecuted}+</p>`;

            console.log(cpuLoad);
            document.querySelector('#cpuload').innerHTML = `<p>${cpuLoad}%</p>`;

            console.log(memLoad);
            document.querySelector('#memload').innerHTML = `<p>${memLoad}%</p>`;

            console.log(serverCount);
            document.querySelector('#server-count').innerHTML = `<p>${serverCount}+</p>`;
        })
        .catch(error => {
            console.log("Error fetching data:", error);
        });
}

fetchData();
