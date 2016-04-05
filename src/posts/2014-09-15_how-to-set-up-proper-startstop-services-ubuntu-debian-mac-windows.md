---
title: "How to set up proper start/stop services"
date: 2014-09-15T10:00:00.000Z
disqus_id: 15
slug: how-to-set-up-proper-startstop-services-ubuntu-debian-mac-windows
---

I’ve noticed that there are a lot of faulty or non properly working **start/stop services** out there in the wild. That’s why I decided to build and explain some example services for the most common distributions and operating systems (like Windows). 

In this case, I assume that our example service is Python’s `SimpleHTTPServer` which starts a web server on port 80 and serves the current working directory. The server can be easily executed by:

`$ python -m SimpleHTTPServer 8000`

(*Caution: this command will probably serve the root directory of your machine. Make sure to stop the service again!*)

---

# Debian and Ubuntu (sysvinit)

1. Create an user for the desired service
1. Ensure the created user has full access to the binary you want to set up:  

  ```shell
  /usr/bin/python
  ```

1. Copy the following script (as root) to `/etc/init.d/`:  

  ```shell
  wget https://raw.github.com/frdmn/service-daemons/master/debian -O /etc/init.d/example
  ```

1. Adjust the variables:  

  ```shell
  sudo vi /etc/init.d/example
  ```

1. Make sure the script is executable:  

  ```shell
  chmod +x /etc/init.d/example
  ```

1. Enable the daemon with:  

  ```shell
  update-rc.d example defaults
  ```

1. Start the service with:  

  ```shell
  service example start
  ```

# Ubuntu (upstart)

1. Create an user for the desired service  
1. Ensure the created user has full access to the binary you want to set up:

  ```shell
  /usr/bin/python
  ```

1. Copy the following script to `/etc/init/`:  

  ```shell
  sudo wget https://raw.github.com/frdmn/service-daemons/master/ubuntu -O /etc/init/example.conf
  ```

1. Adjust the variables:  

  ```shell
  sudo vi /etc/init/example.conf
  ```

1. Start the service with:  

  ```shell
  sudo start example
  ```

# CentOS 6 (sysvinit)

1. Create an user for the desired service  
1. Ensure the created user has full access to the binary you want to set up:  

  ```shell
  /usr/bin/python
  ```

1. Copy the following script (as root) to `/etc/init.d/`:  

  ```shell
  wget https://raw.github.com/frdmn/service-daemons/master/centos -O /etc/init.d/example
  ```

1. Adjust the variables (as root):  

  ```shell
  vi /etc/init.d/example
  ```

1. Make sure the script is marked as executable:   

  ```shell
  chmod +x /etc/init.d/example
  ```

1. Enable the config in in runlevels 2, 3, 4, and 5:  

  ```shell
  chkconfig example on
  ```

1. Start the service with:  

  ```shell
  service example start
  ```

# Arch Linux (systemd)

1. Create an user for the desired service  
1. Ensure the created user has full access to the binary you want to set up:  

  ```shell
  /usr/bin/python
  ```

1. Copy the following script (as root) to `/etc/systemd/system/`:  

  ```shell
  wget https://raw.github.com/frdmn/service-daemons/master/arch -O /etc/systemd/system/example.service
  ```

1. Adjust the variables (as root):  

  ```shell
  /etc/systemd/system/example.service
  ```

1. Make sure the script is executable:  

  ```shell
  chmod +x /etc/systemd/system/example.service
  ```

1. Enable the script on boot with:  

  ```shell
  systemctl enable example
  ```

1. To start the script:  

  ```shell
  systemctl start example
  ```

# Gentoo (runscript)

1. Create an user for the desired service  
1. Ensure the created user has full access to the binary you want to set up:  

  ```shell
  /usr/bin/python
  ```

1. Copy the following script (as root) to `/etc/init.d/`:  

  ```shell
  wget https://raw.github.com/frdmn/service-daemons/master/gentoo-script -O /etc/init.d/example
  ```

1. Copy the following configuration file (as root) to `/etc/conf.d/`:  

  ```shell
  wget https://raw.github.com/frdmn/service-daemons/master/gentoo-conf -O /etc/conf.d/example
  ```

1. Make those files executable:  

  ```shell
  chmod +x /etc/init.d/example /etc/conf.d/example
  ```

1. Load the deamon:  

  ```shell
  rc-update add etherpad-lite default
  ```

1. Start the deamon with:  

  ```shell
  rc-service etherpad-lite start
  ```

# Mac OS X (launchd)

Note: For some reasons the SimpleHTTPServer python module didn’t work via `launchd`, so i included this tiny web server python script in [the repo](https://raw.github.com/frdmn/service-daemons/master/macosx-httpd.py).

1. Create an user for the desired service  
1. Create a log folder for the service:  

  ```shell
  mkdir /var/log/example
  ```

1. Ensure the created user has full access to the binary you want to set up:  

  ```shell
  /usr/bin/python
  ```

1. Copy the following script (as root) to /Library/LaunchDaemons/:  

  ```shell
  wget https://raw.github.com/frdmn/service-daemons/master/macosx -O /Library/LaunchDaemons/mn.frd.example.plist
  ```

1. Copy the python script (as root) to /tmp/:  

  ```shell
  wget https://raw.github.com/frdmn/service-daemons/master/macosx-httpd.py -O /tmp/httpd.py
  ```

1. Launch the daemon with:  

  ```shell
  sudo launchctl load /Library/LaunchDaemons/mn.frd.example.plist
  ```

# Windows (nssm)

1. Download and install `nssm`:  
  [non sucking service manager](http://nssm.cc/)
1. Move it into your `%PATH%`
1. Open an administrative terminal window
1. Load the service:
nssm install "C:/Python27/python" -m SimpleHTTPServer 8000
1. Reboot your machine

---

Please let me know in case you found some typos or errors above. You can also fork the repo and send a [*Pull Request* via GitHub](https://github.com/frdmn/service-daemons) if you have some improvements for the start/stop daemons.
