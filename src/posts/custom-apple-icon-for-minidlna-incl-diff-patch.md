---
title: "Custom Apple icon for MiniDLNA (incl. diff patch)"
date: 2013-03-22T11:00:00.000Z
pageColor: pink
slug: custom-apple-icon-for-minidlna-incl-diff-patch
---

Since a couple of days i've been running a [MiniDLNA](http://sourceforge.net/projects/minidlna/) media server which is allegedly fully compliant with all the common `DLNA/UPnP` clients. In my case is the client a [Samsung UE40ES5700](http://www.amazon.de/Samsung-UE40ES5700-LED-Backlight-Fernseher-Energieeffizienzklasse-Full-HD/dp/B007H72AFM) SmartTV with the latest AllShare Play software.

The initial configuration was very comfortable: You define your media folders/shares, create a `launchd` service and everything works like a charm.  

The only thing now that I didn't really like is that MiniDLNA comes with a hardcoded icon, which will show up in the frontends of the clients. And this is (no wonder) Linux' infamous and notorious Tux. But since I am running the server on my MacBook Pro I wanted to change that icon into an Apple logo.

Like I said above there is no configuration line to specify a path for an image in the `/etc/minidlna.conf` so I dug up the source code and found a C-file named `icons.s` directly in the root folder of the source which contains the images in hex format.

I converted the hex back to the viewable PNG, fired up Photoshop and made some Apple icons in the same dimensions of the source images. Then you just need to convert your new, customized images back into hex, format them like it is required in the `icons.c` (no whitespaces, group of 24 hex pairs, etc.) and compile it again. Thats it:

![MiniDLNA icon on Samsung SmartTV](/content/images/2013/Oct/2.png)

If some of you want to do the same I created the following [Gist on GitHub](https://gist.github.com/frdmn/5222476) which includes all the needed ressources and even a **diff patch**. Follow this instructions:

    # Make sure you disabled the launchd daemon before you start
    sudo launchctl unload /Library/LaunchDaemons/your.bundle.minidlna.plist
    sudo launchctl stop your.bundle.minidlna

    # Go into a temporary directory
    cd /tmp

    # Grab the latest MiniDLNA source via CVS
    cvs -z3 -d:pserver:anonymous@minidlna.cvs.sourceforge.net:/cvsroot/minidlna co -P minidlna
    
    # Clone my GitHub gist - https://gist.github.com/frdmn/5222476
    git clone https://gist.github.com/5222476.git icon-patch
    
    # Change into the MiniDLNA directory
    cd minidlna

    # Apply the diff patch
    patch < ../icon-patch/minidlna-apple-icon.patch

    # Compile and install
    ./autogen.sh && ./configure && make
    sudo make install

    # Start the daemon again
    sudo launchctl load /Library/LaunchDaemons/your.bundle.minidlna.plist
    sudo launchctl start your.bundle.minidlna

And you are done. Reboot your `DLNA/UPnP` client in case the icon didn't change for you.
