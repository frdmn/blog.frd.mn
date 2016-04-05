---
title: "Communigate Pro on Ubuntu LTS"
date: 2014-04-02T08:40:58.914Z
disqus_id: 16
slug: communigate-pro-on-ubuntu-lts
---

Since there are no packages available for Debian based ditributions, here's a short guide how to easily install **Communigate Pro 6.0** on Ubuntu LTS 12.04.

First of all, we need `alien` to convert the *.rpm* based installer to a `dpkg` compatible format:

```shell
aptitude install alien
```

Now download and convert the *CGP* installer:

```shell
cd /tmp/  
wget http://www.communigate.com/pub/CommuniGatePro/CGatePro-Linux.x86_64.rpm  
alien CGatePro-Linux.x86_64.rpm  
dpkg -i cgatepro-linux_6.0-10_amd64.deb  
```

Backup existing mail binaries, so you can restore them in case you uninstall *CommuniGate*:

```shell
mv /usr/bin/mail /usr/bin/mail.ori  
mv /usr/sbin/sendmail /usr/bin/sendmail.ori  
ln -s /opt/CommuniGate/sendmail /usr/sbin/sendmail  
ln -s /opt/CommuniGate/mail /usr/bin/mail  
```

To fix the provided start/stop service on Ubuntu, we need to customize it a little:

```shell
sed -i '2,11d' /opt/CommuniGate/Startup # only extract LSB header
sed -i 's/\#\!\/bin\/sh/\#\!\/bin\/bash/g' /opt/CommuniGate/Startup # use /bin/bash instead of /bin/sh Shell  
sed -i 's/\ 3\ 4\ 5$/\ 2\ 3\ 4\ 5/g' /opt/CommuniGate/Startup # fix start runlevel
sed -i 's/\ 0\ 1\ 2\ 6$/\ 0\ 1\ 6/g' /opt/CommuniGate/Startup # fix stop runlevel
```

Last but not least, we can move the start/stop script, change it's permissions and make it start automatically on boot:

```shell
mv /opt/CommuniGate/Startup /etc/init.d/CommuniGate   
chmod +x /etc/init.d/CommuniGate  
update-rc.d CommuniGate defaults  
```
