fetch("http://localhost:4000/report/user1")
  .then((res) => res.json())
  .then((data) => {
    const reportDiv = document.getElementById("report");
    reportDiv.innerHTML = ""; // clear loading text

    const siteMap = {};

    data.forEach((entry) => {
      if (!siteMap[entry.url]) siteMap[entry.url] = 0;
      siteMap[entry.url] += entry.duration;
    });

    for (const site in siteMap) {
      const div = document.createElement("div");
      div.className = "entry";
      div.innerHTML = `<strong>${site}</strong>: ${siteMap[site]} minutes`;
      reportDiv.appendChild(div);
    }
  })
  .catch((err) => {
    document.getElementById("report").innerText = "Failed to load data.";
    console.error(err);
  });
