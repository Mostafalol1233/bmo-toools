import { createBmoToolsClient } from "./bmo-tools-sdk/index.mjs";

const client = createBmoToolsClient({
  baseUrl: "https://example.test",
  fetch: async (url, options) => ({
    ok: true,
    async json() {
      return { url, method: options?.method || "GET", body: options?.body || null };
    },
  }),
});

const percentage = await client.percentage(100, 20);
if (percentage.method !== "POST") throw new Error("فشل اختبار عميل الحزمة");
console.log("SDK_OK", percentage.url);
