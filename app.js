/* app.js */

async function getManifest(uri) {
	const response = await fetch(uri).catch(err => {alert(err); return err});
	const manifest = await response.json();
	showMetadata(manifest);
	showImages(manifest);
}

function showImages(data) {
	let container = document.getElementById("container");

	let html = "";
	data.sequences[0].canvases.forEach(elm => {
		html = html + `<div class="page"><a href="javascript:changeImage('` + elm.images[0].resource['@id'] + `');"><img src="${elm.thumbnail['@id']}" alt="${elm.label}"></a><small>${elm.label}</small></div>`;
	});

	container.innerHTML = html;
}

function showMetadata(data) {
	let sideBar = document.getElementById("side");
	let html = `<h2>${data.label}</h2>`;
	let tmp = "";
	data.metadata.forEach(elm => {
		tmp = tmp + `<tr><td>${elm.label}</td><td>${elm.value}</td></tr>`;
	});
	html = html + `<table>${tmp}</table>`;
	html = html + `<img src="${data.logo}" alt="${data.attribution}">`;

	sideBar.innerHTML = html;
}

function changeImage(uri) {
	let imageArea = document.getElementById("image");
	imageArea.childNodes.forEach(elem => {elem.remove()});
	let image = document.createElement("img");
	image.setAttribute("src", uri);
	image.setAttribute("alt", "main_image");

	imageArea.appendChild(image);
}
