$(function () {
    //計算するボタンクリック時
    $("#calc-price").click(function () {
        let price;
        let distance;
        let consumption;
        price = $("#price").val();
        distance = $("#distance").val();
        consumption = $("#consumption").val();
        const re = /^[0-9]+$|^[0-9]+.[0-9]+$/;
        if (!re.test(price)) {
            alert("正しく入力してください");
            return;
        }
        if (!re.test(distance)) {
            alert("正しく入力してください");
            return;
        }
        if (!re.test(consumption)) {
            alert("正しく入力してください");
            return;
        }
        let final_price = Math.ceil((price * distance) / consumption);
        $("#final-price").val(final_price);
    });
});
