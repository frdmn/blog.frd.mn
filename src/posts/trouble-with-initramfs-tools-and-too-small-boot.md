---
title: "Trouble with initramfs-tools and too small /boot"
date: 2013-11-25T12:09:17.753Z
pageColor: blue
slug: trouble-with-initramfs-tools-and-too-small-boot
---

The last days I had to struggle with Ubuntus new kernels and a too small `/boot` partition. I am used to allocate 150 MBs for that partition, so you have space for about 3-4 kernels. 

There is no automatic cleanup so you either need to tidy up to make sure you have enough space for further kernels or you expand your partion with a partition manager of your choise. If you don't do that, you probably run into a problem like I did. 

# Story so far


* `aptitude update` came up with a new kernel which I tried to install
* `/boot` partiton too small
* `aptitude` failed with a "No space left on device" kinda error
* `/boot` partition manually expanded 
* New kernel via `aptitude upgrade` installed
* Error with `initramfs-tools`

Currently I stuck with this:

    root@e1:~# aptitude upgrade
    [...]
        Traceback (most recent call last):
      File "/usr/bin/apt-listchanges", line 237, in <module>
        main()
      File "/usr/bin/apt-listchanges", line 48, in main
        debs = apt_listchanges.read_apt_pipeline(config)
      File "/usr/share/apt-listchanges/apt_listchanges.py", line 83, in read_apt_pipeline
        return map(lambda pkg: filenames[pkg], order)
      File "/usr/share/apt-listchanges/apt_listchanges.py", line 83, in <lambda>
        return map(lambda pkg: filenames[pkg], order)
    KeyError: 'initramfs-tools'
    dpkg: dependency problems prevent configuration of initramfs-tools:
     initramfs-tools depends on initramfs-tools-bin (<< 0.99ubuntu13.1.1~); however:
      Version of initramfs-tools-bin on system is 0.99ubuntu13.4.
    dpkg: error processing initramfs-tools (--configure):
    [...]
    Errors were encountered while processing:
     initramfs-tools
     apparmor
     
I did a quite bit of [research on StackOverflow](http://askubuntu.com/questions/252777/how-can-i-resolve-dpkg-dependency) but none of this worked out for me. In the end [`#ubuntu`](http://www.ubuntu.com/support/community/chat) gave me a hint to manually install the downloaded packages via `dpkg`:

    root@e1:~# cd /var/cache/apt/archives
    root@e1:~# dpkg -i initramfs-tools_0.99ubuntu13.4_all.deb
    root@e1:~# dpkg -i initramfs-tools-bin_0.99ubuntu13.4_amd64.deb
    root@e1:~# aptitude upgrade
    
# Remove unused kernels

Here is an easy way to remove available (and unused) kernels on your system. Verify your current kernel:
    
    root@e1:~# uname -r
    3.5.0-37-generic

And list unused ones:

    root@e1:~# dpkg --get-selections|grep 'linux-image*'|awk '{print $1}'|egrep -v "linux-image-$(uname -r)"
    linux-image-3.5.0-23-generic
    linux-image-3.5.0-27-generic
    
You can purge them with:
    
    root@e1:~# apt-get purge linux-image-3.5.0-23-generic linux-image-3.5.0-27-generic
