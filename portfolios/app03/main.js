$(document).ready(() => {
    let enough = true;
    let tax = false;
    let extravagance = false;

    const tax_value = 1.1;

    $(".amount").val("");
    $(".people").val("");
    $(".unit").val(1);
    $(".payment").val("");
    $(".compensation").val("");

    $(".enough").click(function () {
        enough = !enough;
        if (enough) {
            $(this).text("少なめに支払う");
            $(".compensation_group p").text("不足");
        } else {
            $(this).text("多めに支払う");
            $(".compensation_group p").text("余分");
        }
        calc();
    });

    $(".tax").click(function () {
        tax = !tax;
        if (tax) {
            $(this).text("税込");
        } else {
            $(this).text("税抜");
        }
        calc();
    });

    $(".extravagance").click(function () {
        extravagance = !extravagance;
        if (extravagance) {
            $(this).text("奢りモード");
            $(".pagestylesheet").attr("href", "./css/extravagance.css");
        } else {
            $(this).text("通常");
            $(".pagestylesheet").attr("href", "./css/default.css");
        }
        $(".female_people").val("");
        $(".female_magnification").val(2);
        $(".female_payment").val("");
    });

    $(".execution").click(function () {
        calc();
    });

    function calc() {
        let amount = parseInt($(".amount").val());
        let people = parseInt($(".people").val());
        let unit = parseInt($(".unit").val());
        let female_people;
        let female_magnification;
        let female_payment;
        let default_people;
        let payment;
        let compensation;

        if (isNumber(amount) || isNumber(people) || isNumber(unit)) {
            $(".payment").val("数値が正しくないです");
            $(".compensation").val("数値が正しくないです");
            return;
        }

        if (extravagance) {
            female_people = parseInt($(".female_people").val());
            female_magnification = parseInt($(".female_magnification").val());
            if (isNumber(female_people) || isNumber(female_magnification)) {
                $(".female_payment").val("数値が正しくないです");
                $(".payment").val("数値が正しくないです");
                $(".compensation").val("数値が正しくないです");
                return;
            }
        }

        if (tax) {
            amount = Math.ceil(amount * tax_value);
        }

        if (extravagance) {
            default_people = parseInt((people - female_people) * (female_magnification - 1));
            people += default_people;
            if (enough) {
                female_payment = Math.floor(amount / people / unit) * unit;
                payment = Math.floor((amount - female_payment * female_people) / default_people / unit) * unit;
                compensation = amount - payment * default_people - female_payment * female_people;
                $(".female_payment").val(female_payment);
                $(".payment").val(payment);
                $(".compensation").val(compensation);
            } else {
                female_payment = Math.floor(amount / people / unit) * unit;
                payment = Math.ceil((amount - female_payment * female_people) / default_people / unit) * unit;
                compensation = payment * default_people + female_payment * female_people - amount;
                $(".female_payment").val(female_payment);
                $(".payment").val(payment);
                $(".compensation").val(compensation);
            }
        } else {
            if (enough) {
                payment = Math.floor(amount / people / unit) * unit;
                compensation = amount - payment * people;
                $(".payment").val(payment);
                $(".compensation").val(compensation);
            } else {
                payment = Math.ceil(amount / people / unit) * unit;
                compensation = payment * people - amount;
                $(".payment").val(payment);
                $(".compensation").val(compensation);
            }
        }
    }

    //数字チェック
    function isNumber(val) {
        var regexp = new RegExp(/^[0-9]+(\.[0-9]+)?$/);
        return regexp.test(val) == false || val == 0;
    }
});
