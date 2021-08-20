// asideのlistをスプレッドシートのJSONファイルから取得

// 取得したAPI Keyをここに記載
let resortListUrl = "https://script.google.com/macros/s/AKfycbxQgCAcxcAkkThEWk0Fn7b_4L6MEzSQ5lw_GQuMEza_7iUcny6p2XP3R7r6DeE4uu0z/exec";

fetch(resortListUrl, {
    method: "GET",
})
    .then(response => response.json())
    .then(json => {
        let asideWrapper = document.getElementById("aside-wrapper");
        let listHtml = "<h2 class='sub-title'>スキー場一覧 <input type='button' id='ok' value=' OK ' onclick='buttonClickOk()'></h2><form name='form1'>";
        for (j = 0; j < (json.length)- 1; j++){
            listHtml += "<h3 class='region'>" + json[j]["area"] + "</h3>";
            for (i = 0; i < (json[j]["detail"].length); i++) {
                listHtml += "<li><input type='checkbox' value='" + json[j]["detail"][i]["place_detail"]["number"] + ", " + json[j]["detail"][i]["place_detail"]["lat"] + ", " + json[j]["detail"][i]["place_detail"]["lon"] + ", " + json[j]["detail"][i]["place_detail"]["name"] + "' name='checkBox'> " + json[j]["detail"][i]["place_detail"]["name"] + "</input></li>"
            };
        };
        listHtml += "</form>";
        asideWrapper.innerHTML = listHtml;
    });



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


// form name='form1'
// input type="checkbox" value="1, 123.4567890, 123.4567890" name="checkBox" onchange="buttonClick(value)"


let apiKey = "a533675e07f5f09476d1b1b748f2b159";

function buttonClickOk() {
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


        let url = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=metric&appid=" + apiKey;
        // https://api.openweathermap.org/data/2.5/forecast?lat=38.1704429&lon=140.3992911&units=metric&appid=a533675e07f5f09476d1b1b748f2b159
        fetch(url, {
            method: "GET",
        })
            .then(response => response.json())
            .then(json => {
                // let articleWrapper = document.getElementById("article-wrapper");
                idNaming = "information" + num;
                const infoDiv = document.createElement("div");
                //basicInfo {html}
                let html = "<h2>" + name + "</h2>";
                html += "<p>営業</p>";
                html += "<p>天気</p>";


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
                idNaming = "information" + num;
                infoDiv.id = idNaming;
                infoDiv.className = "information";
            });
    }

};