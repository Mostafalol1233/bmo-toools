#!/usr/bin/env node
import readline from "node:readline";
import { createBmoToolsClient } from "../bmo-tools-sdk/index.mjs";

const client = createBmoToolsClient({
  baseUrl: process.env.BMO_TOOLS_BASE_URL || "https://bmo-toools-three.vercel.app",
});

function writeMessage(message) {
  const payload = JSON.stringify(message);
  process.stdout.write(`Content-Length: ${Buffer.byteLength(payload, "utf8")}\r\n\r\n${payload}`);
}

async function handleRequest(message) {
  const { id, method, params = {} } = message;
  if (method === "notifications/initialized" || method === "notifications/cancelled") return;

  if (method === "initialize") {
    return writeMessage({
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: { name: "bmo-tools", version: "0.1.0" },
      },
    });
  }

  if (method === "tools/list") {
    return writeMessage({
      jsonrpc: "2.0",
      id,
      result: {
        tools: [
          {
            name: "bmo_catalog",
            description: "يعيد فهرس أدوات BMO المجانية ومساراتها.",
            inputSchema: { type: "object", properties: {} },
          },
          {
            name: "bmo_percentage",
            description: "يحسب نسبة مئوية من قيمة.",
            inputSchema: {
              type: "object",
              properties: { value: { type: "number" }, percent: { type: "number" } },
              required: ["value", "percent"],
            },
          },
          {
            name: "bmo_loan",
            description: "يحسب القسط الشهري وإجمالي الفائدة لقرض.",
            inputSchema: {
              type: "object",
              properties: {
                principal: { type: "number" },
                annualRate: { type: "number" },
                months: { type: "number" },
              },
              required: ["principal", "annualRate", "months"],
            },
          },
        ],
      },
    });
  }

  if (method === "tools/call") {
    try {
      let data;
      if (params.name === "bmo_catalog") data = await client.catalog();
      else if (params.name === "bmo_percentage") data = await client.percentage(params.arguments?.value, params.arguments?.percent);
      else if (params.name === "bmo_loan") data = await client.loan(params.arguments?.principal, params.arguments?.annualRate, params.arguments?.months);
      else throw new Error("الأداة المطلوبة غير معروفة");

      return writeMessage({
        jsonrpc: "2.0",
        id,
        result: { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] },
      });
    } catch (error) {
      return writeMessage({
        jsonrpc: "2.0",
        id,
        error: { code: -32000, message: error instanceof Error ? error.message : "فشل استدعاء الأداة" },
      });
    }
  }

  if (id !== undefined) {
    writeMessage({ jsonrpc: "2.0", id, error: { code: -32601, message: "الطريقة غير مدعومة" } });
  }
}

let buffer = Buffer.alloc(0);
process.stdin.on("data", (chunk) => {
  buffer = Buffer.concat([buffer, chunk]);
  while (true) {
    const headerEnd = buffer.indexOf("\r\n\r\n");
    if (headerEnd < 0) break;
    const headers = buffer.subarray(0, headerEnd).toString("utf8");
    const match = headers.match(/Content-Length:\s*(\d+)/i);
    if (!match) {
      buffer = buffer.subarray(headerEnd + 4);
      continue;
    }
    const contentLength = Number(match[1]);
    const messageStart = headerEnd + 4;
    if (buffer.length < messageStart + contentLength) break;
    const body = buffer.subarray(messageStart, messageStart + contentLength).toString("utf8");
    buffer = buffer.subarray(messageStart + contentLength);
    try {
      void handleRequest(JSON.parse(body));
    } catch {
      writeMessage({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "JSON غير صالح" } });
    }
  }
});

const rl = readline.createInterface({ input: process.stdin });
rl.on("close", () => process.exit(0));
