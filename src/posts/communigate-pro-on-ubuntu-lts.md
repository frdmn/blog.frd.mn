---
title: "Communigate Pro on Ubuntu LTS"
date: 2014-04-02
disqus_id: 16
pageColor: red
---
Since there is no package for Debian based ditributions, here's a short guide how to install **Communigate Pro 6.0** on Ubuntu LTS 12.04:

First of all, we need `alien` to convert the *.rpm* based installer to a `dpkg` compatible one:

	aptitude install alien

Download and install Communigate Pro:

	cd /tmp/
	wget http://www.communigate.com/pub/CommuniGatePro/CGatePro-Linux.x86_64.rpm
	alien CGatePro-Linux.x86_64.rpm
	dpkg -i cgatepro-linux_6.0-10_amd64.deb

Backup mail binaries:

	mv /usr/bin/mail /usr/bin/mail.ori
	mv /usr/sbin/sendmail /usr/bin/sendmail.ori
	ln -s /opt/CommuniGate/sendmail /usr/sbin/sendmail
	ln -s /opt/CommuniGate/mail /usr/bin/mail

Now we need to make several adjustments to the startup service. First we remove line 2 to line 11, since we only need the LSB headers for Ubunutu:

	sed -i '2,11d' /opt/CommuniGate/Startup

Now we want `bash` instead of `sh` in our Shebang line:

	sed -i 's/\#\!\/bin\/sh/\#\!\/bin\/bash/g' /opt/CommuniGate/Startup

Adjust start runlevel ...

	sed -i 's/\ 3\ 4\ 5$/\ 2\ 3\ 4\ 5/g' /opt/CommuniGate/Startup

... as well as the stop ones:

	sed -i 's/\ 0\ 1\ 2\ 6$/\ 0\ 1\ 6/g' /opt/CommuniGate/Startup

Finally, move the startup script, change it's permissions and make it start  automatically on boot:

	mv /opt/CommuniGate/Startup /etc/init.d/CommuniGate
	chmod +x /etc/init.d/CommuniGate
	update-rc.d CommuniGate defaults  
