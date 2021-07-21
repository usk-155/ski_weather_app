// 取得したAPI Keyをここに記載
let apiKey = "cc05750ba50400f27ebabbcd6f4c4976";       // ------------ ①

function buttonClick() {
    // 1. XMLHttpRequestオブジェクトを作る
    let xhr = new XMLHttpRequest();                   // ------------ ②
    // 2. リクエストを送る
    let url = "https://api.openweathermap.org/data/2.5/weather?q=Tokyo&appid=" + apiKey;         // ------------ ③

    xhr.open("GET", url, true);
    // 3. 読み込みが完了したときに実行される関数を定義する
    xhr.onload = function (e) {
        // データを取得
        let item = eval("(" + xhr.responseText + ")");            // ------------ ④
        // データを展開してdiv要素に設定する
        let div = document.getElementById("mydiv");
        let tenki = item["weather"][0]["main"];                   // ------------ ⑤
        let ondo = parseFloat(item["main"]["temp"]) - 273.15; 　  // ------------ ⑥
        let html = "<table border='1'>";
        html += "<tr>";
        html += "<th>天気</th><td>" + tenki + "</td>";
        html += "<th>温度</th><td>" + ondo + "</td>";
        html += "</tr>";
        html += "</table>";
        div.innerHTML = html;
    };
    // 4. 送信する
    xhr.send();
}