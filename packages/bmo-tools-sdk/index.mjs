const DEFAULT_BASE_URL = "https://bmo-toools-three.vercel.app";

export class BmoToolsClient {
  constructor(options = {}) {
    this.baseUrl = (options.baseUrl || DEFAULT_BASE_URL).replace(/\/$/, "");
    this.fetch = options.fetch || globalThis.fetch;
    if (typeof this.fetch !== "function") {
      throw new Error("يتطلب العميل بيئة تحتوي على fetch");
    }
  }

  async request(path, options = {}) {
    const response = await this.fetch(`${this.baseUrl}${path}`, {
      headers: { "content-type": "application/json", ...(options.headers || {}) },
      ...options,
    });
    const body = await response.json();
    if (!response.ok) {
      throw new Error(body?.error || `فشل الطلب: ${response.status}`);
    }
    return body;
  }

  catalog() {
    return this.request("/api/v1/catalog");
  }

  percentage(value, percent) {
    return this.request("/api/v1/calculate/percentage", {
      method: "POST",
      body: JSON.stringify({ value, percent }),
    });
  }

  loan(principal, annualRate, months) {
    return this.request("/api/v1/calculate/loan", {
      method: "POST",
      body: JSON.stringify({ principal, annualRate, months }),
    });
  }
}

export function createBmoToolsClient(options) {
  return new BmoToolsClient(options);
}

export default BmoToolsClient;
