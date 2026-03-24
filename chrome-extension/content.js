console.log("DOCUMENT STRUCTURER EXTENSION LOADED");
alert("DOCUMENT STRUCTURER EXTENSION LOADED");

function getUserEmail() {
  const accountButton = document.querySelector('a[aria-label*="@"]');
  if (!accountButton) return null;

  const label = accountButton.getAttribute("aria-label") || "";
  const match = label.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);

  return match ? match[0] : null;
}

function showUpgradePopup() {
  const existingPopup = document.getElementById("document-structurer-upgrade-popup");
  if (existingPopup) {
    existingPopup.remove();
  }

  const overlay = document.createElement("div");
  overlay.id = "document-structurer-upgrade-popup";
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.background = "rgba(0, 0, 0, 0.45)";
  overlay.style.zIndex = "999999";

  const modal = document.createElement("div");
  modal.style.position = "fixed";
  modal.style.top = "50%";
  modal.style.left = "50%";
  modal.style.transform = "translate(-50%, -50%)";
  modal.style.background = "#ffffff";
  modal.style.padding = "24px";
  modal.style.borderRadius = "12px";
  modal.style.boxShadow = "0 10px 30px rgba(0,0,0,0.2)";
  modal.style.width = "360px";
  modal.style.maxWidth = "90vw";
  modal.style.fontFamily = "Arial, sans-serif";
  modal.style.textAlign = "center";

  modal.innerHTML = `
    <h2 style="margin: 0 0 10px 0; font-size: 22px; color: #111;">Free limit reached</h2>
    <p style="margin: 0 0 18px 0; font-size: 14px; color: #555;">
      You have used all 3 free transformations. Upgrade to continue.
    </p>
    <div style="display: flex; gap: 10px; justify-content: center;">
      <button id="document-structurer-close-popup" style="
        padding: 10px 14px;
        border: 1px solid #ddd;
        background: white;
        color: #111;
        border-radius: 8px;
        cursor: pointer;
      ">
        Maybe later
      </button>
      <button id="document-structurer-upgrade-btn" style="
        padding: 10px 14px;
        border: none;
        background: black;
        color: white;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
      ">
        Upgrade
      </button>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  document.getElementById("document-structurer-close-popup").onclick = () => {
    overlay.remove();
  };

  document.getElementById("document-structurer-upgrade-btn").onclick = () => {
    window.open("https://document-structurer-ai.vercel.app", "_blank");
  };

  overlay.onclick = (event) => {
    if (event.target === overlay) {
      overlay.remove();
    }
  };
}

function getOpenedEmailText() {
  const allBodies = Array.from(document.querySelectorAll("div.a3s"));
  const visibleBodies = allBodies.filter(
    (el) => el.offsetParent !== null && el.innerText.trim().length > 20
  );

  if (!visibleBodies.length) return "";

  return visibleBodies[visibleBodies.length - 1].innerText.trim();
}

function removeExistingMenus() {
  const menus = document.querySelectorAll(".document-structurer-smart-reply-menu");
  menus.forEach((menu) => menu.remove());
}

function createSmartReplyMenu(button, composeWindow, composeBox) {
  removeExistingMenus();

  const menu = document.createElement("div");
  menu.className = "document-structurer-smart-reply-menu";
  menu.style.position = "absolute";
  menu.style.bottom = "52px";
  menu.style.right = "60px";
  menu.style.background = "#fff";
  menu.style.border = "1px solid #ddd";
  menu.style.borderRadius = "10px";
  menu.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
  menu.style.padding = "8px";
  menu.style.zIndex = "999999";
  menu.style.display = "grid";
  menu.style.gap = "8px";
  menu.style.minWidth = "180px";

  const tones = ["Professional", "Polite", "Friendly", "Concise"];

  tones.forEach((toneLabel) => {
    const option = document.createElement("button");
    option.textContent = toneLabel;
    option.style.padding = "10px 12px";
    option.style.border = "1px solid #eee";
    option.style.borderRadius = "8px";
    option.style.background = "white";
    option.style.cursor = "pointer";
    option.style.textAlign = "left";
    option.style.fontSize = "14px";

    option.addEventListener("click", () => {
      menu.remove();
      generateSmartReply(toneLabel.toLowerCase(), composeBox, button);
    });

    menu.appendChild(option);
  });

   const computedStyle = window.getComputedStyle(composeWindow);
if (computedStyle.position === "static") {
  composeWindow.style.position = "relative";
}
composeWindow.appendChild(menu);
}

function generateSmartReply(tone, composeBox, button) {
  const originalEmailText = getOpenedEmailText();

  if (!originalEmailText) {
    alert("Could not detect the opened email content. Open the email thread and try again.");
    return;
  }

  if (!composeBox) {
    alert("Open the reply box first, then use Smart Reply.");
    return;
  }

  button.textContent = "Working...";
  button.disabled = true;

  if (!chrome?.runtime?.sendMessage) {
  alert("Extension runtime not available. Go to chrome://extensions and reload the extension.");
  button.textContent = "Smart Reply";
  button.disabled = false;
  return;
}

chrome.runtime.sendMessage(
  {
    type: "SMART_REPLY",
    content: originalEmailText,
    email: getUserEmail(),
    tone,
  },
  (response) => {
    try {
      if (chrome.runtime.lastError) {
        alert("Extension error: " + chrome.runtime.lastError.message);
        button.textContent = "Smart Reply";
        button.disabled = false;
        return;
      }

      if (!response || !response.ok) {
        const errorMessage =
          response?.data?.error || response?.error || "Something went wrong";

        if (errorMessage === "Free limit reached. Upgrade to continue.") {
          showUpgradePopup();
        } else {
          alert(errorMessage);
        }

        button.textContent = "Smart Reply";
        button.disabled = false;
        return;
      }

      if (response.data?.result) {
        composeBox.innerText = response.data.result;
      } else {
        alert("No result returned");
      }

      button.textContent = "Smart Reply";
      button.disabled = false;
    } catch (error) {
      alert("Content script error: " + error.message);
      button.textContent = "Smart Reply";
      button.disabled = false;
    }
  }
);
}

function injectSmartReplyButton() {
  const editableBoxes = Array.from(
    document.querySelectorAll('[contenteditable="true"][role="textbox"]')
  );

  editableBoxes.forEach((composeBox) => {
    const container =
      composeBox.closest('div[role="dialog"]') ||
      composeBox.closest(".M9") ||
      composeBox.closest(".nH") ||
      composeBox.parentElement;

    if (!container) return;

    if (container.querySelector(".document-structurer-smart-reply-btn")) return;

    const text = (composeBox.innerText || "").trim();

    if (text.length > 0 && text !== "") {
      return;
    }

    const button = document.createElement("button");
    button.textContent = "Smart Reply";
    button.className = "document-structurer-smart-reply-btn";

    button.style.position = "absolute";
    button.style.bottom = "12px";
    button.style.right = "60px";
    button.style.zIndex = "999999";
    button.style.padding = "8px 12px";
    button.style.borderRadius = "6px";
    button.style.border = "none";
    button.style.background = "black";
    button.style.color = "white";
    button.style.cursor = "pointer";
    button.style.fontSize = "12px";
    button.style.fontWeight = "600";

    button.addEventListener("click", () => {
      createSmartReplyMenu(button, container, composeBox);
    });

    const computedStyle = window.getComputedStyle(container);
    if (computedStyle.position === "static") {
      container.style.position = "relative";
    }

    container.appendChild(button);
  });
}

document.addEventListener("click", (event) => {
  const menu = document.querySelector(".document-structurer-smart-reply-menu");
  if (!menu) return;

  const clickedInsideMenu = menu.contains(event.target);
  const clickedButton = event.target.closest(".document-structurer-smart-reply-btn");

  if (!clickedInsideMenu && !clickedButton) {
    menu.remove();
  }
});

const observer = new MutationObserver(() => {
  injectSmartReplyButton();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

injectSmartReplyButton();