---
title: "\"The CentOS disc was not found in any of your drives\""
date: 2013-10-22T10:00:00.000Z
disqus_id: 8
slug: the-centos-disc-was-not-found-in-any-of-your-drives
---

I had to install several CentOS 6 virtual machines via the minimal installation image in the last few months and for some reason, I ran into a slightly weird problem during the installations.

The assistent wants you to check the installation medium of CentOS. Doesn't sound that bad and it is focused by default, so I thought there no need to eschew this. Unfortunately as soon as you do the media check and try to continue with the installation, the following error message appears:

![CentOS media check error](/assets/images/posts/the-centos-disc-was-not-found-in-any-of-your-drives/1.png)

There is an easy workaround for this, just skip the media check and the installation wizard should continue the installation like as planned.

![CentOS media check solution](/assets/images/posts/the-centos-disc-was-not-found-in-any-of-your-drives/2.png)

This problem/bug exists since CentOS 5 and also in several [RHEL releases](https://bugzilla.redhat.com/show_bug.cgi?id=470033).
