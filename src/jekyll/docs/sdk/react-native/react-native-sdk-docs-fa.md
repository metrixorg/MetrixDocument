---
layout: classic-docs
title: SDK React Native
lang: fa
permalink: /sdk/react-native/index.html
toc: true # table of contents
---

[![npm version](https://badge.fury.io/js/%40metrixorg%2Freact-native-metrix.svg)](https://badge.fury.io/js/%40metrixorg%2Freact-native-metrix)

## تنظیمات اولیه در پروژه

۱.به محل پروژه react native خود بروید و در commad-line دستورهای زیر را به ترتیب وارد کنید :

```bash
npm install @metrixorg/react-native-metrix --save
react-native link @metrixorg/react-native-metrix
```

## نصب به صورت دستی

#### iOS

1. در XCode در قسمت `project navigator` روی `Libraries` راست کلید نمایید سپس `Add files to [your project's name]` را کلیک کنید.
2. به `node_modules` رفته و فایل `@metrixorg/react-native-metrix/ios/RCTMetrixReactNative.xcodeproj` را اضافه کنید.
3. فایل `node_modules/@metrixorg/react-native-metrix/ios/MetrixSdk.framework` را در `[your projct's path]/ios` کپی کنید.
4. در قسمت `project navigatior` پروژه خود را انتخاب کنید در تب `Build Phases` بخش `Link Binary with Libraries` باید `libRCTMetrixReactNative.a` و `add other ➜ [your projct's path]/MetrixSdk.framewrok` اضافه نمایید.
5. در تب `General` ← `Embeded Binaries` ← `+` باید فایل `MetrixSdk.framework` را اضافه نماید.

#### Android

1. برای کتابخانه `Metrix` لازم است تا دسترسی‌های زیر را به فایل `AndroidManifest.xml` اضافه کنید:

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

چنان چه چندین کتابخانه برای دریافت intent `INSTALL_REFERRER` دارید، می‌توانید با قرار دادن کلاس سفارشی خود در `receiver` مانند زیر عمل کنید:

```xml
<receiver
android:name="com.your.app.InstallReceiver"
android:permission="android.permission.INSTALL_PACKAGES"
android:exported="true" >
  <intent-filter>
      <action android:name="com.android.vending.INSTALL_REFERRER" />
  </intent-filter>
</receiver>
```

و کد کلاس `InstallReceiver` به صورت زیر می‌شود:

```java
public class InstallReceiver extends BroadcastReceiver {
@Override
public void onReceive(Context context, Intent intent) {
  // Metrix
  new MetrixReferrerReceiver().onReceive(context, intent);

  // Google Analytics
  new CampaignTrackingReceiver().onReceive(context, intent);
 }
}
```

## راه‌اندازی و پیاده‌سازی sdk در اپلیکیشن اندروید:

### تنظیمات اولیه در اپلیکیشن:

۱. باید کتابخانه متریکس را در کلاس `React.Component` ریکت نیتیو `initialize` کنید.

۲. ابتدا ماژول متریکس را به کد خود اضافه کنید:

```javascript
import {Metrix, MetrixConfig} from '@metrixorg/react-native-metrix';
```

۳. سپس برای مقداردهی اولیه ، تابع زیر را با ورودی کلید اپ خود صدا بزنید.
توجه نمایید که حتما داخل متد `constructor` کامپوننت اصلی پروژه خود متد زیر را صدا بزنید.

```javascript
let metrixConfig = new MetrixConfig('APP_ID');
Metrix.onCreate(metrixConfig);
```

`APP_ID`: کلید اپلیکیشن شما که از پنل متریکس آن را دریافت می‌کنید.

## امکانات کتابخانه متریکس

### ۱. توضیح مفاهیم رویداد (event) و نشست (session)

در هر تعاملی که کاربر با اپلیکیشن دارد، کتابخانه متریکس این تعامل را در قالب یک **رویداد** برای سرور ارسال می‌کند. تعریف کتابخانه متریکس از یک **نشست**، بازه زمانی مشخصی است که کاربر با اپلیکیشن در تعامل است.

در کتابخانه متریکس سه نوع رویداد داریم:

1. **شروع نشست (session_start):** زمان شروع یک نشست.
2. **پایان نشست (session_stop):‌** زمان پایان یک نشست.
3. **سفارشی (custom):** وابسته به منطق اپلیکیشن شما و تعاملی که کاربر با اپلیکیشن شما دارد می‌توانید رویدادهای سفارشی خود را در قالبی که در ادامه شرح داده خواهد شد بسازید و ارسال کنید.

### ۲. فعال یا غیرفعال کردن ثبت اطلاعات مکان کاربر در رویدادها

می‌توانید با استفاده از دو تابع زیر به کتابخانه متریکس اعلام کنید که در رویدادها اطلاعات مربوط به مکان کاربر را به همراه دیگر اطلاعات ارسال کند یا نکند. (برای اینکه این متد به درستی عمل کند دسترسی‌های اختیاری که بالاتر ذکر شد باید فعال باشند)

```javascript
let metrixConfig = new  MetrixConfig(yourAppId);
metrixConfig.setLocationListening(isLocationListeningEnable);
Metrix.onCreate(metrixConfig);
```

### ۳. تعیین سقف تعداد رویدادها برای ارسال به سمت سرور

با استفاده از تابع زیر می‌توانید مشخص کنید که هر موقع تعداد رویدادهای ذخیره شده شما به تعداد مورد نظر شما رسید کتابخانه رویدادها را برای سرور ارسال کند:

```javascript
let metrixConfig = new  MetrixConfig(yourAppId);
metrixConfig.setEventUploadThreshold(50);
Metrix.onCreate(metrixConfig);
```

(مقدار پیش‌فرض این تابع در کتابخانه ۳۰ رویداد است.)

### ۴. تعیین حداکثر تعداد رویداد ارسالی در هر درخواست

با استفاده از این تابع می‌توانید حداکثر تعداد رویداد ارسالی در هر درخواست را به شکل زیر مشخص کنید:

```javascript
let metrixConfig = new  MetrixConfig(yourAppId);
metrixConfig.setEventUploadMaxBatchSize(100);
Metrix.onCreate(metrixConfig);
```

(مقدار پیش‌فرض این تابع در کتابخانه ۱۰۰ رویداد است.)

### ۵. تعیین تعداد حداکثر ذخیره رویداد در مخزن کتابخانه

با استفاده از تابع زیر می‌توانید مشخص کنید که حداکثر تعداد رویدادهای ذخیر شده در کتابخانه متریکس چقدر باشد (به عنوان مثال اگر دستگاه کاربر اتصال خود به اینترنت را از دست داد رویدادها تا مقداری که شما مشخص می‌کنید در کتابخانه ذخیره خواهند شد) و اگر تعداد رویدادهای ذخیره شده در کتابخانه از این مقدار بگذرد رویدادهای قدیمی توسط sdk نگهداری نشده و از بین می‌روند:

```javascript
let metrixConfig = new  MetrixConfig(yourAppId);
metrixConfig.setEventMaxCount(1000);
Metrix.onCreate(metrixConfig);
```

(مقدار پیش‌فرض این تابع در کتابخانه ۱۰۰۰ رویداد است.)

### ۶. تعیین بازه زمانی ارسال رویدادها به سمت سرور

با استفاده از این تابع می‌توانید مشخص کنید که درخواست آپلود رویدادها بعد از گذشت چند میلی‌ثانیه فرستاده شود:

```javascript
let metrixConfig = new  MetrixConfig(yourAppId);
metrixConfig.setEventUploadPeriodMillis(30000);
Metrix.onCreate(metrixConfig);
```

(مقدار پیش‌فرض این تابع در کتابخانه ۳۰ ثانیه است.)

### ۷. تعیین بازه زمانی دلخواه برای نشست‌ها

با استفاده از این تابع می‌توانید حد نشست‌ها را در اپلیکیشن خود مشخص کنید که هر نشست حداکثر چند ثانیه محاسبه شود. به عنوان مثال اگر مقدار این تابع را ۱۰۰۰۰ وارد کنید اگر کاربر در اپلیکیشن ۷۰ ثانیه تعامل داشته باشد، کتابخانه متریکس این تعامل را ۷ نشست محاسبه می‌کند.

```javascript
let metrixConfig = new  MetrixConfig(yourAppId);
metrixConfig.setSessionTimeoutMillis(1800000);
Metrix.onCreate(metrixConfig);
```

(مقدار پیش‌فرض این تابع در کتابخانه ۳۰ دقیقه است.)

### ۸. فعال کردن مدیریت لاگ‌ها کتابخانه متریکس

توجه داشته باشید که موقع release اپلیکیشن خود مقدار این تابع را false قرار دهید:

```javascript
let metrixConfig = new  MetrixConfig(yourAppId);
metrixConfig.enableLogging(true);
Metrix.onCreate(metrixConfig);
```

(مقدار پیش‌فرض این تابع در کتابخانه true است.)

### ۹. تعیین LogLevel

با استفاده از این تابع می‌توانید مشخص کنید که چه سطحی از لاگ‌ها در `logcat` چاپ شود، به عنوان مثال دستور زیر همه‌ی سطوح لاگ‌ها به جز `VERBOSE` در `logcat` نمایش داده شود:

```javascript
let metrixConfig = new  MetrixConfig(yourAppId);
metrixConfig.setLogLevel(3);
Metrix.onCreate(metrixConfig);
```

(مقدار پیش‌فرض این تابع در کتابخانه `INFO` است.)

نکته : مقدار متناظر با `Log Level`

```javascript
VERBOSE = 2;
DEBUG = 3;
INFO = 4;
WARN = 5;
ERROR = 6;
ASSERT = 7;
```

### ۱۰. فعال یا غیرفعال کردن ارسال همه‌ی رویدادها

با استفاده از این تابع می‌توانید مشخص کنید که زمانی که اپلیکیشن بسته می‌شود همه رویدادهای ذخیره شده در کتابخانه ارسال شود یا نشود:

```javascript
let metrixConfig = new  MetrixConfig(yourAppId);
metrixConfig.setFlushEventsOnClose(false);
Metrix.onCreate(metrixConfig);
```

(مقدار پیش‌فرض این تابع در کتابخانه true است.)


### ۱۱. مشخص کردن Pre-installed Tracker

با استفاده از این تابع می‌توانید با استفاده از یک `trackerToken` که از پنل آن را دریافت می‌کنید، برای همه‌ی رویدادها یک `tracker` پیش‌فرض را قرار دهید:

```javascript
let metrixConfig = new  MetrixConfig(yourAppId);
metrixConfig.setDefaultTracker(trackerToken);
Metrix.onCreate(metrixConfig);
```

### ۱۲. تفکیک بر‌اساس استور های اپلیکیشن

اگر شما می‌خواهید اپلیکیشن خود را در استور های مختلف مانند کافه بازار، گوگل پلی و ... منتشر کنید، با استفاده از متد زیر می‌توانید نصب های ارگانیک خود را به تفکیک استور های مختلف داشته باشید.
```javascript
let metrixConfig = new  MetrixConfig(yourAppId);
metrixConfig.setStore("store name");
Metrix.onCreate(metrixConfig);
```

### ۱۳. شناسه دستگاه‌های متریکس

برای هر دستگاهی که اپلیکیشن شما را نصب کند، متریکس یک شناسه منحصر به فرد تولید می‌کند.
برای دسترسی به این شناسه از طریق متد زیر می‌توانید آن را دریافت کنید

```javascript
let metrixConfig = new  MetrixConfig(yourAppId);
metrixConfig.setOnReceiveUserIdListener(metrixUserId => {
  //TODO
});
Metrix.onCreate(metrixConfig);
```
**نکته:** این متد از نسخه ۰.۱۳.۰ به بعد قابل استفاده است.

**نکته:** شناسه متریکس زمانی در اختیار شما قرار می‌گیرید که دستگاه توسط سرویس متریکس شناسایی شده باشد.

### ۱۴. شناسه نشست متریکس

sdk متریکس برای هر نشست یک شناسه منحصر به فرد تولید می‌کند.
برای دسترسی به این شناسه از طریق متد زیر می‌توانید آن را دریافت کنید

```javascript
let metrixConfig = new  MetrixConfig(yourAppId);
metrixConfig.setOnSessionIdListener(metrixSessionId => {
  //TODO
});
Metrix.onCreate(metrixConfig);
```

**نکته:**این متد از نسخه ۰.۱۳.۰ به بعد قابل استفاده است.

### ۱۵. اطلاع یافتن از شماره نشست جاری

با استفاده از این تابع می‌توانید از شماره نشست (session) جاری اطلاع پیدا کنید:

```javascript
Metrix.getSessionNum(function(sessionNum) {
  //TODO
});
```

### ۱۶. ساختن یک رویداد سفارشی

با استفاده از این تابع می‌توانید یک رویداد سفارشی بسازید. برای این کار شما در ابتدا باید در داشبورد متریکس از قسمت مدیریت رخدادها، رخداد موردنظر خود را ثبت کنید و نامک (slug) آن را بعنوان نام رخداد در sdk استفاده کنید.

این تابع را به دو صورت می‌توانید صدا بزنید:

۱. یک رویداد سفارشی که فقط یک نامک مشخص دارد و آن را از داشبورد متریکس میگیرد، بسازید:

```javascript
Metrix.newEvent('my_event_slug');
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

Metrix.newEvent('purchase_event_slug', attributes, metrics);
```

ورودی‌های متد newEvent بدین شرح هستند:

- **ورودی اول:** نامک رویداد مورد نظر شما که از جنس String است و آن را از داشبورد متریکس دریافت می‌کنید.
- **ورودی دوم:** یک `Map<String, String>` که ویژگی‌های یک رویداد را مشخص می‌کند.
- **ورودی سوم:** یک `Map<String, Double>` که شامل ویژگی های قابل اندازه گیری است.

### ۱۷. ساختن رویداد درآمدی

با استفاده از این تابع می‌توانید یک رویداد درآمدی بسازید. برای این کار شما در ابتدا باید در داشبورد متریکس از قسمت مدیریت رخدادها، رخداد موردنظر خود را ثبت کنید و نامک (slug) آن را بعنوان نام رخداد در sdk استفاده کنید.

این تابع را به صورت زیر می‌توانید صدا بزنید:

۱. یک رویداد سفارشی که فقط یک نامک مشخص دارد و آن را از داشبورد متریکس میگیرد، بسازید:

```javascript
Metrix.newRevenue('my_event_slug', 12000, 0, '2');
```

ورودی اول همان نامکی است که از داشبورد دریافت می‌کنید.

دومین وروی تابع یک مقدار است که همان مقدار درآمد است.

سومین ورودی واحد پول این رخداد است که در صورت قرار ندادن مقدار آن واحد پیشفرض ریال است در زیر مقادیر آن را میتوانید ببینید.

1. `0` ریال
2. `1` دلار
3. `2` یورو

ورودی چهارم که به صورت دلخواه است میتواند شماره سفارش شما باشد.

### ۱۸. مشخص کردن Attribute‌های پیش‌فرض همه‌ی رویدادها

با استفاده از این تابع می‌توانید به تعداد دلخواه `Attribute` به همه‌ی رویدادهای خود اضافه کنید:

```javascript
var attributes = {};
attributes['manufacturer'] = 'Nike';

Metrix.addUserAttributes(attributes);
```

### ۱۹. مشخص کردن Metric‌های پیش‌فرض همه‌ی رویدادها

با استفاده از این تابع می‌توانید به تعداد دلخواه `Metric` به همه‌ی رویدادهای خود اضافه کنید:

```javascript
var metrics = {};
metrics['perchase_time'] = current_time;

Metrix.addUserMetrics(metrics);
```

### ۲۰. نگهداری حرکات کاربر در صفحات مختلف در اپلیکیشن

با اضافه کردن تابع زیر به `constructor` صفحات خود میتوانید از حرکت کاربر بین صفحات اطلاع پیدا کنید:

```javascript
Metrix.screenDisplayed('First Screen');
```

### ۲۱. دریافت اطلاعات کمپین

با مقداردهی این تابعه میتوانید اطلاعات کمپین تبلیغاتی که در ترکر خود در پنل قرار داده اید را دریافت کنید.

```javascript
let metrixConfig = new  MetrixConfig(yourAppId);
metrixConfig.setOnAttributionChangedListener(attributionModel => {
  //TODO
});
Metrix.onCreate(metrixConfig);
```

مدل `attributionModel` اطلاعات زیر را در اختیار شما قرار میدهد.

`attributionModel.acquisitionAd` : نام تبلیغ

`attributionModel.acquisitionAdSet`: گروه تبلیغاتی

`attributionModel.acquisitionCampaign`: کمپین تبلیغاتی

`attributionModel.acquisitionSource`: شبکه تبلیغاتی

`attributionModel.attributionStatus`: وضعیت کاربر در کمپین را  
مشخص میکند و فقط چهار مقدار زیر را برمیگرداند

1. `ATTRIBUTED` اتربیوت شده
2. `NOT_ATTRIBUTED_YET` هنوز اتربیوت نشده
3. `ATTRIBUTION_NOT_NEEDED` نیاز به اتربیوت ندارد
4. `UNKNOWN` حالت ناشناخته


## Deep linking
### توضیحات
اگر شما از ترکر های که دیپ‌لینک در آنها فعال است استفاده کنید، می‌توانیداطلاعات url دیپ‌لینک و محتوای آن را دریافت کنید. دستگاه بر اساس نصب بودن اپلیکیشن (سناریو استاندارد) یا نصب نبودن اپلیکیشن (سناریو deferred) واکنش نشان میدهد.
در صورت نصب بودن اپلیکیشن شما اطلاعات دیپ‌لینک به اپلیکیشن شما ارسال می‌شود.
پلتفرم اندروید به صورت اتماتیک سناریو deferred را پشتیبانی نمیکند در این صورت متریکس سناریو مخصوص به خود را دارد تا بتواند اطلاعات دیپ‌لینک را به اپلیکیشن ارسال کند.
### سناریو استاندارد

برای پیاده سازی سناریو استاندارد می‌توانید از  [این](https://reactnavigation.org/docs/en/deep-linking.html) کتابخانه استفاده کنید، 

### سناریو deferred

این سناریو زمانی رخ می‌هد که کاربر روی دیپ‌لینک کلیک می‌کند ولی اپلیکیشن شما را در زمانی که کلیک کرده روی دستگاه خود نصب نکرده است. وقتی کاربر کلیک کرد به گوگل پلی استور هدایت می‌شود تا اپلیکیشن شما را نصب کند وقتی اپلیکیشن شما را نصب کرد و برای اولین بار آن را باز کرد اطلاعات دیپ‌لینک به اپلیکیشن داده می‌شود. 
متریکس به صورت پیش‌فرض سناریو deferred را پشتیبانی نمی‌کند و نیاز به تنظیم دارد.
اگر شما قصد دارید که سناریو deferred را کنترل کنیداز طریق کالبک زیر می‌توانید.
```javascript
let metrixConfig = new  MetrixConfig(yourAppId);
metrixConfig.setShouldLaunchDeeplink(true);
metrixConfig.setOnDeeplinkResponseListener(deeplink => {
  //TODO
});
Metrix.onCreate(metrixConfig);

```
بعد از این که متریکس اطلاعات دیپ‌لینک را از بکند خود دریافت کرد محتوای آن را به کالبک بالا پاس میدهد اگر ورودی متد `setShouldLaunchDeeplink` مقدار `true` باشد متریکس به صورت اتوماتیک سناریو استاندارد را اجرا میکند ولی اگر مقدار خروجی متد `false` باشد متریکس فقط اطلاعات را در این کالبک قرار میدهد تا شما بر اساس آن اکشن مورد نظر خود را انجام دهید.

### ری‌اتریبیوت با دیپ‌لینک
متریکس ابزار ری‌اتریبیوت با دیپ‌لینک دارد اگر میخواهید از این ابزار استفاده کنید نیاز است یکی از متد های متریکس را بعد از دریافت دیپ‌لینک صدا بزنید.
اگر شما اطلاعات دیپ‌لینک را در اپلیکیشن دریافت کردید با صدا زدن `Metrix.appWillOpenUrl(deeplink)` می‌توانید اطلاعات دیپ‌لینک را به بکند متریکس ارسال کنید تا کاربر دوباره ری‌اتریبیوت شود.
```javascript
onDeeplink(deeplink) {
  Metrix.appWillOpenUrl(deeplink);
}
```