import { spawn } from "node:child_process";

const child = spawn(process.execPath, ["packages/bmo-tools-mcp/index.mjs"], {
  cwd: process.cwd(),
  stdio: ["pipe", "pipe", "inherit"],
});

let output = Buffer.alloc(0);
const waitForMessage = new Promise((resolve, reject) => {
  const timeout = setTimeout(() => reject(new Error("انتهت مهلة اختبار MCP")), 3000);
  child.stdout.on("data", (chunk) => {
    output = Buffer.concat([output, chunk]);
    const end = output.indexOf("\r\n\r\n");
    if (end < 0) return;
    const header = output.subarray(0, end).toString();
    const match = header.match(/Content-Length:\s*(\d+)/i);
    if (!match) return;
    const size = Number(match[1]);
    const start = end + 4;
    if (output.length < start + size) return;
    clearTimeout(timeout);
    resolve(JSON.parse(output.subarray(start, start + size).toString()));
  });
});

const request = { jsonrpc: "2.0", id: 1, method: "tools/list", params: {} };
const body = JSON.stringify(request);
child.stdin.write(`Content-Length: ${Buffer.byteLength(body)}\r\n\r\n${body}`);
const response = await waitForMessage;
if (!response.result?.tools?.length) throw new Error("لم يُرجع خادم MCP أدوات");
console.log("MCP_OK", response.result.tools.map((tool) => tool.name).join(","));
child.kill();
