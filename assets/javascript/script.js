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
    var contentArea = $('.tickerWrapper');
    contentArea.innerHTML = '';
    // console.log(JSON.parse(data[0]).id);
    parseData = JSON.parse(data.responseText)
    console.log(parseData)
    parseData.forEach((value, index) => {
        if (index < 50) {
            var mktCap = formatMktCap(value.market_cap);
            contentArea.append(`<div class='ticker'>${value.name}: $${value.current_price.toLocaleString('en-US')} Market Cap: $${mktCap} 24hr change: ${value.price_change_percentage_24h.toFixed(2)}%</div>`)
        }
    }
)}
function formatMktCap (val) {
    if (val > 1000000000) {
        return (val/1000000000).toFixed(2) + "B";
    }
    else if (val > 1000000) {
        return (val/1000000).toFixed(2) + "M";
    }
    else return val;
}