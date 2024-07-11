const ALPHA_VANTAGE_API_KEY = 'TELDEHV3SJEBW6IH'; // Your Alpha Vantage API key

async function fetchCryptoData() {
    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1`);
        const data = await response.json();
        console.log('Crypto Data:', data);
        return data;
    } catch (error) {
        console.error('Error fetching crypto data:', error);
        return [];
    }
}

async function fetchStockData() {
    const stockSymbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'];
    const stockData = [];

    try {
        for (const symbol of stockSymbols) {
            const response = await fetch(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`);
            const data = await response.json();
            console.log(`Stock Data for ${symbol}:`, data);
            if (data.MarketCapitalization) {
                stockData.push({
                    name: data.Name,
                    marketCap: parseFloat(data.MarketCapitalization),
                    type: 'Stock'
                });
            }
        }
    } catch (error) {
        console.error('Error fetching stock data:', error);
    }
    
    console.log('Final Stock Data:', stockData);
    return stockData;
}

async function fetchCommodityData() {
    const commodities = [
        { symbol: 'GCUSD', name: 'Gold' },
        { symbol: 'WTI', name: 'Crude Oil' }
    ];
    const commodityData = [];

    try {
        for (const commodity of commodities) {
            const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${commodity.symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`);
            const data = await response.json();
            console.log(`Commodity Data for ${commodity.symbol}:`, data);
            const timeSeries = data['Time Series (Daily)'];

            if (!timeSeries) {
                console.error(`No time series data for ${commodity.symbol}`);
                continue;
            }

            const latestDate = Object.keys(timeSeries)[0];
            const latestClose = parseFloat(timeSeries[latestDate]['4. close']);

            // Assuming an arbitrary market cap value for demonstration
            const marketCap = latestClose * 1000000; // This should be replaced with actual data if available

            commodityData.push({
                name: commodity.name,
                marketCap: marketCap,
                type: 'Commodity'
            });
        }
    } catch (error) {
        console.error('Error fetching commodity data:', error);
    }

    console.log('Final Commodity Data:', commodityData);
    return commodityData;
}

function populateTable(combinedData) {
    const tableBody = document.getElementById('market-cap-table').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';

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
    const commodityData = await fetchCommodityData();
    const combinedData = [...cryptoData.map((item, index) => ({
        rank: index + 1,
        name: item.name,
        marketCap: item.market_cap,
        type: 'Crypto'
    })), ...stockData, ...commodityData];

    combinedData.sort((a, b) => b.marketCap - a.marketCap);
    console.log('Combined Data:', combinedData);
    populateTable(combinedData);
}

initialize();
