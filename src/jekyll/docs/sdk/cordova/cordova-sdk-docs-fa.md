---
layout: classic-docs
title: SDK Cordova
lang: fa
permalink: /sdk/cordova/index.html
toc: true # table of contents
---

[![npm version](https://badge.fury.io/js/%40metrixorg%2Fcordova-metrix.svg)](https://badge.fury.io/js/%40metrixorg%2Fcordova-metrix)

# تنظیمات اولیه در پروژه

۱.به محل پروژه cordova خود بروید و با اجرای دستور زیر پلاگین متریکس را به برنامه خود اضافه کنید:

```bash
cordova plugin add @metrixorg/cordova-metrix
```

در صورتی که از `ionic-native` در پروژه خود استفاده می‌کنید، پلاگین متریکس را با اجرای دستورات زیر به برنامه خود اضافه کنید:

```bash
npm install @ionic-native/metrix --save
ionic cordova plugin add @metrixorg/cordova-metrix
```

۲. در فایل `index.js` خود، بعد از اینکه event `deviceready` را دریافت کردید، مطابق قطعه کد زیر، نمونه‌ای از کلاس `MetrixConfig` بسازید و سپس با فراخوانی متد `create`، کتابخانه متریکس را `initialize` کنید:

**توجه:** شما می‌توانید پیش از فراخوانی متد `create`، با استفاده از نمونه `MetrixConfig` خود، پیکربندی دلخواه خود را برای کتابخانه تنظیم کنید.
برای دریافت اطلاعات بیشتر در این مورد به بخش مربوطه در 
[تغییر پیکربندی کتابخانه](#تغییر-پیکربندی-کتابخانه)
 مراجعه کنید.

```javascript
let metrixConfig = new MetrixConfig('APP_ID'); // ساخت نمونه‌ای از کلاس `MetrixConfig`
// تغییر پیکربندی (دلخواه)
Metrix.create(metrixConfig); // راه‌اندازی کردن کتابخانه
```

`APP_ID`: کلید اپلیکیشن شما که از پنل متریکس آن را دریافت می‌کنید.

<hr/>
<br/>
# امکانات و قابلیت‌ها
<br/>

## نشست (session)

هر تعاملی که کاربر با یک اپلیکیشن دارد، در قالب یک **نشست** صورت می‌گیرد. کتابخانه متریکس اطلاعات مربوط به نشست‌های مختلف کاربر در اپلیکیشن شما و بازه زمانی آنها را جمع‌آوری می‌کند و در قالب **رویداد** در اختیار شما می‌گذارد.

### شناسه نشست

کتابخانه متریکس برای هر نشست یک شناسه منحصر به فرد تولید می‌کند که می‌توانید این شناسه را دریافت نمایید.
برای دریافت اطلاعات بیشتر در این مورد به بخش مربوطه در 
[تغییر پیکربندی کتابخانه](#شناسه-نشست-متریکس)
 مراجعه کنید.

 ### شماره نشست جاری

با استفاده از این تابع می‌توانید از شماره نشست جاری کاربر در تمام مدت استفاده خود از اپلیکیشن شما اطلاع پیدا کنید:

```javascript
Metrix.getSessionNum(function(sessionNum) {
  //TODO
});
```
<br/>
## رویداد (event)
هرگونه تعاملی که کاربر با اپلیکیشن شما دارد می‌تواند به عنوان یک **رویداد** در پنل و اپلیکیشن شما تعریف شود تا کتابخانه متریکس اطلاعات آماری مربوط به آن را در اختیار شما قرار دهد.

در کتابخانه متریکس چهار نوع رویداد داریم:

- **شروع نشست (session_start):** زمان شروع یک نشست.
- **پایان نشست (session_stop):‌** زمان پایان یک نشست.
- **سفارشی (custom):** وابسته به منطق اپلیکیشن شما و تعاملی که کاربر با اپلیکیشن شما دارد می‌توانید رویدادهای سفارشی خود را در قالبی که در ادامه شرح داده خواهد شد بسازید و ارسال کنید.
- **درآمدی (revenue):** نوع خاصی از رویدادهای سفارشی قابل تعریف است که مربوط به میزان درآمد کسب شده در اپلیکیشن شما می‌باشد و دارای یک مقدار قابل اندازه‌گیری از جنس درآمد مالی است.

### ساختن یک رویداد سفارشی

برای ساخت یک رویداد سفارشی در ابتدا در پنل خود از قسمت مدیریت رویدادها، رویداد موردنظر خود را ثبت کنید و نامک (slug) آن را به عنوان نام رویداد در اپلیکیشن استفاده کنید.

وقوع رویداد به دو صورت می‌تواند ثبت شود:

۱. ثبت رویداد تنها با استفاده از نامک آن که در پنل معرفی شده است:

```javascript
Metrix.newEvent('my_event_slug');
```

۲. ثبت رویداد به همراه تعداد دلخواه attribute مربوط به آن. به عنوان مثال فرض کنید در یک برنامه خرید آنلاین می‌خواهید یک رویداد سفارشی بسازید:

```javascript
var attributes = {};
attributes['first_name'] = 'Ali';
attributes['last_name'] = 'Bagheri';
attributes['manufacturer'] = 'Nike';
attributes['product_name'] = 'shirt';
attributes['type'] = 'sport';
attributes['size'] = 'large';

Metrix.newEvent('purchase_event_slug', attributes);
```

ورودی‌های متد **newEvent** در این حالت، بدین شرح هستند:

- **ورودی اول:** نامک رویداد مورد نظر شما که در پنل متریکس معرفی شده است.
- **ورودی دوم:** یک `Map<String, String>` که ویژگی‌های یک رویداد را مشخص می‌کند.

**توجه:** هر رویداد می‌تواند حداکثر ۵۰ attribute داشته باشد که طول key و value آن حداکثر ۵۱۲ بایت می‌باشد.


#### مشخص کردن Attribute‌های پیش‌فرض همه‌ی رویدادها

با استفاده از این تابع می‌توانید به تعداد دلخواه `Attribute` به همه‌ی رویدادهای خود اضافه کنید:

```javascript
var attributes = {};
attributes['manufacturer'] = 'Nike';

Metrix.addUserAttributes(attributes);
```

**توجه:** هر رویداد می‌تواند حداکثر ۵۰ attribute داشته باشد که طول key و value آن حداکثر ۵۱۲ بایت می‌باشد.


### ساختن رویداد درآمدی

با استفاده از این تابع می‌توانید یک رویداد درآمدی بسازید. برای این کار در ابتدا در پنل خود از قسمت مدیریت رویدادها، رویداد موردنظر خود را ثبت کنید و نامک (slug) آن را به عنوان نام رویداد در اپلیکیشن استفاده کنید.

```javascript
Metrix.newRevenue('my_event_slug', 12000, 0, '2');
```
ورودی‌های متد **newRevenue** بدین شرح هستند:

- **ورودی اول:** نامک رویداد مورد نظر شما که در پنل متریکس معرفی شده است.
- **ورودی دوم:** یک مقدار عددی است که همان میزان درآمد است.
- **ورودی سوم:** واحد پول مورد استفاده را تعیین می‌کند و می‌تواند سه مقدار **0 (ریال)**  (پیش‌فرض) یا **1 (دلار)** و یا **3 (یورو)** را داشته باشد.
- **ورودی چهارم:** این ورودی دلخواه است و شماره سفارش را تعیین می‌کند.

<br/>
## دریافت شناسه دستگاه‌های متریکس

برای هر دستگاهی که اپلیکیشن شما را نصب کند، متریکس یک شناسه منحصر به فرد تولید می‌کند که شما می‌توانید این شناسه را به محض شناسایی دریافت نمایید.
برای دریافت اطلاعات بیشتر در این مورد به بخش مربوطه در 
[تغییر پیکربندی کتابخانه](#شناسه-دستگاه‌های-متریکس)
 مراجعه کنید.

<br/>
## امضاء

شما می‌توانید با فعال‌سازی قابلیت sdk signature در پنل خود و تعیین app secret های موجود، امنیت ارتباط و انتقال اطلاعات را افزایش داده و از سلامت آمار اپلیکیشن خود اطمینان بیشتری حاصل کنید. برای دریافت اطلاعات بیشتر در این مورد به بخش مربوطه در 
[تغییر پیکربندی کتابخانه](#امضاء-sdk)
 مراجعه کنید.

<br/>
## شمارش پاک کردن اپلیکیشن

متریکس برای شمارش پاک شدن اپلیکشن شما از سایلنت پوش استفاده می‌کند.

**نکته:** شما باید برای استفاده از این ابزار حتما از Firebase Cloud Messaging (FCM) استفاده نمایید.

برای پیاده سازی این ابزار مراحل زیر را دنبال کنید.

- پیدا کردن FCM server key

ابتدا به کنسول فایربیس خود رفته.
دکمه settings را زده سپس به Project settings بروید
تب Cloud Messaging را انتخاب کنید.
حالا می‌توانید `server key` و `sender id` را بردارید

<img src="{{ '/images/firebase-cloud-messaging.png' | relative_url }}" alt="firebase cloud messageing"/>

- اضافه کردن FCM server key و sender id به اکانت متریکس

در داشبورد متریکس به تنظیمات اپلیکیش خود رفته
تب Push Configuration را انتخاب کنید
حالا می‌توانید FCM server key و sender id را در فیلد های مناسب قرار دهید و دکمه save را بزنید

<img src="{{ '/images/push-configuration.png' | relative_url }}" alt="push configuration"/>

<!-- - پیدا کردن Firebase APP ID

ابتدا به کنسول فایربیس خود رفته.
دکمه settings را زده سپس به Project settings بروید
تب General را انتخاب کنید
حالا می‌توانید `App ID` را بردارید

<img src="{{ '/images/firebase-settings.png' | relative_url }}" alt="firebase app id"/> -->

- تغییر پیکربندی کتابخانه متریکس

با استفاده از دستور زیر در هنگام تعیین پیکربندی کتابخانه، شناسه‌های فایربیس را به کتابخانه متریکس بدهید.

```javascript
metrixConfig.setFirebaseId("firebase app id", "firebase project id", "firebase api key");
```
**تذکر:** در این باره توضیحات مربوط به بخش
[تغییر پیکربندی کتابخانه](#تغییر-پیکربندی-کتابخانه)
را مطالعه نمایید.

- کتاب‌خانه زیر را به اپلیکیشن خود اضافه کنید:

```groovy
<framework src="com.google.firebase:firebase-messaging:18.0.0" />
```


<br/>
## دریافت اطلاعات کمپین

با استفاده از متد زیر در هنگام تعیین پیکربندی کتابخانه، می‌توانید اطلاعات کمپین تبلیغاتی که در ترکر خود در پنل قرار داده‌اید را دریافت کنید.

```javascript
metrixConfig.setOnAttributionChangedListener(attributionModel => {
  //TODO
});
```

مدل `attributionModel` اطلاعات زیر را در اختیار شما قرار می دهد:

`attributionModel.acquisitionAd` : نام تبلیغ

`attributionModel.acquisitionAdSet`: گروه تبلیغاتی

`attributionModel.acquisitionCampaign`: کمپین تبلیغاتی

`attributionModel.acquisitionSource`: شبکه تبلیغاتی

`attributionModel.attributionStatus`: وضعیت کاربر در کمپین را  
مشخص می کند

مقدار `AttributionStatus` شامل یکی از موارد زیر است:

- `ATTRIBUTED` اتربیوت شده
- `NOT_ATTRIBUTED_YET` هنوز اتربیوت نشده
- `ATTRIBUTION_NOT_NEEDED` نیاز به اتربیوت ندارد
- `UNKNOWN` حالت ناشناخته

**تذکر:** در این باره توضیحات مربوط به بخش
[تغییر پیکربندی کتابخانه](#تغییر-پیکربندی-کتابخانه)
را مطالعه نمایید.

<br/>
## Deep Linking

اگر شما از ترکر هایی که دیپ‌لینک در آنها فعال است استفاده کنید، می‌توانید اطلاعات url دیپ‌لینک و محتوای آن را دریافت کنید. دستگاه بر اساس نصب بودن اپلیکیشن (سناریو استاندارد) یا نصب نبودن اپلیکیشن (سناریو deferred) واکنش نشان می‌دهد.
در صورت نصب بودن اپلیکیشن شما اطلاعات دیپ‌لینک به اپلیکیشن شما ارسال می‌شود.

پلتفرم اندروید به صورت اتوماتیک سناریو deferred را پشتیبانی نمی‌کند. در این صورت متریکس سناریو مخصوص به خود را دارد تا بتواند اطلاعات دیپ‌لینک را به اپلیکیشن ارسال کند.

### سناریو استاندارد

برای پیاده سازی سناریو استاندارد می‌توانید از  [این](https://github.com/EddyVerbruggen/Custom-URL-scheme) پلاگین استفاده کنید،

### سناریو deferred

این سناریو زمانی رخ می‌هد که کاربر روی دیپ‌لینک کلیک می‌کند ولی اپلیکیشن شما را در زمانی که کلیک کرده روی دستگاه خود نصب نکرده است. وقتی کاربر کلیک کرد به گوگل پلی استور هدایت می‌شود تا اپلیکیشن شما را نصب کند. وقتی اپلیکیشن شما را نصب کرد و برای اولین بار آن را باز کرد اطلاعات دیپ‌لینک به اپلیکیشن داده می‌شود.

متریکس به صورت پیش‌فرض سناریو deferred را پشتیبانی نمی‌کند و نیاز به تنظیم دارد.
اگر شما قصد دارید که سناریو deferred را کنترل کنید می‌توانید از کالبک زیر در هنگام تعیین پیکربندی کتابخانه استفاده نمایید:

```javascript
metrixConfig.setShouldLaunchDeeplink(true);
metrixConfig.setOnDeeplinkResponseListener(deeplink => {
  //TODO
});
```
بعد از این که متریکس اطلاعات دیپ‌لینک را از سرور خود دریافت کرد محتوای آن را به کالبک بالا پاس می‌دهد. اگر خروجی متد `lunchReceivedDeeplink` مقدار `true` باشد متریکس به صورت اتوماتیک سناریو استاندارد را اجرا می‌کند ولی اگر مقدار خروجی متد `false` باشد متریکس فقط اطلاعات را در این کالبک قرار می‌دهد تا شما بر اساس آن اکشن مورد نظر خود را انجام دهید.

**تذکر:** در این باره توضیحات مربوط به بخش
[تغییر پیکربندی کتابخانه](#تغییر-پیکربندی-کتابخانه)
را مطالعه نمایید.

### ری‌اتریبیوت با دیپ‌لینک

متریکس ابزار ری‌اتریبیوت با دیپ‌لینک دارد. اگر می‌خواهید از این ابزار استفاده کنید نیاز است یکی از متد های متریکس را بعد از دریافت دیپ‌لینک صدا بزنید.
اگر شما اطلاعات دیپ‌لینک را در اپلیکیشن دریافت کردید با صدا زدن `Metrix.appWillOpenUrl(deeplink)` می‌توانید اطلاعات دیپ‌لینک را به متریکس ارسال کنید تا کاربر دوباره ری‌اتریبیوت شود.

```javascript
onDeeplink(deeplink) {
  Metrix.appWillOpenUrl(deeplink);
}
```

<hr/>
<br/>
# تغییر پیکربندی کتابخانه
شما می‌توانید به مانند قطعه کد زیر در `constructor` کلاس کامپوننت اصلی پروژه خود، پیش از فراخوانی متد `onCreate` به منظور `initialize` کردن کتابخانه، با استفاده از نمونه کلاس `MetrixConfig` خود، تغییرات مورد نظر خود را در رابطه با پیکربندی کتابخانه متریکس ایجاد کنید:

```javascript
let metrixConfig = new MetrixConfig('APP_ID');

// اعمال تغییرات مورد نظر

Metrix.onCreate(metrixConfig); // راه‌اندازی کردن کتابخانه
```

در ادامه به معرفی تغییراتی که می‌توانید اعمال کنید، می‌پردازیم.

### ثبت اطلاعات مکان کاربر در رویدادها

می‌توانید با استفاده دستور زیر به کتابخانه متریکس اعلام کنید که در رویدادها اطلاعات مربوط به مکان کاربر را به همراه دیگر اطلاعات ارسال کند.

```javascript
metrixConfig.setLocationListening(isLocationListeningEnable);
```

**تذکر مهم:** برای استفاده از امکانات مبتنی بر مکان کاربر نیاز است که اپلیکیشن شما دسترسی موقعیت مکانی را داشته باشد. به این منظور یکی از دسترسی‌های زیر را به فایل `AndroidManifest.xml` برنامه خود اضافه نمایید.

```xml
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```
البته توجه داشته باشید که در اندرویدهای ۶ به بالا برای گرفتن این دسترسی ها علاوه بر اضافه کردن آنها به منیفست باید دسترسی در زمان اجرا هم از کاربر گرفته شود.

### سقف تعداد رویدادها برای ارسال به سمت سرور

با استفاده از دستور زیر می‌توانید مشخص کنید که هر موقع تعداد رویدادهای ذخیره شده شما به تعداد مورد نظر شما رسید کتابخانه رویدادها را برای سرور ارسال کند:

```javascript
metrixConfig.setEventUploadThreshold(50);
```

مقدار پیش‌فرض این تابع در کتابخانه ۳۰ رویداد است.

### حداکثر تعداد رویداد ارسالی در هر درخواست

با استفاده از دستور زیر می‌توانید حداکثر تعداد رویداد ارسالی در هر درخواست را مشخص کنید:

```javascript
metrixConfig.setEventUploadMaxBatchSize(100);
```

مقدار پیش‌فرض این تابع در کتابخانه ۱۰۰ رویداد است.

### تعداد حداکثر ذخیره رویداد در مخزن کتابخانه

با استفاده از دستور زیر می‌توانید مشخص کنید که حداکثر تعداد رویدادهای ذخیره شده در کتابخانه متریکس چقدر باشد (به عنوان مثال اگر دستگاه کاربر اتصال خود به اینترنت را از دست داد رویدادها تا مقداری که شما مشخص می‌کنید در کتابخانه ذخیره خواهند شد) و اگر تعداد رویدادهای ذخیره شده در کتابخانه از این مقدار بگذرد رویدادهای قدیمی توسط کتابخانه نگهداری نشده و از بین می‌روند:

```javascript
metrixConfig.setEventMaxCount(1000);
```

مقدار پیش‌فرض این تابع در کتابخانه ۱۰۰۰ رویداد است.

### بازه زمانی ارسال رویدادها به سمت سرور

با استفاده از دستور زیر می‌توانید مشخص کنید که درخواست آپلود رویدادها بعد از گذشت چند میلی‌ثانیه فرستاده شود:

```javascript
metrixConfig.setEventUploadPeriodMillis(30000);
```

مقدار پیش‌فرض این تابع در کتابخانه ۳۰ ثانیه است.

### بازه زمانی دلخواه برای نشست‌ها

با استفاده از این تابع می‌توانید حد نشست‌ها را در اپلیکیشن خود مشخص کنید که هر نشست حداکثر چند ثانیه محاسبه شود. به عنوان مثال اگر مقدار این تابع را ۱۰۰۰۰ وارد کنید اگر کاربر در اپلیکیشن ۷۰ ثانیه تعامل داشته باشد، کتابخانه متریکس این تعامل را ۷ نشست محاسبه می‌کند.

```javascript
metrixConfig.setSessionTimeoutMillis(1800000);
```

مقدار پیش‌فرض این متد در کتابخانه ۳۰ دقیقه است.

### مشخص کردن Pre-installed Tracker

اگر بخواهید برای کاربرانی که نصب آنها organic بوده و از یک کلیک ناشی نمی‌شود ترکر داشته باشید، با استفاده از این تابع می‌توانید با یک `trackerToken` که از پنل دریافت می‌کنید، یک `tracker` پیش‌فرض برای اپلیکیشن خود قرار دهید:

```javascript
metrixConfig.setDefaultTracker(trackerToken);
```

### امضاء SDK

اگر شما قابلیت sdk signature را در پنل خود فعال کنید و به app secret ها دسترسی دارید برای استفاده از آن از متد زیر استفاده کنید:

```javascript
metrixConfig.setAppSecret(secretId, info1, info2, info3, info4);
```

### تفکیک بر‌اساس استور های اپلیکیشن

اگر شما می‌خواهید اپلیکیشن خود را در استور های مختلف مانند کافه بازار، گوگل پلی و … منتشر کنید، با استفاده از متد زیر می‌توانید مشاهده کنید که کاربر از کدام استور ( مثلا کافه بازار، گوگل پلی، مایکت، اول مارکت و وبسایت ... ) اپلیکیشن را نصب کرده و منبع نصب های ارگانیک خود را شناسایی کنید.

```javascript
metrixConfig.setStore("store name");
```

### شناسه دستگاه‌های متریکس

برای هر دستگاهی که اپلیکیشن شما را نصب کند، متریکس یک شناسه منحصر به فرد تولید می‌کند.
برای دسترسی به این شناسه از طریق متد زیر می‌توانید آن را دریافت کنید

```javascript
metrixConfig.setOnReceiveUserIdListener(metrixUserId => {
  //TODO
});
```

**نکته:** شناسه متریکس زمانی در اختیار شما قرار می‌گیرید که دستگاه توسط سرویس متریکس شناسایی شده باشد.

### شناسه نشست متریکس

کتابخانه متریکس برای هر نشست یک شناسه منحصر به فرد تولید می‌کند.
برای دسترسی به این شناسه از طریق متد زیر شنونده را تعریف نمایید:

```javascript
metrixConfig.setOnSessionIdListener(metrixSessionId => {
  //TODO
});
```
