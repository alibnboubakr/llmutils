// Popup script
document.addEventListener("DOMContentLoaded", () => {
  const statusEl = document.getElementById("status")!;
  const loginBtn = document.getElementById("loginBtn")!;
  const dashboardBtn = document.getElementById("dashboardBtn")!;
  const usageCountEl = document.getElementById("usageCount")!;

  // Check login status
  chrome.storage.local.get(["userId", "usageCount"], (result) => {
    if (result.userId) {
      statusEl.textContent = "Logged in";
      statusEl.className = "status logged-in";
      loginBtn.style.display = "none";
      dashboardBtn.style.display = "block";
    }

    usageCountEl.textContent = result.usageCount || "0";
  });

  loginBtn.addEventListener("click", () => {
    chrome.tabs.create({ url: "https://llmutils.co/api/auth/extension" });
  });

  dashboardBtn.addEventListener("click", () => {
    chrome.tabs.create({ url: "https://llmutils.co/dashboard" });
  });

  // Upgrade link
  const upgradeLink = document.querySelector(".upgrade-link")!;
  upgradeLink.addEventListener("click", () => {
    chrome.tabs.create({ url: "https://llmutils.co/settings" });
  });
});
