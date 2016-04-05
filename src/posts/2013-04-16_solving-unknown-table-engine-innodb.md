---
title: "Solving \"Unknown table engine 'InnoDB'\""
date: 2013-04-16T10:00:00.000Z
disqus_id: 5
slug: solving-unknown-table-engine-innodb
---

In case you ever run into an error `Unknown table engine 'InnoDB'
` after tuning / tweaking your MySQL configuration, here's how to fix it easily:

(Please note, that we're going to clear all of your __ib_logfile__. Yes — it's usually safe to delete them as soon as the database isn't running anymore. They are getting recreated with the 3rd step)

```shell
service mysql stop
rm /var/lib/mysql/ib_logfile*
service mysql start
```

Et voilà! :)
