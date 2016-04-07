---
title: "Custom Apple icon for MiniDLNA"
date: 2013-03-22T11:00:00.000Z
disqus_id: 3
slug: custom-apple-icon-for-minidlna-incl-diff-patch
---

Since a couple of days I've been running a [MiniDLNA](http://sourceforge.net/projects/minidlna/) media server which seems compatible to all the common `DLNA/UPnP` clients. In my case, the client is a [Samsung UE40ES5700](http://www.amazon.de/Samsung-UE40ES5700-LED-Backlight-Fernseher-Energieeffizienzklasse-Full-HD/dp/B007H72AFM) SmartTV with the latest AllShare Play implementation.

The initial configuration was very comfortable: You define your media folders/shares, create a `launchd` service and everything works like a charm.  

The only thing now that I didn't really like is that MiniDLNA comes with a hardcoded icon, which will show up in the frontend of the clients. And this is (no wonder) Linux' infamous and notorious Tux. But since I am running the server on my MacBook Pro I wanted to change that icon into an Apple logo.

Like I said above there is no configuration line to specify a path for an image in the `/etc/minidlna.conf` so I dug up the source code and found a C-file named `icons.s` directly in the root folder of the source which contains the images in hex format.

I converted the hex back to the viewable PNG, fired up Photoshop and made some Apple icons in the same dimensions of the source images. Then you just need to convert your new, customized images back into hex, format them like it is required in the `icons.c` (no whitespaces, group of 24 hex pairs, etc.) and compile it again. That's it:

![MiniDLNA icon on Samsung SmartTV](/assets/images/posts/custom-apple-icon-for-minidlna-incl-diff-patch/1.png)

If some of you want to do the same I created the following [Gist on GitHub](https://gist.github.com/frdmn/5222476) which includes all the needed resources and even a **diff patch**. Follow this instructions:

1. Make sure you disabled the launchd daemon before you start:

  ```shell
  sudo launchctl unload /Library/LaunchDaemons/your.bundle.minidlna.plist
  sudo launchctl stop your.bundle.minidlna
  ```

1. Go into a temporary directory:

  ```shell
  cd /tmp
  ```

1. Grab the latest MiniDLNA source via CVS:

  ```shell
  cvs -z3 -d:pserver:anonymous@minidlna.cvs.sourceforge.net:/cvsroot/minidlna co -P minidlna
  ```

1. Clone my GitHub gist - <https://gist.github.com/frdmn/5222476>:

  ```shell
  git clone https://gist.github.com/5222476.git icon-patch
  ```

1. Change into the MiniDLNA directory:

  ```shell
  cd minidlna
  ```

1. Apply the diff patch:

  ```shell
  patch < ../icon-patch/minidlna-apple-icon.patch
  ```

1. Compile and install:

  ```shell
  ./autogen.sh && ./configure && make
  sudo make install
  ```

1. Start the daemon again:

  ```shell
  sudo launchctl load /Library/LaunchDaemons/your.bundle.minidlna.plist
  sudo launchctl start your.bundle.minidlna
  ```

And you are done. Reboot your `DLNA/UPnP` client in case the icon didn't change immediately for you.
