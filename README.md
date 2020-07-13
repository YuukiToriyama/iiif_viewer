# iiif_viewer
IIIF Viewer using leaflet.js  

## 変更点
- 画像表示にleaflet.jsを使うようにしました
	- 拡大や縮小など、マウスによる操作が可能になりました
	- app.jsの中身も大幅に書き換えました。

## Usage
- つかいかた
	1. WEB上にあるIIIFマニフェスト(書籍の各ページの書影、メタデータをまとめあげるJSON形式のテキストファイル)のアドレスを入力欄に入れて「アクセス」ボタンをクリック。
	2. 各ページのサムネイル画像が列挙されれば読み込み成功
	3. 見たいコマのサムネイルをクリックすると表示画面に画像が表示されます。

## How to Install
1. このリポジトリをローカルにクローンする  
```bash
git clone https://github.com/YUUKIToriyama/iiif_viewer.git
```
2. 動かすのに必要なライブラリをインストールする  
```bash
npm install
```
3. サーバーを起動させます  
```bash
npm start
```

ウェブブラウザで[http://localhost:8989/](http://localhost:8989/)にアクセスし、画面が表示されればOKです。
