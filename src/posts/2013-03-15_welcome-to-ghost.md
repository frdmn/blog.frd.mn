---
title: "Like a hacker"
slug: welcome-to-ghost
disqus_id: 1
date: 2013-03-15T11:00:00.000Z
---

![$ jekyll --server --auto](/assets/images/posts/welcome-to-ghost/1.png)

The one or other of you might have read [Tom](http://tom.preston-werner.com/)'s blog post "[how to blog like a hacker](http://tom.preston-werner.com/2008/11/17/blogging-like-a-hacker.html)". If not here's a quick TL;DR:

# dynamic/CMS based blogs (like WordPress)

* constantly lag behind the latest software release
* time consuming
* good themes aren't made "in a trice" and take ages
* dynamic page construction is slow to serve

# static page based blogs (like [Jekyll](https://github.com/mojombo/jekyll/))

* data stored in `git` repo or [Dropbox](http://dropbox.com)
* CLI friends can write blog posts in `vim`
* `jekyll` server is watching for changes in Dropbox
* static pages are generated and moved into the `DocumentRoot` (Apache, nginx)
* no need for HTML knowledge
* no need for any DBMS
* way faster serve to the clients
* very complex to setup (gems, ruby, bundle, rake) and a lot of dependencies

So that's why I also made the decision to give the whole blogging thing another try. This time the static and awesome way.

After some hours of failing and getting started with Ruby in general, I made it and set up a proper working Jekyll instance. I spent a day into the design and templates (thanks to @[ffffancy](http://twitter.com/ffffancy) at this point) and here we go. This is my first markdown written blog post ever!

Don't expect updates every second day. I will probably post very fluctuating and spontaneous.
