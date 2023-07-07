//干支の配列
const ETO = ["子（ねずみ）", "丑（うし）", "寅（とら）", "卯（うさぎ）", "辰（たつ）", "巳（へび）", "午（うま）", "未（ひつじ）", "申（さる）", "酉（とり）", "戌（いぬ）", "亥（いのしし）"];
//開始する西暦
const START_YEAR = 1924;

/**
 * 文字列をtdタグで囲います
 * @param {表に入れる文字列} str
 * @returns tdで囲われた文字列
 */
function addTdTag(str) {
    return "<td>" + str + "</td>";
}

$(function () {
    //現在の西暦
    const NOW_YEAR = new Date().getFullYear();
    //各テーブルの最初の西暦[1つめのテーブルの開始年,2つめのテーブルの開始年,2つ目のテーブルのループの終了条件用]
    let start_years = [START_YEAR, Math.ceil((NOW_YEAR + START_YEAR + 2) / 2), NOW_YEAR + 2];
    //テーブルを作成する
    for (let i = 0; i < 2; i++) {
        let elem = "";
        for (let y = start_years[i]; y < start_years[i + 1]; y++) {
            elem += "<tr>";
            //西暦を追加します
            elem += addTdTag(y.toString() + "年");
            //西暦から和暦に変換して追加します
            if (y <= 1925) {
                //大正
                elem += addTdTag("大正" + (y - 1921).toString() + "年");
            } else if (y <= 1926) {
                //昭和元年
                elem += addTdTag("大正15年<br>昭和元年");
            } else if (y <= 1988) {
                //昭和2年~
                elem += addTdTag("昭和" + (y - 1925).toString() + "年");
            } else if (y <= 1989) {
                //平成元年
                elem += addTdTag("昭和64年<br>平成元年");
            } else if (y <= 2018) {
                //平成2年~
                elem += addTdTag("平成" + (y - 1988).toString() + "年");
            } else if (y <= 2019) {
                //令和元年
                elem += addTdTag("平成31年<br>令和元年");
            } else {
                //令和2年~
                elem += addTdTag("令和" + (y - 2018).toString() + "年");
            }
            //西暦から年齢に変換して追加します
            elem += addTdTag((NOW_YEAR - y).toString() + "歳");
            //西暦から干支に変換して追加します
            elem += addTdTag(ETO[(y - 4) % 12]);
            elem += "</tr>";
        }
        //i番目のtbodyに追加します
        $("tbody").eq(i).append(elem);
    }
});
