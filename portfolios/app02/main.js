const URL = "https://www.jma.go.jp/bosai/forecast/data/forecast/210000.json"; //大垣

$(function () {
    // Axios
    const option = { responseType: "blob" };
    axios
        .get(URL, option)
        .then((res) => {
            // 通信が成功した場合
            res.data.text().then((str) => {
                let arr = JSON.parse(str);

                //対応表読み込み
                axios.get("./trans.JSON", option).then((ress) => {
                    ress.data.text().then((strr) => {
                        let tr = JSON.parse(strr);

                        let today = new Date(); //今日
                        let tomorrow = new Date(); //明日
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        let now_day = today.getDay(); //今日の曜日
                        let tomorrow_day = tomorrow.getDay(); //明日の曜日

                        //地名
                        let area_name = arr[0]["timeSeries"][0]["areas"][0]["area"]["name"];
                        $(".area_name").text(area_name);

                        //天気アイコン
                        $(".main_2 img").attr("src", "./images/" + tr[arr[0]["timeSeries"][0]["areas"][0]["weatherCodes"][0]]);

                        //気温
                        let temp_min = arr[0]["timeSeries"][2]["areas"][0]["temps"][0];
                        let temp_max = arr[0]["timeSeries"][2]["areas"][0]["temps"][1];
                        let temp_youbi = youbi(arr[0]["timeSeries"][2]["timeDefines"][1]);
                        //1つめのズレ
                        if (temp_youbi != now_day) {
                            temp_max = temp_min;
                            temp_min = "";
                        }
                        temp_youbi = youbi(arr[0]["timeSeries"][2]["timeDefines"][0]);
                        //2つめのズレ
                        if (temp_youbi != now_day) {
                            temp_max = "";
                        }
                        //最低気温を消す
                        if (temp_min == temp_max && temp_min != "" && temp_min != "") {
                            temp_min = "";
                        }
                        $(".main_3 .temp_min").text("朝の最低気温  " + (temp_min == "" ? "-" : temp_min + "°"));
                        $(".main_3 .temp_max").text("昼の最高気温  " + (temp_max == "" ? "-" : temp_max + "°"));

                        //予報
                        let i = 0;
                        let c = 0;
                        const y = ["日", "月", "火", "水", "木", "金", "土"];

                        //予報に今日の情報を表示しないようにずらす
                        let afteryoubi = youbi(arr[1]["timeSeries"][0]["timeDefines"][0]);
                        if (afteryoubi == now_day) {
                            i += 1;
                        }
                        let j = i + 5;

                        //表示のループ
                        for (i = i; i <= j; i++) {
                            c++;
                            //曜日
                            let t = arr[1]["timeSeries"][0]["timeDefines"][i];
                            let at = youbi(t);
                            let info = y[at];
                            $(".w_after .day_" + c + " .date").text(info + "曜日");

                            //降水確率
                            info = arr[1]["timeSeries"][0]["areas"][0]["pops"][i];
                            if (info == "") {
                                let tmdate = arr[0]["timeSeries"][1]["timeDefines"];
                                let sumpop = 0;
                                for (let ii = 0; ii < tmdate.length; ii++) {
                                    let tmyoubi = youbi(tmdate[ii]);
                                    if (tmyoubi != tomorrow_day) {
                                        continue;
                                    }
                                    sumpop += parseInt(arr[0]["timeSeries"][1]["areas"][0]["pops"][ii]);
                                }
                                //平均を求める
                                let avepop = (sumpop /= 4);
                                avepop = Math.round(sumpop / 10) * 10;
                                info = avepop;
                            }
                            $(".w_after .day_" + c + " .pop").text(info + "%");

                            //天気アイコン
                            info = arr[1]["timeSeries"][0]["areas"][0]["weatherCodes"][i];
                            $(".w_after .day_" + c + " .w_icon img").attr("src", "./images/" + tr[info]);

                            //気温
                            info = arr[1]["timeSeries"][1]["areas"][0]["tempsMin"][i];
                            if (info == "") {
                                let tmdate = arr[0]["timeSeries"][2]["timeDefines"];
                                for (let ii = 0; ii < tmdate.length; ii++) {
                                    let tmyoubi = youbi(tmdate[ii]);
                                    if (tmyoubi == tomorrow_day) {
                                        info = arr[0]["timeSeries"][2]["areas"][0]["temps"][ii]; //最低気温
                                        $(".w_after .day_" + c + " .temp_min").text(info + "°"); //最低気温表示
                                        info = arr[0]["timeSeries"][2]["areas"][0]["temps"][ii + 1]; //最高気温
                                        $(".w_after .day_" + c + " .temp_max").text(info + "°"); //最高気温表示
                                        break;
                                    }
                                }
                            } else {
                                $(".w_after .day_" + c + " .temp_min").text(info + "°");
                                //最高気温
                                info = arr[1]["timeSeries"][1]["areas"][0]["tempsMax"][i];
                                $(".w_after .day_" + c + " .temp_max").text(info + "°");
                            }
                        }
                    });
                    $("#date").text(month);
                });
            });
        })
        .catch((err) => {
            // 通信が失敗した場合
            console.log(err);
        });

    //日時->曜日
    function youbi(arrdate) {
        arrdate = arrdate.substr(0, 10); //yyyy-mm-ddに直す
        arrdate = arrdate.replace(/-/g, "/"); //yyyy/mm/ddに直す
        arrdate = new Date(arrdate);
        arrdate = arrdate.getDay();
        return arrdate;
    }
});
