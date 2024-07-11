const API_KEY = 'TELDEHV3SJEBW6IH'; // Replace with your actual API key

async function fetchCryptoData() {
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1`);
    const data = await response.json();
    return data;
}

async function fetchStockData() {
    const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=IBM&apikey=${API_KEY}`);
    const data = await response.json();
    const timeSeries = data['Time Series (Daily)'];
    const marketCap = Object.keys(timeSeries).reduce((acc, date) => {
        return acc + parseFloat(timeSeries[date]['5. adjusted close']) * parseFloat(timeSeries[date]['6. volume']);
    }, 0);
    return [{ name: 'IBM', marketCap }];
}

function populateTable(cryptoData, stockData) {
    const tableBody = document.getElementById('market-cap-table').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';

    let combinedData = [];

    cryptoData.forEach((item, index) => {
        combinedData.push({
            rank: index + 1,
            name: item.name,
            marketCap: item.market_cap,
            type: 'Crypto'
        });
    });

    stockData.forEach((item, index) => {
        combinedData.push({
            rank: cryptoData.length + index + 1,
            name: item.name,
            marketCap: item.marketCap,
            type: 'Stock'
        });
    });

    combinedData.sort((a, b) => b.marketCap - a.marketCap);

    combinedData.forEach((item, index) => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = index + 1;
        row.insertCell(1).textContent = item.name;
        row.insertCell(2).textContent = `$${item.marketCap.toLocaleString()}`;
        row.insertCell(3).textContent = item.type;
    });
}

async function initialize() {
    const cryptoData = await fetchCryptoData();
    const stockData = await fetchStockData();
    populateTable(cryptoData, stockData);
}

initialize();
