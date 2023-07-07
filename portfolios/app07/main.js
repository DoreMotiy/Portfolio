let data;
let now_artifact;

class artifact {
    constructor() {
        this.artifact_type = this.pick_artifact_type();
        this.artifact_level = 0;
        this.sub_stats_quantity = this.decide_quantity();
        this.main_stat_type = this.decide_main_stat_type();
        this.main_stat_value = data["main_stat"]["value"][this.main_stat_type][this.artifact_level];
        this.sub_stat_types = new Array(this.sub_stats_quantity);
        this.sub_stat_values = new Array(this.sub_stats_quantity).fill(parseFloat(0));
        this.sub_stat_types = this.pick_sub_stats_type(this.get_data_of_sub_stat());
        for (let i = 0; i < this.sub_stats_quantity; i++) {
            this.sub_stat_values[i] = this.add_sub_stat_value(this.sub_stat_types[i], this.sub_stat_values[i]); //data["sub_stat"]["value"][this.sub_stat_types[i]][this.get_random_number(4)];
        }
        this.display_on_screen();
    }
    get_random_number(range) {
        return Math.floor(Math.random() * range);
    }
    pick_artifact_type() {
        return data["type"][this.get_random_number(data["type"].length)];
    }
    decide_quantity() {
        return this.get_random_number(100) < data["sub_stat"]["sub_stat_quantity_4"] ? 4 : 3;
    }
    pick_stat_type(data_object) {
        let rate = 0;
        let rand = this.get_random_number(10000);
        for (const prop_key in data_object) {
            rate += data_object[prop_key];
            if (rand < rate) {
                return prop_key;
            }
        }
    }
    decide_main_stat_type() {
        switch (data["type"].indexOf(this.artifact_type)) {
            case 0:
                return "HP";
            case 1:
                return "ATK";
            case 2:
                return this.pick_stat_type(data["main_stat"]["probability"]["sands"]);
            case 3:
                return this.pick_stat_type(data["main_stat"]["probability"]["goblet"]);
            case 4:
                return this.pick_stat_type(data["main_stat"]["probability"]["circlet"]);
        }
    }
    pick_sub_stats_type(data_object) {
        let sub_stat_types = new Array(this.sub_stats_quantity);
        for (let i = 0; i < this.sub_stats_quantity; i++) {
            let stat_type;
            do {
                switch (this.pick_stat_type(data_object)) {
                    case "real_numbers":
                        stat_type = data["group"]["real_number"][this.get_random_number(data["group"]["real_number"].length)];
                        break;
                    case "various":
                        stat_type = data["group"]["various"][this.get_random_number(data["group"]["various"].length)];
                        break;
                    case "crits":
                        stat_type = data["group"]["crit"][this.get_random_number(data["group"]["crit"].length)];
                        break;
                }
            } while (sub_stat_types.includes(stat_type) || stat_type == this.main_stat_type);
            sub_stat_types[i] = stat_type;
        }
        return sub_stat_types;
    }
    pick_4th_sub_stats_type(data_object) {
        let stat_type;
        do {
            switch (this.pick_stat_type(data_object)) {
                case "real_numbers":
                    stat_type = data["group"]["real_number"][this.get_random_number(data["group"]["real_number"].length)];
                    break;
                case "various":
                    stat_type = data["group"]["various"][this.get_random_number(data["group"]["various"].length)];
                    break;
                case "crits":
                    stat_type = data["group"]["crit"][this.get_random_number(data["group"]["crit"].length)];
                    break;
            }
        } while (this.sub_stat_types.includes(stat_type) || stat_type == this.main_stat_type);
        return stat_type;
    }
    get_data_of_sub_stat() {
        if (data["group"]["real_number"].includes(this.main_stat_type)) {
            return data["sub_stat"]["probability"]["flower_plume"];
        } else if (data["group"]["various"].includes(this.main_stat_type)) {
            return data["sub_stat"]["probability"]["various"];
        } else if (data["group"]["bounus"].includes(this.main_stat_type)) {
            return data["sub_stat"]["probability"]["bounus"];
        } else if (data["group"]["crit"].includes(this.main_stat_type)) {
            return data["sub_stat"]["probability"]["crit"];
        }
    }
    add_sub_stat_value(stat_type, value) {
        let value_to_add = data["sub_stat"]["value"][stat_type][this.get_random_number(4)];
        let sum_value = parseFloat(value + value_to_add);
        return sum_value;
    }
    fix_sub_stat_value(stat_type, value) {
        if (!data["group"]["not_decimal"].includes(stat_type)) {
            return parseFloat(value).toFixed(1);
        }
        return Math.round(value);
    }
    level_up_sub_stat() {
        let rand = this.get_random_number(4);
        let target_stat = this.sub_stat_types[rand];
        let target_value = this.sub_stat_values[rand];
        target_value = this.add_sub_stat_value(target_stat, target_value);
        this.fix_sub_stat_value(target_stat, target_value);
        this.sub_stat_values[rand] = target_value;
    }
    update_level() {
        if (this.artifact_level == 20) {
            return;
        }
        this.artifact_level++;
        this.main_stat_value = data["main_stat"]["value"][this.main_stat_type][this.artifact_level];
        if (this.artifact_level % 4 == 0) {
            if (this.sub_stats_quantity == 3) {
                this.sub_stats_quantity++;
                this.sub_stat_types.push(this.pick_4th_sub_stats_type(this.get_data_of_sub_stat()));
                this.sub_stat_values.push(data["sub_stat"]["value"][this.sub_stat_types[3]][this.get_random_number(4)]);
            } else {
                this.level_up_sub_stat();
            }
        }
        this.display_on_screen();
    }
    display_on_screen() {
        $(".artifact").text(data["translate"][this.artifact_type]);
        $(".main_op_name").text(data["translate"][this.main_stat_type]);
        $(".main_op_value").text(this.fix_sub_stat_value(this.main_stat_type, this.main_stat_value) + (data["group"]["percentage"].includes(this.main_stat_type) ? "%" : ""));
        for (let i = 0; i < this.sub_stats_quantity; i++) {
            let stat_type = this.sub_stat_types[i];
            let stat_value = this.sub_stat_values[i];
            $(".sub_op_" + i).text("・" + data["translate"][stat_type] + "+" + this.fix_sub_stat_value(stat_type, stat_value) + (data["group"]["percentage"].includes(stat_type) ? "%" : ""));
        }
        if (this.sub_stats_quantity == 4) {
            $(".sub_op_3").css("display", "initial");
        } else {
            $(".sub_op_3").css("display", "none");
        }
        $(".level").text("+" + this.artifact_level);
        $(".upper").css("padding", "10px 20px");
        $(".lower").css("padding", "20px 20px");
        $(".stars").css("display", "initial");
        $(".level").css("display", "initial");
        $(".btn").css("height", "100px");
        $(".enhance").css("display", "initial");
    }
}

$(function () {
    $(".generate").click(function () {
        now_artifact = new artifact();
    });

    $(".enhance").click(function () {
        now_artifact.update_level();
    });

    const option = {
        responseType: "blob",
    };
    axios.get("./data.json", option).then((res) => {
        res.data.text().then((str) => {
            data = JSON.parse(str);
        });
    });
});
