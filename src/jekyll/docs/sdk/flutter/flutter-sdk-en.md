---
layout: classic-docs
title: SDK Flutter
lang: en
permalink: /sdk/flutter/index.html
toc: true # table of contents
---

[![pub package](https://img.shields.io/pub/v/metrix.svg)](https://pub.dartlang.org/packages/metrix)

<hr/>
<br/>
# Initial Implementation of the SDK in Your Project
<br/>

1\. To use this plugin, add `metrix` as a [dependency in your pubspec.yaml file](https://flutter.io/platform-plugins/).

## Android

2\. In `initState` method of your `State` class, create an instance of `MetrixConfig` and initialize Metrix by calling `onCreate` method:

**Note:** Before calling the `onCreate` method, you can configure Metrix in the `MetrixConfig` instance according to your requirements.
Check out the [SDK Configuration](#SDK-Configuration) section for more info.

```dart
import 'package:metrix/metrix.dart';
import 'package:metrix/metrixConfig.dart';

class _MyAppState extends State<MyApp> {

  @override
  void initState() {
    super.initState();

    MetrixConfig metrixConfig = new MetrixConfig("APP_ID");
    // set your configuration
    Metrix.onCreate(metrixConfig); // initialize the SDK
  }
}
```

Replace `APP_ID` with your application id. You can find that in your Metrix dashboard.

<hr/>
<br/>
# Additional Features
<br/>

## Sessions

In Metrix, a **session** is a specific timeframe during which the user interacts with the app. These sessions and the data related to them are captured by the Metrix SDK and provided to you as **events**.

### Session Identifier
For each session, our SDK generates a unique Metrix session identifier (knowns as an mxsid). You can obtain this identifier by introducing a listener in your configuration. 
Check out the [SDK Configuration](#Metrix-Session-Identifier) section for more info. 

<br/>
## Event

Each interaction that the user has with your application can be introduced as an **event** in your dashboard and application in order for Metrix to collect and present its statistics. 

There are four types of events in Metrix:

- **Session Start:** The time at which a session starts.
- **Session Stop:** The time at which a session ends.
- **Custom:** Depending on your application logic and the interaction that the user has with your app, you can create and send custom events.
- **Revenue:** A special type of custom events you can specify for tracking your application revenue.

### Custom Events

You can use Metrix to track any event in your app. Suppose you want to track every tap on a button. You would have to create a new event slug in the Events Management section of your dashboard. Let's say that event slug is `abc123`. In your button's onClick method you could then add the following lines to track the click.

You can call this function in two ways:

1\. Make a custom event that has only one specified name:

```dart
Metrix.newEvent('my_event_slug',null,null);
```
2\. Create a custom event with a specific number of attributes and metrics, for example, suppose you want to create a custom event in an online purchase program:

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
The parameters for the `newEvent` method are as follows:

- **First variable:** The event slug which is a String you receive from the Metrix dashboard.
- **Second variable:** A `Map<String, String>` that specifies the attributes of an event.
- **Third variable:** A `Map<String, Double>` that contains measurable metrics.

**Note:** Every event can have up to 50 attributes unique to that event with each attribute having a limit of 512 bytes in key and 512 bytes in value.

#### Specify the default attributes for user

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

**Note:** Every event can have up to 50 attributes unique to that event with each attribute having a limit of 512 bytes in key and 512 bytes in value.

#### Specify the default metrics for user
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

- The first parameter is the slug you get from the dashboard.
- The second parameter is the amount of revenue.
- The third parameter is the currency of this event which can be `0` (Rial), `1` (Dollar), or `2` (Euro). Rial is considered as the default value. 
- The fourth parameter is your order number (optional).

<br/>
## Device Identifier
For each device with your app installed on, our backend generates a unique Metrix device identifier (known as an mxuid). You can obtain this identifier by introducing a listener in your configuration. 
Check out the [SDK Configuration](#Metrix-Device-Identifier) section for more info. 

<br/>
## Signature

An account manager must activate the Metrix SDK Signature.

If the SDK signature has already been enabled on your account and you have access to App Secrets in your Metrix Dashboard, you should set the secrets in your application. 
Check out the [SDK Configuration](#SDK-Signature) section for more info. 

<br/>
## Uninstall Tracking

Metrix’s app uninstall tracking relies on silent push notifications to determine if an app is installed on a device. 

**Note:** You must configure your app for push notifications through Firebase Cloud Messaging (FCM). Google Cloud Messaging (GCM) is not supported.

Developer instructions for configuring your app for uninstall tracking can be found below.

- Find your FCM server key

In your Firebase console, select the settings (gear) icon > Project settings. Select CLOUD MESSAGING and locate your `Server key` and `sender id` token.

<img src="{{ '/images/firebase-cloud-messaging.png' | relative_url }}" alt="firebase cloud messageing"/>

- Add your FCM server key and sender id to your Metrix account

In the Metrix dashboard, navigate to your app and select your app settings. Select Push configuration and enter or paste your FCM server key into the Server Key field and FCM sender id into Sender Id field. Select Save.

<img src="{{ '/images/push-configuration.png' | relative_url }}" alt="push configuration"/>

- Find your Firebase APP ID

In your Firebase console, select the settings (gear) icon > Project settings. Select General and locate your `App ID` token.

<img src="{{ '/images/firebase-settings.png' | relative_url }}" alt="firebase app id"/>

- Configure the Metrix SDK to receive your app's push notification token

```dart
metrixConfig.firebaseAppId = "yourfirebase app id";
```

**Note:** Please check out the [SDK Configuration](#SDK-Configuration) section for further considerations on configuring the SDK.

- Add this dependency to your `app/build.gradle` file:

```groovy
implementation 'com.google.firebase:firebase-messaging:18.0.0'
```

## Get User Attribution

In case you want to access info about your user's current attribution when ever you need it, you can make a call to the following method of the Metrix instance:

```darts
void metrixAttribution(dynamic attributionModel) {
  //do any thing with metrix attribution model
}

metrixConfig.attributionCallback = metrixAttribution;
```

Here is a quick summary of `AttributionModel` properties:

`attributionModel.getAcquisitionAd()`: The creative/ad grouping level of the current attribution.

`attributionModel.getAcquisitionAdSet()`: The adGroup/adSet grouping level of the current attribution.

`attributionModel.getAcquisitionCampaign()`: The campaign grouping level of the current attribution.

`attributionModel.getAcquisitionSource()`: The network/source grouping level of the current attribution.

`attributionModel.getAttributionStatus()`: Specifies the status of the user in the campaign.

`AttributionStatus` has one of the values below:
- `ATTRIBUTED`
- `NOT_ATTRIBUTED_YET`
- `ATTRIBUTION_NOT_NEEDED`
- `UNKNOWN`

**Note:** Please check out the [SDK Configuration](#SDK-Configuration) section for further considerations on configuring the SDK.

<br/>
## Deep Linking

If you are using Metrix tracker URLs with deeplinking enabled, it is possible to receive information about the deeplink URL and its content. Users may interact with the URL regardless of whether they have your app installed on their device (standard deep linking scenario) or not (deferred deep linking scenario). In the standard deep linking scenario, the Android platform natively offers the possibility for you to receive deep link content information. The Android platform does not automatically support deferred deep linking scenario; in this case, the Metrix SDK offers the mechanism you need to get the information about the deep link content.

### Standard deep linking scenario

Unfortunately, in this scenario the information about the deep link can not be delivered to you in your Dart code. Once you enable your app to handle deep linking, you will get information about the deep link on native level. 

### Deferred deep linking scenario

Deferred deeplinking scenario occurs when a user clicks on a Metrix tracker URL with a `deep_link` parameter contained in it, but does not have the app installed on the device at click time. When the user clicks the URL, he/she will be redirected to the Play Store to download and install your app. After opening it for the first time, `deep_link` parameter content will be delivered to your app.

#### Deferred deep linking callback

If you wish to control if the Metrix SDK will open the deferred deep link, you can do it with a callback method in the config object.

```dart
void deferredDeeplink(String deeplink) {
  //do any thing with deferred deeplink
}

metrixConfig.lunchDeferredDeeplink = true;
metrixConfig.deferredDeeplinkCallback = deferredDeeplink;
```

After the Metrix SDK receives the deep link information from our backend, the SDK will deliver you its content via the listener and expect the `boolean` return value from you. This return value represents your decision on whether or not the Metrix SDK should launch the activity to which you have assigned the scheme name from the deeplink (like in the standard deeplinking scenario).

If you return `true`, we will launch it, triggering the scenario described in the Standard deep linking scenario chapter. If you do not want the SDK to launch the activity, return `false` from the listener, and (based on the deep link content) decide on your own what to do next in your app.

**Note:** Please check out the [SDK Configuration](#SDK-Configuration) section for further considerations on configuring the SDK.

### Reattribution via deeplinks

Metrix enables you to run re-engagement campaigns with deeplinks.

If you are using this feature, you need to make one additional call to the Metrix SDK in your app for us to properly reattribute your users.

Once you have received the deeplink content in your app, add a call to the `Metrix.appWillOpenUrl(Uri)` method. By making this call, the Metrix SDK will send information to the Metrix backend to check if there is any new attribution information inside of the deeplink. If your user is reattributed due to a click on the Metrix tracker URL with deeplink content.

Here's how the call to `Metrix.appWillOpenUrl(Uri)` should look:

```dart
void onDeeplink(String deeplink) {
  Metrix.appWillOpenUrl(deeplink);
}
```

<hr/>
<br/>
# SDK Configuration
In your `Application` class, before calling `onCreate` method to initialize Metrix, you can configure Metrix SDK by introducing different configurations to your `MetrixConfig` instance, calling available methods in the class. See the sample below:

```dart
import 'package:metrix/metrix.dart';

class _MyAppState extends State<MyApp> {

  @override
  void initState() {
    super.initState();

    MetrixConfig metrixConfig = new MetrixConfig("APP_ID");

    // Setting your configuration
    
    Metrix.onCreate(metrixConfig); // initializing the SDK
  }
}
```

Available configurations can be found below:

### Enable location listening

Using the following method, you can inform Metrix that you wish to send information about the location of the user.

```dart
metrixConfig.locationListening = locationListening;
```

**Note:** In order for these methods to work properly, your app must be granted location permissions by the user.
Add one of the following permissions to your `AndroidManifest.xml` file.

```xml
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```
You should be informed that as of Android 6.0 (API level 23), permissions should be asked and granted at runtime as well.

### Limitation in number of events to upload

Using the following method, you can specify that each time the number of your buffered events reaches the threshold, the Metrix SDK should send them to the server:

```dart
metrixConfig.eventUploadThreshold = 50;
```

The default value is 30 events.

### Limitation in number of events to send per request

Using this method, you can specify the maximum number of out-going events per request:

```dart
metrixConfig.eventUploadMaxBatchSize = 100;
```

The default value is 100 events.

### Limitation in number of events to buffer on the device

Using the following method, you can specify the maximum number of events that are buffered in the SDK (for example, if the user's device loses internet connection, the events will be buffered in the library until there is a chance to send the events and empty the buffer) and if the number of buffered events in the library passes this amount, old events are destroyed by SDK to make space for new events:

```dart
metrixConfig.eventMaxCount = 1000;
```

The default value is 1000 events.

### The time interval for sending events

By using this method, you can specify the timeout period of requests for sending events:

```dart
metrixConfig.eventUploadPeriodMillis = 30000;
```

The default value is 30 seconds.

### The session timeout

Using this function, you can specify the limit of session length in your application in unit of milliseconds. For example, if this value is 10,000 and the user interacts with the application for 70 seconds, Metrix calculates this interaction as seven sessions.

```dart
metrixConfig.sessionTimeoutMillis = 1800000;
```

The default value is 30 minutes.

### Pre-installed trackers

If you want to use the Metrix SDK to recognize users whose installation has not been triggered by an ad click, set the default tracker in your config using the method below. Replace `trackerToken` with the tracker token you created in the dashboard.

```dart
metrixConfig.trackerToken = "trackerToken";
```

### SDK Signature

If the SDK signature has already been enabled on your account and you have access to App Secrets in your Metrix Dashboard, please use the method below to integrate the SDK signature into your app.

An App Secret is set by calling setAppSecret on your config instance:

```dart
metrixConfig.setAppSecret(secretId, info1, info2, info3, info4);
```

### Separation based on app stores

If you want to publish your app in different stores such as Cafe Bazaar, Google Play, etc, and split the organic users by their store's source, you can use the following method:

```dart
metrixConfig.store = "storename";
```

### Metrix device identifier
For each device with your app installed on, our backend generates a unique Metrix device identifier (known as an mxuid). You can obtain this identifier using the following method.

```dart
void metrixUserId(String metrixUserId) {
  //do any thing with metrix user id
}

metrixConfig.userIdCallback = metrixUserId;
```

**Note:** Information about the adId is only available after our backend tracks the app installation. It is not possible to access the adId value before the SDK has been initialized and the installation of your app has been successfully tracked.


### Metrix Session Identifier
For each session, our sdk generates a unique Metrix session identifier (knowns as an mxsid). In order to obtain this identifier, call the following method on the `MetrixConfig` instance:

```dart
void metrixSessionId(String metrixSessionId) {
  //do any thing with metrix session id
}

metrixConfig.sessionIdCallback = metrixSessionId;
```