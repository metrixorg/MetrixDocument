---
layout: classic-docs
title: S2S Integration
lang: en
permalink: /faq/s2s-integration/index.html
toc: true # table of contents
---

## Server-to-Server Integration (S2S)

1. This API allows you to send custom events that occur inside our outside of your app but are not sent through the Metrix SDK from your servers. To send custom events from your server, use the following API:

```js
Method: POST;

URL: "http://analytics.metrix.ir/inappevent/{appId}";
```

<br>
`appId` is the unqiue key for your app. This key can be found from . (find your app inside the apps page, right click on the menu, and copy the AppId)

```js
Path Variable:
{
	"appId": {app-id}
}
```

In order to get you `dev-key`, go to the settings page of your app and look for the "S2S Integration" sub-menu. Copy the `dev-key` from this page.
Finally, to ensure the security, please add the public ip address of your servers to the "Ip Address" field. This will make sure that requests sent from your server will be received by Metrix servers.

```js
Request Header:
{
	"Authorization":  {dev-key},
}
```

```js
Request Body:
{
  "metrixUserId": {Metrix User ID },        // e.g. 1415211453000-6513894
  "metrixSessionId": {Metrix Session ID },

  "idfa":{idfa},                            // for ios
  "advertisingId":{Google advertising id},  // for Android

  "customAttributes": {     // A JSON containing a rich in-app event value - must be String to String},
  {
    "content_type": "wallets",
    "content_id": "hrhfwbrfybwa"

  },
  "customMetrics": {        // A JSON containing a rich in-app event value - must be String to Double},
  {
    "revenue": 130.5
  },

  "deviceIp": {device IP},
  "eventSlug": {The event slug},            // e.g. "taqsq"
  "eventTime": {Event timestamp in UTC +0}, // e.g "1570274953412" timestamp in millisecond
}

```

## Parameters

All of the parameters inside the URL and Header are required and should be used in every API call.

### Required parameters

- **metrixUserId**
- **metrixSessionId**
- **advertisingId or idfa** :
  As you know, `idfa` is used for iOS devices and `advertisingId` is used by Android devices. Send S2S custom events based on the device type (iOS or Android) that the events are fired from. Filling none or both of them will cause a 400 bad request error.

* **eventSlug**
  This is the same slug created inside the Metrix dashboard for each custom event.

* **eventTime**
  The time when the event occured inside the app. If this field is not set, Metrix will set it with the receive time of the event by its servers.

### Optional Parameters

- **customAttributes**
  Use this to send custom information. Use a JSON format for your data, and all of the values should be String values.

- **customMetrics**
  Use this to send custom information. Use a JSON format for your data, and all of the values should be as Double values.
- **deviceIp**
  You can use the device ip address using this field.
