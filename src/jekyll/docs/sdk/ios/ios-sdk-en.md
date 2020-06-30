---
layout: classic-docs
title: SDK iOS
lang: en
permalink: /sdk/ios/index.html
toc: true # table of contents
---

## Basic integration

### Add SDK to your project

If you're using [CocoaPods](https://cocoapods.org), you can add the following line to your Podfile:

```ruby
pod 'MetrixSdk', '>= 1.2.2', '< 2.0'
```

You can also choose to integrate the Metrix SDK by adding it to your project as a framework.

Download from [here](https://github.com/metrixorg/MetrixSDK-iOS).

Since the release of iOS 8, Apple has introduced dynamic frameworks (also known as embedded frameworks). If your app is targeting iOS 8 or higher, you can use the Mertix SDK dynamic framework. Choose which framework you want to use – static or dynamic – and add it to your project.

### Add iOS frameworks

- Select your project in the Project Navigator
- In the left-hand side of the main view, select your target
- In the Build Phases tab, expand the Link Binary with Libraries group
- At the bottom of that section, select the + button
- Select the AdSupport.framework, iAd.framework and CoreTelephony.framework
- Change the Status of the frameworks to Optional

### Integrate the SDK into your app

You should use following import statement.

```objc
#import <MetrixSdk/Metrix.h>
```

### Basic setup

In the Project Navigator, open the source file of your application delegate. Add the import statement at the top of the file, then add the following call to Metrix in the didFinishLaunching or didFinishLaunchingWithOptions method of your app delegate:

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

**Note**: Initializing the Metrix SDK like this is very important. Otherwise, you may encounter different kinds of issues.
Replace {YourAppToken} with your Metrix app Id.
Depending on whether you build your app for testing or for production, you must set environment with one of these values:

```objc
NSString *environment = MXEnvironmentSandbox;
NSString *environment = MXEnvironmentProduction;
```

## Additional features

Once you integrate the Metrix SDK into your project, you can take advantage of the following features.

## Event tracking

You can use Metrix to track events. You should create a new custom event in your dashboard and use its slug as an event name in SDK. First you should create a custom event.

```objc
MXCustomEvent *event = [MXCustomEvent newEvent:@"mySlug" attributes:myAttributes metrics:myMetrics];
[Metrix trackCustomEvent:event];
```

For a custom event, you can make as many attributes or metrics for your specific scenario. For example, suppose you want to create a custom event in an online shopping application

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

## Revenue Tracking

You can use Metrix to track events. You would create a new event in your dashboard and use its slug as an event name in SDK.

You can call this function as following:

create a custom event that has just one slug (which you get from Metrix dashboard)

```objc
#import <MetrixSdk/MXCurrency.h>

[Metrix trackRevenue:@"mySlug" withValue:@12000 currency:IRR orderId:@"myOrderId"];
```

The first parameter is the slug that you get from dashboard.

The second one is a value, which is the revenue amount.

The third parameter is the currency of this revenue.

The fourth parameter (optional) can be your order number.

## Tracking user flow

You can track your user journey with metrix in your app. To do this, you should call the following method upon entering each page (in viewWillAppear or in viewDidApear)

```objc
[Metrix trackScreen:@"HomePage"];
```

## Device ID

The Metrix SDK provides access to some device IDs.

### Ad ID

Certain services (such as Google Analytics) require you to coordinate device and client IDs in order to prevent duplicate reporting.

To obtain the device identifier IDFA, call the function

```objc
NSString *idfa = [Metrix idfa];
```

### Metrix device identifier

For each device with your app installed, Metrix backend generates unique Metrix device identifier (mxid). In order to obtain this identifier, you can make a call to the following method on the Metrix instance:

```objc
NSString *mxid = [Metrix mxid];
```

## Pre-install trackers

Applying this function, you can set a default tracker for all events using a `trackerToken` you receive from the panel. Open your app delegate and set the `trackerToken` for `MXConfig`

```objc
MXConfig *metrixConfig = [MXConfig configWithAppId:yourAppId environment:environment];
[metrixConfig setTrackerToken:@"{TrackerToken}"];
[Metrix appDidLaunch:metrixConfig];
```

After running the app you should see a line like the following in XCode:

```objc
Tracker token: 'abc123'
```
### Get Attribution Info
You can register a delegate callback to be notified of tracker attribution changes. Due to the different sources considered for attribution, this information can not be provided synchronously. Follow these steps to implement the optional delegate protocol in your app delegate:
1. Open `AppDelegate.h` and add the import and the `MetrixDelegate` declaration.

    ```objc
    @interface AppDelegate : UIResponder <UIApplicationDelegate, MetrixDelegate>
    ```

2. Open `AppDelegate.m` and add the following delegate callback function to your app delegate implementation.

    ```objc
    - (void)metrixAttributionChanged:(MXAttribution *)attribution {
    }
    ```

3. Set the delegate with your `MXConfig` instance:

    ```objc
    [metrixConfig setDelegate:self];
    ```

As the delegate callback is configured using the `MXConfig` instance, you should call `setDelegate` before calling `[Metrix appDidLaunch:metrix
Config]`.

The delegate function will be called after the SDK receives the final attribution data. Within the delegate function you have access to the `attribution` parameter. Here is a quick summary of its properties:
- `NSString trackerToken` the tracker token of the current attribution.
- `NSString acquisitionSource` the network grouping level of the current attribution.
- `NSString acquisitionCampaign` the campaign grouping level of the current attribution.
- `NSString acquisitionAdSet` the ad group grouping level of the current attribution.
- `NSString acquisitionAd` the creative grouping level of the current attribution.
- `NSString attributionStatus` the status of the current attribution.

`attributionStatus` has one of the values below:
- `ATTRIBUTED`
- `NOT_ATTRIBUTED_YET`
- `ATTRIBUTION_NOT_NEEDED`
- `UNKNOWN`

Then you can request for attribution info:
```objc
    [Metrix requestAttribution];
```

### Metrix Session Identifier
For each session, our SDK generates a unique Metrix session identifier. Follow these steps to implement the optional delegate protocol in your app delegate:
1. Open `AppDelegate.h` and add the import and the `MetrixDelegate` declaration.

```objc
    @interface AppDelegate : UIResponder <UIApplicationDelegate, MetrixDelegate>
```

2. Open `AppDelegate.m` and add the following delegate callback function to your app delegate implementation.

```objc
    - (void)metrixSessionIdChanged:(NSString *)sessionId {
    }
```

3. Set the delegate with your `MXConfig` instance:

```objc
    [metrixConfig setDelegate:self];
```

As the delegate callback is configured using the `MXConfig` instance, you should call `setDelegate` before calling `[Metrix appDidLaunch:metrix
Config]`.
