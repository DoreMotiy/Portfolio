const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

$(function () {
    function add_digit(num, base_n) {
        let digit = num % base_n;
        if (digit > 9) {
            return alphabet.charAt(digit - 10);
        }
        return digit;
    }

    function conversion(before, base_n) {
        let res = "";
        while (before >= base_n) {
            res = add_digit(before, base_n) + res;
            before = parseInt(before / base_n);
        }
        res = add_digit(before, 100) + res;
        $(".result").text(res + "です");
    }

    function check_number(num) {
        const pattern = /^([1-9]\d*|0)$/;
        return pattern.test(num);
    }

    $(".primary_btn").click(function () {
        let before_val = $(".before_val").val();
        let base_n = $(".base_n").val();
        if (check_number(before_val) && check_number(base_n)) {
            if (parseInt(base_n) >= 2 || parseInt(base_n) <= 36) {
                conversion(parseInt(before_val), parseInt(base_n));
            } else {
                alert("基数は36以下で入力してください");
            }
        } else {
            alert("正しい数字を入力してください");
        }
    });
});
