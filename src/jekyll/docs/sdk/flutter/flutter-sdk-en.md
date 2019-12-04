---
layout: classic-docs
title: SDK Flutter
lang: en
permalink: /sdk/flutter/index.html
toc: true # table of contents
---

[![pub package](https://img.shields.io/pub/v/metrix.svg)](https://pub.dartlang.org/packages/metrix)

## Basic integration

1\. To use this plugin, add `metrix` as a [dependency in your pubspec.yaml file](https://flutter.io/platform-plugins/).

2\. Add the following settings to your project's `Proguard` file:

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

3\. Please add the following permissions, which the Metrix SDK needs, if they are not already present in your `AndroidManifest.xml` file:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" /> <!--optional-->
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" /> <!--optional-->
```

(Two last permissions are optional)

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

We use this broadcast receiver to retrieve the install referrer and pass it to our backend.

If you are already using a multiple broadcast receiver for the `INSTALL_REFERRER` intent, follow below to add the Metrix broadcast receiver.
If you have implemented your own broadcast receiver like this

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

then add class to recevier in `applicaton` tag in `AndroidManifest.xml` file

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

## Implement the SDK in your project

### Initial configuration in the app

You need to initialize the Metrix SDK in `initState` method of your `State`.

1\. In `initState` method of your `State` class, initialize Metrix according to the codes below:

```dart
import 'package:metrix/metrix.dart';
import 'package:metrix/metrixConfig.dart';

class _MyAppState extends State<MyApp> {

  @override
  void initState() {
    super.initState();
    MetrixConfig metrixConfig = new MetrixConfig("APP_ID");
    Metrix.onCreate(metrixConfig); 
  }
}
```

Replace `APP_ID` with your application id. You can find that in your Metrix dashboard.

## Additional features

### Events and sessions

In each interaction that the user has with the app, Metrix sends this interaction to the server as an **event**. In Metrix, a **session** is a specific timeframe during which the user interacted with the app.

There are three types of events in Metrix:

**1. Session Start:** The time a session starts.

**2. Session Stop:** The time of a session ends.

**3. Custom:** Depending on your application logic and the interactiion that the user has with your app, you can create and send custom events as below:



### Enable location listening

Using the following functions, you can inform Metrix that you wish to send information about the location of the user (In order for these methods to work properly, the optional permissions explained earlier must be enabled).

```dart
MetrixConfig metrixConfig = new MetrixConfig(yourAppId);
metrixConfig.locationListening = locationListening;
Metrix.onCreate(metrixConfig);
```

### Limitation in number of events to upload

Using the following function, you can specify that each time the number of your buffered events reaches the threshold, the Metrix SDK should send them to the server:

```dart
MetrixConfig metrixConfig = new MetrixConfig(yourAppId);
metrixConfig.eventUploadThreshold = 50;
Metrix.onCreate(metrixConfig);
```

(The default value is 30 events.)

### Limitation in number of events to send per request

Using this function, you can specify the maximum number of out-going events per request as shown below:

```dart
MetrixConfig metrixConfig = new MetrixConfig(yourAppId);
metrixConfig.eventUploadMaxBatchSize = 100;
Metrix.onCreate(metrixConfig);
```

(The default value is 100 events.)

### Limitation in number of events to buffer on the device

Using the following function, you can specify the maximum number of events that are buffered in the SDK (for example, if the user's device loses internet connection, the events will be buffered in the library until there is a chance to send the events and empty the buffer) and if the number of buffered events in the library passes this amount, old events are destroyed by SDK to make space for new events:

```dart
MetrixConfig metrixConfig = new MetrixConfig(yourAppId);
metrixConfig.eventMaxCount = 1000;
Metrix.onCreate(metrixConfig);
```

(The default value is 100 events.)

### The time interval for sending events

By using this function, you can specify the timeout period of requests for sending events:

```dart
MetrixConfig metrixConfig = new MetrixConfig(yourAppId);
metrixConfig.eventUploadPeriodMillis = 30000;
Metrix.onCreate(metrixConfig);
```

(The default value is 30 seconds.)

### The session timeout

Using this function, you can specify the limit of session length in your application in unit of miliseconds. For example, if this value is 10,000 and the user interacts with the application for 70 seconds, Metrix calculates this interaction as seven sessions.

```dart
MetrixConfig metrixConfig = new MetrixConfig(yourAppId);
metrixConfig.sessionTimeoutMillis = 1800000;
Metrix.onCreate(metrixConfig);
```

(The default value is 30 minutes.)

### Log management

Note that you should set this value to `false` before the release of your application:

```dart
MetrixConfig metrixConfig = new MetrixConfig(yourAppId);
metrixConfig.loggingEnabled = true;
Metrix.onCreate(metrixConfig);
```

(The default value is true.)

### Set LogLevel

Using this function, you can specify what level of logs to be printed in `logcat`, for example, the following command will display all logs except `VERBOSE` in `logcat`:

```dart
MetrixConfig metrixConfig = new MetrixConfig(yourAppId);
metrixConfig.logLevel = 3;
Metrix.onCreate(metrixConfig);
```

(The default value is `Log.INFO`.)

The value of `Log Level` can be one of the following:

```dart
VERBOSE = 2;
DEBUG = 3;
INFO = 4;
WARN = 5;
ERROR = 6;
ASSERT = 7;
```

### Flush all events

Using this function, you can specify whether when the application is closed, all events buffered in the device, should be sent or not:

```dart
MetrixConfig metrixConfig = new MetrixConfig(yourAppId);
metrixConfig.flushEventsOnClose = false;
Metrix.onCreate(metrixConfig);
```

(The default value is true.)

### Pre-installed trackers

If you want to use the Metrix SDK to recognize users whose devices came with your app pre-installed, open your app delegate and set the default tracker of your config. Replace `trackerToken` with the tracker token you created in dashboard. Please note that the Dashboard displays a tracker URL (including http://tracker.metrix.ir/). In your source code, you should specify only the six-character token and not the entire URL.

```dart
MetrixConfig metrixConfig = new MetrixConfig(yourAppId);
metrixConfig.trackerToken = "trackerToken";
Metrix.onCreate(metrixConfig);
```

### Sdk signature

An account manager must activate the Metrix SDK Signature.

If the SDK signature has already been enabled on your account and you have access to App Secrets in your Metrix Dashboard, please use the method below to integrate the SDK signature into your app.

An App Secret is set by calling setAppSecret on your config instance:
```dart
MetrixConfig metrixConfig = new MetrixConfig(yourAppId);
metrixConfig.setAppSecret(secretId, info1, info2, info3, info4);
Metrix.onCreate(metrixConfig);
```

### Separation based on app stores

If you want to publish your app in different stores such as Cafe Bazaar, Google Play, etc, and split the organic users by their store's source, you can use the following method:

```dart
MetrixConfig metrixConfig = new MetrixConfig(yourAppId);
metrixConfig.store = "storename";
Metrix.onCreate(metrixConfig);
```

### Metrix device identifier
For each device with your app installed on it, our backend generates a unique Metrix device identifier (known as an mxuid). In order to obtain this identifier, call the following method on the `MetrixConfig` instance:

```dart
void metrixUserId(String metrixUserId) {
  //do any thing with metrix user id
}

MetrixConfig metrixConfig = new MetrixConfig(yourAppId);
metrixConfig.userIdCallback = metrixUserId;
Metrix.onCreate(metrixConfig);
```

**Note:** You can only make this call in the Metrix SDK in v0.12.0 and above.

**Note:** Information about the adid is only available after our backend tracks the app instal. It is not possible to access the adid value before the SDK has been initialized and the installation of your app has been successfully tracked.


### Metrix session identifier
For each session, our sdk generates a unique Metrix session identifier (knowns as an mxsid). In order to obtain this identifier, call the following method on the `MetrixConfig` instance:

```dart
void metrixSessionId(String metrixSessionId) {
  //do any thing with metrix session id
}

MetrixConfig metrixConfig = new MetrixConfig(yourAppId);
metrixConfig.sessionIdCallback = metrixSessionId;
Metrix.onCreate(metrixConfig);
```

**Note:** You can only make this call in the Metrix SDK in v0.12.0 and above.

### Get User attribution

In case you want to access info about your user's current attribution when ever you need it, you can make a call to the following method of the Metrix instance:

```darts
void metrixAttribution(dynamic attributionModel) {
  //do any thing with metrix attribution model
}

MetrixConfig metrixConfig = new MetrixConfig(yourAppId);
metrixConfig.attributionCallback = metrixAttribution;
Metrix.onCreate(metrixConfig);
```

Here is a quick summary of `attributionModel` properties:

`attributionModel.acquisitionAd` : The creative/ad grouping level of the current attribution.

`attributionModel.acquisitionAdSet`: The adGroup/adSet grouping level of the current attribution.

`attributionModel.acquisitionCampaign`: The campaign grouping level of the current attribution.

`attributionModel.acquisitionSource`: The network/source grouping level of the current attribution.

`attributionModel.attributionStatus`: Specifies the status of the user in the campaign and returns only the four values below:

1. `ATTRIBUTED`
2. `NOT_ATTRIBUTED_YET`
3. `ATTRIBUTION_NOT_NEEDED`
4. `UNKNOWN`

### uninstall tracking

Metrix’s app uninstall tracking relies on silent push notifications to determine if an app is installed on a device. Developer instructions for configuring your app for uninstall tracking can be found below.

**Note:** You must configure your app for push notifications through Firebase Cloud Messaging (FCM). Google Cloud Messaging (GCM) is not supported.

#### Find your FCM legacy server key
In your Firebase console

1\. Select the settings (gear) icon > Project settings

2\. Select CLOUD MESSAGING

3\. Locate your `legacy Server key` and `sender id` token

<img src="{{ '/images/firebase-cloud-messaging.png' | relative_url }}" alt="firebase cloud messageing"/>

#### Add your FCM legacy server key and sender id to your Metrix account

In the Metrix dashboard

1\. Navigate to your app and select your app settings

2\. Select Push configuration

3\. Enter or paste your FCM legacy server key into the Legacy Server Key field and FCM sender id into Sender Id field

4\. Select Save

<img src="{{ '/images/push-configuration.png' | relative_url }}" alt="push configuration"/>

#### Find your Firebase APP ID
In your Firebase console

1\. Select the settings (gear) icon > Project settings

2\. Select General

3\. Locate your `App ID` token

<img src="{{ '/images/firebase-settings.png' | relative_url }}" alt="firebase app id"/>

4\. Configure the Metrix SDK to receive your app's push notification token

```dart
MetrixConfig metrixConfig = new MetrixConfig(yourAppId);
metrixConfig.firebaseAppId = "yourfirebase app id";
Metirx.onCreate(metrixConfig);
```

5\. Open the `mainTemplate.gradle` file of your app and find the `dependencies` block. Add the following line:

```groovy
implementation 'com.google.firebase:firebase-messaging:17.6.0'
```

**Note:** Integration with Metrix SDK 0.14.0 or above

### Custom event

You can use Metrix to track any event in your app. Suppose you want to track every tap on a button. You would have to create a new event slug in the Events Management section of your dashboard. Let's say that event slug is `abc123`. In your button's onClick method you could then add the following lines to track the click.
 Create a custom event with a specific number of attributes and metrics, for example, suppose you want to create a custom event in an online purchase program:

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
The variables for the `newEvent` method are as follows:

- **First variable:**The event slug which is a String you receive from the Metrix dashboard.

- **Second variable:** A Map `<String, String>` that specifies the attributes of an event.

- **Third variable:** A Map `<String, Double>` that contains measurable metrics.


### Specify the default attributes for user

Using this function, you can add arbitrary `Attributes` to all events of the user:

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

### Specify the default metrics for user

Using this function, you can add arbitrary `Metrics` to all events of the user:

```dart
Map<String, Double> metrics = new Map();
metrics["price"] =  100000.0;

Metrix.addUserMetrics(metrics);
```

### Track Revenue

If your users can generate revenue by tapping on advertisements or making in-app purchases, you can track those revenues too with events. You can also add an optional order ID to avoid tracking duplicate revenues. By doing so, the last ten order IDs will be remembered and revenue events with duplicate order IDs are skipped. This is especially useful for tracking in-app purchases. You can see an example below where a tap is worth 12,000 IRR:

```dart
Metrix.newRevenue("my_event_slug", 12000, 0, "{orderId}");
```

The first parameter is the slug you get from the dashboard.
The second parameter is the amount of revenue.
The third parameter is the currency of this event. If you do not set the value, Rial is be considered as default value. You can see below its values:

1. `0` Rial
2. `1` Dollars
3. `2` Euro

The fourth parameter is your order number.

## Deep linking

### Deep linking Overview

If you are using Metrix tracker URLs with deeplinking enabled, it is possible to receive information about the deeplink URL and its content. Users may interact with the URL regardless of whether they have your app installed on their device (standard deep linking scenario) or not (deferred deep linking scenario). In the standard deep linking scenario, the Android platform natively offers the possibility for you to receive deep link content information. The Android platform does not automatically support deferred deep linking scenario; in this case, the Metrix SDK offers the mechanism you need to get the information about the deep link content.

### Standard deep linking scenario

Unfortunately, in this scenario the information about the deep link can not be delivered to you in your Dart code. Once you enable your app to handle deep linking, you will get information about the deep link on native level. 

### Deferred deep linking scenario

Deferred deeplinking scenario occurs when a user clicks on an Metrix tracker URL with a `deep_link` parameter contained in it, but does not have the app installed on the device at click time. When the user clicks the URL, they will be redirected to the Play Store to download and install your app. After opening it for the first time, `deep_link` parameter content will be delivered to your app.

The Metrix SDK opens the deferred deep link by default. There is no extra configuration needed.

#### Deferred deep linking callback

If you wish to control if the Metrix SDK will open the deferred deep link, you can do it with a callback method in the config object.

```dart
void deferredDeeplink(String deeplink) {
  //do any thing with deferred deeplink
}

MetrixConfig metrixConfig = new MetrixConfig(yourAppId);
metrixConfig.lunchDeferredDeeplink = true;
metrixConfig.deferredDeeplinkCallback = deferredDeeplink;
Metrix.onCreate(metrixConfig);
```

After the Metrix SDK receives the deep link information from our backend, the SDK will deliver you its content via the delegate and expect the `boolean` set value from you. This value represents your decision on whether or not the Metrix SDK should launch the activity to which you have assigned the scheme name from the deeplink (like in the standard deeplinking scenario).

If you set `true`, we will launch it, triggering the scenario described in the Standard deep linking scenario chapter. If you do not want the SDK to launch the activity, set `false` from the `lunchDeferredDeeplink` method, and (based on the deep link content) decide on your own what to do next in your app.

### Reattribution via deeplinks

Metrix enables you to run re-engagement campaigns with deeplinks. For more information.

If you are using this feature, you need to make one additional call to the Metrix SDK in your app for us to properly reattribute your users.

Once you have received the deeplink content in your app, add a call to the `Metrix.appWillOpenUrl(Uri)` method. By making this call, the Metrix SDK will send information to the Metrix backend to check if there is any new attribution information inside of the deeplink. If your user is reattributed due to a click on the Metrix tracker URL with deeplink content.

Here's how the call to `Metrix.appWillOpenUrl(Uri)` should look:

```dart
void onDeeplink(String deeplink) {
  Metrix.appWillOpenUrl(deeplink);
}
```