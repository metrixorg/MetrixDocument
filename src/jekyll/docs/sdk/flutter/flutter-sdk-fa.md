---
layout: classic-docs
title: SDK Flutter
lang: fa
permalink: /sdk/flutter/index.html
toc: true # table of contents
---

[![pub package](https://img.shields.io/pub/v/metrix.svg)](https://pub.dartlang.org/packages/metrix)

## تنظیمات اولیه در پروژه

۱. ابتدا باید `metrix` را به فایل `pubspec.yaml` خود اضافه کنید.

۲. تنظیمات زیر را به `Proguard` پروژه خود اضافه کنید:

```
-keepattributes Signature
-keepattributes *Annotation*
-keepattributes EnclosingMethod
-keepattributes InnerClasses

-keepclassmembers enum * { *; }
-keep class **.R$* { *; }

#Metrix
-keep class ir.metrix.sdk.** { *; }


# retrofit
# Retain service method parameters when optimizing.
-keepclassmembers,allowshrinking,allowobfuscation interface * {
    @retrofit2.http.* <methods>;
}

# Ignore JSR 305 annotations for embedding nullability information.
-dontwarn javax.annotation.**

# Guarded by a NoClassDefFoundError try/catch and only used when on the classpath.
-dontwarn kotlin.Unit

# Top-level functions that can only be used by Kotlin.
-dontwarn retrofit2.-KotlinExtensions

# With R8 full mode, it sees no subtypes of Retrofit interfaces since they are created with a Proxy
# and replaces all potential values with null. Explicitly keeping the interfaces prevents this.
-if interface * { @retrofit2.http.* <methods>; }
-keep,allowobfuscation interface <1>

#OkHttp
# A resource is loaded with a relative path so the package of this class must be preserved.
-keepnames class okhttp3.internal.publicsuffix.PublicSuffixDatabase

# Animal Sniffer compileOnly dependency to ensure APIs are compatible with older versions of Java.
-dontwarn org.codehaus.mojo.animal_sniffer.*

# OkHttp platform used only on JVM and when Conscrypt dependency is available.
-dontwarn okhttp3.internal.platform.ConscryptPlatform



#Gson
# Gson specific classes
-dontwarn sun.misc.**
#-keep class com.google.gson.stream.** { *; }

# Prevent proguard from stripping interface information from TypeAdapterFactory,
# JsonSerializer, JsonDeserializer instances (so they can be used in @JsonAdapter)
-keep class * implements com.google.gson.TypeAdapterFactory
-keep class * implements com.google.gson.JsonSerializer
-keep class * implements com.google.gson.JsonDeserializer
#gms
-keep class com.google.android.gms.** { *; }

-dontwarn android.content.pm.PackageInfo
-keep public class com.android.installreferrer.** { *; }
```

۳. برای کتابخانه `Metrix` لازم است تا دسترسی‌های زیر را به فایل `AndroidManifest.xml` اضافه کنید:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" /> <!--optional-->
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" /> <!--optional-->
```

(دو permission دوم اختیاری است)

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
۱. کتابخانه متریکس را باید در کلاس اولیه پروژه اینیشیالایز کرد.

۲. ابتدا باید پکیج زیر را ایمپورت کنید:
```dart
import 'package:metrix/metrix.dart';
```
۳. در متد `initState` متریکس را اینیشیالایز کنید:
```dart
import 'package:metrix/metrix.dart';

class _MyAppState extends State<MyApp> {

  @override
  void initState() {
    super.initState();
    MetrixConfig metrixConfig = new MetrixConfig("APP_ID");
    Metrix.onCreate(metrixConfig); 
  }
}
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

```dart
MetrixConfig metrixConfig = new  MetrixConfig(yourAppId);
metrixConfig.locationListening = isLocationListeningEnable;
Metrix.onCreate(metrixConfig);
```

### ۳. تعیین سقف تعداد رویدادها برای ارسال به سمت سرور

با استفاده از تابع زیر می‌توانید مشخص کنید که هر موقع تعداد رویدادهای ذخیره شده شما به تعداد مورد نظر شما رسید کتابخانه رویدادها را برای سرور ارسال کند:

```dart
MetrixConfig metrixConfig = new  MetrixConfig(yourAppId);
metrixConfig.eventUploadThreshold = 50;
Metrix.onCreate(metrixConfig);
```

(مقدار پیش‌فرض این تابع در کتابخانه ۳۰ رویداد است.)

### ۴. تعیین حداکثر تعداد رویداد ارسالی در هر درخواست

با استفاده از این تابع می‌توانید حداکثر تعداد رویداد ارسالی در هر درخواست را به شکل زیر مشخص کنید:

```dart
MetrixConfig metrixConfig = new  MetrixConfig(yourAppId);
metrixConfig.eventUploadMaxBatchSize = 100;
Metrix.onCreate(metrixConfig);
```

(مقدار پیش‌فرض این تابع در کتابخانه ۱۰۰ رویداد است.)

### ۵. تعیین تعداد حداکثر ذخیره رویداد در مخزن کتابخانه

با استفاده از تابع زیر می‌توانید مشخص کنید که حداکثر تعداد رویدادهای ذخیر شده در کتابخانه متریکس چقدر باشد (به عنوان مثال اگر دستگاه کاربر اتصال خود به اینترنت را از دست داد رویدادها تا مقداری که شما مشخص می‌کنید در کتابخانه ذخیره خواهند شد) و اگر تعداد رویدادهای ذخیره شده در کتابخانه از این مقدار بگذرد رویدادهای قدیمی توسط sdk نگهداری نشده و از بین می‌روند:

```dart
MetrixConfig metrixConfig = new  MetrixConfig(yourAppId);
metrixConfig.eventMaxCount = 1000;
Metrix.onCreate(metrixConfig);
```

(مقدار پیش‌فرض این تابع در کتابخانه ۱۰۰۰ رویداد است.)

### ۶. تعیین بازه زمانی ارسال رویدادها به سمت سرور

با استفاده از این تابع می‌توانید مشخص کنید که درخواست آپلود رویدادها بعد از گذشت چند میلی‌ثانیه فرستاده شود:

```dart
MetrixConfig metrixConfig = new  MetrixConfig(yourAppId);
metrixConfig.eventUploadPeriodMillis = 30000;
Metrix.onCreate(metrixConfig);
```

(مقدار پیش‌فرض این تابع در کتابخانه ۳۰ ثانیه است.)

### ۷. تعیین بازه زمانی دلخواه برای نشست‌ها

با استفاده از این تابع می‌توانید حد نشست‌ها را در اپلیکیشن خود مشخص کنید که هر نشست حداکثر چند ثانیه محاسبه شود. به عنوان مثال اگر مقدار این تابع را ۱۰۰۰۰ وارد کنید اگر کاربر در اپلیکیشن ۷۰ ثانیه تعامل داشته باشد، کتابخانه متریکس این تعامل را ۷ نشست محاسبه می‌کند.

```dart
MetrixConfig metrixConfig = new  MetrixConfig(yourAppId);
metrixConfig.sessionTimeoutMillis = 1800000;
Metrix.onCreate(metrixConfig);
```

(مقدار پیش‌فرض این تابع در کتابخانه ۳۰ دقیقه است.)

### ۸. فعال کردن مدیریت لاگ‌ها کتابخانه متریکس

توجه داشته باشید که موقع release اپلیکیشن خود مقدار این تابع را false قرار دهید:

```dart
MetrixConfig metrixConfig = new  MetrixConfig(yourAppId);
metrixConfig.loggingEnabled(true);
Metrix.onCreate(metrixConfig);
```

(مقدار پیش‌فرض این تابع در کتابخانه true است.)

### ۹. تعیین LogLevel

با استفاده از این تابع می‌توانید مشخص کنید که چه سطحی از لاگ‌ها در `logcat` چاپ شود، به عنوان مثال دستور زیر همه‌ی سطوح لاگ‌ها به جز `VERBOSE` در `logcat` نمایش داده شود:

```dart
MetrixConfig metrixConfig = new  MetrixConfig(yourAppId);
metrixConfig.logLevel = 3;
Metrix.onCreate(metrixConfig);
```

(مقدار پیش‌فرض این تابع در کتابخانه `INFO` است.)

نکته : مقدار متناظر با `Log Level`

```dart
VERBOSE = 2;
DEBUG = 3;
INFO = 4;
WARN = 5;
ERROR = 6;
ASSERT = 7;
```

### ۱۰. فعال یا غیرفعال کردن ارسال همه‌ی رویدادها

با استفاده از این تابع می‌توانید مشخص کنید که زمانی که اپلیکیشن بسته می‌شود همه رویدادهای ذخیره شده در کتابخانه ارسال شود یا نشود:

```dart
MetrixConfig metrixConfig = new  MetrixConfig(yourAppId);
metrixConfig.flushEventsOnClose = false;
Metrix.onCreate(metrixConfig);
```

(مقدار پیش‌فرض این تابع در کتابخانه true است.)


### ۱۱. مشخص کردن Pre-installed Tracker

با استفاده از این تابع می‌توانید با استفاده از یک `trackerToken` که از پنل آن را دریافت می‌کنید، برای همه‌ی رویدادها یک `tracker` پیش‌فرض را قرار دهید:

```dart
MetrixConfig metrixConfig = new  MetrixConfig(yourAppId);
metrixConfig.trackerToken = "trackerToken";
Metrix.onCreate(metrixConfig);
```

### ۱۲. تفکیک بر‌اساس استور های اپلیکیشن

اگر شما می‌خواهید اپلیکیشن خود را در استور های مختلف مانند کافه بازار، گوگل پلی و … منتشر کنید، با استفاده از متد زیر می‌توانید مشاهده کنید که کاربر از کدام استور ( مثلا کافه بازار، گوگل پلی، مایکت، اول مارکت و وبسایت ... ) اپلیکیشن را نصب کرده اند و منبع نصب های ارگانیک خود را  شناسایی کنید.

```dart
MetrixConfig metrixConfig = new  MetrixConfig(yourAppId);
metrixConfig.store = "storename";
Metrix.onCreate(metrixConfig);
```

### ۱۳. امضاء sdk

اگر شما قابلیت sdk signature در دشبورد خود فعال کنید و به app secret ها دسترسی دارید برای استفاده از آن از متد زیر استفاده کنید:

```dart
MetrixConfig metrixConfig = new MetrixConfig(yourAppId);
metrixConfig.setAppSecret(secretId, info1, info2, info3, info4);
Metrix.onCreate(metrixConfig);
```

### ۱۴. شناسه دستگاه‌های متریکس

برای هر دستگاهی که اپلیکیشن شما را نصب کند، متریکس یک شناسه منحصر به فرد تولید می‌کند.
برای دسترسی به این شناسه از طریق متد زیر می‌توانید آن را دریافت کنید

```dart
void metrixUserId(String metrixUserId) {
  //do any thing with metrix user id
}

MetrixConfig metrixConfig = new MetrixConfig(yourAppId);
metrixConfig.userIdCallback = metrixUserId;
Metrix.onCreate(metrixConfig);
```
**نکته:** این متد از نسخه ۰.۱۳.۰ به بعد قابل استفاده است.

**نکته:** شناسه متریکس زمانی در اختیار شما قرار می‌گیرید که دستگاه توسط سرویس متریکس شناسایی شده باشد.

### ۱۵. شناسه نشست متریکس

sdk متریکس برای هر نشست یک شناسه منحصر به فرد تولید می‌کند.
برای دسترسی به این شناسه از طریق متد زیر می‌توانید آن را دریافت کنید

```dart
void metrixSessionId(String metrixSessionId) {
  //do any thing with metrix session id
}

MetrixConfig metrixConfig = new MetrixConfig(yourAppId);
metrixConfig.sessionIdCallback = metrixSessionId;
Metrix.onCreate(metrixConfig);
```

**نکته:**این متد از نسخه ۰.۱۳.۰ به بعد قابل استفاده است.


### ۱۶. دریافت اطلاعات کمپین

با مقداردهی این تابعه میتوانید اطلاعات کمپین تبلیغاتی که در ترکر خود در پنل قرار داده اید را دریافت کنید.

```darts
void metrixAttribution(dynamic attributionModel) {
  //do any thing with metrix attribution model
}

MetrixConfig metrixConfig = new MetrixConfig(yourAppId);
metrixConfig.attributionCallback = metrixAttribution;
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



### ۱۷. شمارش پاک کردن اپلیکیشن

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

```dart
MetrixConfig metrixConfig = new  MetrixConfig(yourAppId);
metrixConfig.firebaseAppId = "yourfirebase app id";
Metrix.onCreate(metrixConfig);
```

۵. کتاب خانه زیر را در قسمت `dependencies` فایل `android/app/build.gradle` اپلیکیشن خود اضافه کنید:

```groovy
implementation 'com.google.firebase:firebase-messaging:17.6.0'
```

**نکته:**این متد از نسخه ۰.۱۴.۰ به بعد قابل استفاده است.


### ۱۸. ساختن یک رویداد سفارشی

با استفاده از این تابع می‌توانید یک رویداد سفارشی بسازید. برای این کار شما در ابتدا باید در داشبورد متریکس از قسمت مدیریت رخدادها، رخداد موردنظر خود را ثبت کنید و نامک (slug) آن را بعنوان نام رخداد در sdk استفاده کنید.

این تابع را به دو صورت می‌توانید صدا بزنید:

۱. یک رویداد سفارشی که فقط یک نامک مشخص دارد و آن را از داشبورد متریکس میگیرد، بسازید:

```dart
Metrix.newEvent('my_event_slug',null,null);
```

ورودی این تابع از جنس String است و همان نامکی است که داشبورد دریافت می‌کنید.

۲. یک رویداد سفارشی با تعداد دلخواه attribute و metric خاص سناریو خود بسازید، به عنوان مثال فرض کنید در یک برنامه خرید آنلاین می‌خواهید یک رویداد سفارشی بسازید:

```dart
Map<String, String> attributes = new Map();
attributes["first_name"] =  "Ali";
attributes["last_name"] =  "Bagheri";
attributes["manufacturer"] =  "Nike";
attributes["product_name"] =  "shirt";
attributes["type"] =  "sport";
attributes["size"] =  "large";

Map<String, Double> metrics = new Map();
metrics["price"] =  100000.0;

Metrix.newEvent("purchase_event_slug", attributes, metrics);
```

ورودی‌های متد newEvent بدین شرح هستند:

- **ورودی اول:** نامک رویداد مورد نظر شما که از جنس String است و آن را از داشبورد متریکس دریافت می‌کنید.
- **ورودی دوم:** یک `Map<String, String>` که ویژگی‌های یک رویداد را مشخص می‌کند.
- **ورودی سوم:** یک `Map<String, Double>` که شامل ویژگی های قابل اندازه گیری است.

### ۱۸. ساختن رویداد درآمدی

با استفاده از این تابع می‌توانید یک رویداد درآمدی بسازید. برای این کار شما در ابتدا باید در داشبورد متریکس از قسمت مدیریت رخدادها، رخداد موردنظر خود را ثبت کنید و نامک (slug) آن را بعنوان نام رخداد در sdk استفاده کنید.

این تابع را به صورت زیر می‌توانید صدا بزنید:

۱. یک رویداد سفارشی که فقط یک نامک مشخص دارد و آن را از داشبورد متریکس میگیرد، بسازید:

```dart
Metrix.newRevenue('my_event_slug', 12000, 0, '{orderId}');
```

ورودی اول همان نامکی است که از داشبورد دریافت می‌کنید.

دومین وروی تابع یک مقدار است که همان مقدار درآمد است.

سومین ورودی واحد پول این رخداد است که در صورت قرار ندادن مقدار آن واحد پیشفرض ریال است در زیر مقادیر آن را میتوانید ببینید.

1. `0` ریال
2. `1` دلار
3. `2` یورو

ورودی چهارم که به صورت دلخواه است میتواند شماره سفارش شما باشد.

### ۱۹. مشخص کردن Attribute‌های پیش‌فرض همه‌ی رویدادها

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

### ۲۰. مشخص کردن Metric‌های پیش‌فرض همه‌ی رویدادها

با استفاده از این تابع می‌توانید به تعداد دلخواه `Metric` به همه‌ی رویدادهای خود اضافه کنید:

```dart
Map<String, Double> metrics = new Map();
metrics["price"] =  100000.0;

Metrix.addUserMetrics(metrics);
```

## Deep linking
### توضیحات
اگر شما از ترکر های که دیپ‌لینک در آنها فعال است استفاده کنید، می‌توانیداطلاعات url دیپ‌لینک و محتوای آن را دریافت کنید. دستگاه بر اساس نصب بودن اپلیکیشن (سناریو استاندارد) یا نصب نبودن اپلیکیشن (سناریو deferred) واکنش نشان میدهد.
در صورت نصب بودن اپلیکیشن شما اطلاعات دیپ‌لینک به اپلیکیشن شما ارسال می‌شود.
پلتفرم اندروید به صورت اتماتیک سناریو deferred را پشتیبانی نمیکند در این صورت متریکس سناریو مخصوص به خود را دارد تا بتواند اطلاعات دیپ‌لینک را به اپلیکیشن ارسال کند.
### سناریو استاندارد

برای پیاده سازی سناریوی استاندارد به داکیومنت اندروید مراجعه نماید.

### سناریو deferred

این سناریو زمانی رخ می‌هد که کاربر روی دیپ‌لینک کلیک می‌کند ولی اپلیکیشن شما را در زمانی که کلیک کرده روی دستگاه خود نصب نکرده است. وقتی کاربر کلیک کرد به گوگل پلی استور هدایت می‌شود تا اپلیکیشن شما را نصب کند وقتی اپلیکیشن شما را نصب کرد و برای اولین بار آن را باز کرد اطلاعات دیپ‌لینک به اپلیکیشن داده می‌شود. 
متریکس به صورت پیش‌فرض سناریو deferred را پشتیبانی نمی‌کند و نیاز به تنظیم دارد.
اگر شما قصد دارید که سناریو deferred را کنترل کنیداز طریق کالبک زیر می‌توانید.

```dart
void deferredDeeplink(String deeplink) {
  //do any thing with deferred deeplink
}

MetrixConfig metrixConfig = new MetrixConfig(yourAppId);
metrixConfig.lunchDeferredDeeplink = true;
metrixConfig.deferredDeeplinkCallback = deferredDeeplink;
Metrix.onCreate(metrixConfig);
```
بعد از این که متریکس اطلاعات دیپ‌لینک را از بکند خود دریافت کرد محتوای آن را به کالبک بالا پاس میدهد اگر ورودی متد `lunchDeferredDeeplink` مقدار `true` باشد متریکس به صورت اتوماتیک سناریو استاندارد را اجرا میکند ولی اگر مقدار خروجی متد `false` باشد متریکس فقط اطلاعات را در این کالبک قرار میدهد تا شما بر اساس آن اکشن مورد نظر خود را انجام دهید.

### ری‌اتریبیوت با دیپ‌لینک
متریکس ابزار ری‌اتریبیوت با دیپ‌لینک دارد اگر میخواهید از این ابزار استفاده کنید نیاز است یکی از متد های متریکس را بعد از دریافت دیپ‌لینک صدا بزنید.
اگر شما اطلاعات دیپ‌لینک را در اپلیکیشن دریافت کردید با صدا زدن `Metrix.appWillOpenUrl(deeplink)` می‌توانید اطلاعات دیپ‌لینک را به بکند متریکس ارسال کنید تا کاربر دوباره ری‌اتریبیوت شود.

```dart
void onDeeplink(String deeplink) {
  Metrix.appWillOpenUrl(deeplink);
}
```