---
title: "How to set up proper start/stop services"
date: 2014-09-15T10:00:00.000Z
pageColor: purple
disqus_id: 15
slug: how-to-set-up-proper-startstop-services-ubuntu-debian-mac-windows
---

I’ve noticed that there are a lot of faulty or non properly working **start/stop scripts** out there in the wild. That’s why I made the decision to build some example or default services for the common distributions (and even operating systems, like Windows). In this case our example service is Python’s `SimpleHTTPServer` which starts a web server on port 80 and serves the current working directory to the web server. The server can be easily executed by:

`$ python -m SimpleHTTPServer 8000`

(Caution: this command will probably serve the root directory of your machine. Make sure to stop the service again!)

---

# Debian and Ubuntu (sysvinit)

1. Create an user for the desired service
1. Ensure the created user has full access to the binary you want to set up:  
`/usr/bin/python`
1. Copy the following script (as root) to `/etc/init.d/`:  
`wget https://raw.github.com/frdmn/service-daemons/master/debian -O /etc/init.d/example`
1. Adjust the variables:  
`sudo vi /etc/init.d/example`
1. Make sure the script is executable:  
`chmod +x /etc/init.d/example`
1. Enable the daemon with:  
`update-rc.d example defaults`
1. Start the service with:  
`service example start`

# Ubuntu (upstart)

1. Create an user for the desired service  
1. Ensure the created user has full access to the binary you want to set up:
`/usr/bin/python`
1. Copy the following script to `/etc/init/`:  
`sudo wget https://raw.github.com/frdmn/service-daemons/master/ubuntu -O /etc/init/example.conf`
1. Adjust the variables:  
`sudo vi /etc/init/example.conf`
1. Start the service with:  
`sudo start example`

# CentOS 6 (sysvinit)

1. Create an user for the desired service  
1. Ensure the created user has full access to the binary you want to set up:  
`/usr/bin/python`
1. Copy the following script (as root) to `/etc/init.d/`:  
`wget https://raw.github.com/frdmn/service-daemons/master/centos -O /etc/init.d/example`
1. Adjust the variables (as root):  
`vi /etc/init.d/example`
1. Make sure the script is marked as executable:   
`chmod +x /etc/init.d/example`
1. Enable the config in in runlevels 2, 3, 4, and 5:  
`chkconfig example on`
1. Start the service with:  
`service example start`

# Arch Linux (systemd)

1. Create an user for the desired service  
1. Ensure the created user has full access to the binary you want to set up:  
`/usr/bin/python`
1. Copy the following script (as root) to `/etc/systemd/system/`:  
`wget https://raw.github.com/frdmn/service-daemons/master/arch -O /etc/systemd/system/example.service`
1. Adjust the variables (as root):  
`/etc/systemd/system/example.service`
1. Make sure the script is executable:  
`chmod +x /etc/systemd/system/example.service`
1. Enable the script on boot with:  
`systemctl enable example`
1. To start the script:  
`systemctl start example`

# Gentoo (runscript)

1. Create an user for the desired service  
1. Ensure the created user has full access to the binary you want to set up:  
`/usr/bin/python`
1. Copy the following script (as root) to `/etc/init.d/`:  
`wget https://raw.github.com/frdmn/service-daemons/master/gentoo-script -O /etc/init.d/example`
1. Copy the following configuration file (as root) to `/etc/conf.d/`:  
`wget https://raw.github.com/frdmn/service-daemons/master/gentoo-conf -O /etc/conf.d/example`
1. Make those files executable:  
`chmod +x /etc/init.d/example /etc/conf.d/example`
1. Load the deamon:  
`rc-update add etherpad-lite default`
1. Start the deamon with:  
`rc-service etherpad-lite start`

# Mac OS X (launchd)

Note: For some reasons the SimpleHTTPServer python module didn’t work via `launchd`, so i included this tiny web server python script in [the repo](https://raw.github.com/frdmn/service-daemons/master/macosx-httpd.py).

1. Create an user for the desired service  
1. Create a log folder for the service:  
`mkdir /var/log/example`
1. Ensure the created user has full access to the binary you want to set up:  
`/usr/bin/python`
1. Copy the following script (as root) to /Library/LaunchDaemons/:  
`wget https://raw.github.com/frdmn/service-daemons/master/macosx -O /Library/LaunchDaemons/mn.frd.example.plist`
1. Copy the python script (as root) to /tmp/:  
`wget https://raw.github.com/frdmn/service-daemons/master/macosx-httpd.py -O /tmp/httpd.py`
1. Launch the daemon with:  
`sudo launchctl load /Library/LaunchDaemons/mn.frd.example.plist`

# Windows (nssm)

1. Download and install `nssm`:  
[non sucking service manager](http://nssm.cc/)
1. Move it into your `%PATH%`
1. Open an administrative terminal window
1. Load the service:
nssm install "C:/Python27/python" -m SimpleHTTPServer 8000
1. Reboot your machine

---

Please let me know in case you found some typos or errors above. You can also fork the repo and send a [pull request via GitHub](https://github.com/frdmn/service-daemons) if you have some improvements for the start/stop daemons.
