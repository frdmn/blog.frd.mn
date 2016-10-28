Some months ago, I used to have some WiFi issues so I did some google-fu and managed to enable the debug logs of the macOS' network component.

Apparently I forgot to disable the debug logging again, which lead my `/var/log/` folder to be filled up with temporary `wifi.log`'s:

```bash
❯ ls -la /var/log/wifi.log*
-rw-r--r--  1 root  admin  32723  7 Nov 10:32 /var/log/wifi.log
-rw-r-----  1 root  admin   1030  7 Nov 00:30 /var/log/wifi.log.0.bz2
-rw-r-----  1 root  admin   1606  6 Nov 00:30 /var/log/wifi.log.1.bz2
-rw-r-----  1 root  admin   8146 28 Okt 00:30 /var/log/wifi.log.10.bz2
-rw-r-----  1 root  admin   5764  5 Nov 00:30 /var/log/wifi.log.2.bz2
-rw-r-----  1 root  admin   5895  4 Nov 00:30 /var/log/wifi.log.3.bz2
-rw-r-----  1 root  admin   4931  3 Nov 00:30 /var/log/wifi.log.4.bz2
-rw-r-----  1 root  admin   3386  2 Nov 00:30 /var/log/wifi.log.5.bz2
-rw-r-----  1 root  admin   1315  1 Nov 00:30 /var/log/wifi.log.6.bz2
-rw-r-----  1 root  admin    962 31 Okt 00:30 /var/log/wifi.log.7.bz2
-rw-r-----  1 root  admin   1849 30 Okt 00:30 /var/log/wifi.log.8.bz2
-rw-r-----  1 root  admin   4445 29 Okt 00:30 /var/log/wifi.log.9.bz2
```

Here's an easy way to disable them again. First you need to change into the directory that contains the `airport` command line utility:

```bash
❯ cd /System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources
```

Then figure out which log settings are currently enabled by invoking:

```bash
❯ sudo ./airport debug
DriverWPA
```

In this case only the `DriverWPA` setting is active. To disable that you just need to prefix it with a dash sign:

```bash
❯ sudo ./airport debug -DriverWPA
```

Last but not least, double check and confirm that the log setting is not active anymore:


```bash
❯ sudo ./airport debug
```

As you can see, the command return no output anymore so the log setting is successfully disabled.
