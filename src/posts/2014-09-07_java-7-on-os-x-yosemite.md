---
title: "Java 7 on OS X Yosemite"
date: 2014-09-07T17:04:26.577Z
disqus_id: 17
slug: java-7-on-os-x-yosemite
---

If you ever tried to install Java 7 on Mac OS X 10.10, you probably already came across this annoying error message as soon as you open the installer: "Java from Oracle requires Mac OS X 10.7.3".

![](/assets/images/posts/java-7-on-os-x-yosemite/1.png)

There is an easy way to fix this though. You can easily open the installer and fix the OS version check so it allows installations again on 10.10. Here's what you need to do:

1. Download the latest [Java 7 .dmg from Oracle](http://www.oracle.com/technetwork/java/javase/downloads/index.html).
2. Open and mount the downloaded image
3. Open a new window in the Terminal.app
4. Based on the downloaded version adjust the variable below which will help us during the following customization:
  `JAVABUILD="67"`
5. Unpack the installer:

  ```shell
  pkgutil --expand "/Volumes/JDK 7 Update ${JAVABUILD}/JDK 7 Update ${JAVABUILD}.pkg" "/tmp/JDK 7 Update ${JAVABUILD}.unpkg"
  ```

6. Remove the OS version check in the `Distribution` file:

  ```shell
  sed -i '' 's/<installation-check script="pm_install_check();"\/>//g' "/tmp/JDK 7 Update ${JAVABUILD}.unpkg/Distribution"
  ```

7. Rebuild the customized image:

  ```shell
  pkgutil --flatten "/tmp/JDK 7 Update ${JAVABUILD}.unpkg" "/tmp/JDK 7 Update ${JAVABUILD}.pkg"
  ```

8. Open the image:

  ```shell
  open "/tmp/JDK 7 Update ${JAVABUILD}.pkg"
  ```

Voilà!
