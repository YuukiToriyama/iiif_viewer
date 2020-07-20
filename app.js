/* app.js */

const ImageViewer = function(id) {
	// 変数の初期化
	this.attribution;
	this.canvases;
	this.metadata;
	this.imageLayer;
	this.viewer = L.map(id, {
		center: [0, 0],
		crs: L.CRS.Simple,
		zoom: 0
	});

	
	// マニフェストを取得
	this.getManifest = async function (uri) {
		const response = await fetch(uri).catch(err => {alert(err); return err});
		const manifest = await response.json();
		this.manifestToObjects(manifest);
	};
	this.manifestToObjects = function (manifest) {
		this.metadata = manifest["metadata"];
		this.attribution = {
			"license": manifest["license"],
			"attribution": manifest["attribution"],
			"logo": manifest["logo"],
			"seeAlso": manifest["seeAlso"]
		}
		this.canvases = manifest["sequences"][0]["canvases"];
	
		this.showMetadata();
		this.showThumbnails()
		this.changeImage(0);
	}
	// メタデータを表示
	this.showMetadata = function () {
		let details = document.getElementById("metadata");
		let html = "<summary>この資料の情報を表示</summary>";
		let tmp = this.metadata.map(elm => "<tr><td>" + elm["label"] + "</td><td>" + elm["value"] + "</td></tr>").join("");
		html = html + "<table>" + tmp + "</table>";
		details.innerHTML = html;
	}

	// サムネイルを表示
	this.showThumbnails = function () {
		let div = document.getElementById("thumbnails");
		let thumbnails = [];
		this.canvases.forEach((canvas, index) => {
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
		let html = thumbnails.map(elm => `<div class="page"><a href="javascript:${id}.changeImage(${elm[0]});"><img src="${elm[2]}"></a><small>${elm[1]}</small></div>`).join("");
		div.innerHTML = html;
	}
	
	// 画像を変更
	this.changeImage = function (Pageid) {
		let canvas = this.canvases[Pageid];
		let resource = canvas["images"][0]["resource"]
		let image = {
			url: resource["@id"],
			format: resource["image/jpeg"],
			width: resource["width"],
			height: resource["height"],
			manifest: resource["service"]["@id"]
		}
		this.showImage(image);
	}

	// 画像を表示
	this.showImage = function (image) {
		if (this.viewer.hasLayer(this.imageLayer)) {
			this.viewer.removeLayer(this.imageLayer);
		}
		this.imageLayer = L.tileLayer.iiif(image.manifest + "/info.json", {
			attribution: '<a href="' + this.attribution["license"] + '" target="_blank">' + this.attribution["attribution"] + '</a>',
			fitBounds: true
		})
		this.imageLayer.addTo(this.viewer);
	}

	// テキストフォームに入力されたマニフェストを表示する
	document.getElementById("btn-" + id).addEventListener("click", () => {
		let manifestURI = document.getElementById("uri-" + id).value;
		this.getManifest(manifestURI);
	})
}

var viewer1 = new ImageViewer("viewer1");
