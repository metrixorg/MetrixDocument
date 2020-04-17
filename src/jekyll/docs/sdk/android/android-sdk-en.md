---
layout: classic-docs
title: SDK Android
lang: en
permalink: /sdk/android/index.html
toc: true # table of contents
---

<hr/>
<br/>
# Initial Implementation of the SDK in Your Project
<br/>
1\. Add the following library to the `dependencies` section of your application `gradle` file:

```groovy
                 implementation 'ir.metrix:metrix:0.14.8'
```

2\. You need to initialize the Metrix SDK in `onCreate` method of your `Application`. 
If you do not already have a `Application` class in your project, create this class as below:

- Create a class that inherits from the `Application` class:

<img src="https://storage.backtory.com/tapsell-server/metrix/doc/screenshots/Metrix-Application-Class.png"/>  

- Open the `AndriodManifest.xml` file and go to`<application>` tag.
- Using `Attribute` subclass, add `Application` to `AndroidManifest.xml` file:

```xml
    <application
        android:name=“.MyApplication”
        ... >

    </application>
```

<img src="https://storage.backtory.com/tapsell-server/metrix/doc/screenshots/Metrix-Application-Manifest.png">  

In `onCreate` method of your `Application` class, create an instance of `MetrixConfig` and initialize Metrix by calling `onCreate` method:

**Note:** Before calling the `onCreate` method, you can configure Metrix in the `MetrixConfig` instance according to your requirements.
Check out the [SDK Configuration](#SDK-Configuration) section for more info.

```java
import ir.metrix.sdk.Metrix;

public class MyApplication extends Application {

    @Override
    public void onCreate() {
        super.onCreate();

        MetrixConfig metrixConfig = new  MetrixConfig(this, "APP_ID");
        // set your configuration (optional)
        Metrix.onCreate(metrixConfig); // initialize the SDK
    }
}
```

Replace `APP_ID` with your application id. You can find that in your Metrix dashboard.

### About the application class and initialization in this class

Android gives developers the ability to run methods before the creation of any `activity` in the application class. Because counting the `session`, gathering `screen-flows` between `activities` and many other features of the SDK required them to work properly.

<hr/>
<br/>
# Additional Features
<br/>

## Sessions

In Metrix, a **session** is a specific timeframe during which the user interacts with the app. These sessions and the data related to them are captured by the Metrix SDK and provided to you as **events**.

### Session Identifier
For each session, our SDK generates a unique Metrix session identifier (knowns as an mxsid). You can obtain this identifier by introducing a listener in your configuration. 
Check out the [SDK Configuration](#Metrix-Session-Identifier) section for more info. 

### Current Session Number

Using this function, you can find the current session number:

```java
Metrix.getInstance().getSessionNum();
```

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

```java
Metrix.getInstance().newEvent("abc123");
```

2\. Create a custom event with a specific number of attributes and metrics, for example, suppose you want to create a custom event in an online purchase program:

```java
Map<String, String> attributes = new HashMap<>();
attributes.put("first_name", "Ali");
attributes.put("last_name", "Bagheri");
attributes.put("manufacturer", "Nike");
attributes.put("product_name", "shirt");
attributes.put("type", "sport");
attributes.put("size", "large");

Map<String, Double> metrics = new HashMap<>();
metrics.put("price", 100000);
metrics.put("purchase_time", current_time);

Metrix.getInstance().newEvent("purchase_event_slug", attributes, metrics);
```

The parameters for the `newEvent` method are as follows:

- **First variable:** The event slug which is a String you receive from the Metrix dashboard.
- **Second variable:** A `Map<String, String>` that specifies the attributes of an event.
- **Third variable:** A `Map<String, Double>` that contains measurable metrics.

#### Specify the default attributes for user

Using this function, you can add arbitrary `Attributes` to all events of the user:

```java
Map<String, String> attributes = new HashMap<>();
attributes.put("manufacturer", "Nike");
Metrix.getInstance().addUserAttributes(attributes);
```

#### Specify the default metrics for user
Using this function, you can add arbitrary `Metrics` to all events of the user:

```java
Map<String, Double> metrics = new HashMap<>();
metrics.put("purchase_time", current_time);
Metrix.getInstance().addUserMetrics(metrics);
```

### Track Revenue

If your users can generate revenue by tapping on advertisements or making in-app purchases, you can track those revenues too with events. You can also add an optional order ID to avoid tracking duplicate revenues. By doing so, the last ten order IDs will be remembered and revenue events with duplicate order IDs are skipped. This is especially useful for tracking in-app purchases. You can see an example below where a tap is worth 12,000 IRR:

```java
Metrix.getInstance().newRevenue("my_event_slug", 12000, MetrixCurrency.IRR, "{orderId}");
```

- The first parameter is the slug you get from the dashboard.
- The second parameter is the amount of revenue.
- The third parameter is the currency of this event which can be `MetrixCurrency.IRR` (Default), `MetrixCurrency.USD`, or `MetrixCurrency.EUR`. 
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

```java
metrixConfig.setFirebaseAppId("your firebase app id");
```

**Note:** Please check out the [SDK Configuration](#SDK-Configuration) section for further considerations on configuring the SDK.


## Get User Attribution

In case you want to access info about your user's current attribution when ever you need it, you can make a call to the following method of the Metrix instance:

```java
metrixConfig.setOnAttributionChangedListener(new OnAttributionChangedListener() {
    @Override
      public void onAttributionChanged(AttributionModel attributionModel) {
          //TODO
       }
    });
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

If a user has your app installed and you want it to launch after they engage with an Metrix tracker URL with the `deep_link` parameter in it, enable deeplinking in your app. This is done by choosing a desired **unique scheme name**. You'll assign it to the activity you want to launch once your app opens following a user selecting the tracker URL in the`AndroidManifest.xml` file. Add the `intent-filter` section to your desired activity definition in the manifest file and assign an `android:scheme` property value with the desired scheme name:

```xml
<activity
    android:name=".MainActivity"
    android:configChanges="orientation|keyboardHidden"
    android:label="@string/app_name"
    android:screenOrientation="portrait">

    <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>

    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data android:scheme="metrixExample" />
    </intent-filter>
</activity>
```

Deeplink content information within your desired activity is delivered via the `Intent` object, via either the activity's `onCreate` or `onNewIntent` methods. Once you've launched your app and have triggered one of these methods, you will be able to receive the actual deeplink passed in the `deep_link` parameter in the click URL. You can then use this information to conduct some additional logic in your app.

You can extract deeplink content from either two methods like so:

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

### Deferred deep linking scenario

Deferred deeplinking scenario occurs when a user clicks on a Metrix tracker URL with a `deep_link` parameter contained in it, but does not have the app installed on the device at click time. When the user clicks the URL, he/she will be redirected to the Play Store to download and install your app. After opening it for the first time, `deep_link` parameter content will be delivered to your app.

#### Deferred deep linking callback

If you wish to control if the Metrix SDK will open the deferred deep link, you can do it with a callback method in the config object.

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

After the Metrix SDK receives the deep link information from our backend, the SDK will deliver you its content via the listener and expect the `boolean` return value from you. This return value represents your decision on whether or not the Metrix SDK should launch the activity to which you have assigned the scheme name from the deeplink (like in the standard deeplinking scenario).

If you return `true`, we will launch it, triggering the scenario described in the Standard deep linking scenario chapter. If you do not want the SDK to launch the activity, return `false` from the listener, and (based on the deep link content) decide on your own what to do next in your app.

**Note:** Please check out the [SDK Configuration](#SDK-Configuration) section for further considerations on configuring the SDK.

### Reattribution via deeplinks

Metrix enables you to run re-engagement campaigns with deeplinks.

If you are using this feature, you need to make one additional call to the Metrix SDK in your app for us to properly reattribute your users.

Once you have received the deeplink content in your app, add a call to the `Metrix.getInstance().appWillOpenUrl(Uri)` method. By making this call, the Metrix SDK will send information to the Metrix backend to check if there is any new attribution information inside of the deeplink. If your user is reattributed due to a click on the Metrix tracker URL with deeplink content.

Here's how the call to `Metrix.getInstance().appWillOpenUrl(Uri)` should look:

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
# SDK Configuration
In your `Application` class, before calling `onCreate` method to initialize Metrix, you can configure Metrix SDK by introducing different configurations to your `MetrixConfig` instance, calling available methods in the class. See the sample below:

```java
MetrixConfig metrixConfig = new MetrixConfig(context, "APP_ID");

// Setting your configuration 

Metrix.onCreate(metrixConfig); // initializing the SDK
```

Available configurations can be found below:

### Enable location listening

Using the following method, you can inform Metrix that you wish to send information about the location of the user.

```java
metrixConfig.setLocationListening(isLocationListeningEnable);
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

```java
metrixConfig.setEventUploadThreshold(50);
```

The default value is 30 events.

### Limitation in number of events to send per request

Using this method, you can specify the maximum number of out-going events per request:

```java
metrixConfig.setEventUploadMaxBatchSize(100);
```

The default value is 100 events.

### Limitation in number of events to buffer on the device

Using the following method, you can specify the maximum number of events that are buffered in the SDK (for example, if the user's device loses internet connection, the events will be buffered in the library until there is a chance to send the events and empty the buffer) and if the number of buffered events in the library passes this amount, old events are destroyed by SDK to make space for new events:

```java
metrixConfig.setEventMaxCount(1000);
```

The default value is 1000 events.

### The time interval for sending events

By using this method, you can specify the timeout period of requests for sending events:

```java
Metrix.onCreate(metrixConfig);
```

The default value is 30 seconds.

### The session timeout

Using this function, you can specify the limit of session length in your application in unit of milliseconds. For example, if this value is 10,000 and the user interacts with the application for 70 seconds, Metrix calculates this interaction as seven sessions.

```java
metrixConfig.setSessionTimeoutMillis(1800000);
```

The default value is 30 minutes.

### Enable the process of storing the user flow

Using this method, you can inform Metrix to gather information about user's flow in each `Activity`/`Fragment` and these details should be stored automatically:

```java
metrixConfig.setScreenFlowsAutoFill(true);
```

The default value is false.

### Pre-installed trackers

If you want to use the Metrix SDK to recognize users whose devices came with your app pre-installed, open your app delegate and set the default tracker of your config. Replace `trackerToken` with the tracker token you created in the dashboard. Please note that the Dashboard displays a tracker URL (including http://tracker.metrix.ir/). In your source code, you should specify only the six-character token and not the entire URL.

```java
metrixConfig.setDefaultTrackerToken(trackerToken);
```

### SDK Signature

If the SDK signature has already been enabled on your account and you have access to App Secrets in your Metrix Dashboard, please use the method below to integrate the SDK signature into your app.

An App Secret is set by calling setAppSecret on your config instance:
```java
metrixConfig.setAppSecret(secretId, info1, info2, info3, info4);
```

### Separation based on app stores

If you want to publish your app in different stores such as Cafe Bazaar, Google Play, etc, and split the organic users by their store's source, you can use the following method:

```java
metrixConfig.setStore("store name");
```

### Metrix device identifier
For each device with your app installed on, our backend generates a unique Metrix device identifier (known as an mxuid). You can obtain this identifier using the following method.

```java
metrixConfig.setOnReceiveUserIdListener(new OnReceiveUserIdListener() {
            @Override
            public void onReceiveUserId(String metrixUserId) {
            sendToyourApi(metrixUserId);    
            }
        });
```

**Note:** Information about the adId is only available after our backend tracks the app installation. It is not possible to access the adId value before the SDK has been initialized and the installation of your app has been successfully tracked.


### Metrix Session Identifier
For each session, our sdk generates a unique Metrix session identifier (knowns as an mxsid). In order to obtain this identifier, call the following method on the `MetrixConfig` instance:

```java
metrixConfig.setOnSessionIdListener(new OnSessionIdListener() {
            @Override
            public void onReceiveSessionId(String sessionId) {
            sendToyourApi(sessionId);    
            }
        });
```