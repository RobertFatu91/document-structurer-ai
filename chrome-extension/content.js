console.log("DOCUMENT STRUCTURER EXTENSION LOADED");
alert("DOCUMENT STRUCTURER EXTENSION LOADED");

function getUserEmail() {
  const accountButton = document.querySelector('a[aria-label*="@"]');
  if (!accountButton) return null;

  const label = accountButton.getAttribute("aria-label") || "";
  const match = label.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);

  return match ? match[0] : null;
}

function injectButton() {
  const composeWindows = document.querySelectorAll('div[role="dialog"]');

  composeWindows.forEach((composeWindow) => {
    const toolbars = composeWindow.querySelectorAll('[role="toolbar"]');
    if (!toolbars.length) return;

    const bottomToolbar = toolbars[toolbars.length - 1];
    if (!bottomToolbar) return;

    if (composeWindow.querySelector(".document-structurer-btn")) return;

    const sendButton = composeWindow.querySelector('div[role="button"][data-tooltip^="Send"]');
    const composeBox = composeWindow.querySelector('[contenteditable="true"]');

    if (!composeBox) return;

    const button = document.createElement("button");
    button.textContent = "Make professional";
    button.className = "document-structurer-btn";
    button.style.marginLeft = "8px";
    button.style.padding = "8px 12px";
    button.style.borderRadius = "6px";
    button.style.border = "none";
    button.style.background = "black";
    button.style.color = "white";
    button.style.cursor = "pointer";
    button.style.fontSize = "12px";
    button.style.fontWeight = "600";

    button.addEventListener("click", async () => {
      const draftText = composeBox.innerText.trim();

      if (!draftText) {
        alert("No draft text found");
        return;
      }

      button.textContent = "Working...";
      button.disabled = true;

      chrome.runtime.sendMessage(
  {
    type: "STRUCTURE_EMAIL",
    content: draftText,
    email: getUserEmail(),
  },
        (response) => {
          if (chrome.runtime.lastError) {
            alert("Extension error: " + chrome.runtime.lastError.message);
            button.textContent = "Make professional";
            button.disabled = false;
            return;
          }

          if (!response) {
            alert("No response from background script");
            button.textContent = "Make professional";
            button.disabled = false;
            return;
          }

          if (response.ok && response.data?.result) {
            composeBox.innerText = response.data.result;
          } else if (response.data?.error) {
            alert(response.data.error);
          } else if (response.error) {
            alert("Extension error: " + response.error);
          } else {
            alert("Unknown error");
          }

          button.textContent = "Make professional";
          button.disabled = false;
        }
      );
    });

    if (sendButton && sendButton.parentElement) {
      sendButton.parentElement.insertAdjacentElement("afterend", button);
    } else {
      bottomToolbar.appendChild(button);
    }
  });
}

const observer = new MutationObserver(() => {
  injectButton();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

injectButton();