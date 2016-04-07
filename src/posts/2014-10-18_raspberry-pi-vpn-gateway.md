---
title: "Raspberry Pi VPN Gateway"
date: 2014-10-18T12:34:00.000Z
disqus_id: 18
slug: raspberry-pi-vpn-gateway
---

Netflix finally arrived in Germany, but guess what? It's library is heavily limited in comparison to the US one and if you like TV series as much as I do, you don't want to wait until they eventually release it year(s) later for us german users.

Maybe you've heard recently of Anonabox — a small device with two ethernet ports that you can plug in front of your router and everything behind the device is routed through Tor (_side note_: turned out to [be a scam](https://www.reddit.com/r/privacy/comments/2j9caq/anonabox_tor_router_box_is_false_representation/) and got pulled [from Kickstarter](https://www.kickstarter.com/projects/augustgermar/anonabox-a-tor-hardware-router) in the end). However, it made me come up with an idea: Instead of having a Tor-box, I want a VPN-box that is connected to my PrivateInternetAccess VPN. If I'm in need of a VPN connection I just switch the WiFi network and I'm good to go. This way I can easily watch US content from Netflix as well as unblock location restricted content like YouTube, even with my iPhone or Xbox.

Another purpose might be to use it as an anonymizer if you care about your privacy and anonymity while browsing the web.

All you need for this is a Raspberry Pi, a WiFi Stick and a 8 or 16 GB SD card. Let's start with the general assumptions:

# Assumptions

## General

* You have a Raspberry Pi and you want to use it as a VPN gateway
* The gateway should be accessible within a dedicated VPN-only WiFi SSID
* The Pi is connected via Ethernet to your home network
* The WiFi stick is a [RTL8188CUS](http://www.amazon.de/s/field-keywords=RTL8188CUS) 802.11n WLAN Adapter  
  (Not sure if these are really RTL8188CUS sticks though)
* You use a Mac OS X based computer to prepare the SD card

## Technical

* Our home network uses IP range: `192.169.1.0/24`
* The VPN network is going to use the IP range: `192.168.101.0/24`
* We're going to use [PrivateInternetAccess](https://www.privateinternetaccess.com) as VPN provider
* We're going to use OpenVPN as VPN client
* We'll use [raspbian](http://www.raspbian.org/) as distribution

# Guide

## Prepare SD card

Mount your SD card and download and unzip the latest *raspbian* image:

```shell
cd /tmp  
curl -L "http://downloads.raspberrypi.org/raspbian_latest" -o /tmp/raspbian_latest.zip
unzip raspbian_latest.zip
```

Clone @[RayViljoen](https://github.com/RayViljoen)'s Raspberry PI SD Installer for OS X and execute it to transfer the *raspbian*:

```shell
git clone https://github.com/RayViljoen/Raspberry-PI-SD-Installer-OS-X.git
cd Raspberry-PI-SD-Installer-OS-X  
sudo ./install /tmp/2014-09-09-wheezy-raspbian.img
```

In the prompt, select the number of the disk drive (I had to select `5`) of your SD card and wait till it finished writing the image to the SD card. Finally, unplug the SD card when the process is done

## Configure the Pi as access point

__Intermediate assumptions__:

* You plugged in the WiFi stick
* You booted the Pi from the SD card
* You did the base configuration of raspbian  
  (change password, timezone, localization, etc.)
* `apt-get` repositories and packages are up to date  
  (`sudo apt-get update && sudo apt-get upgrade -y`)
* `ifconfig` shows an wlan0 interface
* You can access the internet using ethernet
  (`curl icanhazip.com` returns the external IP)

### Install and configure `hostapd` and the DHCP server

To create a WiFi network, we need `hostapd` to manage the authentications and `isc-dhcp-server` to act as DHCP server:

```shell
sudo apt-get install hostapd isc-dhcp-server
```

Now we need to adjust the DHCP configuration:

```shell
sudo vi /etc/dhcp/dhcpd.conf  
```

> ```
> [...]
> #option domain-name "example.org";
> #option domain-name-servers ns1.example.org, ns2.example.org;
> [...]
> # If this DHCP server is the official DHCP server for the local
> # network, the authoritative directive should be uncommented.
> authoritative;
> [... go to end of file ...]
> subnet 192.168.101.0 netmask 255.255.255.0 {
>     range 192.168.101.10 192.168.101.50;
>     option broadcast-address 192.168.101.255;
>     option routers 192.168.101.1;
>     default-lease-time 600;
>     max-lease-time 7200;
>     option domain-name "local";
>     option domain-name-servers 8.8.8.8, 8.8.4.4;
> }
> ```

And make sure to use the proper interface:

```shell
sudo vi /etc/default/isc-dhcp-server  
```

> ```
> [...]
> INTERFACES="wlan0"
> ```

### Setup network interface

Let's adjust the network interface and use a static IP:  

```shell
sudo vi /etc/network/interfaces
```

> ```
> [...]
> allow-hotplug wlan0
> iface wlan0 inet static
>   address 192.168.101.1
>   netmask 255.255.255.0
> [...]
> #iface wlan0 inet manual
> #wpa-roam /etc/wpa_supplicant/wpa_supplicant.conf
> #iface default inet dhcp
> ```

Restart your network interface to activate the changes:

```shell
ifdown wlan0 && ifup wlan0
```

### Configure `hostapd`

In the next step, we're going to adjust the `hostapd` configuration. Make sure you replace `[Your_WiFi_SSID]` as well as `[Your_WiFi_Pass]`:  

```shell
sudo vi /etc/hostapd/hostapd.conf
```

> ```
> interface=wlan0
> driver=rtl871xdrv
> ssid=[Your_WiFi_SSID]
> hw_mode=g
> channel=6
> macaddr_acl=0
> auth_algs=1
> ignore_broadcast_ssid=0
> wpa=2
> wpa_passphrase=[Your_WiFi_Pass]
> wpa_key_mgmt=WPA-PSK
> wpa_pairwise=TKIP
> rsn_pairwise=CCMP
> ```

And assure to adjust the configuration defaults:  

```shell
sudo vi /etc/default/hostapd
```

> ```
> [...]
> DAEMON_CONF="/etc/hostapd/hostapd.conf"
> [...]
> ```

### Recompile `hostapd` to work with RTL8188CUS

To use our *RTL8188CUS* we need to recompile `hostapd` with the according chipset. Download and extract the latest drivers:

```shell
cd /tmp   
sudo wget "ftp://WebUser:n8W9ErCy@208.70.202.219/cn/wlan/RTL8188C_8192C_USB_linux_v4.0.2_9000.20130911.zip"
sudo unzip RTL8188C_8192C_USB_linux_v4.0.2_9000.20130911.zip
cd RTL8188C_8192C_USB_linux_v4.0.2_9000.20130911/wpa_supplicant_hostapd  
sudo tar -xvf wpa_supplicant_hostapd-0.8_rtw_r7475.20130812.tar.gz  
```

Compile and move them into your `$PATH` variable:

```shell
cd wpa_supplicant_hostapd-0.8_rtw_r7475.20130812/hostapd
sudo make && sudo make install
sudo mv hostapd /usr/sbin/hostapd  
sudo chown root:root /usr/sbin/hostapd  
sudo chmod 755 /usr/sbin/hostapd
```

## Configure OpenVPN

To connect to *PIA*, we're going to use the OpenVPN client. Install and download the default configuration profiles provided by PrivateInternetAccess:

```shell
sudo apt-get install openvpn unzip
sudo mkdir -p /etc/openvpn/PIA/disabled  
cd /etc/openvpn/PIA  
wget https://www.privateinternetaccess.com/openvpn/openvpn.zip  
sudo unzip openvpn.zip && rm openvpn.zip
```

and rename the profiles, so you can take advantage of the autostart option later:  

```shell
sudo rename 's/ovpn/conf/' /etc/openvpn/PIA/*.ovpn  
sudo rename 's/ /_/g' /etc/openvpn/PIA/*.conf  
```

Create an authentication file that will hold your *PIA* username and password. Make sure you replace `<PIAopenVPNuser>` and `<PIAopenVPNpass>`, matching your credentials:

```shell
sudo echo "<PIAopenVPNuser>" >> /etc/openvpn/PIA/auth.txt  
sudo echo "<PIAopenVPNpass>" >> /etc/openvpn/PIA/auth.txt  
```

Since relative paths do no good to our setup, we replace them with absolute ones:

```shell
sed -i 's/auth-user-pass/auth-user-pass \/etc\/openvpn\/PIA\/auth.txt/g' *.conf
sed -i 's/ca ca.crt/ca \/etc\/openvpn\/PIA\/ca.crt/g' *.conf  
sed -i 's/crl-verify crl.pem/crl-verify \/etc\/openvpn\/PIA\/crl.pem/g' *.conf
```

Last but not least, you can move all unwanted configurations, that you don't want to connect to in future in the `disabled/` folder:

```shell
sudo mv CA_North_York.conf disabled/  
sudo mv CA_Toronto.conf disabled/  
sudo mv France.conf disabled/  
sudo mv Germany.conf disabled/  
sudo mv Hong_Kong.conf disabled/  
sudo mv Netherlands.conf disabled/  
sudo mv Romania.conf disabled/  
sudo mv Sweden.conf disabled/  
sudo mv Switzerland.conf disabled/  
sudo mv UK_London.conf disabled/  
sudo mv UK_Southampton.conf disabled/  
```

### Gimmick: Choose random VPNs from "profile pool"

Because I don't want to use the same VPN server/location over and over again, I rather want to randomly choose one location profile from the "profile pool" in `/etc/openvpn/PIA/`. As soon as I restart the VPN, it will choose a different one than before. This way I simply can reboot the Pi to obtain a new location/IP address.

```shell
vi /etc/default/openvpn
```

> ```
> CONFIG_DIR=/etc/openvpn/PIA
> [...]
> test -d $CONFIG_DIR || exit 0
>
> # Helper array and selector variable to pick random element
> returnRandomVPN (){
>     CHOSEN=`find $CONFIG_DIR -maxdepth 1 -type f | shuf -n1 | grep conf`
>     CHOSEN=`basename $CHOSEN .conf`
>     # If empty, choose new one
>     if [ ! "$CHOSEN" ]; then
>         returnRandomVPN
>     else
>         echo $CHOSEN
>     fi
> }
>
> # Source defaults file; edit that file to configure this script.
> AUTOSTART=`returnRandomVPN`
> [...]
> ```

To test the "randomizer", just stop and start the OpenVPN client a couple of times:

> ```
> [ ok ] Starting virtual private network daemon: US_Florida.
> [ ok ] Stopping virtual private network daemon: US_Florida.
> ```

```shell
service openvpn start && service openvpn stop
```

> ```
> [ ok ] Starting virtual private network daemon: US_West.
> [ ok ] Stopping virtual private network daemon: US_West.
> ```

```shell
service openvpn start && service openvpn stop
```

> ```
> [ ok ] Starting virtual private network daemon: US_Seattle.
> [ ok ] Stopping virtual private network daemon: US_Seattle.
> ```

## NAT & Netfilter/iptables adjustments

Enable IPv4 forwarding:  

```shell
sudo echo 1 > /proc/sys/net/ipv4/ip_forward  
sudo vi /etc/sysctl.conf
```

> ```
> [...]
> net.ipv4.ip_forward = 1
> [...]
> ```

And adopt the following `iptables` rules to make sure your traffic is routed via the VPN:  

```shell
sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE -m comment --comment "Use VPN IP for eth0"  
sudo iptables -t nat -A POSTROUTING -o tun0 -j MASQUERADE -m comment --comment "Use VPN IP for tun0"  
sudo iptables -A FORWARD -s 192.168.101.0/24 -i wlan0 -o eth0 -m conntrack --ctstate NEW -j REJECT -m comment --comment "Block traffic from clients to eth0"  
sudo iptables -A FORWARD -s 192.168.101.0/24 -i wlan0 -o tun0 -m conntrack --ctstate NEW -j ACCEPT -m comment --comment "Allow only traffic from clients to tun0"  
```

For a persistent configuration that survives reboot, we got to do some extra steps:

```shell
sudo iptables-save > /etc/iptables.ipv4.nat
sudo echo "up iptables-restore < /etc/iptables.ipv4.nat" >> /etc/network/interfaces
```

Now reboot your Pi and make sure the `iptables` rules are loaded again:

```shell
reboot
```

```shell
sudo iptables -vL && iptables -vL -t nat
```

> ```
> [...]
>
> Chain FORWARD (policy ACCEPT 2758 packets, 1347K bytes)
>  pkts bytes target     prot opt in     out     source               destination
>     0     0 REJECT     all  --  wlan0  eth0    192.168.101.0/24      anywhere             ctstate NEW /* Block traffic from clients to eth0 */ reject-with icmp-port-unreachable
>   117  8618 ACCEPT     all  --  wlan0  tun0    192.168.101.0/24      anywhere             ctstate NEW /* Allow only traffic from clients to tun0 */
>
> [...]
>
> Chain POSTROUTING (policy ACCEPT 0 packets, 0 bytes)
>  pkts bytes target     prot opt in     out     source               destination
>   116  8536 MASQUERADE  all  --  any    tun0    anywhere             anywhere             /* Use VPN IP for tun0 */
>     8   568 MASQUERADE  all  --  any    eth0    anywhere             anywhere             /* Use VPN IP for eth0 */
> ```

## Start/stop services

To ensure your VPN, `hostapd` and DHCP server is started as soon as you power on the Pi:

```shell
sudo update-rc.d hostapd enable
sudo update-rc.d isc-dhcp-server enable
sudo update-rc.d openvpn enable
```

# Tests

To test the whole setup, reboot the Pi, SSH into it and make sure the services run correctly:

```shell
sudo service hostapd status
```

> ```
> [ ok ] hostapd is running.
> ```

```shell
sudo service isc-dhcp-server status
```

> ```
> Status of ISC DHCP server: dhcpd is running.
> ```

```shell
sudo service openvpn status
```

> ```
> [FAIL] VPN 'US_California' (non autostarted) is not running ... failed!
> [FAIL] VPN 'US_East' (non autostarted) is not running ... failed!
> [FAIL] VPN 'US_Florida' (non autostarted) is not running ... failed!
> [ ok ] VPN 'US_Midwest' (non autostarted) is running.
> [FAIL] VPN 'US_Seattle' (non autostarted) is not running ... failed!
> [FAIL] VPN 'US_Texas' is not running ... failed!
> [FAIL] VPN 'US_West' (non autostarted) is not running ... failed!
> ```

* Check the outgoing IP for eth0. Make sure it's one of your VPN provider and not your "real" one:  

  ```shell
  curl icanhazip.com
  ```

* Connect to the new VPN WiFi of the Pi, open http://ipleak.net and check if there are leaking DNS requests
* Reboot the Pi (either `sudo reboot` or power cycle) and check if you get a new IP from a new VPN location

# Sources

* https://learn.adafruit.com/setting-up-a-raspberry-pi-as-a-wifi-access-point
* http://jankarres.de/2013/05/raspberry-pi-openvpn-vpn-server-installieren/
* https://community.hide.me/threads/raspberry-pi-als-openvpn-router-fuer-das-lokale-heimnetz.837/#post-5610
* http://superuser.com/questions/513351/debian-eth0-to-wlan0-forwarding-with-openvpn
* http://forums.adafruit.com/viewtopic.php?f=19&t=47716#p240781
* http://dotslashnotes.wordpress.com/2013/08/05/how-to-set-up-a-vpn-private-internet-access-in-raspberry-pi/

Let me know in the comment section below in case you have any issues suggestions or general feedback.
