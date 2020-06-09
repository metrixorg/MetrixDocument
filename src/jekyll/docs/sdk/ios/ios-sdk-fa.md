---
layout: classic-docs
title: SDK iOS
lang: fa
permalink: /sdk/ios/index.html
toc: true # table of contents
---

## تنظیمات اولیه در پروژه

در [اینجا](https://github.com/metrixorg/MetrixSDK-iOSSample) پروژه نمونه وجود دارد می‌توانید نحوه استفاده از متریکس را در این پروژه ببینید.

### پیاده‌سازی

مراحل استفاده از SDK متریکس داخل پروژه iOS شما به شکل زیر است.

### افزودن SDK به پروژه

اگر از CocoaPods استفاده می‌کنید، می‌توانید خط زیر را به Podfile خود اضافه کنید:

```ruby
pod 'MetrixSdk', '>= 1.2.1', '< 2.0'
```

همچنین شما می‌توانید SDK متریکس را به عنوان یک framework به پروژه خود اضافه کنید.

از [اینجا](https://github.com/metrixorg/MetrixSDK-iOS) دانلود نماید.

از iOS 8 اپل فریم‌ورکهای پویا (dynamic frameworks یا embedded frameworks) را معرفی کرده است. اگر برنامه‌ شما iOSهای با نسخه 8 یا بالاتر را هدف‌گذاری کرده است، می‌توانید از فریم‌ورک پویای متریکس استفاده کنید.

### افزودن فریم‌ورک‌های iOS

- پروژه خود را در قسمت Project Navigator انتخاب کنید.
- در قسمت سمت چپ target مورد نظر را انتخاب کنید.
- در تب Build Phases گروه Link Binary with Libraries را باز کنید.
- در پایین این بخش دکمه + رو انتخاب کنید.
- فرم‌ورک‌های AdSupport.framework و iAd.framework و CoreTelephony.framework را انتخاب کنید.
- وضعیت فریم‌ورکها را به Optional تغییر دهید.

### یکپارچه سازی SDK در برنامه خود

باید از عبارت زیر برای import استفاده کنید.

```objc
#import <MetrixSdk/Metrix.h>
```

### راه اندازی اولیه

در Project Navigatorُ فایل منبع application delegate خود را انتخاب کنید. عبارت import مناسب را در بالای فایل وارد کنید و سپس متد زیر را در متدهای didFinishLaunching یا didFinishLaunchingWithOptions فراخوانی کنید.

```objc
#import "Metrix.h"
// or #import <Metrix/Metrix.h>
// or #import <MetrixSdk/Metrix.h>

// ...

NSString *yourAppId = @"{YourAppId}";
NSString *environment = MXEnvironmentSandbox;
MXConfig *metrixConfig = [MXConfig configWithAppId:yourAppId
                                            environment:environment];

[Metrix appDidLaunch:metrixConfig];
```

**نکته**: راه‌ اندازی SDK به این شکل بسیار مهم است. در غیر این صورت ممکن است باعث مشکلات مختلف شود.

مقدار {YourAppId} را با مقدار Metrix App Id خود جایگزین کنید.

بسته به این که برنامه خود را برای تست یا محصول نهایی خروجی میگیرید، باید مقدار environment را یکی از موارد زیر قرار دهید:

```objc
NSString *environment = MXEnvironmentSandbox;
NSString *environment = MXEnvironmentProduction;
```

## ویژگی‌های اضافه

بعد از پیاده‌سازی SDK می‌توانید از ویژگی‌های زیر استفاده کنید.

## رویداد سفارشی

با استفاده از این تابع می‌توانید یک رویداد سفارشی بسازید. برای این کار شما در ابتدا باید در داشبورد متریکس از قسمت مدیریت رخدادها، رخداد موردنظر خود را ثبت کنید و نامک (slug) آن را بعنوان نام رخداد در sdk استفاده کنید.
ابتدا باید یک رویداد سفارشی بسازید

```objc
MXCustomEvent *event = [MXCustomEvent newEvent:@"mySlug" attributes:myAttributes metrics:myMetrics];
[Metrix trackCustomEvent:event];
```

برای یک رویداد سفارشی میتوانید به تعداد دلخواه attribute و metric خاص سناریو خود بسازید، به عنوان مثال فرض کنید در یک برنامه خرید آنلاین می‌خواهید یک رویداد سفارشی بسازید:

```objc
NSMutableDictionary *myAttributes = [[NSMutableDictionary alloc] init];
    myAttributes[@"first_name"] = @"Ali";
    myAttributes[@"last_name"] = @"Bagheri";
    myAttributes[@"manufacturer"] = @"Nike";
    myAttributes[@"product_name"] = @"shirt";
    myAttributes[@"type"] = @"sport";
    myAttributes[@"size"] = @"large";
NSMutableDictionary *myMetrics = [[NSMutableDictionary alloc] init];
    myMetrics[@"price"] = @(100000);
    myMetrics[@"purchase_time"] = current_time;
```

## ساختن رویداد درآمدی

با استفاده از این تابع می‌توانید یک رویداد درآمدی بسازید. برای این کار شما در ابتدا باید در داشبورد متریکس از قسمت مدیریت رخدادها، رخداد موردنظر خود را ثبت کنید و نامک (slug) آن را بعنوان نام رخداد در sdk استفاده کنید.

این تابع را به صورت زیر می‌توانید صدا بزنید:

یک رویداد سفارشی که فقط یک نامک مشخص دارد و آن را از داشبورد متریکس میگیرد، بسازید:

```objc
#import <MetrixSdk/MXCurrency.h>

[Metrix trackRevenue:@"mySlug" withValue:@12000 currency:IRR orderId:@"myOrderId"];
```

ورودی اول همان نامکی است که از داشبورد دریافت می‌کنید.

دومین وروی تابع یک مقدار است که همان مقدار درآمد است.

سومین ورودی واحد پول این رخداد است.

ورودی چهارم که به صورت دلخواه است میتواند شماره سفارش شما باشد.

## ردگیری جریان صفحات

شما میتوانید جریان حرکت کاربران خود در صفحات برنامه خود را با متریکس ردگیری کنید. برای این کار باید به هنگام ورود به هر صفحه (در viewWillAppear یا viewDidApear) متد زیر را فراخوانی کنید:

```objc
[Metrix trackScreen:@"HomePage"];
```

## شناسه‌های دستگاه

SDK متریکس امکان دسترسی به برخی شناسه‌های دستگاه را فراهم می‌کند.

### شناسه تبلیغاتی

برخی سرویسها (مثل Google Analytics) شناسه یکتایی برای هر دستگاه فراهم میکنند تا از گزارش چندباره اطلاعات اجتناب کنند.

برای به دست آوردن این شناسه کافی است متد زیر را فراخوانی کنید:

```objc
NSString *idfa = [Metrix idfa];
```

### شناسه متریکس

برای هر دستگاهی که برنامه شما را نصب میکند، سرور متریکس یک شناسه یکتا (mxid) تولید میکند.

بنابراین پیش از راه اندازی اولیه و ثبت برنامه شما در سرورهای متریکس دسترسی به این شناسه ممکن نیست.

برای به دست آوردن این شناسه میتوانید به شکل زیر عمل کنید:

```objc
NSString *mxid = [Metrix mxid];
```

## ردگیرهای پیش‌نصب

با استفاده از این تابع می‌توانید با استفاده از یک `trackerToken` که از پنل آن را دریافت می‌کنید، برای همه‌ی رویدادها یک `tracker` پیش‌فرض را قرار دهید.

برای این کار app delegate برنامه خود را باز کرده و trackerToken را برای MXConfig خود قرار دهید:

```objc
MXConfig *metrixConfig = [MXConfig configWithAppId:yourAppId environment:environment];
[metrixConfig setTrackerToken:@"{TrackerToken}"];
[Metrix appDidLaunch:metrixConfig];
```

بعد از اجرای برنامه باید لاگی به این شکل در XCode ببینید:

```objc
Tracker token: 'abc123'
```
