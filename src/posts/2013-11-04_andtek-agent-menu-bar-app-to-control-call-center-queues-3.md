---
title: "AndTek Agent"
date: 2013-11-04T13:52:29.906Z
pageColor: blue
slug: andtek-agent-menu-bar-app-to-control-call-center-queues-3
---

We use an [AndTek](http://www.andtek.de/) call center at work which is an extension for an exisiting [Cisco Unified Communications Manager](http://www.cisco.com/web/DE/solutions/unified_communication/unified-communications-manager.html) environment. Due to my job design, I often have to get up from my desk to walk to our data centers. My coworkers and I often had the problem, that we forgot to logout of the call center queues so you came back to about five missed calls.

Since we all lock our MacBooks/iMacs via the screensaver lock or the "switch user" function as soon as we go away from keyboard, I thought it can't be that hard to hook into those events. This way our computers would log us in and off the call center queues fully automated.

One or two months later I came up with the first version of __[AndTek Agent](http://git.frd.mn/iWelt/andtekagent/tree/master)__, a small Mac OS X menubar application to login and logoff AndTek queues. There are a lot of new features and changes since:

# Features / changelog

* 0.2: Login and logout out of AndTek queues manually via menubar application
* 0.2.5: Auto login/logout in queues on "Switch user" event via OS X
* 0.3: Auto login/logout in queues on "Enter/exit screensaver" event
* 0.3.1: Auto logout before application gets quit (fixed [#1](http://git.frd.mn/iWelt/andtekagent/issues/1))
* 0.3.2: GiraHelper integration (fixed [#2](http://git.frd.mn/iWelt/andtekagent/issues/2))

In order to compile and use the applicaion, we need to meet some requirements first:

# Requirements

* Cisco Unified Communications Manager
* AndTek call center
* OS X workstation
* Xcode

Now we can proceed with the actuall installation:

# Installation

1. Clone this repo
1. Compile from source
1. Build the executable via Xcode
1. Copy plist into "Preferences" folder:  
`cp opt/de.frdmn.AndTekAgent.plist ~/Library/Preferences/`
1. Adjust plist and replace the informations according to your Cisco/AndTek environment

# Screenshots

![menubar](/assets/images/posts/andtek-agent-menu-bar-app-to-control-call-center-queues-3/1.png)

![settings](/assets/images/posts/andtek-agent-menu-bar-app-to-control-call-center-queues-3/2.png)

Don't hesitate to clone the repository in case you have some improvements.

PS: Excuse my shitty code/programming skills, I suck at OOP.
