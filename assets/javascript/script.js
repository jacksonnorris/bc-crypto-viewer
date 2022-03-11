var url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1";

var xhr = new XMLHttpRequest();
xhr.open("GET", url);
xhr.setRequestHeader("accept", "application/json");

xhr.onreadystatechange = function () {
   if (xhr.readyState === 4) {
      console.log(xhr.status);
      console.log(xhr.responseText);
      formatData(xhr);
   }};

xhr.send();

function formatData (data) {
    // console.log(JSON.parse(data[0]).id);
    parseData = JSON.parse(data.responseText)
    console.log(parseData)
    parseData.forEach((value, index) => {
        if (index < 50) {
            console.log(value.id)
        }
    }
)}