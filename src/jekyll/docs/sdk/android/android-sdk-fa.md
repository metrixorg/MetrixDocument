---
layout: classic-docs
title: SDK Android
lang: fa
permalink: /sdk/android/index.html
toc: true # table of contents
---
<hr/>
<br/>
# راه‌اندازی کتابخانه در اپلیکیشن اندروید
<br/>
۱. کتابخانه را در قسمت `dependencies` فایل `gradle` اپلیکیشن خود اضافه کنید:

```groovy
 implementation 'ir.metrix:metrix:0.15.4'
```

۲. کتابخانه متریکس را در متد `onCreate` کلاس `Application` اندروید `initialize` کنید. 
اگر از قبل در پروژه خود کلاس `Application` ندارید به شکل زیر این کلاس را ایجاد کنید:

- یک کلاس ایجاد کنید که از کلاس `Application` ارث بری کند:

<img src="https://storage.backtory.com/tapsell-server/metrix/doc/screenshots/Metrix-Application-Class.png"/>

- فایل `AndriodManifest.xml` اپلیکیشن خود را باز کنید و به تگ `<application>` بروید.

- با استفاده از `Attribute` زیر، کلاس `Application` خود را در `AndroidManifest.xml` اضافه کنید:

```xml
<application
    android:name=“.MyApplication”
    ... >

</application>
```

در کلاس `Application` خود، مطابق قطعه کد زیر، نمونه‌ای از کلاس `MetrixConfig` بسازید و سپس با فراخوانی متد `onCreate`، sdk متریکس را `initialize` کنید:

**توجه:** شما می‌توانید پیش از فراخوانی متد `onCreate`، با استفاده از نمونه `MetrixConfig` خود، پیکربندی دلخواه خود را برای کتابخانه تنظیم کنید.
برای دریافت اطلاعات بیشتر در این مورد به بخش مربوطه در 
[تغییر پیکربندی کتابخانه](#تغییر-پیکربندی-کتابخانه)
 مراجعه کنید.

```java
import android.app.Application;

import ir.metrix.sdk.Metrix;
import ir.metrix.sdk.MetrixConfig;


public class MyApplication extends Application {

    @Override
    public void onCreate() {
        super.onCreate();

        MetrixConfig metrixConfig = new  MetrixConfig(this, "APP_ID"); // ساخت نمونه‌ای از کلاس `MetrixConfig`
        // تغییر پیکربندی (دلخواه)
        Metrix.onCreate(metrixConfig); // راه‌اندازی کردن کتابخانه
    }
}
```



`APP_ID`: کلید اپلیکیشن شما که از پنل متریکس آن را دریافت می‌کنید.



### در مورد کلاس اپلیکیشن و initialize کردن در این کلاس

اندروید در کلاس اپلیکیشن به توسعه دهنده این اختیار را می‌دهد که قبل از ساخته شدن هر `Activity` در اپلیکیشن دستوراتی را وارد کند. این موضوع برای کتابخانه متریکس نیز ضروری است، به این دلیل که شمردن `session`ها و همچنین جریان بین `Activity`ها و دیگر امکانات کارایی لازم را داشته باشند و به درستی عمل کنند.



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

```java
Metrix.getInstance().getSessionNum();
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

```java
Metrix.getInstance().newEvent("my_event_slug");
```

۲. ثبت رویداد به همراه تعداد دلخواه attribute مربوط به آن. به عنوان مثال فرض کنید در یک برنامه خرید آنلاین می‌خواهید یک رویداد سفارشی بسازید:

```java
Map<String, String> attributes = new HashMap<>();
attributes.put("first_name", "Ali");
attributes.put("last_name", "Bagheri");
attributes.put("manufacturer", "Nike");
attributes.put("product_name", "shirt");
attributes.put("type", "sport");
attributes.put("size", "large");

Metrix.getInstance().newEvent("purchase_event_slug", attributes);
```

ورودی‌های متد **newEvent** در این حالت، بدین شرح هستند:

- **ورودی اول:** نامک رویداد مورد نظر شما که در پنل متریکس معرفی شده است.
- **ورودی دوم:** یک `Map<String, String>` که ویژگی‌های یک رویداد را مشخص می‌کند.

**توجه:** هر رویداد می‌تواند حداکثر ۵۰ attribute داشته باشد که طول key و value آن حداکثر ۵۱۲ بایت می‌باشد.

#### مشخص کردن Attribute‌های پیش‌فرض همه‌ی رویدادها

با استفاده از این تابع می‌توانید به تعداد دلخواه `Attribute` به همه‌ی رویدادهای خود اضافه کنید:

```java
Map<String, String> attributes = new HashMap<>();
attributes.put("manufacturer", "Nike");
Metrix.getInstance().addUserAttributes(attributes);
```

**توجه:** هر رویداد می‌تواند حداکثر ۵۰ attribute داشته باشد که طول key و value آن حداکثر ۵۱۲ بایت می‌باشد.


### ساختن رویداد درآمدی

با استفاده از این تابع می‌توانید یک رویداد درآمدی بسازید. برای این کار در ابتدا در پنل خود از قسمت مدیریت رویدادها، رویداد موردنظر خود را ثبت کنید و نامک (slug) آن را به عنوان نام رویداد در اپلیکیشن استفاده کنید.

```java
Metrix.getInstance().newRevenue("my_event_slug", 12000, MetrixCurrency.IRR, "{orderId}");
```
ورودی‌های متد **newRevenue** بدین شرح هستند:

- **ورودی اول:** نامک رویداد مورد نظر شما که در پنل متریکس معرفی شده است.
- **ورودی دوم:** یک مقدار عددی است که همان میزان درآمد است.
- **ورودی سوم:** واحد پول مورد استفاده است و می‌تواند سه مقدار **MetrixCurrency.IRR**  (پیش‌فرض) یا **MetrixCurrency.USD** و یا **MetrixCurrency.EUR** را داشته باشد.
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

- پیدا کردن Firebase APP ID

ابتدا به کنسول فایربیس خود رفته.
دکمه settings را زده سپس به Project settings بروید
تب General را انتخاب کنید
حالا می‌توانید `App ID` را بردارید

<img src="{{ '/images/firebase-settings.png' | relative_url }}" alt="firebase app id"/>

- تغییر پیکربندی کتابخانه متریکس

با استفاده از دستور زیر در هنگام تعیین پیکربندی کتابخانه، آیدی فایربیس را به کتابخانه متریکس بدهید.

```java
metrixConfig.setFirebaseAppId("your firebase app id");
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

```java
metrixConfig.setOnAttributionChangedListener(new OnAttributionChangedListener() {
@Override
    public void onAttributionChanged(AttributionModel attributionModel) {
        //TODO
    }
});
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

اگر کاربران شما اپلیکیشن شما را نصب داشته باشند و شما بخواهید بعد از کلیک بر روی لینک دیپ‌لینک صفحه خاصی از اپلیکیشن شما باز شود ابتدا باید یک scheme name یکتا انتخاب کنید.
سپس آن را باید به اکتیویتی که قصد دارید در صورت کلیک بر روی دیپ‌لینک اجرا شود نسبت دهید. برای این منظور به فایل `AndroinManifest.xml` رفته و بخش `intent-filter` را به اکتیویتی مورد نظر اضافه کنید همچنین scheme name مورد نظر خود را نیز قرار دهید.
مانند زیر:

```xml
<activity
    android:name=".MainActivity"
    android:configChanges="orientation|keyboardHidden"
    android:label="@string/app_name"
    android:screenOrientation="portrait">

    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data android:scheme="metrixEample" />
    </intent-filter>
</activity>
```

اطلاعات دیپ‌لینک در اکتیویتی که آن را تعریف کردید توسط یک آبجکت `Intent` درمتد های `onCreate`و `newIntent` قابل دسترس است.

```java
@Override
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);

    Intent intent = getIntent();
    Uri data = intent.getData();
}
```

```java
@Override
protected void onNewIntent(Intent intent) {
    super.onNewIntent(intent);

    Uri data = intent.getData();
}
```

### سناریو deferred

این سناریو زمانی رخ می‌هد که کاربر روی دیپ‌لینک کلیک می‌کند ولی اپلیکیشن شما را در زمانی که کلیک کرده روی دستگاه خود نصب نکرده است. وقتی کاربر کلیک کرد به گوگل پلی استور هدایت می‌شود تا اپلیکیشن شما را نصب کند. وقتی اپلیکیشن شما را نصب کرد و برای اولین بار آن را باز کرد اطلاعات دیپ‌لینک به اپلیکیشن داده می‌شود.

متریکس به صورت پیش‌فرض سناریو deferred را پشتیبانی نمی‌کند و نیاز به تنظیم دارد.
اگر شما قصد دارید که سناریو deferred را کنترل کنید می‌توانید از کالبک زیر در هنگام تعیین پیکربندی کتابخانه استفاده نمایید:

```java
metrixConfig.setOnDeeplinkResponseListener(new OnDeeplinkResponseListener() {
    @Override
    public boolean launchReceivedDeeplink(Uri deeplink) {
        // ...
        if (shouldMetrixSdkLaunchTheDeeplink(deeplink)) {
            return true;
        } else {
            return false;
        }
    }
});
```

بعد از این که متریکس اطلاعات دیپ‌لینک را از سرور خود دریافت کرد محتوای آن را به کالبک بالا پاس می‌دهد. اگر خروجی متد `lunchReceivedDeeplink` مقدار `true` باشد متریکس به صورت اتوماتیک سناریو استاندارد را اجرا می‌کند ولی اگر مقدار خروجی متد `false` باشد متریکس فقط اطلاعات را در این کالبک قرار می‌دهد تا شما بر اساس آن اکشن مورد نظر خود را انجام دهید.

**تذکر:** در این باره توضیحات مربوط به بخش
[تغییر پیکربندی کتابخانه](#تغییر-پیکربندی-کتابخانه)
را مطالعه نمایید.

### ری‌اتریبیوت با دیپ‌لینک

متریکس ابزار ری‌اتریبیوت با دیپ‌لینک دارد. اگر می‌خواهید از این ابزار استفاده کنید نیاز است یکی از متد های متریکس را بعد از دریافت دیپ‌لینک صدا بزنید.
اگر شما اطلاعات دیپ‌لینک را در اپلیکیشن دریافت کردید با صدا زدن `Metrix.getInstance().appWillOpenUrl(Uri)` می‌توانید اطلاعات دیپ‌لینک را به متریکس ارسال کنید تا کاربر دوباره ری‌اتریبیوت شود.

```java
@Override
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);

    Intent intent = getIntent();
    Uri data = intent.getData();
    Metrix.getInstance().appWillOpenUrl(data);
}
```

```java
@Override
protected void onNewIntent(Intent intent) {
    super.onNewIntent(intent);

    Uri data = intent.getData();
    Metrix.getInstance().appWillOpenUrl(data);
}
```

<hr/>
<br/>
# تغییر پیکربندی کتابخانه
شما می‌توانید به مانند قطعه کد زیر در کلاس `Application` خود، پیش از فراخوانی متد `onCreate` به منظور `initialize` کردن کتابخانه، با استفاده از نمونه کلاس `MetrixConfig` خود، تغییرات مورد نظر خود را در رابطه با پیکربندی کتابخانه متریکس ایجاد کنید:

```java
MetrixConfig metrixConfig = new MetrixConfig(context, "APP_ID");

// اعمال تغییرات مورد نظر 

Metrix.onCreate(metrixConfig); // راه‌اندازی کردن کتابخانه
```

در ادامه به معرفی تغییراتی که می‌توانید اعمال کنید، می‌پردازیم.

### ثبت اطلاعات مکان کاربر در رویدادها

می‌توانید با استفاده دستور زیر به کتابخانه متریکس اعلام کنید که در رویدادها اطلاعات مربوط به مکان کاربر را به همراه دیگر اطلاعات ارسال کند.

```java
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

```java
metrixConfig.setEventUploadThreshold(50);
```
مقدار پیش‌فرض این تابع در کتابخانه ۳۰ رویداد است.

### حداکثر تعداد رویداد ارسالی در هر درخواست

با استفاده از دستور زیر می‌توانید حداکثر تعداد رویداد ارسالی در هر درخواست را مشخص کنید:

```java
metrixConfig.setEventUploadMaxBatchSize(100);
```
مقدار پیش‌فرض این تابع در کتابخانه ۱۰۰ رویداد است.

### تعداد حداکثر ذخیره رویداد در مخزن کتابخانه

با استفاده از دستور زیر می‌توانید مشخص کنید که حداکثر تعداد رویدادهای ذخیره شده در کتابخانه متریکس چقدر باشد (به عنوان مثال اگر دستگاه کاربر اتصال خود به اینترنت را از دست داد رویدادها تا مقداری که شما مشخص می‌کنید در کتابخانه ذخیره خواهند شد) و اگر تعداد رویدادهای ذخیره شده در کتابخانه از این مقدار بگذرد رویدادهای قدیمی توسط کتابخانه نگهداری نشده و از بین می‌روند:

```java
metrixConfig.setEventMaxCount(1000);
```
مقدار پیش‌فرض این تابع در کتابخانه ۱۰۰۰ رویداد است.

### بازه زمانی ارسال رویدادها به سمت سرور

با استفاده از دستور زیر می‌توانید مشخص کنید که درخواست آپلود رویدادها بعد از گذشت چند میلی‌ثانیه فرستاده شود:

```java
metrixConfig.setEventUploadPeriodMillis(30000);
```
مقدار پیش‌فرض این تابع در کتابخانه ۳۰ ثانیه است.

### بازه زمانی دلخواه برای نشست‌ها

با استفاده از این تابع می‌توانید حد نشست‌ها را در اپلیکیشن خود مشخص کنید که هر نشست حداکثر چند ثانیه محاسبه شود. به عنوان مثال اگر مقدار این تابع را ۱۰۰۰۰ وارد کنید اگر کاربر در اپلیکیشن ۷۰ ثانیه تعامل داشته باشد، کتابخانه متریکس این تعامل را ۷ نشست محاسبه می‌کند.

```java
metrixConfig.setSessionTimeoutMillis(1800000);
```
مقدار پیش‌فرض این متد در کتابخانه ۳۰ دقیقه است.

### جمع‌آوری flow کاربر در اپلیکیشن

با استفاده از این متد، می‌توانید جمع‌آوری خودکار اطلاعات مربوط به جریان کاربر در هر `Activity`/`Fragment` توسط متریکس را فعال یا غیر فعال نمایید.

```java
metrixConfig.setScreenFlowsAutoFill(true);
```

به طور پیش‌فرض این عملکرد غیرفعال است.

### مشخص کردن Pre-installed Tracker

اگر بخواهید برای کاربرانی که نصب آنها organic بوده و از یک کلیک ناشی نمی‌شود ترکر داشته باشید، با استفاده از این تابع می‌توانید با یک `trackerToken` که از پنل دریافت می‌کنید، یک `tracker` پیش‌فرض برای اپلیکیشن خود قرار دهید:

```java
metrixConfig.setDefaultTrackerToken(trackerToken);
```

### امضاء SDK

اگر شما قابلیت sdk signature را در پنل خود فعال کنید و به app secret ها دسترسی دارید برای استفاده از آن از متد زیر استفاده کنید:
```java
metrixConfig.setAppSecret(secretId, info1, info2, info3, info4);
```

### تفکیک بر‌اساس استور های اپلیکیشن

اگر شما می‌خواهید اپلیکیشن خود را در استور های مختلف مانند کافه بازار، گوگل پلی و … منتشر کنید، با استفاده از متد زیر می‌توانید مشاهده کنید که کاربر از کدام استور ( مثلا کافه بازار، گوگل پلی، مایکت، اول مارکت و وبسایت ... ) اپلیکیشن را نصب کرده و منبع نصب های ارگانیک خود را شناسایی کنید.
```java
metrixConfig.setStore("store name");
```

### شناسه دستگاه‌های متریکس

برای هر دستگاهی که اپلیکیشن شما را نصب کند، متریکس یک شناسه منحصر به فرد تولید می‌کند.
برای دسترسی به این شناسه از طریق متد زیر می‌توانید آن را دریافت کنید

```java
metrixConfig.setOnReceiveUserIdListener(new OnReceiveUserIdListener() {
            @Override
            public void onReceiveUserId(String metrixUserId) {
            sendToyourApi(metrixUserId);    
            }
        });
```
**نکته:** شناسه متریکس زمانی در اختیار شما قرار می‌گیرید که دستگاه توسط سرویس متریکس شناسایی شده باشد.

### شناسه نشست متریکس

کتابخانه متریکس برای هر نشست یک شناسه منحصر به فرد تولید می‌کند.
برای دسترسی به این شناسه از طریق متد زیر شنونده را تعریف نمایید:

```java
metrixConfig.setOnSessionIdListener(new OnSessionIdListener() {
            @Override
            public void onReceiveSessionId(String sessionId) {
            sendToyourApi(sessionId);    
            }
        });
```
