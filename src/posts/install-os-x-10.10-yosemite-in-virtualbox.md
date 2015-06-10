---
title: "Install OS X 10.10 Yosemite in VirtualBox"
date: 2015-05-31
---
The guide below explains how to install OS X Yosemite 10.10 in a virtual machine using the free and powerful VirtualBox.

{<1>}![](https://i.imgur.com/72faPvJ.png)

It's based on [this pastebin](http://pastebin.com/rFmQvFWc) I've found via Google, markdownified and adjusted to work with the official Yosemite release.

*Legal disclaimer*: This guide aims to explain how to create a virtual machine on a regularly purchased Apple computer, running a genuine Mac OS X operating system, for testing purposes only.

### Howto

1. Download Yosemite from the App Store
2. Open Terminal.app
3. Install `iesd`, to customize OS X InstallESD:
  `gem install iesd`
4. Turn install image into base system:
  `iesd -i "/Applications/Install OS X Yosemite.app" -o yosemite.dmg -t BaseSystem`
5. Convert into UDSP (sparse image) format:
  `hdiutil convert yosemite.dmg -format UDSP -o yosemite.sparseimage`
6. Mount the InstallESD ...
  `hdiutil mount "/Applications/Install OS X Yosemite.app/Contents/SharedSupport/InstallESD.dmg"`
7. ... as well as the sparse image:
  `hdiutil mount yosemite.sparseimage`
8. Copy base system into sparse image:
  `cp "/Volumes/OS X Install ESD/BaseSystem."* "/Volumes/OS X Base System/"`
9. Unmound InstallESD ...
  `hdiutil unmount "/Volumes/OS X Install ESD/"`
10. ... as well as the sparse image:
  `hdiutil unmount "/Volumes/OS X Base System/"`
11. Unmount both mounted disks:
  * via `diskutil`:
    `diskutil unmountDisk $(diskutil list | grep "OS X Base System" -B 4 | head -1)`
    `diskutil unmountDisk $(diskutil list | grep "OS X Install ESD" -B 4 | head -1)`
  * if that doesn't work and you get a "resource busy" message in step 12, try using the Disk Utility:
  ![](https://i.imgur.com/ZBNY9o9.gif)
12. Convert back to UDZO format (compressed image):
  `hdiutil convert yosemite.sparseimage -format UDZO -o yosemitefixed.dmg`
13. Add `yosemitefixed.dmg` as a live cd in virtual box
14. Change the chipset of your virtual machine to "_PIIX3_"
15. Start your VM, open Disk Utility within installer and create a new HFS+ partition on the virtual disk
16. Install it!

### FAQ

##### Error message: "Kernel driver not installed (rc=-1908)"

Try to reinstall VirtualBox to fix this error

##### Stuck on boot: "Missing Bluetooth Controller Transport"

Try the following steps to fix this issue:

1. Stop the virtual machine in VirtualBox
2. Open a new terminal window
3. Run the following command to adjust the guest CPU (Replace `<YourVMname>` with your actual VM name):
  `VBoxManage modifyvm '<YourVMname>' --cpuidset 1 000206a7 02100800 1fbae3bf bfebfbff`

### Sources

* http://www.engadget.com/discuss/how-to-install-os-x-yosemite-inside-virtualbox-1rey/
* http://forums.macrumors.com/showthread.php?p=19191255
* http://pastebin.com/rFmQvFWc