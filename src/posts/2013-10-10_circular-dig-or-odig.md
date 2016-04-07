---
title: "Circular dig or odig"
date: 2013-10-10T10:00:00.000Z
disqus_id: 7
slug: circular-dig-or-odig
---

As you might already know, I work for a small regional web hosting ISP. We have have several shared web environments to manage and host our clients on.

Now if we need to find out which shared web server is responsible for a specific domain name of one of the clients (in this example, "iwelt.de"), you probably do something like this:

```shell
dig +short iwelt.de
```

> ```
> 82.212.222.175
> ```

Okay, now we have an IP address but that probably doesn't help us out unless we know our whole IPAM system inside out. Next step is trying to figure out which server is using the IP "82.212.222.175". We can use `dig` again for that:

```shell
dig +short -x 82.212.222.175
```

> ```
> t1.iwelt-ag.net.
> ```

And now we found out about the responsible web server which is serving the domain "iwelt.de". Since I do those steps nearly everyday I am getting tired of doing it step by step all the time, I wrote a small Bash script for this.

# Circular dig or odig

Basically __[odig](https://github.com/w/circular-dig)__ just combines the two commands above and simplifies the whole process:

```shell
odig iwelt.de
```

> ```
> iwelt.de returned the following DNS records:
> 1. returned IP: 82.212.222.175
>    corresponding PTR: t1.iwelt-ag.net.
> ```

In case you get some CNAME records, it will try to resolve the A records instead:

```shell
odig www.frd.mn
```

> ```
> www.frd.mn returned the following DNS records:
> 1. returned hostname (CNAME): c-3po.frd.mn. -> skip
> 2. returned IP: 82.196.7.61
>    corresponding PTR: c-3po.frd.mn.
> ```

If you want to take a look for yourself checkout my [repo on GitHub](https://github.com/frdmn/circular-dig). In case you found some problems or improvements, feel free to send a pull request.

# Update: resolving MX records

One of my coworkers asked me if I could implement a feature to lookup MX records of a Domain as well. Got him satisfied [some minutes later](https://github.com/frdmn/circular-dig/commit/af3587dc3ec29145883594a856e733a0fa921441):

```shell
odig -m yeahwh.at
```

> ```
> yeahwh.at returned the following MX records:
> 1. returned hostname (CNAME): alt2.aspmx.l.google.com.
>    -> resolved IP: 173.194.79.26
>    -> resolved PTR: pb-in-f26.1e100.net.
> 2. returned hostname (CNAME): aspmx2.googlemail.com.
>    -> resolved IP: 74.125.143.26
>    -> resolved PTR: la-in-f26.1e100.net.
> 3. returned hostname (CNAME): aspmx3.googlemail.com.
>    -> resolved IP: 173.194.79.26
>    -> resolved PTR: pb-in-f26.1e100.net.
> 4. returned hostname (CNAME): aspmx.l.google.com.
>    -> resolved IP: 173.194.70.26
>    -> resolved PTR: fa-in-f26.1e100.net.
> 5. returned hostname (CNAME): alt1.aspmx.l.google.com.
>    -> resolved IP: 74.125.143.26
>    -> resolved PTR: la-in-f26.1e100.net.
> ```

As you can see in the example above, you just need to pass the __-m__ switch to query MX records instead of A/CNAMEs.
