function fetchData() {
	fetch('https://statcord.com/api/bots/877644741339144244/stats').then(response => {
		return response.json();
	}).then(data => {
		console.log(data.data[0].guildCount);
		document.querySelector('#server-count').innerHTML = `<p>${data.data[0].guildCount}+</p>`
		console.log(data.data[0].userCount);
		document.querySelector('#user-count').innerHTML = `<p>${data.data[0].userCount}+</p>`
		console.log(data.data[0].members);
		document.querySelector('#active').innerHTML = `<p>${data.data[0].members}+</p>`
		console.log(data.data[0].shardCount);
		document.querySelector('#commands').innerHTML = `<p>${data.data[0].shardCount}+</p>`
		console.log(data.data[0].cpuUsage);
		document.querySelector('#cpuload').innerHTML = `<p>${data.data[0].cpuUsage}%</p>`
		console.log(data.data[0].ramUsage);
		document.querySelector('#memload').innerHTML = `<p>${data.data[0].ramUsage}%</p>`
	}).catch(error => {
		console.log(error);
	});
}

fetchData();
