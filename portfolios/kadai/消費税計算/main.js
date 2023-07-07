$(function () {
    //その他選択時だけ入力欄を追加で表示
    $("[name='tax-radio']").on("change", function () {
        if ($(this).attr("id") === "tax-other") {
            $("#tax-other-form").collapse("show");
        } else {
            $("#tax-other-form").collapse("hide");
        }
    });

    //計算するボタンクリック時
    $("#calc-tax").click(function () {
        let tax;
        let before_price;
        const re = /^[0-9]+$/;
        if ($("#tax-10").prop("checked")) {
            tax = 10;
        } else if ($("#tax-8").prop("checked")) {
            tax = 8;
        } else {
            tax = $("#input-tax").val();
            if (!re.test(tax)) {
                alert("正しく入力してください");
                return;
            }
            tax = parseInt(tax);
        }
        before_price = $("#before-price").val();
        if (!re.test(before_price)) {
            alert("正しく入力してください");
            return;
        }
        let after_price = Math.ceil((before_price * (100 + tax)) / 100);
        $("#after-price").val(after_price);
    });
});
