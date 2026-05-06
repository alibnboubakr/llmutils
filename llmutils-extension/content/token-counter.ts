// Token counter for ChatGPT/Claude
let tokenCount = 0;
let lastText = "";

// Simple token estimation (roughly 4 chars per token for English)
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

// Observe text input changes
function observeInput() {
  const textareas = document.querySelectorAll("textarea");
  
  textareas.forEach((textarea) => {
    textarea.addEventListener("input", (e) => {
      const target = e.target as HTMLTextAreaElement;
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
  widget.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #1a1a1a;
    color: #fff;
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 12px;
    font-family: monospace;
    z-index: 9999;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    display: none;
  `;
  document.body.appendChild(widget);
  return widget;
}

let widget: HTMLElement | null = null;

function updateWidget() {
  if (!widget) widget = createWidget();
  
  // Check if Pro user (this would need auth check)
  const isPro = false; // TODO: Check via API
  
  if (isPro) {
    widget.style.display = "block";
    widget.textContent = `Tokens: ~${tokenCount} | Est. Cost: $${(tokenCount * 0.00003).toFixed(4)}`;
  } else {
    widget.style.display = "none";
  }
}

// Initialize
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    observeInput();
  });
} else {
  observeInput();
}

// Observe for dynamically added textareas
const observer = new MutationObserver(() => {
  observeInput();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
