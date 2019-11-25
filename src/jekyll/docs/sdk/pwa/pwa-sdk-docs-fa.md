---
layout: classic-docs
title: SDK PWA
lang: fa
permalink: /sdk/pwa/index.html
toc: true # table of contents
---


### پروژه نمونه
در [اینجا](https://github.com/metrixorg/MetrixSDK-Web/blob/master/index.js) یک نمونه از استفاده از sdk قرار دارد.

### تنظیمات اولیه

`appId`: کلید اپلیکیشن شما که از پنل متریکس آن را دریافت می‌کنید.

`uniqueDeviceId`: یک آیدی یونیک که توسط اپلیکیشن شما ساخته میشود مانند androidAdId که توسط این آیدی بتوان کاربر را یکتا سازی کرد.(غیر ضروری)

`trackerToken`: توکنی که پس از ساخت ترکر از پنل دریافت میکنید.(غیر ضروری)

`geoInfo`: لوکیشن کاربر.(غیر ضروری)

```javascript
var _metrix = new MetrixAnalytics({
	appId: 'zozazzcrpzaptaa',
	uniqueDeviceId: 'fe3343ff444r4',
	trackerToken: 'rebhyh',
	geoInfo: {
		country: "Iran",
		admin_area: "Tehran Province",
		sub_admin_area: "Tehran",
		latitude: 35.7658549,
		longitude: 51.4236146
	}
});
```
 
### ساختن یک رویداد سفارشی

با استفاده از این تابع می‌توانید یک رویداد سفارشی بسازید. برای این کار شما در ابتدا باید در داشبورد متریکس از قسمت مدیریت رخدادها، رخداد موردنظر خود را ثبت کنید و نامک (slug) آن را بعنوان نام رخداد در sdk استفاده کنید.

این تابع را به دو صورت می‌توانید صدا بزنید:

۱. یک رویداد سفارشی که فقط یک نامک مشخص دارد و آن را از داشبورد متریکس میگیرد، بسازید:

```javascript
_metrix.sendCustomTrack('my_event_slug');
```

ورودی این تابع از جنس String است و همان نامکی است که داشبورد دریافت می‌کنید.

۲. یک رویداد سفارشی با تعداد دلخواه attribute و metric خاص سناریو خود بسازید، به عنوان مثال فرض کنید در یک برنامه خرید آنلاین می‌خواهید یک رویداد سفارشی بسازید:

```javascript
var attributes = {};
attributes['first_name'] = 'Ali';
attributes['last_name'] = 'Bagheri';
attributes['manufacturer'] = 'Nike';
attributes['product_name'] = 'shirt';
attributes['type'] = 'sport';
attributes['size'] = 'large';

var metrics = {};
metrics['price'] = 100000;
metrics['perchase_time'] = current_time;

_metrix.sendCustomTrack('purchase_event_slug', attributes, metrics);
```

ورودی‌های متد sendCustomTrack بدین شرح هستند:

- **ورودی اول:** نامک رویداد مورد نظر شما که از جنس String است و آن را از داشبورد متریکس دریافت می‌کنید.
- **ورودی دوم:** یک `Map<String, String>` که ویژگی‌های یک رویداد را مشخص می‌کند.
- **ورودی سوم:** یک `Map<String, Double>` که شامل ویژگی های قابل اندازه گیری است.

### ساختن رویداد درآمدی

با استفاده از این تابع می‌توانید یک رویداد درآمدی بسازید. برای این کار شما در ابتدا باید در داشبورد متریکس از قسمت مدیریت رخدادها، رخداد موردنظر خود را ثبت کنید و نامک (slug) آن را بعنوان نام رخداد در sdk استفاده کنید.

این تابع را به صورت زیر می‌توانید صدا بزنید:

۱. یک رویداد سفارشی که فقط یک نامک مشخص دارد و آن را از داشبورد متریکس میگیرد، بسازید:

```javascript
_metrix.sendRevenue('my_event_slug', 12000, 'IRR', 'order id');
```

ورودی اول همان نامکی است که از داشبورد دریافت می‌کنید.

دومین وروی تابع یک مقدار است که همان مقدار درآمد است.

سومین ورودی واحد پول این رخداد است که در صورت قرار ندادن مقدار آن واحد پیشفرض ریال است در زیر مقادیر آن را میتوانید ببینید.

1. `IRR` ریال
2. `USD` دلار
3. `EUR` یورو

ورودی چهارم که به صورت دلخواه است میتواند شماره سفارش شما باشد.
