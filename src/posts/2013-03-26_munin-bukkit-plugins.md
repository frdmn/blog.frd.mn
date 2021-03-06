---
title: "Munin Bukkit plugins"
date: 2013-03-26T11:00:00.000Z
disqus_id: 4
slug: munin-bukkit-plugins
---

Recently I've set up a [Munin](http://munin-monitoring.org) monitoring platform to get an in-depth overview for my running services and servers. Here's how to monitor your Minecraft server using Munin monitoring.

Someday, I had the great idea to add and track my [Bukkit](http://bukkit.org) ([Minecraft](http://minecraft.net)) server somehow on that Munin instance as well. Due to [JSONAPI](https://github.com/alecgorge/jsonapi) — which provides [hundreds of API-calls](http://mcjsonapi.com/apidocs/) through HTTP, TCP and [WebSocket](http://www.websocket.org/) streams — it is pretty easy to get the necessary informations for the Munin plugin.

So I started to gather some informations about plugin development in Munin and six hours later my Munin looked like this:

![Munin Bukkit/JSONAPI plugins](/assets/images/posts/munin-bukkit-plugins/1.png)

In the picture above you can see the three PHP-based plugins which track that lets you track:

* TPS (ticks per second)
* RAM usage
* players currently online

You can grab them via [my GitHub repo](https://github.com/yeahwhat-mc/munin-bukkit-plugins) or you just follow this little tutorial how to set those up. Please note that the paths and Munin folders might be different if you compiled Munin from source or run a different distribution than Debian.

# Requirements

* [Bukkit](http://bukkit.org) server with [JSONAPI](https://github.com/alecgorge/jsonapi) plugin
* Web server with PHP support and Munin (2)

# Configuration

1. Clone the [git repo](https://github.com/frdmn/munin-bukkit-plugins):  

  ```shell
  git clone git://github.com/frdmn/munin-bukkit-plugins.git
  ```

1. Adjust the variables in each plugin file
1. Make sure the PHP binary in the Shebang line is executable

# Installation

1. Perform your configuration (see above)
1. Move the plugins into the Munin plugin directory:  

  ```shell
  mv mcjson* /usr/share/munin/plugins/
  ```

1. Change the ownership:  

  ```shell
  chown munin:munin /usr/share/munin/plugins/mcjson*
  ```

1. Make sure they are executable:  

  ```shell
  chmod 755 /usr/share/munin/plugins/mcjson*
  ```

1. Enable the plugins:  

  ```shell
  ln -s /usr/share/munin/plugins/mcjson* /etc/munin/plugins/
  ```

1. Restart your munin-node:  

  ```shell
  service munin-node restart
  ```

1. Run your cron:  

  ```shell
  su - munin --shell=/bin/sh -c /usr/bin/munin-cron
  ```

You did it! Point your browser to your Munin instance and enjoy the nice Bukkit graphs! :)

# Update, March 27, 07:29 am

I took a look at my MySQL tables again to find some more useful resources that I can turn into neat fancy graphs and came across the SQL data of UltraBans and Statistician. Both plugins became very essential for [my Minecraft](http://yeahwh.at) server: UltraBans is responsible and bedrock of our [Hall of Shame](http://shame.yeahwh.at) because it stores the ban entries in SQL tables and not in flat-files. Statistician is a detailed stats tracking plugin and allows us our [statistics frontend](http://stats.yeahwh.at).

So I wrote five SQL based plugins:

(screenshot coming tomorrow)

* hostile mob kills (via Statistician)
* neutral mob kills (via Statistician)
* passive mob kills (via Statistician)
* new players per day (via Statistician)
* kicks/bans/mutes/etc. per day (via UltraBans)

You can find them in the existing repository on [GitHub](https://github.com/yeahwhat-mc/munin-bukkit-plugins). The configuration and installation is pretty much the same like the JSONAPI ones above. Just change the MySQL credentials in each plugin, enable them, restart Munin and you are done!
