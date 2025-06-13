chrome.storage.local.get("siteTimes", (data) => {
  const summary = document.getElementById("summary");
  const sites = data.siteTimes || {};
  for (const site in sites) {
    const minutes = sites[site];
    summary.innerHTML += `<p>${site}: ${minutes} minutes</p>`;
  }
});
