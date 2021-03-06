---
layout: classic-docs
title: SDK Flutter
lang: fa
permalink: /sdk/flutter/index.html
toc: true # table of contents
---

[![pub package](https://img.shields.io/pub/v/metrix.svg)](https://pub.dartlang.org/packages/metrix)

# تنظیمات اولیه در پروژه

۱. کتابخانه متریکس را طبق 
[این توضیحات](https://flutter.io/platform-plugins/)
 به وابستگی‌های پروژه خود در فایل `pubspec.yaml` اضافه کنید.

## اندروید

۲. در کلاس اولیه پروژه خود، مطابق قطعه کد زیر، داخل متد `initState`، نمونه‌ای از کلاس `MetrixConfig` بسازید و سپس با فراخوانی متد `onCreate`، کتابخانه متریکس را `initialize` کنید:

**توجه:** شما می‌توانید پیش از فراخوانی متد `onCreate`، با استفاده از نمونه `MetrixConfig` خود، پیکربندی دلخواه خود را برای کتابخانه تنظیم کنید.
برای دریافت اطلاعات بیشتر در این مورد به بخش مربوطه در 
[تغییر پیکربندی کتابخانه](#تغییر-پیکربندی-کتابخانه)
 مراجعه کنید.

```dart
import 'package:metrix/metrix.dart'; // ایمپورت کردن پکیج

class _MyAppState extends State<MyApp> {

  @override
  void initState() {
    super.initState();

    MetrixConfig metrixConfig = new MetrixConfig("APP_ID"); // ساخت نمونه‌ای از کلاس `MetrixConfig`
    // تغییر پیکربندی (دلخواه)
    Metrix.onCreate(metrixConfig); // راه‌اندازی کردن کتابخانه
  }
}
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

```dart
Metrix.newEvent('my_event_slug',null,null);
```

۲. ثبت رویداد به همراه تعداد دلخواه attribute مربوط به آن. به عنوان مثال فرض کنید در یک برنامه خرید آنلاین می‌خواهید یک رویداد سفارشی بسازید:

```dart
Map<String, String> attributes = new Map();
attributes["first_name"] =  "Ali";
attributes["last_name"] =  "Bagheri";
attributes["manufacturer"] =  "Nike";
attributes["product_name"] =  "shirt";
attributes["type"] =  "sport";
attributes["size"] =  "large";

Metrix.newEvent("purchase_event_slug", attributes);
```

ورودی‌های متد **newEvent** در این حالت، بدین شرح هستند:

- **ورودی اول:** نامک رویداد مورد نظر شما که در پنل متریکس معرفی شده است.
- **ورودی دوم:** یک `Map<String, String>` که ویژگی‌های یک رویداد را مشخص می‌کند.

**توجه:** هر رویداد می‌تواند حداکثر ۵۰ attribute داشته باشد که طول key و value آن حداکثر ۵۱۲ بایت می‌باشد.


#### مشخص کردن Attribute‌های پیش‌فرض همه‌ی رویدادها

با استفاده از این تابع می‌توانید به تعداد دلخواه `Attribute` به همه‌ی رویدادهای خود اضافه کنید:

```dart
Map<String, String> attributes = new Map();
attributes["first_name"] =  "Ali";
attributes["last_name"] =  "Bagheri";
attributes["manufacturer"] =  "Nike";
attributes["product_name"] =  "shirt";
attributes["type"] =  "sport";
attributes["size"] =  "large";

Metrix.addUserAttributes(attributes);
```

**توجه:** هر رویداد می‌تواند حداکثر ۵۰ attribute داشته باشد که طول key و value آن حداکثر ۵۱۲ بایت می‌باشد.


### ساختن رویداد درآمدی

با استفاده از این تابع می‌توانید یک رویداد درآمدی بسازید. برای این کار در ابتدا در پنل خود از قسمت مدیریت رویدادها، رویداد موردنظر خود را ثبت کنید و نامک (slug) آن را به عنوان نام رویداد در اپلیکیشن استفاده کنید.

```dart
Metrix.newRevenue('my_event_slug', 12000, 0, '{orderId}');
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

با استفاده از دستور زیر در هنگام تعیین پیکربندی کتابخانه، آیدی فایربیس را به کتابخانه متریکس بدهید.

```dart
metrixConfig.setFirebaseId("firebase app id", "firebase project id", "firebase api key");
```

**تذکر:** در این باره توضیحات مربوط به بخش
[تغییر پیکربندی کتابخانه](#تغییر-پیکربندی-کتابخانه)
را مطالعه نمایید.

- کتاب‌خانه زیر را در قسمت `dependencies` فایل `app/build.gradle` اپلیکیشن خود اضافه کنید:

```groovy
implementation 'com.google.firebase:firebase-messaging:18.0.0'
```

<br/>
## دریافت اطلاعات کمپین

با استفاده از متد زیر، در هنگام تعیین پیکربندی کتابخانه، می‌توانید اطلاعات کمپین تبلیغاتی که در ترکر خود در پنل قرار داده‌اید را دریافت کنید.

```darts
void metrixAttribution(dynamic attributionModel) {
  //do any thing with metrix attribution model
}

metrixConfig.attributionCallback = metrixAttribution;
```

مدل `AttributionModel` اطلاعات زیر را در اختیار شما قرار می‌دهد.

```java
attributionModel.getAcquisitionAd() // نام تبلیغ
attributionModel.getAcquisitionAdSet() // گروه تبلیغاتی
attributionModel.getAcquisitionCampaign() // کمپین تبلیغاتی
attributionModel.getAcquisitionSource() // شبکه تبلیغاتی
attributionModel.getAttributionStatus() // وضعیت کاربر در کمپین را مشخص می‌کند
```

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

برای پیاده سازی سناریوی استاندارد به داکیومنت اندروید مراجعه نماید.

### سناریو deferred

این سناریو زمانی رخ می‌هد که کاربر روی دیپ‌لینک کلیک می‌کند ولی اپلیکیشن شما را در زمانی که کلیک کرده روی دستگاه خود نصب نکرده است. وقتی کاربر کلیک کرد به گوگل پلی استور هدایت می‌شود تا اپلیکیشن شما را نصب کند. وقتی اپلیکیشن شما را نصب کرد و برای اولین بار آن را باز کرد اطلاعات دیپ‌لینک به اپلیکیشن داده می‌شود.

متریکس به صورت پیش‌فرض سناریو deferred را پشتیبانی نمی‌کند و نیاز به تنظیم دارد.
اگر شما قصد دارید که سناریو deferred را کنترل کنید می‌توانید از کالبک زیر در هنگام تعیین پیکربندی کتابخانه استفاده نمایید:

```dart
void deferredDeeplink(String deeplink) {
  //do any thing with deferred deeplink
}

metrixConfig.lunchDeferredDeeplink = true;
metrixConfig.deferredDeeplinkCallback = deferredDeeplink;
```
بعد از این که متریکس اطلاعات دیپ‌لینک را از سرور خود دریافت کرد محتوای آن را به کالبک بالا پاس می‌دهد. اگر خروجی متد `lunchReceivedDeeplink` مقدار `true` باشد متریکس به صورت اتوماتیک سناریو استاندارد را اجرا می‌کند ولی اگر مقدار خروجی متد `false` باشد متریکس فقط اطلاعات را در این کالبک قرار می‌دهد تا شما بر اساس آن اکشن مورد نظر خود را انجام دهید.

**تذکر:** در این باره توضیحات مربوط به بخش
[تغییر پیکربندی کتابخانه](#تغییر-پیکربندی-کتابخانه)
را مطالعه نمایید.

### ری‌اتریبیوت با دیپ‌لینک

متریکس ابزار ری‌اتریبیوت با دیپ‌لینک دارد. اگر می‌خواهید از این ابزار استفاده کنید نیاز است یکی از متد های متریکس را بعد از دریافت دیپ‌لینک صدا بزنید.
اگر شما اطلاعات دیپ‌لینک را در اپلیکیشن دریافت کردید با صدا زدن `Metrix.appWillOpenUrl(deeplink)` می‌توانید اطلاعات دیپ‌لینک را به متریکس ارسال کنید تا کاربر دوباره ری‌اتریبیوت شود.

```dart
void onDeeplink(String deeplink) {
  Metrix.appWillOpenUrl(deeplink);
}
```

<hr/>
<br/>
# تغییر پیکربندی کتابخانه
شما می‌توانید به مانند قطعه کد زیر در کلاس اولیه پروژه خود، پیش از فراخوانی متد `onCreate` به منظور `initialize` کردن کتابخانه، با استفاده از نمونه کلاس `MetrixConfig` خود، تغییرات مورد نظر خود را در رابطه با پیکربندی کتابخانه متریکس ایجاد کنید:

```dart
import 'package:metrix/metrix.dart';

class _MyAppState extends State<MyApp> {

  @override
  void initState() {
    super.initState();

    MetrixConfig metrixConfig = new MetrixConfig("APP_ID");

    // اعمال تغییرات مورد نظر
    
    Metrix.onCreate(metrixConfig); // راه‌اندازی کردن کتابخانه
  }
}
```

### ثبت اطلاعات مکان کاربر در رویدادها

می‌توانید با استفاده دستور زیر به کتابخانه متریکس اعلام کنید که در رویدادها اطلاعات مربوط به مکان کاربر را به همراه دیگر اطلاعات ارسال کند.

```dart
metrixConfig.locationListening = isLocationListeningEnable;
```

**تذکر مهم:** برای استفاده از امکانات مبتنی بر مکان کاربر نیاز است که اپلیکیشن شما دسترسی موقعیت مکانی را داشته باشد. به این منظور یکی از دسترسی‌های زیر را به فایل `AndroidManifest.xml` برنامه خود اضافه نمایید.

```xml
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```
البته توجه داشته باشید که در اندرویدهای ۶ به بالا برای گرفتن این دسترسی ها علاوه بر اضافه کردن آنها به منیفست باید دسترسی در زمان اجرا هم از کاربر گرفته شود.

### سقف تعداد رویدادها برای ارسال به سمت سرور

با استفاده از دستور زیر می‌توانید مشخص کنید که هر موقع تعداد رویدادهای ذخیره شده شما به تعداد مورد نظر شما رسید کتابخانه رویدادها را برای سرور ارسال کند:

```dart
metrixConfig.eventUploadThreshold = 50;
```

مقدار پیش‌فرض این تابع در کتابخانه ۳۰ رویداد است.

### حداکثر تعداد رویداد ارسالی در هر درخواست

با استفاده از دستور زیر می‌توانید حداکثر تعداد رویداد ارسالی در هر درخواست را مشخص کنید:

```dart
metrixConfig.eventUploadMaxBatchSize = 100;
```

مقدار پیش‌فرض این تابع در کتابخانه ۱۰۰ رویداد است.

### تعداد حداکثر ذخیره رویداد در مخزن کتابخانه

با استفاده از دستور زیر می‌توانید مشخص کنید که حداکثر تعداد رویدادهای ذخیره شده در کتابخانه متریکس چقدر باشد (به عنوان مثال اگر دستگاه کاربر اتصال خود به اینترنت را از دست داد رویدادها تا مقداری که شما مشخص می‌کنید در کتابخانه ذخیره خواهند شد) و اگر تعداد رویدادهای ذخیره شده در کتابخانه از این مقدار بگذرد رویدادهای قدیمی توسط کتابخانه نگهداری نشده و از بین می‌روند:

```dart
metrixConfig.eventMaxCount = 1000;
```

مقدار پیش‌فرض این تابع در کتابخانه ۱۰۰۰ رویداد است.

### بازه زمانی ارسال رویدادها به سمت سرور

با استفاده از دستور زیر می‌توانید مشخص کنید که درخواست آپلود رویدادها بعد از گذشت چند میلی‌ثانیه فرستاده شود:

```dart
metrixConfig.eventUploadPeriodMillis = 30000;
```

مقدار پیش‌فرض این تابع در کتابخانه ۳۰ ثانیه است.

### بازه زمانی دلخواه برای نشست‌ها

با استفاده از این تابع می‌توانید حد نشست‌ها را در اپلیکیشن خود مشخص کنید که هر نشست حداکثر چند ثانیه محاسبه شود. به عنوان مثال اگر مقدار این تابع را ۱۰۰۰۰ وارد کنید اگر کاربر در اپلیکیشن ۷۰ ثانیه تعامل داشته باشد، کتابخانه متریکس این تعامل را ۷ نشست محاسبه می‌کند.

```dart
metrixConfig.sessionTimeoutMillis = 1800000;
```

مقدار پیش‌فرض این متد در کتابخانه ۳۰ دقیقه است.

### مشخص کردن Pre-installed Tracker

اگر بخواهید برای کاربرانی که نصب آنها organic بوده و از یک کلیک ناشی نمی‌شود ترکر داشته باشید، با استفاده از این تابع می‌توانید با یک `trackerToken` که از پنل دریافت می‌کنید، یک `tracker` پیش‌فرض برای اپلیکیشن خود قرار دهید:

```dart
metrixConfig.trackerToken = "trackerToken";
```
### امضاء SDK

اگر شما قابلیت sdk signature را در پنل خود فعال کنید و به app secret ها دسترسی دارید برای استفاده از آن از متد زیر استفاده کنید:
```dart
metrixConfig.setAppSecret(secretId, info1, info2, info3, info4);
```

### تفکیک بر‌اساس استور های اپلیکیشن

اگر شما می‌خواهید اپلیکیشن خود را در استور های مختلف مانند کافه بازار، گوگل پلی و … منتشر کنید، با استفاده از متد زیر می‌توانید مشاهده کنید که کاربر از کدام استور ( مثلا کافه بازار، گوگل پلی، مایکت، اول مارکت و وبسایت ... ) اپلیکیشن را نصب کرده و منبع نصب های ارگانیک خود را شناسایی کنید.

```dart
metrixConfig.store = "storename";
```

### شناسه دستگاه‌های متریکس

برای هر دستگاهی که اپلیکیشن شما را نصب کند، متریکس یک شناسه منحصر به فرد تولید می‌کند.
برای دسترسی به این شناسه از طریق متد زیر می‌توانید آن را دریافت کنید

```dart
void metrixUserId(String metrixUserId) {
  //do any thing with metrix user id
}

metrixConfig.userIdCallback = metrixUserId;
```
**نکته:** شناسه متریکس زمانی در اختیار شما قرار می‌گیرید که دستگاه توسط سرویس متریکس شناسایی شده باشد.

### شناسه نشست متریکس

کتابخانه متریکس برای هر نشست یک شناسه منحصر به فرد تولید می‌کند.
برای دسترسی به این شناسه از طریق متد زیر شنونده را تعریف نمایید:

```dart
void metrixSessionId(String metrixSessionId) {
  //do any thing with metrix session id
}

metrixConfig.sessionIdCallback = metrixSessionId;
```