var url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1";

var xhr = new XMLHttpRequest();
xhr.open("GET", url);
xhr.setRequestHeader("accept", "application/json");

xhr.onreadystatechange = function () {
   if (xhr.readyState === 4) {
      formatData(xhr);
   }};

xhr.send();

function formatData (data) {
    var contentArea = $('#tickerWrapper');
    contentArea.innerHTML = '';
    var parseData = JSON.parse(data.responseText)
    parseData.forEach((value, index) => {
        if (index < 50) {
            var mktCap = formatMktCap(value.market_cap);
            contentArea.append(`<div class='ticker'>${value.name}: $${value.current_price.toLocaleString('en-US')}<br>Market Cap: $${mktCap}<br>24hr change: <span class='percentage'>${value.price_change_percentage_24h.toFixed(2)}%</span></div>`)
        }
    })
    var percentages = document.getElementsByClassName('percentage');
    for (let i = 0; i < percentages.length; i++) {
        let tmp = percentages[i].innerHTML.charAt(0);
        if (tmp == '-') { percentages[i].classList.add('red') }
        else if (tmp == '') {}
        else { percentages[i].classList.add('green')}
    }
}
function formatMktCap (val) {
    if (val > 1000000000) {
        return (val/1000000000).toFixed(2) + "B";
    }
    else if (val > 1000000) {
        return (val/1000000).toFixed(2) + "M";
    }
    else return val;
}

function searchCrypto () {
    var sQuery = $('#searchBar').val().toLowerCase();
    var url = `https://api.coingecko.com/api/v3/coins/${sQuery}`;
    try {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.setRequestHeader("accept", "application/json");
        xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            var dataArray = [];
            dataArray.push(xhr.responseText);
            var parseData = JSON.parse(dataArray)
            if (parseData.error == "Could not find coin with the given id") {
                document.getElementById('searchContent').innerHTML = 'Could not find currency, please enter the name and not the ticker in your search'
            }
            coinName = sQuery.charAt(0).toUpperCase() + sQuery.slice(1);
            var marketCap = formatMktCap(parseData.market_data.market_cap.usd);
            var totalSupply = formatMktCap(parseData.market_data.circulating_supply)
            $('#searchContent').removeClass('hidden');
            $('#searchContent').html(`<h4>${coinName}</h4><div class='one-third column'><h5>Current price: $${parseData.market_data.current_price.usd.toLocaleString('en-US')}</h5><h5>24hr change: ${parseData.market_data.price_change_percentage_24h.toLocaleString('en-US')}%</h5><h5>7D change: ${parseData.market_data.price_change_percentage_7d.toLocaleString('en-US')}%</h5></div><div class='one-third column'><h5>Market Cap: $${marketCap}</h5><h5>Market Cap Rank: ${parseData.market_data.market_cap_rank}</h5><h5>Circulating Supply: ${totalSupply.toLocaleString('en-US')}</h5></div><div class='one-third column'><h5>All Time High: $${parseData.market_data.ath.usd.toLocaleString('en-US')}</h5><h5>All Time Low: $${parseData.market_data.atl.usd.toLocaleString('en-US')}</h5><h5>ATH change: ${parseData.market_data.ath_change_percentage.usd.toLocaleString('en-US')}%</h5></div>`);
            localStorage.setItem('coin', coinName);
        }};
        xhr.send();
    }
    catch (err) {
        console.log(err);
    }
}

function renderPosts(posts) {
    let redditContent = $('#redditContent');
    redditContent.html('');
    for (var j = 0; j < posts.length; j++) {
        redditContent.append(`<div><li><a target='_blank' href='${posts[j].data.url}'>${posts[j].data.title}</a><span class='upvotes'><i class="fa-solid fa-arrow-up"></i> ${posts[j].data.ups}</span><span class='comments'><i class="fa-solid fa-comment"></i> ${posts[j].data.num_comments}</span></li></div>`)
    }
}

$('#tickerWrapper').attr('max-height', $('.ticker').offsetHeight);

let postType = 'hot';

function fetchRedditPosts() {
    postType = $('#postType').val();
    fetch(`https://www.reddit.com/r/cryptocurrency/${postType}.json`)
    .then(function(result) {
        return result.json();  
    })
    .then(function(result) { 
        renderPosts(result.data.children);
    })
    .catch(function(err) {
        console.log(err); 
    });
}

function toggleContent() {
    var content = document.getElementById('tickerWrapper');
    var toggle = document.getElementById('toggleTickers');
    if (content.classList.contains('expanded')) {
        content.classList.remove('expanded');
        toggle.innerHTML = "Show More <i class='fa-solid fa-circle-arrow-down'</i>";
    }
    else {
        content.classList.add('expanded');
        toggle.innerHTML = "Show Less <i class='fa-solid fa-circle-arrow-up'</i>";
    }
}

function getLocalData () {
    var selectedCoin = JSON.stringify(localStorage.getItem('coin'));
    if (selectedCoin === 'null') {
    }
    else {
        $('#searchBar').val(selectedCoin.replace(/\"/g, ""));
        searchCrypto();
    }
}

getLocalData();
fetchRedditPosts();
