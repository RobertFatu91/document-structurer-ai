console.log("DOCUMENT STRUCTURER EXTENSION LOADED");
alert("DOCUMENT STRUCTURER EXTENSION LOADED");

function injectButton() {
  const composeWindows = document.querySelectorAll('div[role="dialog"]');

  composeWindows.forEach((composeWindow) => {
    const toolbar = composeWindow.querySelector('div[role="toolbar"]');
    if (!toolbar) return;

    if (toolbar.querySelector(".document-structurer-btn")) return;

    const button = document.createElement("button");
    button.textContent = "Make professional";
    button.className = "document-structurer-btn";

    button.addEventListener("click", async () => {
      const composeBox = composeWindow.querySelector('[contenteditable="true"]');
      if (!composeBox) return;

      const draftText = composeBox.innerText.trim();
      if (!draftText) return;

      button.textContent = "Working...";
      button.disabled = true;

      try {
        const res = await fetch("https://document-structurer-ai.vercel.app/api/ai", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "email",
            content: draftText,
          }),
        });

        const data = await res.json();

        if (data?.result) {
          composeBox.innerText = data.result;
        } else if (data?.error) {
          alert(data.error);
        }
      } catch (error) {
        console.error("Extension error:", error);
        alert("Something went wrong.");
      } finally {
        button.textContent = "Make professional";
        button.disabled = false;
      }
    });

    toolbar.appendChild(button);
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