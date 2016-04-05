---
title: "Chrooted SFTP environment"
date: 2014-02-06T18:49:47.795Z
disqus_id: 14
slug: chrooted-sftp-environment
---

Today I had to struggle with a weird chroot / SFTP problem. I am actually familiar with those environments because I've set them up several times before, so I couldn't really explain what the fuck was going on at first.

The issue was, that you were not able to create a folder inside the chroot, as long as you didnt create a file before (o_O). After you created a file, you could create directories as well. If you didn't done that, you were greeted with the following error message by the `sftp` binary:

```
Couldn't create directory: Failure
```

After googleing quite a time and asking some co-workers which were clueless as well, I started comparing specs with a server that has a working chroot environment. Same architecture, same operating system (Ubuntu 12.04 LTS), same OpenSSH version and of course the same `/etc/ssh/sshd_config` parameters as well.

I got tired of the problem, and thought: "Okay, lets try again tomorrow. You're probably just exhausted and missing something essential".

I proceeded with `aptitude` updates and saw there's a new kernel update available as well. `aptitude` installed all it's updates and asked me to reboot the machine to boot from the newly installed kernel. After doing the reboot I gave `sftp` another shot and well, well, well. It was working.

![wat](/assets/images/posts/chrooted-sftp-environment/1.gif)

I still can't explain the origin of the problem, but in case you stumble upon such an error message while using SFTP with a chroot, just try:

```shell
reboot
```
