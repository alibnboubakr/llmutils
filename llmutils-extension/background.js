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

async function getUserId() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["userId"], (result) => {
      resolve(result.userId || null);
    });
  });
}

async function handleSanitizeAction(text, tab) {
  try {
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
        chrome.tabs.sendMessage(tab.id, {
          action: "copyToClipboard",
          text: data.sanitized,
        });
      }
    } else {
      console.error("Sanitize API error:", await response.text());
    }
  } catch (error) {
    console.error("Error in sanitize action:", error);
  }
}

async function handleMarkdownAction(text, tab) {
  try {
    const response = await fetch("https://llmutils.co/api/tools/markdown", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: text }),
    });

    if (response.ok) {
      const data = await response.json();
      if (tab?.id) {
        chrome.tabs.sendMessage(tab.id, {
          action: "copyToClipboard",
          text: data.markdown,
        });
      }
    }
  } catch (error) {
    console.error("Error in markdown action:", error);
  }
}
