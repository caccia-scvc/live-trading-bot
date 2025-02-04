async function trade(action) {
    try {
        let response = await fetch("http://127.0.0.1:8000/trade", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: action })
        });

        let data = await response.json();
        alert(`Trade Successful: ${data.message}`);
        getTradingData(); // Refresh balance
    } catch (error) {
        console.error("Trade error:", error);
        alert("Trade failed!");
    }
}
