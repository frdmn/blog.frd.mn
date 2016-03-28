---
title: "iOS 9 / Xcode 7 and \"Untrusted Developer\" message"
date: 2015-09-22T17:40:00.000Z
pageColor: red
slug: ios-9-and-untrusted-developer-message
---

You might have heard that you are allowed to deploy applications to your physical iOS device since iOS 9 even if you don't participate in Apple's developer programm. If you [managed to compile and transfer it to your phone](http://bouk.co/blog/sideload-iphone/), you probably still stuck with the following message as soon as you try to open the app:

![](http://up.frd.mn/tMj9A.jpg)

To make this work, you need to trust the corresponding developer profile in your Settings → Profiles:

![](http://up.frd.mn/JVblA.jpg)

I wasn't really aware of this and it took me quite some time to find out about this option.
