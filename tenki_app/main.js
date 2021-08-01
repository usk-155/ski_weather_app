// XMLHttpRequestオブジェクト を fetchに書き換え

// 取得したAPI Keyをここに記載
let apiKey = "cc05750ba50400f27ebabbcd6f4c4976";       // ------------ ①
let resortName = ["蔵王温泉スキー場", "苗場スキー場", "赤倉観光リゾート", ];//緯度
let lat = ["38.1704429", "36.7916707", "36.8866025", ];//経度
let lon = ["140.3992911", "138.7799397", "138.1736814", ];//緯度
let url = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat[0] + "&lon=" + lon[0] + "&units=metric&lang=ja&appid=" + apiKey ;

function buttonClick(value) {
    let url = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat[value] + "&lon=" + lon[value] + "&units=metric&appid=" + apiKey;
    fetch(url, {
        method: "GET",
    })
    .then(response => response.json())
    .then(json => {
        //let item = eval("(" + xhr.responseText + ")");            // ------ ④ JSONをjavascriptオブジェクトには変換
        // データを展開してdiv要素に設定する
        let div = document.getElementById("weather-info");
        let date = new Date(json["list"][0]["dt"] * 1000).toLocaleDateString('ja-JP').slice(5);

        let html = "<table>";

        html += "<tr><th>" + new Date(json["list"][0]["dt"] * 1000).toLocaleDateString('ja-JP').slice(5) + "</th>";
        for (i = 0; i < 8; i++) {
            html += "<td>" + new Date(json["list"][i]["dt"] * 1000).toLocaleString('ja-JP', { hour: "numeric" }) + "</td>";
        };
        html += "</tr>";

        html += "<tr><th>天気</th>"
        for (i = 0; i < 8; i++) {
            html += "<td>" + json["list"][i]["weather"]["0"]["main"] + "</td>";
        };
        html += "</tr>";

        html += "<tr><th>気温</th>"
        for (i = 0; i < 8; i++) {
            html += "<td>" + json["list"][i]["main"]["temp"] + "</td>";
        };
        html += "</tr>";

        html += "<tr><th>降水</th>"
        for (i = 0; i < 8; i++) {
            if (json["list"][i]["weather"]["0"]["main"] == "Rain") {
                html += "<td>" + json["list"][i]["rain"]["3h"] + "mm</td>";
            } else {
                html += "<td>" + "0mm" + "</td>";
            };
        };
        html += "</tr>";

        html += "<tr><th>降雪</th>"
        for (i = 0; i < 8; i++) {
            if (json["list"][i]["weather"]["0"]["main"] == "Snow") {
                html += "<td>" + json["list"][i]["snow"]["3h"] + "mm</td>";
            } else {
                html += "<td>" + "0mm" + "</td>";
            };
        };
        html += "</tr>";

        html += "</table>"

        html += "<table>";

        html += "<tr><th>" + new Date(json["list"][8]["dt"] * 1000).toLocaleDateString('ja-JP').slice(5) + "</th>";
        for (i = 8; i < 16; i++) {
            html += "<td>" + new Date(json["list"][i]["dt"] * 1000).toLocaleString('ja-JP', { hour: "numeric" }) + "</td>";
        };
        html += "</tr>";

        html += "<tr><th>天気</th>"
        for (i = 8; i < 16; i++) {
            html += "<td>" + json["list"][i]["weather"]["0"]["main"] + "</td>";
        };
        html += "</tr>";

        html += "<tr><th>気温</th>"
        for (i = 8; i < 16; i++) {
            html += "<td>" + json["list"][i]["main"]["temp"] + "</td>";
        };
        html += "</tr>";

        html += "<tr><th>降水</th>"
        for (i = 8; i < 16; i++) {
            if (json["list"][i]["weather"]["0"]["main"] == "Rain") {
                html += "<td>" + json["list"][i]["rain"]["3h"] + "mm</td>";
            } else {
                html += "<td>" + "0mm" + "</td>";
            };
        };
        html += "</tr>";

        html += "<tr><th>降雪</th>"
        for (i = 8; i < 16; i++) {
            if (json["list"][i]["weather"]["0"]["main"] == "Snow") {
                html += "<td>" + json["list"][i]["snow"]["3h"] + "mm</td>";
            } else {
                html += "<td>" + "0mm" + "</td>";
            };
        };
        html += "</tr>";

        html += "</table>";

        div.innerHTML = html;
    });
};
