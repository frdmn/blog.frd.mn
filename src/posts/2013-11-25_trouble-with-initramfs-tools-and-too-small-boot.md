---
title: "Trouble with initramfs-tools and small /boot partition"
date: 2013-11-25T12:09:17.753Z
disqus_id: 12
slug: trouble-with-initramfs-tools-and-too-small-boot
---

The last days I had to fight with Ubuntus new kernels and a stingy `/boot` partition. Since years, I am used to allocate about 150 MBs for that partition, so you have enough space for about 3-4 kernels.

There is no automatic cleanup so you either need to tidy up to make sure you have enough space for further kernels or you expand your partition with a partition manager of your choice. If you don't do that, you probably run into a problem like I did.

# Story so far

* `aptitude update` came up with a new kernel which I tried to install
* `/boot` partititon too small
* `aptitude` failed with a "No space left on device" kinda error
* `/boot` partition manually expanded
* New kernel via `aptitude upgrade` installed
* Error with `initramfs-tools`

Currently I stuck with this:

```shell
$ aptitude upgrade
```

> ```shell
> [...]
>     Traceback (most recent call last):
>   File "/usr/bin/apt-listchanges", line 237, in <module>
>     main()
>   File "/usr/bin/apt-listchanges", line 48, in main
>     debs = apt_listchanges.read_apt_pipeline(config)
>   File "/usr/share/apt-listchanges/apt_listchanges.py", line 83, in read_apt_pipeline
>     return map(lambda pkg: filenames[pkg], order)
>   File "/usr/share/apt-listchanges/apt_listchanges.py", line 83, in <lambda>
>     return map(lambda pkg: filenames[pkg], order)
> KeyError: 'initramfs-tools'
> dpkg: dependency problems prevent configuration of initramfs-tools:
>  initramfs-tools depends on initramfs-tools-bin (<< 0.99ubuntu13.1.1~); however:
>   Version of initramfs-tools-bin on system is 0.99ubuntu13.4.
> dpkg: error processing initramfs-tools (--configure):
> [...]
> Errors were encountered while processing:
>  initramfs-tools
>  apparmor
> ```

I did a some [research on StackOverflow](http://askubuntu.com/questions/252777/how-can-i-resolve-dpkg-dependency) but none of suggested solutions worked out for me. In the end [`#ubuntu`](http://www.ubuntu.com/support/community/chat) gave me a hint to manually install the downloaded packages via `dpkg`:

```shell
cd /var/cache/apt/archives
dpkg -i initramfs-tools_0.99ubuntu13.4_all.deb
dpkg -i initramfs-tools-bin_0.99ubuntu13.4_amd64.deb
aptitude upgrade
```

# Remove unused kernels

Here is an easy way to remove available (and unused) kernels on your system. Verify your current kernel:

```shell
$ uname -r
```

> ```
> 3.5.0-37-generic
> ```

And list the unused ones:

```shell
$ dpkg --get-selections|grep 'linux-image*'|awk '{print $1}'|egrep -v "linux-image-$(uname -r)"
```

> ```shell
> linux-image-3.5.0-23-generic
> linux-image-3.5.0-27-generic
> ```

You can finally purge them with:

```shell
$ apt-get purge linux-image-3.5.0-23-generic linux-image-3.5.0-27-generic
```
