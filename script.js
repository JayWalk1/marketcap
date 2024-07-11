const API_KEY = 'your_api_key_here'; // Replace with your actual API key

async function fetchCryptoData() {
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1`);
    const data = await response.json();
    return data;
}

async function fetchStockData() {
    const response = await fetch(`https://financialmodelingprep.com/api/v3/stock_market/actives?apikey=${API_KEY}`);
    const data = await response.json();
    return data;
}

function populateTable(cryptoData, stockData) {
    const tableBody = document.getElementById('market-cap-table').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';

    cryptoData.forEach((item, index) => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = index + 1;
        row.insertCell(1).textContent = item.name;
        row.insertCell(2).textContent = `$${item.market_cap.toLocaleString()}`;
    });

    stockData.forEach((item, index) => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = cryptoData.length + index + 1;
        row.insertCell(1).textContent = item.name;
        row.insertCell(2).textContent = `$${item.marketCap.toLocaleString()}`;
    });
}

async function initialize() {
    const cryptoData = await fetchCryptoData();
    const stockData = await fetchStockData();
    populateTable(cryptoData, stockData);
}

initialize();
