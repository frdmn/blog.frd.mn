---
title: "iOS / Xcode and \"Untrusted Developer\""
date: 2015-09-22T17:40:00.000Z
disqus_id: 23
slug: ios-9-and-untrusted-developer-message
---

You might have heard that since iOS 9 you are allowed to deploy self-made applications to your physical iOS device, without even participating in Apple's developer program. If you [managed to compile and transfer the app to your phone](http://bouk.co/blog/sideload-iphone/), iOS will probably display the following error message if this is the first time you're deploying an application:

![](/assets/images/posts/ios-9-and-untrusted-developer-message/1.jpg)

To make this work, you need to trust the developer profile (which is the Apple ID that was used to sign your compiled app) via `Settings` → `General` → `Profile`:

![](/assets/images/posts/ios-9-and-untrusted-developer-message/2.jpg)
