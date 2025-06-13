let currentTabUrl = "";
let timeSpentInMinutes = 0;
let activeInterval = null;

function startTimer(url) {
  if (activeInterval) clearInterval(activeInterval);
  currentTabUrl = url;
  timeSpentInMinutes = 0;

  activeInterval = setInterval(() => {
    timeSpentInMinutes++;
    console.log("Tracking:", currentTabUrl, timeSpentInMinutes);

    fetch("http://localhost:4000/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: "user1",
        url: currentTabUrl,
        duration: 1, // send 1 minute each time
      }),
    }).then(() => {
      console.log("Sent 1 min to server for", currentTabUrl);
    }).catch(err => console.error("Error sending to server:", err));
  }, 60000); // every 1 minute
}

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab && tab.url && tab.url.startsWith("http")) {
      const url = new URL(tab.url).hostname;
      startTimer(url);
    }
  });
});
