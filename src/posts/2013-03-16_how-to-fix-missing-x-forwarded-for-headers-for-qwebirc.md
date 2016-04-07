---
title: "How to fix missing X-Forwarded-For headers for qwebirc"
date: 2013-03-16T11:00:00.000Z
disqus_id: 2
slug: how-to-fix-missing-x-forwarded-for-headers-for-qwebirc
---

If you own an [uberspace](http://uberspace.de) hosting package and run a server application, you (used to) have to contact the support first to demand a TCP port that your application can listen to.

If this application is a web-based one you probably don't want to use the given "9034", otherwise your users had to type in something like `http://your-domain.com:9034` to access your web server. To solve this problem you can resort to Apache's `mod_proxy ` module which is enabled by default on uberspace.

Now you just create a `.htaccess` file in the `DocumentRoot` of your-domain.com which contains this:

```apacheconf
RewriteEngine On
RewriteRule (.*) http://localhost:9034/$1 [P]
```

This proxy configuration will tunnel every incoming traffic on port "80" to the given "9034". Your server application is now accessible via `http://your-domain.com` without the port declaration.

That's all well and good, but the incoming traffic of the server now will be sent with sender IP of the webserver on port "80", in that case the uberspace host. Sometimes it's mandatory for your server application to get the real IP addresses of your users (for logging purposes or if you want to check against IPs) instead. Especially with qwebirc you don't want to waive that feature because users who log into your IRC channel would have a hostname like:

```
<nickname_of_user>!7F000001@phoenix.uberspace.de    
# 7F000001 is 127.0.0.1 in hexadecimal notation
```

Instead of:

```
<nickname_of_user>!0A16212C@phoenix.uberspace.de
# 0A16212C is the real IP adress of the user in
# hexadecimal notation
```

But again we can produce relief with the if your server is able to extract the [`X-Forwarded-For`](http://en.wikipedia.org/wiki/X-Forwarded-For) header out of the proxied HTTP request. This extra header contains the real IP address of the user and will be inserted by the `mod_proxy ` module to avoid that "loss".

[qwebirc](http://qwebirc.org/) provides such a feature which can be activated activated the `qwebirc/config.py` configuration file. Add the following lines to your configuration:

```python
FORWARDED_FOR_HEADER = "x-forwarded-for"
FORWARDED_FOR_IPS = ["127.0.0.1"]
```

(Make sure you compile your instance again to make the changes in the `qwebirc/config.py` effective!)

Now qwebirc will parse that header, treats the containing IP as the sender IP of the HTTP request and will set a proper hostname like I showed above. Just convert the hexadecimal part into a decimal notation and you reveal the IPv4 address of your user.
