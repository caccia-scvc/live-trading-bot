let balance = 1000000000; // Starting balance
let btcOwned = 0; // BTC holdings
let chart; // Chart instance
let priceHistory = []; // Store price data

// Function to fetch live BTC price from Binance API
async function getTradingData() {
    try {
        let response = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT");
        let data = await response.json();
        let price = parseFloat(data.price).toFixed(2);

        document.getElementById("status").innerText = "Running";
        document.getElementById("price").innerText = price;

        updateChart(price); // Update price graph
    } catch (error) {
        document.getElementById("status").innerText = "Error!";
        console.error("Error fetching data:", error);
    }
}

// Function to handle BUY/SELL trades
function trade(action) {
    let price = parseFloat(document.getElementById("price").innerText);

    if (action === "buy" && balance >= price) {
        btcOwned += 1;
        balance -= price;
        alert(`✅ Bought 1 BTC at $${price}`);
    } else if (action === "sell" && btcOwned > 0) {
        btcOwned -= 1;
        balance += price;
        alert(`🔴 Sold 1 BTC at $${price}`);
    } else {
        alert("❌ Not enough funds or BTC to trade!");
    }

    document.getElementById("balance").innerText = balance.toFixed(2);
}

// Function to update the price chart
function updateChart(price) {
    if (priceHistory.length >= 20) {
        priceHistory.shift(); // Remove oldest price
    }
    priceHistory.push(price);

    if (chart) {
        chart.data.labels = Array(priceHistory.length).fill("");
        chart.data.datasets[0].data = priceHistory;
        chart.update();
    }
}

// Initialize price chart
function setupChart() {
    let ctx = document.getElementById("priceChart").getContext("2d");
    chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: [],
            datasets: [{
                label: "BTC Price",
                data: [],
                borderColor: "white",
                backgroundColor: "rgba(255,255,255,0.1)",
                borderWidth: 2,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { display: false },
                y: { ticks: { color: "white" } }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

// Run functions on load
setupChart();
getTradingData();
setInterval(getTradingData, 5000); // Update price every 5 seconds
