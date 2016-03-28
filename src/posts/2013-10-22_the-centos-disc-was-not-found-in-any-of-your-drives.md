---
title: "\"The CentOS disc was not found in any of your drives\""
date: 2013-10-22T10:00:00.000Z
pageColor: pink
slug: the-centos-disc-was-not-found-in-any-of-your-drives
---

I had to install several CentOS 6 virtual machines via the minimal installation image in the past time and ran into a slightly weird problem during the installation. 

The assistent wants you to check the installation medium of CentOS. Doesn't sound that bad and it is focused by default, so i thought there no need to eschew this. Unfortunately as soon as you do the media check and try to continue with the installation, the following error message appears:

![CentOS media check error](/content/images/2013/Oct/5_1.png)

There is an easy workaround for this, just skip the media check and the installation wizard should continue the installation like as planned.

![CentOS media check solution](/content/images/2013/Oct/5_2.png)

This problem/bug exists since CentOS 5 and also in several [RHEL releases](https://bugzilla.redhat.com/show_bug.cgi?id=470033).
