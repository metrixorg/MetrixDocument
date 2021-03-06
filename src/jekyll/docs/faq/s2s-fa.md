---
layout: classic-docs
title: S2S Integration
lang: fa
permalink: /faq/s2s-integration/index.html
toc: true # table of contents
---

## یکپارچه سازی سرور با سرور

۱. این API این امکان را به شما می‌دهد که رخداد‌هایی که در داخل App یا خارج از آن رخ می‌دهد اما توسط SDK ارسال نمی‌شود را از طریق سرور‌های خود برای ما ارسال کنید.
برای این منظور می‌توانید از API زیر استفاده کنید

```js 
Method: POST

URL: "http://analytics.metrix.ir/inappevent/{appId}"
```
```appId```: همان کلید اپلیکیشن شماست که از پنل متریکس آن را دریافت می‌کنید<br>
برای پیدا کردن ```appId``` برنامه‌ی مورد نظر خود می‌توانید به صفحه‌ی سازمان آن مراجعه کنید و در بخش Apps آن را ‌copy کنید.

```js
Path Variable:
{
	"appId": {app-id}
}
```

این بخش توسط سیستم برای هر App تولید می‌شود. کافی است با مراجعه به صفحه‌ی تنظیمات App در بخش Advanced Settings کلید(dev-key) را Copy کنید.

همچنین برای امنیت بیشتر داده‌های دریافتی می‌توانید در قسمت Advanced Settings در هر App لیستی از ip های مورد تائید خود را وارد کنید تا تنها رخدادهای دریافتی از آن محل معتبر شمرده شوند.
```js
Request Header:
{
	"Authorization":  {dev-key},
}
```

```js
Request Body:
{
  "metrixUserId": {Metrix User ID },        // e.g. 1415211453000-6513894
  "metrixSessionId": {Metrix Session ID },

  "idfa":{idfa},                            // for ios
  "advertisingId":{Google advertising id},  // for Android

  "customAttributes": {     // A JSON containing a rich in-app event value - must be String to String},
  {
    "content_type": "wallets",
    "content_id": "hrhfwbrfybwa"

  },
  "customMetrics": {        // A JSON containing a rich in-app event value - must be String to Double},
  {
    "revenue": 130.5
  },

  "deviceIp": {device IP},
  "eventSlug": {The event slug},            // e.g. "taqsq"
  "eventTime": {Event timestamp in UTC +0}, // e.g "1570274953412" timestamp in millisecond
}

```

## پارامترها
تمام پارامتر‌‌هایی که در Header و URL وجود دارند ضروری محسوب می‌شود و به هنگام استفاده از این API باید وارد شوند.
### پارامترهای اجباری

* `metrixUserId`
* `metrixSessionId`
* `advertisingId` or **idfa** : همان طور که می‌دانید idfa برای دستگاه‌هایی با سیستم عامل ios و advertisingId برای Android است. با توجه به نوع دستگاهی که رخداد مورد نظر شما در آن اتفاق می‌افتد باید دقیقا یکی از آن‌ها را انتخاب و داده‌ی متناظر با آن را وارد کنید.
انتخاب هر دوی آن‌ها یا هیچ‌کدام از آن‌ها باعث 400 Bad Request می شود.

* `eventSlug` : همان slug مشخص شده در حین تعریف یک رخداد در داشبورد متریکس است.

* `eventTime` : زمانی که رخداد در App اتفاق می‌افتد.
در صورتی که این زمان وارد نشود، زمان آن لحظه از سیستم که رخداد دریافت می‌شود به 
عنوان زمان وقوع رخداد ثبت می‌شود.


### پارامترهای اختیاری

* `customAttributes` : با این پارامتر می‌توانید اطلاعات دلخواه خود را ارسال کنید. اطلاعات ارسالی در این بخش یک Json است که تمامی value های آن باید رشته (String) باشند.
* `customMetrics` : با این پارامتر می‌توانید اطلاعات دلخواه خود را ارسال کنید. اطلاعات ارسالی در این بخش یک Json است که تمامی value های آن باید عدد (Double) باشند.
* `deviceIp` : با این پارامتر آدرس ip دستگاه را می‌توانید ارسال کنید.

## سؤالات متداول در مورد یکپارچه‌سازی سرور با سرور
{:.text-info}

### منظور از **یکپارچه سازی سرور با سرور** چیست؟
زمانی که سرور شما به عنوان تبلیغ دهنده با سرور ترکر منتخب شما یکپارچه شده باشد تا بتواند داده های رخدادهای اپلیکیشنتان را بدون نیاز به کد انتقال دهد از یکپارچه سازی سرور با سرور صحبت می کنیم. این نوع یکپارچه سازی در شرایطی به کار می آید که زیرساخت سرور شما اطلاعات کلیدی مانند تراکنش ها داشته باشد که بخواهید بی نیاز از SDK آن را برای ترکر خود بفرستید.

### چرا یکپارچه سازی سرور با سرور اهمیت دارد؟
زمانی که ویرایش کد منبع اپلیکیشن برای پلتفرم اتریبیوشن امکان پذیر نباشد این رویکرد یکپارچه سازی سودمند است. اما به طور کلی در سه حالت زیر از این قابلیت استفاده کنید:
* تیم شما امکان ویرایش کد سورس اپلیکیشنتان  را ندارد و آن را برای مثال به یک تردپارتی واگذار کرده است.
* SDK های تردپارتی با سیاست های شرکت شما به عنوان تبلیغ دهنده مطابقت ندارد
* می خواهید قبل از به‌روز رسانی اپلیکیشن رصد کمپین های خود را شروع کنید

### چطور باید سرور خودم را با سرور متریکس یکپارچه کنم؟
برای انجام این یکپارچه سازی از بخش تنظیمات اپلیکیشن خود در داشبورد اقدام کنید. لازم است development key و آدرس‌ IP های مجاز خود را وارد کنید. برای راهنمایی بیشتر از مستندات متریکس کمک بگیرید.

### آیا اپلیکیشن‌های خاصی باید از این قابلیت یکپارچه سازی استفاده کنند؟
این فیچر برای تمام اپلیکیشن های فعال در تمامی حوزه ها مناسب است. اما اپلیکیشن هایی که پرداخت خارج از برنامه در آنها بیشتر رخ می دهد (مانند اپ های بانکی، مالی و پرداخت الکترونیک) می توانند استفاده بیشتری از این سرویس کنند. با این حال تمام اپلیکیشن ها مانند حمل و نقل نیز که برای پرداخت هزینه سفر کاربر را به درگاه پرداخت هدایت می کنند بهتر است از این یکپارچه سازی بهره ببرند.