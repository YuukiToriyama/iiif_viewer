/* app.js */

var canvases;
var attribution;
var imageLayer;

// leaflet.jsをもちいて画像を表示する
var viewer = L.map("viewer", {
	center: [0,0],
	crs: L.CRS.Simple,
	zoom: 0
});

// テキストフォームにマニフェストのURLを入力すると表示ができるしくみ
var submitButton = document.getElementById("submit");
submitButton.addEventListener("click", () => {
	var manifestURI = document.getElementById("manifest-uri").value;
	getManifest(manifestURI);
})

// 画像を表示
const showImage = image => {
	if (viewer.hasLayer(imageLayer)) {
		viewer.removeLayer(imageLayer);
	}
	/*
	var imageBounds = L.latLngBounds(
		[0, 0],
		[image.height/30, image.width/30]
	);
	viewer.fitBounds(imageBounds);
	imageLayer = L.imageOverlay(image.url, imageBounds, {
		attribution: '<a href="' + attribution["license"] + '" target="_blank">' + attribution["attribution"] + '</a>'
	})
	*/
	imageLayer = L.tileLayer.iiif(image.manifest + "/info.json", {
		attribution: '<a href="' + attribution["license"] + '" target="_blank">' + attribution["attribution"] + '</a>',
		fitBounds: true
	})
	imageLayer.addTo(viewer);
}


// マニフェストを取得
const getManifest = async uri => {
	const response = await fetch(uri).catch(err => {alert(err); return err});
	const manifest = await response.json();
	manifestToObjects(manifest);
}

const manifestToObjects = manifest => {
	var metadata = manifest["metadata"];
	attribution = {
		"license": manifest["license"],
		"attribution": manifest["attribution"],
		"logo": manifest["logo"],
		"seeAlso": manifest["seeAlso"]
	}
	canvases = manifest["sequences"][0]["canvases"];

	showMetadata(metadata);
	showThumbnails(canvases)
	changeImage(0);
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
	let thumbnails = [];
	canvases.forEach((canvas, index) => {
		// iiifバージョンによる違い？
		/*
		if (canvas["thumbnail"]["@id"] == undefined) {
			thumbnails.push([index, canvas["label"], canvas["thumbnail"]])
		} else {
			thumbnails.push([index, canvas["label"], canvas["thumbnail"]["@id"]])
		}
		*/
		if (canvas.thumbnail != undefined) {
			if (canvas.thumbnail["@id"] != undefined) {
				thumbnails.push([index, canvas["label"], canvas["thumbnail"]["@id"]])
			} else {
				thumbnails.push([index, canvas["label"], canvas["thumbnail"]])
			}
		} else {
			thumbnails.push([index, canvas["label"], "image/image-not-found.png"])
		}
	})
	let html = thumbnails.map(elm => '<div class="page"><a href="javascript:changeImage(' + elm[0] + ');"><img src="' + elm[2] + '"></a><small>' + elm[1] + '</small></div>').join("");
	div.innerHTML = html;
}

// 画像を変更
const changeImage = id => {
	let canvas = canvases[id];
	let resource = canvas["images"][0]["resource"]
	let image = {
		url: resource["@id"],
		format: resource["image/jpeg"],
		width: resource["width"],
		height: resource["height"],
		manifest: resource["service"]["@id"]
	}
	showImage(image);
}
