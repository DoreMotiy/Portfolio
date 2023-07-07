console.log("main.js!!");
let snd_arr = new Array(8);
let btn_len = 9;

// Ready
$(function () {
    console.log("Ready!!");

    //ボタン作成
    let i;
    for (i = 0; i < btn_len; i++) {
        let elem = '<button id="snd_' + i + '">サウンド' + (i + 1) + "</button>";
        $("#s_btn").append(elem);
        let id = "#snd_" + i;
        $(id).css("width", 100);
        $(id).css("height", 100);
        $(id).css("border-radius", "20px");
        $(id).css("border", "none");
        $(id).attr("index", i);

        //サウンドオブジェクト
        snd_arr[i] = new Howl({
            src: ["sounds/s_" + (i + 1) + ".mp3"],
            loop: false,
            volume: 1.0,
        });

        //クリックイベント
        $(id).click(function () {
            let num = $(this).attr("index");
            snd_arr[num].play();
        });
    }
});
