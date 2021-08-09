// weather-info の表示を編集 / チェックボックスと連動（作業中）

// 取得したAPI Keyをここに記載
let apiKey = "a533675e07f5f09476d1b1b748f2b159";       // ------------ ①
let resortName = ["蔵王温泉スキー場", "苗場スキー場", "赤倉観光リゾート", ];//緯度
let lat = ["38.1704429", "36.7916707", "36.8866025", ];//経度
let lon = ["140.3992911", "138.7799397", "138.1736814", ];//緯度
let url = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat[0] + "&lon=" + lon[0] + "&units=metric&lang=ja&appid=" + apiKey ;

// date format
let formatDate = (dateTime) => {
    let formatted_date = dateTime.getFullYear() + "/" + (dateTime.getMonth() + 1).toString().padStart(2, '0') + "/" + dateTime.getDate().toString().padStart(2, '0') + " " + dateTime.getHours().toString().padStart(2, '0') + ":" + dateTime.getMinutes().toString().padStart(2, '0');
    return formatted_date;
}

// todayNow(今日)の日付時間 取得
let today = new Date();
const todayNow = document.getElementById("todayNow");
let todayUnix = today.getTime()/1000; // 【 今日のUnixTime 】
// todayをHTMLに出力
todayNow.textContent = "TODAY : " + formatDate(today); 

// checkInの日付09時 取得　/　checkInUnix と todayUnix の時間差(整数値)を取得
document.getElementById("checkIn").onchange = function () {
    let checkInUnix = document.getElementById("checkIn").valueAsNumber/1000; // 【 checkInのUnixTime 】
    timeDiff = parseInt((checkInUnix - todayUnix)/3600); //時間座(整数値)
}; 

// 現在の時間(3時間で1コマ　1~8)
let listNo = parseInt(today.getHours()/3)+1;  // 5


// (checkIn-todayNow)/3 => 整数　=2 → list2からスタート
// 0,1 は空白にする



function buttonClick(value) {
    let url = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat[value] + "&lon=" + lon[value] + "&units=metric&appid=" + apiKey;
    // https://api.openweathermap.org/data/2.5/forecast?lat=38.1704429&lon=140.3992911&units=metric&appid=a533675e07f5f09476d1b1b748f2b159
    fetch(url, {
        method: "GET",
    })
        .then(response => response.json())
        .then(json => {
            let articleWrapper = document.getElementById("article-wrapper");
            idNaming = "information" + [value];
            if (document.checkList.elements[value].checked === true) {
                const infoDiv = document.createElement("div");
                //basicInfo {html}
                let html = "<h2>" + resortName[value] + "</h2>"
                html += "<p>営業</p>"
                html += "<p>天気</p>"


                // weatherInfo {weatherTable}
                let weatherTable = "<table>";
                weatherTable += "<tr><th>" + new Date(json["list"][0]["dt"] * 1000).toLocaleDateString('ja-JP').slice(5) + "</th>";
                for (i = 0; i < listNo; i++) {
                    weatherTable += "<td>-</td>";
                };
                for (i = 0; i < (8 - listNo); i++) {
                    weatherTable += "<td>" + new Date(json["list"][i]["dt"] * 1000).toLocaleString('ja-JP', { hour: "numeric" }) + "</td>";
                };
                weatherTable += "</tr>";
                weatherTable += "<tr><th>天気</th>"
                for (i = 0; i < listNo; i++) {
                    weatherTable += "<td>-</td>";
                };
                for (i = 0; i < (8 - listNo); i++) {
                    weatherTable += "<td>" + json["list"][i]["weather"]["0"]["main"] + "</td>";
                };
                weatherTable += "</tr>";
                weatherTable += "<tr><th>気温</th>"
                for (i = 0; i < listNo; i++) {
                    weatherTable += "<td>-</td>";
                };
                for (i = 0; i < (8 - listNo); i++) {
                    weatherTable += "<td>" + json["list"][i]["main"]["temp"] + "</td>";
                };
                weatherTable += "</tr>";
                weatherTable += "<tr><th>降水</th>"
                for (i = 0; i < listNo; i++) {
                    weatherTable += "<td>-</td>";
                };
                for (i = 0; i < (8 - listNo); i++) {
                    if (json["list"][i]["weather"]["0"]["main"] == "Rain") {
                        weatherTable += "<td>" + json["list"][i]["rain"]["3h"] + "mm</td>";
                    } else {
                        weatherTable += "<td>" + "0mm" + "</td>";
                    };
                };
                weatherTable += "</tr>";
                weatherTable += "<tr><th>降雪</th>"
                for (i = 0; i < listNo; i++) {
                    weatherTable += "<td>-</td>";
                };
                for (i = 0; i < (8 - listNo); i++) {
                    if (json["list"][i]["weather"]["0"]["main"] == "Snow") {
                        weatherTable += "<td>" + json["list"][i]["snow"]["3h"] + "mm</td>";
                    } else {
                        weatherTable += "<td>" + "0mm" + "</td>";
                    };
                };
                weatherTable += "</tr>";
                weatherTable += "</table>"
                weatherTable += "<table>";
                weatherTable += "<tr><th>" + new Date(json["list"][8]["dt"] * 1000).toLocaleDateString('ja-JP').slice(5) + "</th>";
                for (i = (8 - listNo); i < (16 - listNo); i++) {
                    weatherTable += "<td>" + new Date(json["list"][i]["dt"] * 1000).toLocaleString('ja-JP', { hour: "numeric" }) + "</td>";
                };
                weatherTable += "</tr>";
                weatherTable += "<tr><th>天気</th>"
                for (i = (8 - listNo); i < (16 - listNo); i++) {
                    weatherTable += "<td>" + json["list"][i]["weather"]["0"]["main"] + "</td>";
                };
                weatherTable += "</tr>";
                weatherTable += "<tr><th>気温</th>"
                for (i = (8 - listNo); i < (16 - listNo); i++) {
                    weatherTable += "<td>" + json["list"][i]["main"]["temp"] + "</td>";
                };
                weatherTable += "</tr>";
                weatherTable += "<tr><th>降水</th>"
                for (i = (8 - listNo); i < (16 - listNo); i++) {
                    if (json["list"][i]["weather"]["0"]["main"] == "Rain") {
                        weatherTable += "<td>" + json["list"][i]["rain"]["3h"] + "mm</td>";
                    } else {
                        weatherTable += "<td>" + "0mm" + "</td>";
                    };
                };
                weatherTable += "</tr>";
                weatherTable += "<tr><th>降雪</th>"
                for (i = (8 - listNo); i < (16 - listNo); i++) {
                    if (json["list"][i]["weather"]["0"]["main"] == "Snow") {
                        weatherTable += "<td>" + json["list"][i]["snow"]["3h"] + "mm</td>";
                    } else {
                        weatherTable += "<td>" + "0mm" + "</td>";
                    };
                };
                weatherTable += "</tr>";
                weatherTable += "</table>";

                // ▽▽▽ 出力 ▽▽▽

                // basicInfo 出力
                const basicInfo = document.createElement("div");
                basicInfo.innerHTML = html;

                // weatherInfo 出力
                const weatherInfo = document.createElement("div");
                weatherInfo.innerHTML = weatherTable;

                // twitter 出力


                infoDiv.appendChild(basicInfo);         // basicInfo 出力
                basicInfo.className = "basic-info";     // basicInfo クラス名
                infoDiv.appendChild(weatherInfo);       // weatherInfo 出力
                weatherInfo.className = "weather-info"; // weatherInfo クラス名
                // twitterInfo 出力
                // twitterInfo クラス名

                // infoDiv 生成 / id 命名
                articleWrapper.appendChild(infoDiv);
                idNaming = "information" + [value];
                infoDiv.id = idNaming;
                infoDiv.className = "information";
            } else {
                let infoDiv = document.getElementById(idNaming);
                articleWrapper.removeChild(infoDiv);
            };

        });

};