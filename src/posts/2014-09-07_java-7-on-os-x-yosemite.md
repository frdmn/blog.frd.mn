---
title: "Java 7 on OS X Yosemite"
date: 2014-09-07T17:04:26.577Z
pageColor: green
disqus_id: 17
slug: java-7-on-os-x-yosemite
---

If you want to install Java 7 on OS X 10.10 you probably already came across this annoying message:

![](/assets/images/posts/java-7-on-os-x-yosemite/1.png)

There is an easy way to fix this while customizing the installer and disabling the OS version check. Here's how to do so:

1. Download the latest [Java 7 dmg from Oracle](http://www.oracle.com/technetwork/java/javase/downloads/index.html).
2. Open and mount the downloaded image
3. Open a new window in the Terminal.app
4. Based on the downloaded version adjust the varibale below which will help us during the following customization:
  `JAVABUILD="67"`
5. Unpack the installer:
  `pkgutil --expand "/Volumes/JDK 7 Update ${JAVABUILD}/JDK 7 Update ${JAVABUILD}.pkg" "/tmp/JDK 7 Update ${JAVABUILD}.unpkg"`
6. Remove the OS version check in the `Distribution` file:
  `sed -i '' 's/<installation-check script="pm_install_check();"\/>//g' "/tmp/JDK 7 Update ${JAVABUILD}.unpkg/Distribution"`
7. Rebuild the customized image:
  `pkgutil --flatten "/tmp/JDK 7 Update ${JAVABUILD}.unpkg" "/tmp/JDK 7 Update ${JAVABUILD}.pkg"`
8. Open the image:
  `open "/tmp/JDK 7 Update ${JAVABUILD}.pkg"`

Voilà!
