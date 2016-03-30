---
title: "Solving \"Unknown table engine 'InnoDB'\""
date: 2013-04-16T10:00:00.000Z
disqus_id: 5
slug: solving-unknown-table-engine-innodb
---

In case you run into such an error after tuning / tweaking your MySQL configuration:

# Unknown table engine 'InnoDB'

... you should make sure that you clear all of your __ib_logfile[01]__:  

(Yes — it's safe to delete them once the database isn't running anymore. They are getting recreated with the 3rd step)

    $ service mysql stop
    $ rm /var/lib/mysql/ib_logfile*
    $ service mysql start

Et voilà! :)
