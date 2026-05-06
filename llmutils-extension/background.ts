// Background service worker for context menu
chrome.runtime.onInstalled.addListener(() => {
  // Create context menu items
  chrome.contextMenus.create({
    id: "llmutils-sanitize",
    title: "LLMUtils: Sanitize & Copy",
    contexts: ["selection"],
  });

  chrome.contextMenus.create({
    id: "llmutils-markdown",
    title: "LLMUtils: Convert to Markdown",
    contexts: ["selection"],
  });

  chrome.contextMenus.create({
    id: "llmutils-separator",
    type: "separator",
    contexts: ["selection"],
  });

  chrome.contextMenus.create({
    id: "llmutils-open",
    title: "Open LLMUtils Dashboard",
    contexts: ["page"],
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "llmutils-sanitize") {
    handleSanitizeAction(info.selectionText || "", tab);
  } else if (info.menuItemId === "llmutils-markdown") {
    handleMarkdownAction(info.selectionText || "", tab);
  } else if (info.menuItemId === "llmutils-open") {
    chrome.tabs.create({ url: "https://llmutils.co" });
  }
});

async function handleSanitizeAction(text: string, tab?: chrome.tabs.Tab) {
  // Check usage limits via API
  const response = await fetch("https://llmutils.co/api/extension/sanitize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, userId: await getUserId() }),
  });

  if (response.ok) {
    const data = await response.json();
    // Copy to clipboard
    if (tab?.id) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (text) => navigator.clipboard.writeText(text),
        args: [data.sanitized],
      });
    }
  } else {
    // Show upgrade prompt
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icon48.png",
      title: "LLMUtils - Upgrade Required",
      message: "Free users get 3 actions/day. Upgrade to Pro for unlimited.",
    });
  }
}

async function handleMarkdownAction(text: string, tab?: chrome.tabs.Tab) {
  // Similar to sanitize but for markdown conversion
  const response = await fetch("https://llmutils.co/api/extension/markdown", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, userId: await getUserId() }),
  });

  if (response.ok) {
    const data = await response.json();
    if (tab?.id) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (text) => navigator.clipboard.writeText(text),
        args: [data.markdown],
      });
    }
  }
}

async function getUserId(): Promise<string | null> {
  const result = await chrome.storage.local.get(["userId"]);
  return result.userId || null;
}
