/** @type {number} 縦横のサイズ */
const HW = 9;
/** @type {number} マスの数 */
const HW_2 = 81;
/** @type {number} ブロックのサイズ */
const BLOCK_HW = 3;
/** @type {number} 数字の対応配列 */
const pow2 = [0, 1, 2, 4, 8, 16, 32, 64, 128, 256];
/** @type {Board} 答えを保存する */
let ansBoard;
/** @type {number} 答えの数を保存する */
let ansNum;

/**仮の問題データ */
let qdata = [
    [0, 0, 5, 3, 0, 0, 0, 0, 0],
    [8, 0, 0, 6, 0, 0, 0, 2, 0],
    [0, 7, 0, 0, 1, 0, 5, 0, 0],
    [4, 0, 0, 0, 0, 5, 3, 0, 0],
    [0, 1, 0, 0, 7, 0, 0, 0, 6],
    [0, 0, 3, 2, 0, 0, 0, 8, 0],
    [0, 6, 0, 5, 0, 0, 0, 0, 9],
    [0, 0, 4, 0, 0, 0, 0, 3, 0],
    [0, 0, 0, 0, 0, 9, 7, 0, 0],
];

/** 盤面クラス */
class Board {
    constructor() {
        /** @type {number} マスの配列 */
        this.cells = new Array(HW);
        for (let i = 0; i < HW; i++) {
            this.cells[i] = new Array(HW).fill(0);
        }
        /** @type {number} 縦列の合法手フラグ */
        this.flagColumn = new Array(HW).fill(511);
        /** @type {number} 横列の合法手フラグ */
        this.flagRow = new Array(HW).fill(511);
        /** @type {number} ブロックの合法手フラグ */
        this.flagBlock = new Array(HW).fill(511);
    }

    /**
     * マスに数字を入れる
     * @param {number} num 入れる数字
     * @param {number} x 盤面のx座標
     * @param {number} y 盤面のy座標
     */
    place(num, x, y) {
        this.cells[y][x] = num;
        this.flagColumn[x] ^= num;
        this.flagRow[y] ^= num;
        this.flagBlock[this.getBlockIdx(x, y)] ^= num;
    }

    /**
     * マスに数字を入れた後の盤面を返す
     * @param {number} num 入れる数字
     * @param {number} x 盤面のx座標
     * @param {number} y 盤面のy座標
     * @returns {Board} 盤面
     */
    move(num, x, y) {
        let res = new Board();
        for (let i = 0; i < HW; i++) {
            for (let j = 0; j < HW; j++) {
                res.cells[i][j] = this.cells[i][j];
            }
            res.flagColumn[i] = this.flagColumn[i];
            res.flagRow[i] = this.flagRow[i];
            res.flagBlock[i] = this.flagBlock[i];
        }
        res.place(num, x, y);
        return res;
    }

    /**
     * 盤面が全て埋まったか調べて返す
     * @returns {boolean} true:終了,false:継続
     */
    isFinish() {
        for (let y = 0; y < HW; y++) {
            for (let x = 0; x < HW; x++) {
                if (this.cells[y][x] == 0) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * 数字が確定している所を探して入れる
     * @returns {boolean} 盤面が埋まったかどうか
     */
    definitelyBoard() {
        while (true) {
            if (this.definitelyCell()) {
                continue;
            }
            if (this.definitelyColumn()) {
                continue;
            }
            if (this.definitelyRow()) {
                continue;
            }
            if (this.definitelyBlock()) {
                continue;
            }
            break;
        }
        return this.isFinish();
    }

    /**
     * 各マスで数字が確定している所を探して入れる
     * @returns {boolean} true:入れた,false:入れなかった
     */
    definitelyCell() {
        let res = false;
        for (let y = 0; y < HW; y++) {
            for (let x = 0; x < HW; x++) {
                if (this.cells[y][x] == 0) {
                    let num = this.getPutNumber(x, y);
                    if (num.toString(2).replace(/0/g, "").length == 1) {
                        res = true;
                        this.place(num, x, y);
                    }
                }
            }
        }
        return res;
    }

    /**
     * 各縦列で数字が確定している所を探して入れる
     * @returns {boolean} true:入れた,false:入れなかった
     */
    definitelyColumn() {
        let res = false;
        for (let x = 0; x < HW; x++) {
            for (let f = this.flagColumn[x]; f > 0; f &= f - 1) {
                let num = f & -f;
                let count = 0;
                let yy;
                for (let y = 0; y < HW; y++) {
                    if (this.cells[y][x] == 0 && this.getPutNumber(x, y) & num) {
                        count++;
                        if (count > 1) {
                            break;
                        }
                        yy = y;
                    }
                }
                if (count == 1) {
                    res = true;
                    this.place(num, x, yy);
                }
            }
        }
        return res;
    }

    /**
     * 各横列で数字が確定している所を探して入れる
     * @returns {boolean} true:入れた,false:入れなかった
     */
    definitelyRow() {
        let res = false;
        for (let y = 0; y < HW; y++) {
            for (let f = this.flagRow[y]; f > 0; f &= f - 1) {
                let num = f & -f;
                let count = 0;
                let xx;
                for (let x = 0; x < HW; x++) {
                    if (this.cells[y][x] == 0 && this.getPutNumber(x, y) & num) {
                        count++;
                        if (count > 1) {
                            break;
                        }
                        xx = x;
                    }
                }
                if (count == 1) {
                    res = true;
                    this.place(num, xx, y);
                }
            }
        }
        return res;
    }

    /**
     * 各ブロックで数字が確定している所を探して入れる
     * @returns {boolean} true:入れた,false:入れなかった
     */
    definitelyBlock() {
        let res = false;
        for (let y = 0; y < HW; y += 3) {
            for (let x = 0; x < HW; x += 3) {
                for (let f = this.flagBlock[this.getBlockIdx(x, y)]; f > 0; f &= f - 1) {
                    let num = f & -f;
                    let count = 0;
                    let xx, yy;
                    endLoop: for (let dy = 0; dy < BLOCK_HW; dy++) {
                        for (let dx = 0; dx < BLOCK_HW; dx++) {
                            if (this.cells[y + dy][x + dx] == 0 && this.getPutNumber(x + dx, y + dy) & num) {
                                count++;
                                if (count > 1) {
                                    break endLoop;
                                }
                                xx = x + dx;
                                yy = y + dy;
                            }
                        }
                    }
                    if (count == 1) {
                        res = true;
                        this.place(num, xx, yy);
                    }
                }
            }
        }
        return res;
    }

    /**
     * そのマスが属するブロックの番号を返す
     * @param {number} x 盤面のx座標
     * @param {number} y 盤面のy座標
     * @returns ブロックの番号
     */
    getBlockIdx(x, y) {
        return parseInt(parseInt(y / BLOCK_HW) * BLOCK_HW + parseInt(x / BLOCK_HW));
    }

    /**
     * そのマスの合法手を調べて返す
     * @param {number} x 盤面のx座標
     * @param {number} y 盤面のy座標
     * @returns マスの合法手フラグ
     */
    getPutNumber(x, y) {
        return this.flagColumn[x] & this.flagRow[y] & this.flagBlock[this.getBlockIdx(x, y)];
    }

    /**
     * cellsに入っている値を1~9にして返す
     * @param {number} value
     * @returns {number} 1~9
     */
    getTrueNumber(value) {
        return Math.log2(value) + 1;
    }

    /**
     * 盤面に問題を入力する
     * @param {number} data
     */
    inputBoard(data) {
        for (let y = 0; y < HW; y++) {
            for (let x = 0; x < HW; x++) {
                let num = data[y][x];
                if (num == 0) {
                    this.cells[y][x] = num;
                } else {
                    this.place(1 << (num - 1), x, y);
                }
            }
        }
    }

    /** 盤面を出力する */
    outputBoard() {
        $(".boardCell").each((idx, cell) => {
            const x = idx % HW;
            const y = parseInt(idx / HW);
            $(cell).val(this.getTrueNumber(this.cells[y][x]));
        });
    }
}

$(function () {
    /**
     * ナンプレを解く
     * @param {Board} b 盤面
     * @param {number} depth 次数字を入れる場所
     */
    function solver(b, depth) {
        if (ansNum >= 2) {
            return;
        }
        if (depth == HW_2) {
            ansNum++;
            ansBoard.cells = b.cells;
            return;
        }
        let x = depth % HW;
        let y = parseInt(depth / HW);
        if (b.cells[y][x] != 0) {
            solver(b, depth + 1);
        } else {
            for (let f = b.getPutNumber(x, y); f > 0; f &= f - 1) {
                let num = f & -f;
                solver(b.move(num, x, y), depth + 1);
            }
        }
    }

    /**　盤面を作成してナンプレを解く */
    function main() {
        let b = new Board();
        b.inputBoard(readBoard());
        if (b.definitelyBoard()) {
            b.outputBoard();
        } else {
            solver(b, 0);
        }
        if (ansNum == 0) {
            $(".result").text("解がありません");
        } else if (ansNum == 1) {
            $(".result").text("解が見つかりました");
            ansBoard.outputBoard();
        } else {
            $(".result").text("複数の解があります");
        }
    }

    /** 画面に枠を表示する */
    function createBoard() {
        for (let i = 0; i < HW; i++) {
            $(".board").append(`<div class="boardRow"></div>`);
            for (let j = 0; j < HW; j++) {
                $(`.boardRow:last`).append(`<input type="text" class="boardCell"></input>`);
            }
        }
        $(".boardCell").change(function () {
            const reg = new RegExp(/^[0-9]{1}$/);
            if (!reg.test($(this).val())) {
                $(this).val("");
            }
        });
    }

    /**
     * 画面の数字を配列にして返す
     * @returns {number} 問題の二次元配列
     */
    function readBoard() {
        let res = new Array(HW);
        for (let i = 0; i < HW; i++) {
            res[i] = new Array(HW);
        }
        $(".boardCell").each(function (idx, cell) {
            const num = parseInt($(cell).val());
            const x = idx % HW;
            const y = parseInt(idx / HW);
            if (isNaN(num)) {
                res[y][x] = 0;
            } else {
                res[y][x] = num;
            }
        });
        return res;
    }

    $(".start").click(function () {
        ansBoard = new Board();
        ansNum = 0;
        main();
    });

    $(".reset").click(function () {
        $(".boardCell").each((idx, cell) => {
            $(cell).val("");
        });
    });

    createBoard();
});
