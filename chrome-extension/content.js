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

function injectButton() {
  const composeWindows = document.querySelectorAll('div[role="dialog"]');

  composeWindows.forEach((composeWindow) => {
    const composeBox = composeWindow.querySelector('[contenteditable="true"]');
    if (!composeBox) return;

    if (composeWindow.querySelector(".document-structurer-btn")) return;

    const button = document.createElement("button");
    button.textContent = "Make professional";
    button.className = "document-structurer-btn";

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
          try {
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

            if (!response.ok) {
              const errorMessage =
                response.data?.error || response.error || "Something went wrong";

              if (errorMessage === "Free limit reached. Upgrade to continue.") {
                showUpgradePopup();
              } else {
                alert(errorMessage);
              }

              button.textContent = "Make professional";
              button.disabled = false;
              return;
            }

            if (response.data?.result) {
              composeBox.innerText = response.data.result;
            } else {
              alert("No result returned");
            }

            button.textContent = "Make professional";
            button.disabled = false;
          } catch (error) {
            alert("Content script error: " + error.message);
            button.textContent = "Make professional";
            button.disabled = false;
          }
        }
      );
    });

    composeWindow.style.position = "relative";
    composeWindow.appendChild(button);
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