chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type !== "STRUCTURE_EMAIL") return;

  fetch("https://document-structurer-ai.vercel.app/api/ai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "email",
      content: message.content,
    }),
  })
    .then(async (res) => {
      const data = await res.json();
      sendResponse({
        ok: res.ok,
        status: res.status,
        data,
      });
    })
    .catch((error) => {
      sendResponse({
        ok: false,
        error: error.message,
      });
    });

  return true;
});