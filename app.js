/* app.js */

function getManifest(uri) {
    var manifest = null;
    var httpObj = new XMLHttpRequest();
    httpObj.open("GET", uri, true);
    httpObj.onload = function () {
        manifest = JSON.parse(this.responseText);
        showMetadata(manifest);
        showImages(manifest);
    }
    httpObj.send(null);
}

function showImages(data) {
    var container = document.getElementById("container");

    var html = "";
    data.sequences[0].canvases.forEach(elm => {
        html = html + `<div class="page"><a href="javascript:changeImage('` + elm.images[0].resource['@id'] + `');"><img src="${elm.thumbnail['@id']}" alt="${elm.label}"></a><small>${elm.label}</small></div>`;
    });

    container.innerHTML = html;
}

function showMetadata(data) {
    var sideBar = document.getElementById("side");
    var html = `<h2>${data.label}</h2>`;
    var tmp = "";
    data.metadata.forEach(elm => {
        tmp = tmp + `<tr><td>${elm.label}</td><td>${elm.value}</td></tr>`;
    });
    html = html + `<table>${tmp}</table>`;
    html = html + `<img src="${data.logo}" alt="${data.attribution}">`;

    sideBar.innerHTML = html;
}

function changeImage(uri) {
    var imageArea = document.getElementById("image");

    var html = `<img src="${uri}" alt="main image">`;

    imageArea.innerHTML = html;
}