// Token counter for ChatGPT/Claude
let tokenCount = 0;
let lastText = "";

// Simple token estimation (roughly 4 chars per token for English)
function estimateTokens(text) {
  return Math.ceil(text.length / 4);
}

// Observe text input changes
function observeInput() {
  const textareas = document.querySelectorAll("textarea");
  
  textareas.forEach((textarea) => {
    textarea.addEventListener("input", (e) => {
      const target = e.target;
      const text = target.value;
      
      if (text !== lastText) {
        lastText = text;
        tokenCount = estimateTokens(text);
        updateWidget();
      }
    });
  });
}

// Create floating widget
function createWidget() {
  const widget = document.createElement("div");
  widget.id = "llmutils-token-widget";
  widget.className = "llmutils-token-counter";
  widget.innerHTML = `
    <div class="llmutils-token-count">
      <svg class="llmutils-token-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
      <span class="llmutils-token-text">Tokens: <strong>${tokenCount}</strong></span>
      <span class="llmutils-token-cost">~$${(tokenCount * 0.00003).toFixed(4)}</span>
    </div>
  `;
  document.body.appendChild(widget);
  return widget;
}

let widget = null;

function updateWidget() {
  if (!widget) {
    widget = createWidget();
  }
  
  const tokenText = widget.querySelector(".llmutils-token-text strong");
  const costText = widget.querySelector(".llmutils-token-cost");
  
  if (tokenText) {
    tokenText.textContent = tokenCount.toString();
  }
  if (costText) {
    costText.textContent = `~$${(tokenCount * 0.00003).toFixed(4)}`;
  }
  
  // Show widget only if there's text
  widget.style.display = tokenCount > 0 ? "block" : "none";
}

// Initialize
function init() {
  // Check if Pro user
  chrome.storage.local.get(["plan"], (result) => {
    if (result.plan === "pro") {
      observeInput();
      
      // Use MutationObserver to detect new textareas
      const observer = new MutationObserver(() => {
        observeInput();
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }
  });
}

// Run on page load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
