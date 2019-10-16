---
layout: classic-docs
title: SDK unity
lang: fa
permalink: /sdk/unity/index.html
toc: true # table of contents
---

## تنظیمات اولیه در پروژه

۱. ابتدا کتابخانه‌ متریکس را از [این لینک](https://github.com/metrixorg/MetrixSDK-UnityPlugin/blob/master/MetrixSDK-v0.13.0.unitypackage) دانلود کنید و در پروژه خود import کنید.

۲. دسترسی های زیر را به فایل `AndroidManifest.xml` موجود در فولدر `Plugins/Android` پروژه خود اضافه کنید:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" /> <!--optional-->
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" /> <!--optional-->
```

(دو permission دوم اختیاری است)

## دریافت اطلاعات Install Referrer

برای افزایش دقت تشخیص اتریبیوشن نصب‌های اپلیکیشن شما، متریکس نیازمند اطلاعاتی درباره `referrer` نصب اپلیکیشن است. این اطلاعات می‌تواند از طریق سرویس ارائه شده توسط کتابخانه **Google Play Referrer API** و یا دریافت **Google Play Store intent** با استفاده از یک **broadcast receiver** به دست آید.

**نکته مهم:** سرویس **Google Play Referrer API** به تازگی توسط گوگل و با هدف فراهم کردن دقیق یک راه امن و مطمئن برای دریافت اطلاعات `referrer` نصب ارائه شده و این قابلیت را به سرویس‌دهندگان پلتفرم‌های اتریبیوشن می‌دهد تا با تقلب click injection مبازه کنند. به همین دلیل متریکس نیز به همه توسعه‌دهندگان استفاده از این سرویس را توصیه می‌کند. در مقابل، روش **Google Play Store intent** یک مسیر با ضریب امنیت کمتر برای به‌دست آوردن اطلاعات `referrer`نصب ارائه می‌دهد که البته به صورت موازی با **Google Play Referrer API** به طور موقت پشتیبانی می‌شود،اما در آینده‌ای نزدیک منسوخ خواهد شد.

### تنظیمات Google Play Store intent

برای دریافت intent `INSTALL_REFERRER` از Google Play باید یک `broadcast receiver` آن را دریافت کند، اگر از `broadcast receiver` سفارشی خود استفاده نمی‌کنید میتوانید با قرار دادن `receiver` زیر در تگ `application` فایل `AndroidManifest.xml` آن را دریافت کنید.

```xml
<receiver
android:name="ir.metrix.sdk.MetrixReferrerReceiver"
android:permission="android.permission.INSTALL_PACKAGES"
android:exported="true" >
  <intent-filter>
      <action android:name="com.android.vending.INSTALL_REFERRER" />
  </intent-filter>
</receiver>
```

## راه‌اندازی و پیاده‌سازی sdk در اپلیکیشن اندروید:

### تنظیمات اولیه در اپلیکیشن:

کتابخانه متریکس را در ابتدای برنامه‌ی خود به این روش initialize کنید:

```csharp
MetrixConfig metrixConfig = new MetrixConfig("APP_ID");
Metirx.OnCreate(metrixConfig);
```

`APP_ID`: کلید اپلیکیشن شما که از پنل متریکس آن را دریافت می‌کنید.

## امکانات کتابخانه متریکس

### ۱. توضیح مفاهیم رویداد (event) و نشست (session)

در هر تعاملی که کاربر با اپلیکیشن دارد، کتابخانه متریکس این تعامل را در قالب یک **رویداد** برای سرور ارسال می‌کند. تعریف کتابخانه متریکس از یک **نشست**، بازه زمانی مشخصی است که کاربر با اپلیکیشن در تعامل است.

در کتابخانه متریکس سه نوع رویداد داریم:

**۱. شروع نشست (session_start):** زمان شروع یک نشست.

**۲. پایان نشست (session_stop):‌** زمان پایان یک نشست.

**۳. سفارشی (custom):** وابسته به منطق اپلیکیشن شما و تعاملی که کاربر با اپلیکیشن شما دارد می‌توانید رویدادهای سفارشی خود را در قالبی که در ادامه شرح داده خواهد شد بسازید و ارسال کنید.

### ۲. فعال یا غیرفعال کردن ثبت اطلاعات مکان کاربر در رویدادها

می‌توانید با استفاده از دو تابع زیر به کتابخانه متریکس اعلام کنید که در رویدادها اطلاعات مربوط به مکان کاربر را به همراه دیگر اطلاعات ارسال کند یا نکند. (برای اینکه این متد به درستی عمل کند دسترسی‌های اختیاری که بالاتر ذکر شد باید فعال باشند)

```csharp
MetrixConfig metrixConfig = new MetrixConfig(yourAppId);
metrixConfig.SetLocationListening(locationListening);
Metirx.OnCreate(metrixConfig);
```

### ۳. تعیین سقف تعداد رویدادها برای ارسال به سمت سرور

با استفاده از تابع زیر می‌توانید مشخص کنید که هر موقع تعداد رویدادهای ذخیره شده شما به تعداد مورد نظر شما رسید کتابخانه رویدادها را برای سرور ارسال کند:

```csharp
MetrixConfig metrixConfig = new MetrixConfig(yourAppId);
metrixConfig.SetEventUploadThreshold(50);
Metirx.OnCreate(metrixConfig);
```

(مقدار پیش‌فرض این تابع در کتابخانه ۳۰ رویداد است.)

### ۴. تعیین حداکثر تعداد رویداد ارسالی در هر درخواست

با استفاده از این تابع می‌توانید حداکثر تعداد رویداد ارسالی در هر درخواست را به شکل زیر مشخص کنید:

```csharp
MetrixConfig metrixConfig = new MetrixConfig(yourAppId);
metrixConfig.SetEventUploadMaxBatchSize(100);
Metirx.OnCreate(metrixConfig);
```

(مقدار پیش‌فرض این تابع در کتابخانه ۱۰۰ رویداد است.)

### ۵. تعیین تعداد حداکثر ذخیره رویداد در مخزن کتابخانه

با استفاده از تابع زیر می‌توانید مشخص کنید که حداکثر تعداد رویدادهای ذخیر شده در کتابخانه متریکس چقدر باشد (به عنوان مثال اگر دستگاه کاربر اتصال خود به اینترنت را از دست داد رویدادها تا مقداری که شما مشخص می‌کنید در کتابخانه ذخیره خواهند شد) و اگر تعداد رویدادهای ذخیره شده در کتابخانه از این مقدار بگذرد رویدادهای قدیمی توسط sdk نگهداری نشده و از بین می‌روند:

```csharp
MetrixConfig metrixConfig = new MetrixConfig(yourAppId);
metrixConfig.SetEventMaxCount(1000);
Metirx.OnCreate(metrixConfig);
```

(مقدار پیش‌فرض این تابع در کتابخانه ۱۰۰۰ رویداد است.)

### ۶. تعیین بازه زمانی ارسال رویدادها به سمت سرور

با استفاده از این تابع می‌توانید مشخص کنید که درخواست آپلود رویدادها بعد از گذشت چند میلی‌ثانیه فرستاده شود:

```csharp
MetrixConfig metrixConfig = new MetrixConfig(yourAppId);
metrixConfig.SetEventUploadPeriodMillis(30000);
Metirx.OnCreate(metrixConfig);
```

(مقدار پیش‌فرض این تابع در کتابخانه ۳۰ ثانیه است.)

### ۷. تعیین بازه زمانی دلخواه برای نشست‌ها

با استفاده از این تابع می‌توانید حد نشست‌ها را در اپلیکیشن خود مشخص کنید که هر نشست حداکثر چند ثانیه محاسبه شود. به عنوان مثال اگر مقدار این تابع را ۱۰۰۰۰ وارد کنید اگر کاربر در اپلیکیشن ۷۰ ثانیه تعامل داشته باشد، کتابخانه متریکس این تعامل را ۷ نشست محاسبه می‌کند.

```csharp
MetrixConfig metrixConfig = new MetrixConfig(yourAppId);
metrixConfig.SetSessionTimeoutMillis(1800000);
Metirx.OnCreate(metrixConfig);
```

(مقدار پیش‌فرض این تابع در کتابخانه ۳۰ دقیقه است.)

### ۸. فعال کردن مدیریت لاگ‌ها کتابخانه متریکس

توجه داشته باشید که موقع release اپلیکیشن خود مقدار این تابع را false قرار دهید:

```csharp
MetrixConfig metrixConfig = new MetrixConfig(yourAppId);
metrixConfig.EnableLogging(true);
Metirx.OnCreate(metrixConfig);
```

(مقدار پیش‌فرض این تابع در کتابخانه true است.)

### ۹. تعیین LogLevel

با استفاده از این تابع می‌توانید مشخص کنید که چه سطحی از لاگ‌ها در `logcat` چاپ شود، به عنوان مثال دستور زیر همه‌ی سطوح لاگ‌ها به جز `VERBOSE` در `logcat` نمایش داده شود:

```csharp
MetrixConfig metrixConfig = new MetrixConfig(yourAppId);
metrixConfig.SetLogLevel(3);
Metirx.OnCreate(metrixConfig);
```

(مقدار پیش‌فرض این تابع در کتابخانه `INFO` است.)

نکته : مقدار متناظر با `Log Level`

```csharp
VERBOSE = 2;
DEBUG = 3;
INFO = 4;
WARN = 5;
ERROR = 6;
ASSERT = 7;
```

### ۱۰. فعال یا غیرفعال کردن ارسال همه‌ی رویدادها

با استفاده از این تابع می‌توانید مشخص کنید که زمانی که اپلیکیشن بسته می‌شود همه رویدادهای ذخیره شده در کتابخانه ارسال شود یا نشود:

```csharp
MetrixConfig metrixConfig = new MetrixConfig(yourAppId);
metrixConfig.SetFlushEventsOnClose(false);
Metirx.OnCreate(metrixConfig);
```

(مقدار پیش‌فرض این تابع در کتابخانه true است.)

### ۱۱. مشخص کردن Pre-installed Tracker

با استفاده از این تابع می‌توانید با استفاده از یک `trackerToken` که از پنل آن را دریافت می‌کنید، برای همه‌ی رویدادها یک `tracker` پیش‌فرض را قرار دهید:

```csharp
MetrixConfig metrixConfig = new MetrixConfig(yourAppId);
metrixConfig.SetDefaultTracker("trackerToken");
Metirx.OnCreate(metrixConfig);
```

### ۱۲. امضاء sdk

اگر شما قابلیت sdk signature در دشبورد خود فعال کنید و به app secret ها دسترسی دارید برای استفاده از آن از متد زیر استفاده کنید:

```csharp
MetrixConfig metrixConfig = new MetrixConfig(yourAppId);
metrixConfig.SetAppSecret(secretId, info1, info2, info3, info4);
Metirx.OnCreate(metrixConfig);
```

### ۱۳. تفکیک بر‌اساس استور های اپلیکیشن

اگر شما می‌خواهید اپلیکیشن خود را در استور های مختلف مانند کافه بازار، گوگل پلی و ... منتشر کنید، با استفاده از متد زیر می‌توانید نصب های ارگانیک خود را به تفکیک استور های مختلف داشته باشید.
```csharp
MetrixConfig metrixConfig = new MetrixConfig(yourAppId);
metrixConfig.SetStore("store name");
Metirx.OnCreate(metrixConfig);
```

### ۱۴. شناسه دستگاه‌های متریکس

برای هر دستگاهی که اپلیکیشن شما را نصب کند، متریکس یک شناسه منحصر به فرد تولید می‌کند.
برای دسترسی به این شناسه از طریق متد زیر می‌توانید آن را دریافت کنید

```csharp
void metrixUserId(string metrixUserId) {
  //do any thing with metrix user id
}

MetrixConfig metrixConfig = new MetrixConfig(yourAppId);
metrixConfig.SetUserIdDelegate(metrixUserId);
Metirx.OnCreate(metrixConfig);
```

**نکته:** این متد از نسخه ۰.۱۳.۰ به بعد قابل استفاده است.

**نکته:** شناسه متریکس زمانی در اختیار شما قرار می‌گیرید که دستگاه توسط سرویس متریکس شناسایی شده باشد.

### ۱۵. شناسه نشست متریکس

sdk متریکس برای هر نشست یک شناسه منحصر به فرد تولید می‌کند.
برای دسترسی به این شناسه از طریق متد زیر می‌توانید آن را دریافت کنید

```csharp
void metrixSessionId(string metrixSessionId) {
  //do any thing with metrix session id
}

MetrixConfig metrixConfig = new MetrixConfig(yourAppId);
metrixConfig.SetSessionIdDelegate(metrixSessionId);
Metirx.OnCreate(metrixConfig);
```

**نکته:**این متد از نسخه ۰.۱۳.۰ به بعد قابل استفاده است.


### ۱۶. شمارش پاک کردن اپلیکیشن

متریکس برای شمارش پاک شدن اپلیکشن شما از سایلنت پوش استفاده می‌کند.

برای پیاده سازی این ابزار مراحل زیر را دنبال کنید.

**نکته:** شما باید برای استفاده از این ابزار حتما از Firebase Cloud Messaging (FCM) استفاده نمایید.

#### پیدا کردن FCM legacy server key
ابتدا به کنسول فایربیس خود رفته.

۱. دکمه settings را زده سپس به Project settings بروید

۲. تب Cloud Messaging را انتخاب کنید

۳. حالا می‌توانید `legacy server key` و `sender id` را بردارید

<img src="{{ '/images/firebase-cloud-messaging.png' | relative_url }}" alt="firebase cloud messageing"/>

#### اضافه کردن FCM legacy server key و sender id به اکانت متریکس

در داشبورد متریکس مراحل زیر را انجام دهید:

۱. به تنظیمات اپلیکیش خود رفته

۲. تب Push Configuration را انتخاب کنید

۳. حالا می‌توانید FCM legacy server key و sender id را در فیلد های مناسب قرار دهید

۴. دکمه save را بزنید

<img src="{{ '/images/push-configuration.png' | relative_url }}" alt="push configuration"/>

#### پیدا کردن Firebase APP ID

ابتدا به کنسول فایربیس خود رفته.

۱. دکمه settings را زده سپس به Project settings بروید

۲. تب General را انتخاب کنید

۳. حالا می‌توانید `App ID` را بردارید

<img src="{{ '/images/firebase-settings.png' | relative_url }}" alt="firebase app id"/>

۴. سپس در تنظیمات sdk متریکس قرار دهید.

```csharp
MetrixConfig metrixConfig = new MetrixConfig(yourAppId);
metrixConfig.SetFirebaseAppId("your firebase app id");
Metirx.OnCreate(metrixConfig);
```

۵. کتاب خانه زیر را در قسمت `dependencies` فایل `mainTemplate.gradle` اپلیکیشن خود اضافه کنید:

```groovy
implementation 'com.google.firebase:firebase-messaging:17.6.0'
```

**نکته:**این متد از نسخه ۰.۱۴.۰ به بعد قابل استفاده است.

### ۱۷. اطلاع یافتن از شماره نشست جاری

با استفاده از این تابع می‌توانید از شماره نشست (session) جاری اطلاع پیدا کنید:

```csharp
Metrix.GetSessionNum();
```

### ۱۸. ساختن یک رویداد سفارشی

با استفاده از این تابع می‌توانید یک رویداد سفارشی بسازید. برای این کار شما در ابتدا باید در داشبورد متریکس از قسمت مدیریت رخدادها، رخداد موردنظر خود را ثبت کنید و نامک (slug) آن را بعنوان نام رخداد در sdk استفاده کنید.

این تابع را به صورت زیر صدا بزنید:

۱. یک رویداد سفارشی که فقط یک اسم مشخص دارد بسازید:

```csharp
Metrix.NewEvent("my_event_slug");
```

ورودی این تابع از جنس String است

### ۱۹. ساختن رویداد درآمدی

با استفاده از این تابع می‌توانید یک رویداد درآمدی بسازید. برای این کار شما در ابتدا باید در داشبورد متریکس از قسمت مدیریت رخدادها، رخداد موردنظر خود را ثبت کنید و نامک (slug) آن را بعنوان نام رخداد در sdk استفاده کنید.

این تابع را به صورت زیر می‌توانید صدا بزنید:

۱. یک رویداد سفارشی که فقط یک نامک مشخص دارد و آن را از داشبورد متریکس میگیرد، بسازید:

```csharp
Metrix.NewRevenue("my_event_slug", 12000, 0, "{orderId}");
```

ورودی اول همان نامکی است که از داشبورد دریافت می‌کنید.

دومین وروی تابع یک مقدار است که همان مقدار درآمد است.

سومین ورودی واحد پول این رخداد است که در صورت قرار ندادن مقدار آن واحد پیشفرض ریال است در زیر مقادیر آن را میتوانید ببینید.

1. `0` ریال
2. `1` دلار
3. `2` یورو

ورودی چهارم که به صورت دلخواه است میتواند شماره سفارش شما باشد.

### ۲۰. نگهداری حرکات کاربر در صفحات مختلف در اپلیکیشن

با اضافه کردن تابع زیر صفحات خود میتوانید از حرکت کاربر بین صفحات اطلاع پیدا کنید:

```csharp
Metrix.ScreenDisplayed("First Screen");
```

## Deep linking
### توضیحات
اگر شما از ترکر های که دیپ‌لینک در آنها فعال است استفاده کنید، می‌توانیداطلاعات url دیپ‌لینک و محتوای آن را دریافت کنید. دستگاه بر اساس نصب بودن اپلیکیشن (سناریو استاندارد) یا نصب نبودن اپلیکیشن (سناریو deferred) واکنش نشان میدهد.
در صورت نصب بودن اپلیکیشن شما اطلاعات دیپ‌لینک به اپلیکیشن شما ارسال می‌شود.
پلتفرم اندروید به صورت اتماتیک سناریو deferred را پشتیبانی نمیکند در این صورت متریکس سناریو مخصوص به خود را دارد تا بتواند اطلاعات دیپ‌لینک را به اپلیکیشن ارسال کند.
### سناریو استاندارد

برای پیاده سازی سناریو استاندارد می‌توانید از  [این](https://github.com/metrixorg/UnityDeeplinks) کتابخانه استفاده کنید، همچنین یک برنچ نمونه [اینجا](https://github.com/metrixorg/MetrixSDK-UnitySample/tree/deeplink) وجود دارد.

### سناریو deferred

این سناریو زمانی رخ می‌هد که کاربر روی دیپ‌لینک کلیک می‌کند ولی اپلیکیشن شما را در زمانی که کلیک کرده روی دستگاه خود نصب نکرده است. وقتی کاربر کلیک کرد به گوگل پلی استور هدایت می‌شود تا اپلیکیشن شما را نصب کند وقتی اپلیکیشن شما را نصب کرد و برای اولین بار آن را باز کرد اطلاعات دیپ‌لینک به اپلیکیشن داده می‌شود. 
متریکس به صورت پیش‌فرض سناریو deferred را پشتیبانی نمی‌کند و نیاز به تنظیم دارد.
اگر شما قصد دارید که سناریو deferred را کنترل کنیداز طریق کالبک زیر می‌توانید.
```csharp
void deferredDeeplink(string deeplink) {
  //do any thing with deferred deeplink
}

MetrixConfig metrixConfig = new MetrixConfig(yourAppId);
metrixConfig.SetShouldLaunchDeeplink(true);
metrixConfig.SetDeferredDeeplinkDelegate(deferredDeeplink);
Metirx.OnCreate(metrixConfig);
```

بعد از این که متریکس اطلاعات دیپ‌لینک را از بکند خود دریافت کرد محتوای آن را به کالبک بالا پاس میدهد اگر ورودی متد `SetShouldLaunchDeeplink` مقدار `true` باشد متریکس به صورت اتوماتیک سناریو استاندارد را اجرا میکند ولی اگر مقدار خروجی متد `false` باشد متریکس فقط اطلاعات را در این کالبک قرار میدهد تا شما بر اساس آن اکشن مورد نظر خود را انجام دهید.

### ری‌اتریبیوت با دیپ‌لینک
متریکس ابزار ری‌اتریبیوت با دیپ‌لینک دارد اگر میخواهید از این ابزار استفاده کنید نیاز است یکی از متد های متریکس را بعد از دریافت دیپ‌لینک صدا بزنید.
اگر شما اطلاعات دیپ‌لینک را در اپلیکیشن دریافت کردید با صدا زدن `Metrix.AppWillOpenUrl(Uri)` می‌توانید اطلاعات دیپ‌لینک را به بکند متریکس ارسال کنید تا کاربر دوباره ری‌اتریبیوت شود.
```csharp
void onDeeplink(string deeplink) {
  Metrix.AppWillOpenUrl(deeplink);
}
```