/**
 * aside
 * resort list JSON からスキー場リストを取得してレンダリング
 */

// resortList Jsonデータ
// 旧 
let resortListUrl = "https://script.google.com/macros/s/AKfycbxQgCAcxcAkkThEWk0Fn7b_4L6MEzSQ5lw_GQuMEza_7iUcny6p2XP3R7r6DeE4uu0z/exec";
// 改 let resortListUrl = "https://script.google.com/macros/s/AKfycbyw1BcQN9T5QnNVfNvRwgu8u9uU-rljN9FHSpuGmucP5quUYCa6SME5ttrhtGWKJ37l/exec"

fetch(resortListUrl, {
    method: "GET",
})
    .then(response => response.json())
    .then(json => {
        let listHtml = "<h2 class='sub-title'>スキー場一覧 <input type='button' id='ok' value=' OK ' onclick='buttonClickOk()'></h2><form name='form1'>";
        for (j = 0; j < (json.length); j++) {
            listHtml += "<h3 class='region'>" + json[j]["area"] + "</h3><ul class='acc-contents'>";
            for (i = 0; i < (json[j]["detail"].length); i++) {
                listHtml += "<li><input type='checkbox' value='" 
                    + json[j]["detail"][i]["place_detail"]["number"] + ", " 
                    + json[j]["detail"][i]["place_detail"]["lat"] + ", " 
                    + json[j]["detail"][i]["place_detail"]["lon"] + ", " 
                    + json[j]["detail"][i]["place_detail"]["name"] + ", "
                    + json[j]["detail"][i]["place_detail"]["twitter"] 
                    + "' name='checkBox'> " + json[j]["detail"][i]["place_detail"]["name"] + "</input></li>"
            };
            listHtml += "</ul>";
        };
        listHtml += "</form>";
        return listHtml;
    })
    .then(listHtml => {
        let asideWrapper = document.getElementById("aside-wrapper");
        asideWrapper.innerHTML = listHtml;
        const region = document.getElementsByClassName('region');
        for (let i = 0; i < region.length; i++) {
            let regionEach = region[i];
            let content = regionEach.nextElementSibling;
            regionEach.addEventListener('click', () => {
                regionEach.classList.toggle('is-active');
                content.classList.toggle('is-open');
            });
        }
    })






/**
 * ヘッダー
 * date, todayNow, checkIn
 */

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
    timeDiff = parseInt((checkInUnix - todayUnix)/3600); //時間差(整数値)
}; 



// (checkIn-todayNow)/3 => 整数　=2 → list2からスタート
// 0,1 は空白にする

// form name='form1'
// input type="checkbox" value="1, 123.4567890, 123.4567890" name="checkBox" onchange="buttonClick(value)"







/**
 * articleWrapper
 * 天気情報取得, レンダリング
 */

let apiKey = "a533675e07f5f09476d1b1b748f2b159";

function buttonClickOk() {

    // 現在の時間(3時間で1コマ　1,2,3,4,5,6,7,0)
    let listNo = (parseInt(today.getHours() / 3) + 1) % 8;   // 
    let listDt = 0;
    if (timeDiff > 33) {
        listDt += (parseInt((timeDiff - 33) / 3))    // 3
        listNo = 0;
    };


    let initialize = document.getElementById("article-wrapper");
    initialize.innerHTML = "";

    let articleWrapper = document.getElementById("article-wrapper");

    const arrCheck = [];
    const checkBox = document.form1.checkBox;
    // console.log(checkBox);


    for (let g = 0; g < checkBox.length; g++) {
        if (checkBox[g].checked) {
            arrCheck.push(checkBox[g].value);
        }
    }

    for (let h = 0; h < arrCheck.length; h++) {
        result = arrCheck[h].split(", ");
        let num = result[0];
        let lat = result[1];
        let lon = result[2];
        let name = result[3];
        // let twitterId = result[4];
        // var container = document.getElementById("tweet-user-timeline");

        let url = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=metric&appid=" + apiKey;
        //         https://api.openweathermap.org/data/2.5/forecast?lat=38.1704429&lon=140.3992911&units=metric&appid=a533675e07f5f09476d1b1b748f2b159
        //         https://api.openweathermap.org/data/2.5/forecast?lat=42.7521098177761&lon=140.3992911&units=metric&appid=a533675e07f5f09476d1b1b748f2b159
        //         ルスツ　42.7521098177761 140.897838908011
        //         weather-ja.jsonc

        fetch(url, {
            method: "GET",
        })
        .then(response => response.json())
        .then(json => {
            idNaming = "information" + num;
            const infoDiv = document.createElement("div");

            // html
            let html = "<h2>" + name + "</h2>";
            html += "<p>営業</p>";
            html += "<p>天気</p>";


            // weatherInfo {weatherTable}
            let weatherTable = "<table>";           // １段目
                                                    // 日付 時刻
            weatherTable += "<tr><th>" + new Date(json["list"][listDt]["dt"] * 1000).toLocaleDateString('ja-JP').slice(5) + "</th>";
            for (i = listDt + 0; i < listDt + listNo; i++) {          // 時間 現在(listNo)まで「 - 」
                weatherTable += "<td>-</td>";
            };
            for (i = listDt + 0; i < listDt + (8 - listNo); i++) {    // 時間 以降表示
                weatherTable += "<td>" + new Date(json["list"][i]["dt"] * 1000).toLocaleString('ja-JP', { hour: "numeric" }) + "</td>";
            };
            weatherTable += "</tr>";
            weatherTable += "<tr><th>天気</th>"     // 天気
            for (i = listDt + 0; i < listDt + listNo; i++) {          // 天気 現在まで「 - 」
                weatherTable += "<td>-</td>";
            };

            for (i = listDt + 0; i < listDt + (8 - listNo); i++) {    //  天気 以降表示
                weatherTable += '<td><img src="http://openweathermap.org/img/w/' + json["list"][i]["weather"]["0"]["icon"] + '.png" width="25" height="25"></img></td>';
            };

            weatherTable += "</tr>";
            weatherTable += "<tr><th>気温</th>"     // 気温
            for (i = listDt + 0; i < listDt + listNo; i++) {          // 気温 現在まで「 - 」
                weatherTable += "<td>-</td>";
            };
            for (i = listDt + 0; i < listDt + (8 - listNo); i++) {    // 気温 以降表示
                weatherTable += "<td>" + Math.round(json["list"][i]["main"]["temp"]) + "℃</td>";
            };
            weatherTable += "</tr>";
            weatherTable += "<tr><th>降水</th>"     // 降水
            for (i = listDt + 0; i < listDt + listNo; i++) {          // 降水 現在まで「 - 」
                weatherTable += "<td>-</td>";
            };
            for (i = listDt + 0; i < listDt + (8 - listNo); i++) {    // 降水 以降表示
                if (json["list"][i]["weather"]["0"]["main"] == "Rain") {
                    weatherTable += "<td>" + json["list"][i]["rain"]["3h"] + "mm</td>";
                } else {
                    weatherTable += "<td>" + "0mm" + "</td>";
                };
            };
            weatherTable += "</tr>";
            weatherTable += "<tr><th>降雪</th>"     // 降雪
            for (i = listDt + 0; i < listDt + listNo; i++) {          // 降雪 現在まで「 - 」
                weatherTable += "<td>-</td>";
            };
            for (i = listDt + 0; i < listDt + (8 - listNo); i++) {    // 降雪 以降表示
                if (json["list"][i]["weather"]["0"]["main"] == "Snow") {
                    weatherTable += "<td>" + json["list"][i]["snow"]["3h"] + "mm</td>";
                } else {
                    weatherTable += "<td>" + "0mm" + "</td>";
                };
            };
            weatherTable += "</tr>";
            weatherTable += "</table>"

            weatherTable += "<table>";                          // ２段目
                                                                // 日付 時刻
            weatherTable += "<tr><th>" + new Date(json["list"][listDt + 8]["dt"] * 1000).toLocaleDateString('ja-JP').slice(5) + "</th>";
            for (i = listDt + (8 - listNo); i < listDt + (16 - listNo); i++) {    // 時間 表示
                weatherTable += "<td>" + new Date(json["list"][i]["dt"] * 1000).toLocaleString('ja-JP', { hour: "numeric" }) + "</td>";
            };
            weatherTable += "</tr>";
            weatherTable += "<tr><th>天気</th>"                 // 天気
            for (i = listDt + (8 - listNo); i < listDt + (16 - listNo); i++) {    // 天気 表示
                // weatherTable += "<td>" + json["list"][i]["weather"]["0"]["main"] + "</td>";
                weatherTable += '<td><img src="http://openweathermap.org/img/w/' + json["list"][i]["weather"]["0"]["icon"] + '.png" width="30" height="30"></img></td>';
            };
            weatherTable += "</tr>";
            weatherTable += "<tr><th>気温</th>"                 // 気温
            for (i = listDt + (8 - listNo); i < listDt + (16 - listNo); i++) {    // 気温 表示
                weatherTable += "<td>" + Math.round(json["list"][i]["main"]["temp"]) + "℃</td>";
            };
            weatherTable += "</tr>";
            weatherTable += "<tr><th>降水</th>"                 // 降水 
            for (i = listDt + (8 - listNo); i < listDt + (16 - listNo); i++) {    // 降水 表示
                if (json["list"][i]["weather"]["0"]["main"] == "Rain") {
                    weatherTable += "<td>" + json["list"][i]["rain"]["3h"] + "mm</td>";
                } else {
                    weatherTable += "<td>" + "0mm" + "</td>";
                };
            };
            weatherTable += "</tr>";
            weatherTable += "<tr><th>降雪</th>"                 // 降雪
            for (i = listDt + (8 - listNo); i < listDt + (16 - listNo); i++) {    // 降雪 表示
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

            infoDiv.appendChild(basicInfo);         // basicInfo 出力
            basicInfo.className = "basic-info";     // basicInfo クラス名
            infoDiv.appendChild(weatherInfo);       // weatherInfo 出力
            weatherInfo.className = "weather-info"; // weatherInfo クラス名

            // infoDiv 生成 / id 命名
            articleWrapper.appendChild(infoDiv);
            idNaming = "information" + num;
            infoDiv.id = idNaming;
            infoDiv.className = "information";
        });
    };
};


