$(function () {
    //計算するボタンクリック時
    $("#calc-bmi").click(function () {
        let sintyo;
        let taiju;
        sintyo = $("#sintyo").val();
        taiju = $("#taiju").val();
        const re = /^[0-9]+$|^[0-9]+.[0-9]+$/;
        if (!re.test(sintyo)) {
            alert("正しく入力してください");
            return;
        }
        if (!re.test(taiju)) {
            alert("正しく入力してください");
            return;
        }
        sintyo /= 100;
        let bmi = Math.round((taiju / (sintyo * sintyo)) * 10) / 10;
        $("#bmi").val(bmi);
    });
});
