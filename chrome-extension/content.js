function injectButton() {
  const composeToolbars = document.querySelectorAll('[role="toolbar"]');

  composeToolbars.forEach((toolbar) => {
    if (toolbar.querySelector(".document-structurer-btn")) return;

    const button = document.createElement("button");
    button.textContent = "Make professional";
    button.className = "document-structurer-btn";

    button.addEventListener("click", async () => {
      const composeBox = toolbar.closest('[role="dialog"]')?.querySelector('[contenteditable="true"]');

      if (!composeBox) return;

      const draftText = composeBox.innerText.trim();
      if (!draftText) return;

      button.textContent = "Working...";
      button.disabled = true;

      try {
        const res = await fetch("https://document-structurer-ai.vercel.app/api/ai", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            type: "email",
            content: draftText
          })
        });

        const data = await res.json();

        if (data?.result) {
          composeBox.innerText = data.result;
        }
      } catch (error) {
        console.error("Extension error:", error);
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
  subtree: true
});

injectButton();