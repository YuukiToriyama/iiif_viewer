/* app.js */

var canvases = [];

// leaflet.jsをもちいて画像を表示する
var viewer = L.map("viewer", {
	maxZoom: 13,
	minZoom: 1,
	crs: L.CRS.Simple
});

/*
var image = {
	//url: "https://www.dl.ndl.go.jp/api/iiif/2532216/R0000006/0,0,5933,4920/742,/0/default.jpg",
	url: "super_azusa_353.jpg",
	width: 742,
	height: 615
}
*/

// テキストフォームにマニフェストのURLを入力すると表示ができるしくみ
var submitButton = document.getElementById("submit");
submitButton.addEventListener("click", () => {
	var manifestURI = document.getElementById("manifest-uri").value;
	getManifest(manifestURI);
})

// 画像を表示
const showImage = image => {
	var imageBounds = L.latLngBounds(
		[0, 0],
		[image.height/30, image.width/30]
	);
	viewer.fitBounds(imageBounds);
	L.imageOverlay(image.url, imageBounds, {
		attribution: ' <a href="#">hogehoge.com</a>'
	}).addTo(viewer);
}


// マニフェストを取得
const getManifest = async uri => {
	const response = await fetch(uri).catch(err => {alert(err); return err});
	const manifest = await response.json();
	//showMetadata(manifest);
	//showImages(manifest);
	console.log(manifest);
	manifestToObjects(manifest);
}

const manifestToObjects = manifest => {
	var metadata = manifest["metadata"];
	var attribution = {
		"licence": manifest["license"],
		"attribution": manifest["attribution"],
		"logo": manifest["logo"],
		"seeAlso": manifest["seeAlso"]
	}
	canvases = manifest["sequences"][0]["canvases"];

	showMetadata(metadata);
	showThumbnails(canvases)
	changeImage(1);
}

// メタデータを表示
const showMetadata = metadata => {
	let details = document.getElementById("metadata");
	let html = "<summary>この資料の情報を表示</summary>";
	let tmp = metadata.map(elm => "<tr><td>" + elm["label"] + "</td><td>" + elm["value"] + "</td></tr>").join("");
	html = html + "<table>" + tmp + "</table>";
	details.innerHTML = html;
}

// サムネイルを表示
const showThumbnails = canvases => {
	let div = document.getElementById("thumbnails");
	let thumbnails = canvases.map(canvas => [canvas["label"], canvas["thumbnail"]["@id"]]);
	let html = thumbnails.map(elm => '<div class="page"><a href="javascript:changeImage(' + elm[0] + ');"><img src="' + elm[1] + '"></a><small>' + elm[0] + '</small></div>').join("");
	div.innerHTML = html;
}

// 画像を変更
const changeImage = id => {
	let canvas = canvases[id - 1];
	let resource = canvas["images"][0]["resource"]
	let image = {
		url: resource["@id"],
		format: resource["image/jpeg"],
		width: resource["width"],
		height: resource["height"]
	}
	showImage(image);
}
