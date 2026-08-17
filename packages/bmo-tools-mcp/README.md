# خادم BMO Tools عبر MCP

يوفر هذا الخادم أدوات BMO لعملاء MCP المتوافقين عبر الإدخال والإخراج القياسي.

## التشغيل المحلي

من جذر المستودع:

```bash
node packages/bmo-tools-mcp/index.mjs
```

يمكن تغيير عنوان نسخة BMO باستخدام المتغير:

```bash
BMO_TOOLS_BASE_URL=https://example.com node packages/bmo-tools-mcp/index.mjs
```

## إعداد عميل MCP

أضف الأمر التالي إلى إعداد عميل MCP لديك:

```json
{
  "mcpServers": {
    "bmo-tools": {
      "command": "node",
      "args": ["/المسار/إلى/bmo-toools/packages/bmo-tools-mcp/index.mjs"],
      "env": {
        "BMO_TOOLS_BASE_URL": "https://bmo-toools-three.vercel.app"
      }
    }
  }
}
```

## الأدوات المتاحة

يعرض الخادم ثلاث أدوات أولية: فهرس الأدوات، حاسبة النسبة المئوية، وحاسبة القروض. يمكن توسيع القائمة بإضافة مسارات جديدة إلى عميل الحزمة وملف تعريف أدوات MCP.

لا يضع الخادم مفاتيح سرية داخل العميل، ويستخدم واجهات BMO العامة. عند تشغيله على نطاق واسع يوصى بإضافة مصادقة وحدود للطلبات في طبقة الخادم.
