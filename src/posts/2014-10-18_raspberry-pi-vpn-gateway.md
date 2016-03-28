---
title: "Raspberry Pi VPN Gateway"
date: 2014-10-18T12:34:00.000Z
pageColor: purple
slug: raspberry-pi-vpn-gateway
---

Netflix finally arrived in Germany, but guess what? It's library is heavily limited in comparision to the US one and if you like TV series as much as I do, you don't want to wait until they eventually release it year(s) later for us german users.

Maybe you've heard recently of Anonabox — a small device with two ethernet ports that you can plug in front of your router and everything behind the device is routed through Tor (_side note_: turned out to [be a scam](https://www.reddit.com/r/privacy/comments/2j9caq/anonabox_tor_router_box_is_false_representation/) and got pulled [from Kickstarter](https://www.kickstarter.com/projects/augustgermar/anonabox-a-tor-hardware-router) in the end). However, it made me come up with an idea: Instead of having a Tor-box, I want a VPN-box that is connected to my PrivateInternetAccess VPN. If I'm in need of a VPN connection I just switch the WiFi network and I'm good to go. This way I can easily watch US content from Netflix as well as unblock location restricted content like YouTube, even with my iPhone or Xbox.

Another purpose might be to use it as an anoynmizer if you care abour your privacy and anonymity while browsing the web.

All you need for this is a Raspberry Pi, a WiFi Stick and a 8 or 16 GB SD card. Let's start with the general assumptions:

# Assumptions

## General

* You have a Rapsberry Pi and you want to use it as a VPN gateway
* The gateway should be accessable within a dedicated VPN-only WiFi SSID
* The Pi is connected via Ethernet to your home network
* The WiFi stick is a [RTL8188CUS](http://www.amazon.de/s/field-keywords=RTL8188CUS) 802.11n WLAN Adapter  
  (Not sure if these are really RTL8188CUS sticks though)
* You use a Mac OS X based computer to prepare the SD card

## Technical

* Our home network has the IP range: 192.169.1.0/24
* The VPN network is going to have the IP range: 192.168.101.0/24
* You're going to use [PrivateInternetAccess](https://www.privateinternetaccess.com) as VPN provider
* You're going to use OpenVPN as VPN client
* You'll use [raspbian](http://www.raspbian.org/) as distribution

# Guide

## Prepare SD card

1. Mount the SD card
2. Download the latest rasbian image:  
  `curl -L "http://downloads.raspberrypi.org/raspbian_latest" -o /tmp/raspbian_latest.zip`
3. Unzip given image:
  `cd /tmp`  
  `unzip raspbian_latest.zip`
4. Clone @[RayViljoen](https://github.com/RayViljoen)'s Raspberry PI SD Installer for OS X:  
  `git clone https://github.com/RayViljoen/Raspberry-PI-SD-Installer-OS-X.git`
5. Start the installer:  
  `cd Raspberry-PI-SD-Installer-OS-X`  
  `sudo ./install /tmp/2014-09-09-wheezy-raspbian.img`
6. Select the number of the specific disk (I had to select #5) of your SD card and wait until it finished writing the image onto the card
7. Unplug the SD card when the process is done

## Configure the Pi as access point

__Intermediate assumptions__:

* You pluged in the WiFi stick
* You booted the Pi from the SD card
* You did the base configuration of rasbian  
  (change password, timezone, localization, etc.)
* `apt-get` repositories and packages are up to date  
  (`sudo apt-get update && sudo apt-get upgrade -y`) 
* `ifconfig` shows an wlan0 interface
* You can access the internet using ethernet 
  (`curl icanhazip.com` returns the external IP)

---

(Couldn't use ordered lists in the next steps below, because the multi line code blocks somehow destroyed the numeration)

### Install and configure `hostapd` and the DHCP server

* Install `hostapd` (to create the access point) and `isc-dhcp-server` (as DHCP server):  
  `sudo apt-get install hostapd isc-dhcp-server`
* Adjust the `dhcp.conf` of the DHCP server like this:  
  `sudo editor /etc/dhcp/dhcpd.conf`  
   
```
[...]
#option domain-name "example.org";
#option domain-name-servers ns1.example.org, ns2.example.org;
[...]
# If this DHCP server is the official DHCP server for the local
# network, the authoritative directive should be uncommented.
authoritative;
[... go to end of file ...]
subnet 192.168.101.0 netmask 255.255.255.0 {
    range 192.168.101.10 192.168.101.50;
    option broadcast-address 192.168.101.255;
    option routers 192.168.101.1;
    default-lease-time 600;
    max-lease-time 7200;
    option domain-name "local";
    option domain-name-servers 8.8.8.8, 8.8.4.4;
} 
```

* Adjust DHCP configuration:  
  `sudo editor /etc/default/isc-dhcp-server`  

```
[...]
INTERFACES="wlan0"
```

### Setup network interface

* Shutdown wlan0 interface:  
  `sudo ifdown wlan0`  
* Adjust network interface config:  
  `sudo editor /etc/network/interfaces`

```
[...]
allow-hotplug wlan0
iface wlan0 inet static
  address 192.168.101.1
  netmask 255.255.255.0
[...]
#iface wlan0 inet manual
#wpa-roam /etc/wpa_supplicant/wpa_supplicant.conf
#iface default inet dhcp
```

* Set static IP for wlan0 interface:  
  `sudo ifconfig wlan0 192.168.101.1`
* Make sure it uses the correct ip:  
  `ifconfig`

### Configure `hostapd`

* Adjust the `hostapd` configuration. Make sure you replace `<YourWiFiSSID>` as well as `<YourWiFiPass>`:  
  `sudo editor /etc/hostapd/hostapd.conf`

```
interface=wlan0
driver=rtl871xdrv
ssid=<YourWiFiSSID>
hw_mode=g
channel=6
macaddr_acl=0
auth_algs=1
ignore_broadcast_ssid=0
wpa=2
wpa_passphrase=<YourWiFiPass>
wpa_key_mgmt=WPA-PSK
wpa_pairwise=TKIP
rsn_pairwise=CCMP
```

* Correct path for config in defaults:  
  `sudo editor /etc/default/hostapd`

```
[...]
DAEMON_CONF="/etc/hostapd/hostapd.conf"
[...]
```

### Recompile `hostapd` to work with RTL8188CUS

1. Download the compatible driver package:  
  `cd /tmp`   
  `sudo wget "ftp://WebUser:n8W9ErCy@208.70.202.219/cn/wlan/RTL8188C_8192C_USB_linux_v4.0.2_9000.20130911.zip"`
2. Extract the archive:  
  `sudo unzip RTL8188C_8192C_USB_linux_v4.0.2_9000.20130911.zip`
3. Extract custom hostapd:  
  `cd RTL8188C_8192C_USB_linux_v4.0.2_9000.20130911/wpa_supplicant_hostapd`  
  `sudo tar -xvf wpa_supplicant_hostapd-0.8_rtw_r7475.20130812.tar.gz`  
4. Compile it:  
  `cd wpa_supplicant_hostapd-0.8_rtw_r7475.20130812/hostapd`
  `sudo make && sudo make install`
5. Move and adjust permissions of the binary:  
  `sudo mv hostapd /usr/sbin/hostapd`  
  `sudo chown root:root /usr/sbin/hostapd`  
  `sudo chmod 755 /usr/sbin/hostapd`

## Configure OpenVPN

1. Install OpenVPN:  
  `sudo apt-get install openvpn unzip`
2. Download the PrivateInternetAccess OpenVPN configurations:  
  `sudo mkdir -p /etc/openvpn/PIA/disabled`  
  `cd /etc/openvpn/PIA`  
  `wget https://www.privateinternetaccess.com/openvpn/openvpn.zip`  
  `sudo unzip openvpn.zip && sudo rm openvpn.zip`
3. Rename configurations, so you can take advantage of the autostart option later:  
  `sudo rename 's/ovpn/conf/' /etc/openvpn/PIA/*.ovpn`  
  `sudo rename 's/ /_/g' /etc/openvpn/PIA/*.conf`  
4. Create authentication/credentials file. Make sure you replace `<PIAopenVPNuser>` and `<PIAopenVPNpass>`, matching your PrivateInternetAccess credentials:  
  `sudo echo "<PIAopenVPNuser>" >> /etc/openvpn/PIA/auth.txt`  
  `sudo echo "<PIAopenVPNpass>" >> /etc/openvpn/PIA/auth.txt`  
5. Reference to authentication file in each configuration ...  
  `sed -i 's/auth-user-pass/auth-user-pass \/etc\/openvpn\/PIA\/auth.txt/g' *.conf`
6. ... and use absolute paths for the CA files:  
  `sed -i 's/ca ca.crt/ca \/etc\/openvpn\/PIA\/ca.crt/g' *.conf`  
  `sed -i 's/crl-verify crl.pem/crl-verify \/etc\/openvpn\/PIA\/crl.pem/g' *.conf`
6. Move unwanted configurations that you don't want to connect to in future into the `disabled/` folder:  
  `sudo mv CA_North_York.conf disabled/`  
  `sudo mv CA_Toronto.conf disabled/`  
  `sudo mv France.conf disabled/`  
  `sudo mv Germany.conf disabled/`  
  `sudo mv Hong_Kong.conf disabled/`  
  `sudo mv Netherlands.conf disabled/`  
  `sudo mv Romania.conf disabled/`  
  `sudo mv Sweden.conf disabled/`  
  `sudo mv Switzerland.conf disabled/`  
  `sudo mv UK_London.conf disabled/`  
  `sudo mv UK_Southampton.conf disabled/`  

### Gimmick: Choose random VPN from the "VPN pool"

Because I don't want to use the same VPN server/location all the time, I want to randomly choose from a "server pool" in `/etc/openvpn/PIA/`. As soon as I restart the VPN, it will choose a different one than before. This way I simply can recycle the power from the Pi to obtain a new location/IP address. 

* Adjust the default service file:  
  `vi /etc/default/openvpn`

```
CONFIG_DIR=/etc/openvpn/PIA
[...]
test -d $CONFIG_DIR || exit 0

# Helper array and selector variable to pick random element
returnRandomVPN (){
    CHOSEN=`find $CONFIG_DIR -maxdepth 1 -type f | shuf -n1 | grep conf`
    CHOSEN=`basename $CHOSEN .conf`
    # If empty, choose new one
    if [ ! "$CHOSEN" ]; then
        returnRandomVPN
    else
        echo $CHOSEN
    fi
}

# Source defaults file; edit that file to configure this script.
AUTOSTART=`returnRandomVPN`
[...]
```

* Test establishment of connection as well as the `returnRandomVPN` function:  

```
root@raspberrypi:/etc/openvpn/PIA# service openvpn start && service openvpn stop
[ ok ] Starting virtual private network daemon: US_Florida.
[ ok ] Stopping virtual private network daemon: US_Florida.
root@raspberrypi:/etc/openvpn/PIA# service openvpn start && service openvpn stop
[ ok ] Starting virtual private network daemon: US_West.
[ ok ] Stopping virtual private network daemon: US_West.
root@raspberrypi:/etc/openvpn/PIA# service openvpn start && service openvpn stop
[ ok ] Starting virtual private network daemon: US_Seattle.
[ ok ] Stopping virtual private network daemon: US_Seattle.
```
    
## NAT & Netfilter/iptables adjustments

* Enable IPv4 forwarding:  
  `sudo echo 1 > /proc/sys/net/ipv4/ip_forward`  
  `sudo editor /etc/sysctl.conf`

```
[...]
net.ipv4.ip_forward = 1
[...]
```

* Set the following `iptables` rules:  

```  
sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE -m comment --comment "Use VPN IP for eth0"  
sudo iptables -t nat -A POSTROUTING -o tun0 -j MASQUERADE -m comment --comment "Use VPN IP for tun0"  
sudo iptables -A FORWARD -s 192.168.101.0/24 -i wlan0 -o eth0 -m conntrack --ctstate NEW -j REJECT -m comment --comment "Block traffic from clients to eth0"  
sudo iptables -A FORWARD -s 192.168.101.0/24 -i wlan0 -o tun0 -m conntrack --ctstate NEW -j ACCEPT -m comment --comment "Allow only traffic from clients to tun0"  
```

* Save for next reboot:  
  `sudo iptables-save > /etc/iptables.ipv4.nat`
* Load iptables rules as soon as network interfaces are loaded:  
  `sudo echo "up iptables-restore < /etc/iptables.ipv4.nat" >> /etc/network/interfaces`
* Reboot:  
  `reboot`
* Confirm configuration:  
  `sudo iptables -vL && iptables -vL -t nat`

```
[...]

Chain FORWARD (policy ACCEPT 2758 packets, 1347K bytes)
 pkts bytes target     prot opt in     out     source               destination
    0     0 REJECT     all  --  wlan0  eth0    192.168.101.0/24      anywhere             ctstate NEW /* Block traffic from clients to eth0 */ reject-with icmp-port-unreachable
  117  8618 ACCEPT     all  --  wlan0  tun0    192.168.101.0/24      anywhere             ctstate NEW /* Allow only traffic from clients to tun0 */

[...]

Chain POSTROUTING (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination
  116  8536 MASQUERADE  all  --  any    tun0    anywhere             anywhere             /* Use VPN IP for tun0 */
    8   568 MASQUERADE  all  --  any    eth0    anywhere             anywhere             /* Use VPN IP for eth0 */
```

## Start/stop services

```
sudo update-rc.d hostapd enable
sudo update-rc.d isc-dhcp-server enable
sudo update-rc.d openvpn enable
```

* Final reboot:  
  `sudo reboot`

# Tests

* SSH into the Pi
* Make sure all the services run correctly:

`sudo service hostapd status`

```
[ ok ] hostapd is running.
```

`sudo service isc-dhcp-server status`

```
Status of ISC DHCP server: dhcpd is running.
```

`sudo service openvpn status`

```
[FAIL] VPN 'US_California' (non autostarted) is not running ... failed!
[FAIL] VPN 'US_East' (non autostarted) is not running ... failed!
[FAIL] VPN 'US_Florida' (non autostarted) is not running ... failed!
[ ok ] VPN 'US_Midwest' (non autostarted) is running.
[FAIL] VPN 'US_Seattle' (non autostarted) is not running ... failed!
[FAIL] VPN 'US_Texas' is not running ... failed!
[FAIL] VPN 'US_West' (non autostarted) is not running ... failed!
```

* Check the outgoing IP for eth0. Make sure it's the VPN one:  
  `curl icanhazip.com`
* Connect into the new WiFI SSID, open http://ipleak.net and check if there are leaking DNS requests
* Reboot the Pi (either `sudo reboot` or power cycle) and check if you get a new IP from a new VPN location

# Sources

* https://learn.adafruit.com/setting-up-a-raspberry-pi-as-a-wifi-access-point
* http://jankarres.de/2013/05/raspberry-pi-openvpn-vpn-server-installieren/
* https://community.hide.me/threads/raspberry-pi-als-openvpn-router-fuer-das-lokale-heimnetz.837/#post-5610
* http://superuser.com/questions/513351/debian-eth0-to-wlan0-forwarding-with-openvpn
* http://forums.adafruit.com/viewtopic.php?f=19&t=47716#p240781
* http://dotslashnotes.wordpress.com/2013/08/05/how-to-set-up-a-vpn-private-internet-access-in-raspberry-pi/

Let me know in the comment section below in case you have any issues suggestions or general feedback.
