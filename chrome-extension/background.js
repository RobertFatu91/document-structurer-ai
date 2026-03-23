chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type !== "SMART_REPLY") return;

  fetch("https://document-structurer-ai.vercel.app/api/ai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "email-reply",
      content: message.content,
      email: message.email,
      tone: message.tone,
    }),
  })
    .then(async (res) => {
      let data = null;

      try {
        data = await res.json();
      } catch {
        data = { error: "Invalid API response" };
      }

      sendResponse({
        ok: res.ok,
        status: res.status,
        data,
      });
    })
    .catch((error) => {
      sendResponse({
        ok: false,
        status: 0,
        error: error.message,
        data: {
          error: error.message || "Network request failed",
        },
      });
    });

  return true;
});