# عميل BMO Tools

عميل جافاسكربت خفيف للوصول إلى واجهات BMO Tools المجانية من المواقع والخدمات الخلفية والبوتات.

## التثبيت

بعد نشر الحزمة في سجل الحزم، يمكن تثبيتها بالأمر التالي:

```bash
npm install @bmo-tools/sdk
```

ويمكن أثناء التطوير استخدامها من مسار محلي داخل المستودع.

## الاستخدام

```js
import { createBmoToolsClient } from "@bmo-tools/sdk";

const bmo = createBmoToolsClient();

const percentage = await bmo.percentage(250, 15);
console.log(percentage.result); // 37.5

const loan = await bmo.loan(100000, 12, 36);
console.log(loan.monthlyPayment);

const tools = await bmo.catalog();
console.log(tools.tools.length);
```

يمكن تغيير عنوان الخادم عند تشغيل نسخة خاصة:

```js
const bmo = createBmoToolsClient({
  baseUrl: "https://example.com"
});
```

لا يحتاج العميل إلى مفتاح سري في الإصدار العام الحالي؛ ومع ذلك ينبغي وضع حدود استخدام ومراقبة للطلبات عند تشغيل نسخة عامة واسعة النطاق.
