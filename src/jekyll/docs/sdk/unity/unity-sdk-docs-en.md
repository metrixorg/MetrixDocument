---
layout: classic-docs
title: SDK unity
lang: en
permalink: /sdk/unity/index.html
toc: true # table of contents
---

## Basic integration

1\. Download the latest version from [our releases page](https://github.com/metrixorg/MetrixSDK-UnityPlugin/blob/master/MetrixSDK-v0.12.0.unitypackage).
Open your project in the Unity Editor and navigate to Assets → Import Package → Custom Package and select the downloaded Unity package file.

2\. Please add the following permissions, which the Metrix SDK needs, if they are not already present in your `AndroidManifest.xml` file in `Plugins/Android` folder:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" /> <!--optional-->
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" /> <!--optional-->
```

(Two last permissions are optional)

## Install Referrer

In order to correctly attribute an install of your app to its source, Metrix needs information about the **install referrer**. This can be obtained by using the **Google Play Referrer API** or by catching the **Google Play Store intent** with a broadcast receiver.

**Important**: The Google Play Referrer API is newly introduced by Google with the express purpose of providing a more reliable and secure way of obtaining install referrer information and to aid attribution providers in the fight against click injection. It is **strongly advised** that you support this in your application. The Google Play Store intent is a less secure way of obtaining install referrer information. It will continue to exist in parallel with the new Google Play Referrer API temporarily, but it is set to be deprecated in future.

### Google Play Store intent

The Google Play Store `INSTALL_REFERRER` intent should be captured with a broadcast receiver. If you are **not using your own broadcast receiver** to receive the `INSTALL_REFERRER` intent, add the following `receiver` tag inside the `application` tag in your `AndroidManifest.xml`.

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

## Implement the SDK in your project

### Initial configuration in the app

Initialize Metrix according to the code below:

```csharp
MetrixConfig metrixConfig = new MetrixConfig("APP_ID");
Metirx.OnCreate(metrixConfig);
```

Replace `APP_ID` with your application id. You can find that in your Metrix's dashboard.  


## Additional features

### Events and sessions

In each interaction that the user has with the app, Metrix sends this interaction to the server as an **event**. In Metrix, a **session** is a specific timeframe during which the user interacted with the app.
There are three types of events in Metrix:
**1. Session Start:** The time a session starts.
**2. Session Stop:** The time of a session ends.
**3. Custom:** Depending on your application logic and the interactiion that the user has with your app, you can create and send custom events as below:

### Enable location listening

Using the following functions, you can inform Metrix that you wish to send information about the location of the user (In order for these methods to work properly, the optional permissions explained earlier must be enabled).

```csharp
MetrixConfig metrixConfig = new MetrixConfig(yourAppId);
metrixConfig.SetLocationListening(locationListening);
Metirx.OnCreate(metrixConfig);
```

### Limitation in number of events to upload

Using the following function, you can specify that each time the number of your buffered events reaches the threshold, the Metrix SDK should send them to the server:

```csharp
MetrixConfig metrixConfig = new MetrixConfig(yourAppId);
metrixConfig.SetEventUploadThreshold(50);
Metirx.OnCreate(metrixConfig);
```

(The default value is 30 events.)

### Limitation in number of events to send per request

Using this function, you can specify the maximum number of out-going events per request as shown below:

```csharp
MetrixConfig metrixConfig = new MetrixConfig(yourAppId);
metrixConfig.SetEventUploadMaxBatchSize(100);
Metirx.OnCreate(metrixConfig);
```

(The default value is 100 events.)

### Limitation in number of events to buffer on the device

Using the following function, you can specify the maximum number of events that are buffered in the SDK (for example, if the user's device loses internet connection, the events will be buffered in the library until there is a chance to send the events and empty the buffer) and if the number of buffered events in the library passes this amount, old events are destroyed by SDK to make space for new events:

```csharp
MetrixConfig metrixConfig = new MetrixConfig(yourAppId);
metrixConfig.SetEventMaxCount(1000);
Metirx.OnCreate(metrixConfig);
```

(The default value is 100 events.)

### The time interval for sending events

By using this function, you can specify the timeout period of requests for sending events:

```csharp
MetrixConfig metrixConfig = new MetrixConfig(yourAppId);
metrixConfig.SetEventUploadPeriodMillis(30000);
Metirx.OnCreate(metrixConfig);
```

(The default value is 30 seconds.)

### The session timeout

Using this function, you can specify the limit of session length in your application in unit of miliseconds. For example, if this value is 10,000 and the user interacts with the application for 70 seconds, Metrix calculates this interaction as seven sessions.

```csharp
MetrixConfig metrixConfig = new MetrixConfig(yourAppId);
metrixConfig.SetSessionTimeoutMillis(1800000);
Metirx.OnCreate(metrixConfig);
```

(The default value is 30 minutes.)

### Log management

Note that you should set this value to `false` before the release of your application:

```csharp
MetrixConfig metrixConfig = new MetrixConfig(yourAppId);
metrixConfig.EnableLogging(true);
Metirx.OnCreate(metrixConfig);
```

(The default value is true.)

### Set LogLevel

Using this function, you can specify what level of logs to be printed in `logcat`, for example, the following command will display all logs except `VERBOSE` in `logcat`:

```csharp
MetrixConfig metrixConfig = new MetrixConfig(yourAppId);
metrixConfig.SetLogLevel(3);
Metirx.OnCreate(metrixConfig);
```

(The default value is `Log.INFO`.)

The value of `Log Level` can be one of the following:

```csharp
VERBOSE = 2;
DEBUG = 3;
INFO = 4;
WARN = 5;
ERROR = 6;
ASSERT = 7;
```

### Flush all events

Using this function, you can specify whether when the application is closed, all events buffered in the device, should be sent or not:

```csharp
MetrixConfig metrixConfig = new MetrixConfig(yourAppId);
metrixConfig.SetFlushEventsOnClose(false);
Metirx.OnCreate(metrixConfig);
```

(The default value is true.)

### Pre-installed trackers

If you want to use the Metrix SDK to recognize users whose devices came with your app pre-installed, open your app delegate and set the default tracker of your config. Replace `trackerToken` with the tracker token you created in dashboard. Please note that the Dashboard displays a tracker URL (including http://tracker.metrix.ir/). In your source code, you should specify only the six-character token and not the entire URL.

```csharp
MetrixConfig metrixConfig = new MetrixConfig(yourAppId);
metrixConfig.SetDefaultTracker("trackerToken");
Metirx.OnCreate(metrixConfig);
```

### Sdk signature

An account manager must activate the Metrix SDK Signature.

If the SDK signature has already been enabled on your account and you have access to App Secrets in your Metrix Dashboard, please use the method below to integrate the SDK signature into your app.

An App Secret is set by calling setAppSecret on your config instance:
```csharp
MetrixConfig metrixConfig = new MetrixConfig(yourAppId);
metrixConfig.SetAppSecret(secretId, info1, info2, info3, info4);
Metirx.OnCreate(metrixConfig);
```

### Separation based on app stores

If you want to publish your app in different stores such as Cafe Bazaar, Google Play, etc, and split the organic users by their store's source, you can use the following method:

```csharp
MetrixConfig metrixConfig = new MetrixConfig(yourAppId);
metrixConfig.SetStore("store name");
Metirx.OnCreate(metrixConfig);
```

### Current session number

By this function, you can find the current session number:

```csharp
Metrix.GetSessionNum();
```

### Custom event

You can use Metrix to track any event in your app. Suppose you want to track every tap on a button. You would have to create a new event slug in the Events Management section of your dashboard. Let's say that event slug is `abc123`. In your button's onClick method you could then add the following lines to track the click.

You can call this function in this way:
Make a custom event that has only one specified name:

```csharp
Metrix.NewEvent("abc123");
```

The input of this function is String.

### Track Revenue

If your users can generate revenue by tapping on advertisements or making in-app purchases, you can track those revenues too with events. You can also add an optional order ID to avoid tracking duplicate revenues. By doing so, the last ten order IDs will be remembered and revenue events with duplicate order IDs are skipped. This is especially useful for tracking in-app purchases. You can see an example below where a tap is worth 12,000 IRR:

```csharp
Metrix.NewRevenue("my_event_slug", 12000, 0, "{orderId}");
```

The first parameter is the slug you get from the dashboard.
The second parameter is the amount of revenue.
The third parameter is the currency of this event. If you do not set the value, Rial is be considered as default value. You can see below its values:

1. `0` Rial
2. `1` Dollars
3. `2` Euro

The fourth parameter is your order number.

### Enable the process of storing the user flow

Using this function, you can inform the Metrix to gather information about user's flow in each `Activity`/`Fragment` and these details should be stored automatically:

```csharp
Metrix.ScreenDisplayed("First Screen");
```

## Deep linking

### Deep linking Overview

If you are using Metrix tracker URLs with deeplinking enabled, it is possible to receive information about the deeplink URL and its content. Users may interact with the URL regardless of whether they have your app installed on their device (standard deep linking scenario) or not (deferred deep linking scenario). In the standard deep linking scenario, the Android platform natively offers the possibility for you to receive deep link content information. The Android platform does not automatically support deferred deep linking scenario; in this case, the Metrix SDK offers the mechanism you need to get the information about the deep link content.

### Standard deep linking scenario

برای پیاده سازی سناریو استاندارد می‌توانید از  [این](https://github.com/metrixorg/UnityDeeplinks) کتابخانه استفاده کنید، همچنین یک برنچ نمونه برای پیاده سازی سناریو استاندارد دیپ‌لینک در [اینجا](https://github.com/metrixorg/MetrixSDK-UnitySample/tree/deeplink) وجود دارد.

### Deferred deep linking scenario

Deferred deeplinking scenario occurs when a user clicks on an Metrix tracker URL with a `deep_link` parameter contained in it, but does not have the app installed on the device at click time. When the user clicks the URL, they will be redirected to the Play Store to download and install your app. After opening it for the first time, `deep_link` parameter content will be delivered to your app.

The Metrix SDK opens the deferred deep link by default. There is no extra configuration needed.

#### Deferred deep linking callback

If you wish to control if the Metrix SDK will open the deferred deep link, you can do it with a callback method in the config object.

```csharp
void deferredDeeplink(string deeplink) {
  //do any thing with deferred deeplink
}

MetrixConfig metrixConfig = new MetrixConfig(yourAppId);
metrixConfig.SetShouldLaunchDeeplink(true);
metrixConfig.SetDeferredDeeplinkDelegate(deferredDeeplink);
Metirx.OnCreate(metrixConfig);
```

After the Metrix SDK receives the deep link information from our backend, the SDK will deliver you its content via the delegate and expect the `boolean` set value from you. This value represents your decision on whether or not the Metrix SDK should launch the activity to which you have assigned the scheme name from the deeplink (like in the standard deeplinking scenario).

If you set `true`, we will launch it, triggering the scenario described in the Standard deep linking scenario chapter. If you do not want the SDK to launch the activity, set `false` from the `SetShouldLaunchDeeplink` method, and (based on the deep link content) decide on your own what to do next in your app.

### Reattribution via deeplinks

Metrix enables you to run re-engagement campaigns with deeplinks. For more information.

If you are using this feature, you need to make one additional call to the Metrix SDK in your app for us to properly reattribute your users.

Once you have received the deeplink content in your app, add a call to the `Metrix.AppWillOpenUrl(Uri)` method. By making this call, the Metrix SDK will send information to the Metrix backend to check if there is any new attribution information inside of the deeplink. If your user is reattributed due to a click on the Metrix tracker URL with deeplink content.

Here's how the call to `Metrix.AppWillOpenUrl(Uri)` should look:

```csharp
void onDeeplink(string deeplink) {
  Metrix.AppWillOpenUrl(deeplink);
}
```