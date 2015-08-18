---
title: "Install OS X 10.10 Yosemite in VirtualBox"
date: 2015-05-31
disqus_id: 22
pageColor: greyblue
---
The guide below explains how to install OS X Yosemite 10.10 in a virtual machine using the free and powerful VirtualBox.

![](https://i.imgur.com/72faPvJ.png)

It's based on [this pastebin](http://pastebin.com/rFmQvFWc) I've found via Google, markdownified and adjusted to work with the official Yosemite release.

*Legal disclaimer*: This guide aims to explain how to create a virtual machine on a regularly purchased Apple computer, running a genuine Mac OS X operating system, for testing purposes only.

## Howto

First you need to [download Yosemite](https://itunes.apple.com/de/app/os-x-yosemite/id915041082?mt=12) from the App Store. Once finished open your Terminal and install `iesd`, to customize OS X InstallESD:

```
gem install iesd
```

You then have to turn the install image into base system and convert into UDSP (sparse image) format afterwards:

```
iesd -i "/Applications/Install OS X Yosemite.app" -o yosemite.dmg -t BaseSystem
hdiutil convert yosemite.dmg -format UDSP -o yosemite.sparseimage
```

### Mount images

Mount the InstallESD as well as the sparse image:  

```
hdiutil mount "/Applications/Install OS X Yosemite.app/Contents/SharedSupport/InstallESD.dmg"
hdiutil mount yosemite.sparseimage
```

Copy base system into sparse image:  

```
cp "/Volumes/OS X Install ESD/BaseSystem."* "/Volumes/OS X Base System/"
```

### Unmount images

Unmount InstallESD as well as the sparse image:

```
hdiutil unmount "/Volumes/OS X Install ESD/"
hdiutil unmount "/Volumes/OS X Base System/"
```

Unmount both mounted disks via `diskutil`:

```
diskutil unmountDisk $(diskutil list | grep "OS X Base System" -B 4 | head -1)
diskutil unmountDisk $(diskutil list | grep "OS X Install ESD" -B 4 | head -1)
```

*If that doesn't work and you get a "resource busy" message in step 12, try using the Disk Utility:*

![](https://i.imgur.com/ZBNY9o9.gif)

### Finish and installation

Convert back to UDZO format (compressed image):

```
hdiutil convert yosemite.sparseimage -format UDZO -o yosemitefixed.dmg
```

Add `yosemitefixed.dmg` as a live cd in virtual box, change the chipset of your virtual machine to "_PIIX3_".

Start your VM, open Disk Utility within installer and create a new HFS+ partition on the virtual disk. **Install it!**

## FAQ

Below you can find some of the frequently asked questions from the comment section. In case you have any issue or problem, try to check if you find your problem listed. Otherwise feel free to contact me via [mail](mailto:j@frd.mn) or use the comment section below.

#### Error message: "Kernel driver not installed (rc=-1908)"

Try to reinstall VirtualBox to fix this error

#### Stuck on boot: "Missing Bluetooth Controller Transport"**

Try the following steps to fix this issue:

1. Stop the virtual machine in VirtualBox
2. Open a new terminal window
3. Run the following command to adjust the guest CPU:

```
VBoxManage modifyvm '<YourVMname>' --cpuidset 1 000206a7 02100800 1fbae3bf bfebfbff
```
*(Replace `<YourVMname>` with your actual VM name)*

## Sources

* http://www.engadget.com/discuss/how-to-install-os-x-yosemite-inside-virtualbox-1rey/
* http://forums.macrumors.com/showthread.php?p=19191255
* http://pastebin.com/rFmQvFWc
