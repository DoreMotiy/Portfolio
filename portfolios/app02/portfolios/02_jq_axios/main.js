console.log("main.js!!");

// Ready
$(document).ready(()=>{
	console.log("Ready!!");
	// Axiosを使ってみる!!
	const option = {responseType: "blob"};
	axios.get("https://www.jma.go.jp/bosai/forecast/data/forecast/130000.json", option).then(res=>{
		// 通信が成功した場合
		console.log("通信成功!!");
		console.log(res);// データそのもの
		res.data.text().then(str=>{
			let arr = JSON.parse(str);// JSONオブジェクトに変換
			console.log(arr);// データ確認
			console.log(arr[0]);// 0番目のデータ
			console.log(arr[0]["publishingOffice"]);// 気象庁
			console.log(arr[0]["reportDatetime"]);// 発令された日時
			console.log(arr[0]["timeSeries"][0]);// 0番目のデータ
			// 東京地方
			console.log(arr[0]["timeSeries"][0]["areas"][0]["area"]["name"]);// 東京地方
			console.log(arr[0]["timeSeries"][0]);// TODO:0.5メートル
			console.log(arr[0]["timeSeries"][0]);// TODO:晴れ　時々　くもり
			console.log(arr[0]["timeSeries"][0]);// TODO:南西の風
			// TODO:伊豆諸島北部
			console.log(arr[0]["timeSeries"][0]["areas"][1]["area"]["name"]);// 伊豆諸島北部
			// TODO:伊豆諸島南部
			// TODO:小笠原諸島

			// TODO: 東京地方の今日の天気を、HTMLに表示する!!(jQuery使ってね)
			// TODO: 東京地方の今日の天気を、天気アイコンで表示する!!(jQuery使ってね)



		});
	}).catch(err=>{
		// 通信が失敗した場合
		console.log("通信失敗...");
		console.log(err);// エラー内容
	});
});