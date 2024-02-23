function fetchData() {
	fetch('https://statcord.com/api/bots/877644741339144244/stats').then(response => {
		return response.json();
	}).then(data => {
		console.log(data.data[0].servers);
		document.querySelector('#server-count').innerHTML = `<p>${data.data[0].servers}+</p>`
		console.log(data.data[0].users);
		document.querySelector('#user-count').innerHTML = `<p>${data.data[0].users}+</p>`
		console.log(data.data[0].active);
		document.querySelector('#active').innerHTML = `<p>${data.data[0].active}+</p>`
		console.log(data.data[0].commands);
		document.querySelector('#commands').innerHTML = `<p>${data.data[0].commands}+</p>`
		console.log(data.data[0].cpuload);
		document.querySelector('#cpuload').innerHTML = `<p>${data.data[0].cpuload}%</p>`
		console.log(data.data[0].memload);
		document.querySelector('#memload').innerHTML = `<p>${data.data[0].memload}%</p>`
	}).catch(error => {
		console.log(error);
	});
}

fetchData();
