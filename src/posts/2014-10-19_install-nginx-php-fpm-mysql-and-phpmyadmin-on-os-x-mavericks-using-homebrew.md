---
title: "Install Nginx, PHP and MySQL on OS X"
date: 2014-10-19T04:34:00.000Z
disqus_id: 13
slug: install-nginx-php-fpm-mysql-and-phpmyadmin-on-os-x-mavericks-using-homebrew
---

Recently I've got a new MacBook Pro and decided to set it up from scratch, because I use the same Time Machine backup to migrate from since about four years. Perfect time to get rid of the web server/LAMP (**L**inux **A**pache **M**ySQL **P**HP) stack and replace it with Nginx and PHP-FPM as FastCGI implementation. Below you can read how to setup Nginx, PHP-FPM, MySQL and phpMyAdmin on OS X 10.9 / Mavericks.

> **Updated for Yosemite users**: Updated the guide for 10.10 since Yosemite is officially released. The steps are basically the same as for Mavericks.

# Xcode

First of all, get the latest *Xcode* version (6.1) via the Mac App Store:

[Download Xcode.app (via Mac App Store)](https://itunes.apple.com/de/app/xcode/id497799835)

As soon as you've finished the download, open Xcode in your `/Applications` folder and agree to the licence.

Open a new Terminal window and install the Xcode Command Line Tools:

    xcode-select --install

Confirm the installation dialog with `Install`.

Back in Xcode, hit `⌘ + ,` to access the *Preferences* and navigate to the *Locations* tab. Set the *Command Line Tools* to the latest version available , *Xcode 6.1 (61A1052c)* in my example:

![Xcode.app → Preferences → Location | Command Line Tools](/assets/images/posts/install-nginx-php-fpm-mysql-and-phpmyadmin-on-os-x-mavericks-using-homebrew/1.png)

Make sure you use at least Xcode 6.1!

# Homebrew

Now we need to install *Homebrew*, which is a package manager for OS X. You probably already heard about `apt-get` or `aptitude` on Linux distributions to install packages or depencies for a specific application. `brew` works the same, just on Mac operating systems. It will also make sure that you will get the latest updates of the installed packages as well, so you don't need to worry about outdated versions or vulnerable security flaws and exploits either.

First, we need to download and install Homebrew using the following command:

    ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

Check for any conflicts or problems (If you have confilcts, sort them out before you continue with this guide):

    brew doctor

Update and upgrade its formulas in case you already had Homebrew installed before:

    brew update && brew upgrade

# PHP-FPM

Because Homebrew doesn't have a default formula for PHP-FPM, we need need to add this first:

    brew tap homebrew/dupes
    brew tap homebrew/php

Now install it with the following arguments:

    brew install --without-apache --with-fpm --with-mysql php56

Homebrew is downloading now the PHP-FPM source code and compiling it for you. Give it some time, it can take several minutes.

## Setup PHP CLI binary

If you want to use the PHP command line binary, you need to update the `$PATH` environment variable of your shell profile:

    # If you use Bash    
    echo 'export PATH="/usr/local/sbin:$PATH"' >> ~/.bash_profile
    . ~/.bash_profile

    # If you use ZSH
    echo 'export PATH="/usr/local/sbin:$PATH"' >> ~/.zshrc
    . ~/.zshrc

## Setup auto start

Create a folder for our LaunchAgents and symlink the start/stop service:  

    mkdir -p ~/Library/LaunchAgents
    ln -sfv /usr/local/opt/php56/homebrew.mxcl.php56.plist ~/Library/LaunchAgents/

And start PHP-FPM:

    launchctl load -w ~/Library/LaunchAgents/homebrew.mxcl.php56.plist

Make sure PHP-FPM is listening on port 9000:  

`lsof -Pni4 | grep LISTEN | grep php`

The output should look something like this:

    php-fpm   69659  frdmn    6u  IPv4 0x8d8ebe505a1ae01      0t0  TCP 127.0.0.1:9000 (LISTEN)
    php-fpm   69660  frdmn    0u  IPv4 0x8d8ebe505a1ae01      0t0  TCP 127.0.0.1:9000 (LISTEN)
    php-fpm   69661  frdmn    0u  IPv4 0x8d8ebe505a1ae01      0t0  TCP 127.0.0.1:9000 (LISTEN)
    php-fpm   69662  frdmn    0u  IPv4 0x8d8ebe505a1ae01      0t0  TCP 127.0.0.1:9000 (LISTEN)    

# MySQL

Next step is to install MySQL:

    brew install mysql

## Setup auto start

    ln -sfv /usr/local/opt/mysql/*.plist ~/Library/LaunchAgents

And start the database server:

    launchctl load ~/Library/LaunchAgents/homebrew.mxcl.mysql.plist

## Secure the installation

To seure our MySQL server, we'll exececute the provided `secure_mysql_installation` binary to change the root password, remove anonymous users and disbale remote root logins:

    mysql_secure_installation

 <clear>

    > Enter current password for root (enter for none):

Press enter since you don't have one set.

    > Change the root password? [Y/n]

Press enter, choose a root password, add it in your 1Password keychain and enter it here.

    > Remove anonymous users? [Y/n]

Yes. They are not necessary.

    > Disallow root login remotely? [Y/n]

Yes. No need to log in as root from any other IP than 127.0.0.1.

    > Remove test database and access to it? [Y/n]

Yes. We don't need the testing tables.

    > Reload privilege tables now? [Y/n]

Reload the privilege table to ensure all changes made so far will take effect.

## Test connection

    mysql -uroot -p

Enter your root password and you should see the MySQL console:

    Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

    mysql>

Quit the session with `\q`:

    mysql> \q
    Bye

# phpMyAdmin

Install `autoconf`, which is needed for the installation of phpMyAdmin:

    brew install autoconf

 Set $PHP_AUTOCONF:

    # If you use Bash
    echo 'PHP_AUTOCONF="'$(which autoconf)'"' >> ~/.bash_profile && . ~/.bash_profile
    # If you use ZSH
    echo 'PHP_AUTOCONF="'$(which autoconf)'"' >> ~/.zshrc && . ~/.zshrc

Let's start with the installation of phpMyAdmin:

    brew install phpmyadmin

# Nginx

Install the default *Nginx* with:

    brew install nginx

## Setup auto start

Since we want to use port 80 have to start the Nginx process as root:

    sudo cp -v /usr/local/opt/nginx/*.plist /Library/LaunchDaemons/
    sudo chown root:wheel /Library/LaunchDaemons/homebrew.mxcl.nginx.plist

## Test web server

Start Nginx for the first with:

    sudo launchctl load /Library/LaunchDaemons/homebrew.mxcl.nginx.plist

The default configuration is set that it will listen on port 8080 instead of the HTTP standard 80. Ignore that for now:

    curl -IL http://127.0.0.1:8080

The output should look like:

    HTTP/1.1 200 OK
    Server: nginx/1.6.2
    Date: Mon, 19 Oct 2014 19:07:47 GMT
    Content-Type: text/html
    Content-Length: 612
    Last-Modified: Mon, 19 Oct 2014 19:01:32 GMT
    Connection: keep-alive
    ETag: "5444dea7-264"
    Accept-Ranges: bytes

Stop Nginx again:

    sudo launchctl unload /Library/LaunchDaemons/homebrew.mxcl.nginx.plist

# More configuration

## nginx.conf

Create some folders which we are going to use in the configurtion files:

    mkdir -p /usr/local/etc/nginx/logs
    mkdir -p /usr/local/etc/nginx/sites-available
    mkdir -p /usr/local/etc/nginx/sites-enabled
    mkdir -p /usr/local/etc/nginx/conf.d
    mkdir -p /usr/local/etc/nginx/ssl
    sudo mkdir -p /var/www

    sudo chown :staff /var/www
    sudo chmod 775 /var/www

Remove the current default `nginx.conf` (which is also available as `/usr/local/etc/nginx/nginx.conf.default` in case you want to take a look) and download my custom one via `curl` from GitHub:

    rm /usr/local/etc/nginx/nginx.conf
    curl -L https://gist.github.com/frdmn/7853158/raw/nginx.conf -o /usr/local/etc/nginx/nginx.conf

The configuration is simple and as lightweight as possible: worker settings, log format/paths and some includes. None of unnecessary (and probably commented out) stuff out of the `nginx.conf.default`.

## Load PHP FPM

Download my PHP-FPM configuration from GitHub:

    curl -L https://gist.github.com/frdmn/7853158/raw/php-fpm -o /usr/local/etc/nginx/conf.d/php-fpm

## Create default virtual hosts

    curl -L https://gist.github.com/frdmn/7853158/raw/sites-available_default -o /usr/local/etc/nginx/sites-available/default
    curl -L https://gist.github.com/frdmn/7853158/raw/sites-available_default-ssl -o /usr/local/etc/nginx/sites-available/default-ssl
    curl -L https://gist.github.com/frdmn/7853158/raw/sites-available_phpmyadmin -o /usr/local/etc/nginx/sites-available/phpmyadmin

Clone my example virtual host (including 404, 403 and a `phpinfo()` rewrite) using `git`:

    git clone http://git.frd.mn/frdmn/nginx-virtual-host.git /var/www
    rm -rf /var/www/.git

And remove `/var/www/.git` folder so your future projects won't get tracked by git.

## Setup SSL

Create folder for our SSL certificates and private keys:

    mkdir -p /usr/local/etc/nginx/ssl

Generate 4096bit RSA keys and the self-sign the certificates in one command:

    openssl req -new -newkey rsa:4096 -days 365 -nodes -x509 -subj "/C=US/ST=State/L=Town/O=Office/CN=localhost" -keyout /usr/local/etc/nginx/ssl/localhost.key -out /usr/local/etc/nginx/ssl/localhost.crt
    openssl req -new -newkey rsa:4096 -days 365 -nodes -x509 -subj "/C=US/ST=State/L=Town/O=Office/CN=phpmyadmin" -keyout /usr/local/etc/nginx/ssl/phpmyadmin.key -out /usr/local/etc/nginx/ssl/phpmyadmin.crt


## Enable virtual hosts

Now we need to symlink the virtual hosts we want to enable into the `sites-enabled` folder:

    ln -sfv /usr/local/etc/nginx/sites-available/default /usr/local/etc/nginx/sites-enabled/default
    ln -sfv /usr/local/etc/nginx/sites-available/default-ssl /usr/local/etc/nginx/sites-enabled/default-ssl
    ln -sfv /usr/local/etc/nginx/sites-available/phpmyadmin /usr/local/etc/nginx/sites-enabled/phpmyadmin

Start Nginx again:

    sudo launchctl load /Library/LaunchDaemons/homebrew.mxcl.nginx.plist

# Final tests

Thats it, everything should be up and running. Click on the links below to ensure that:

* [http://localhost](http://localhost) → "Nginx works" page  
* [http://localhost/info](http://localhost/info) → `phpinfo()`    
* [http://localhost/nope](http://localhost/nope) → " Not Found" page  
* [https://localhost:443](https://localhost:443) → "Nginx works" page (SSL)  
* [https://localhost:443/info](https://localhost:443/info) → `phpinfo()` (SSL)  
* [https://localhost:443/nope](https://localhost:443/nope) → "Not Found" page (SSL)  
* [https://localhost:306](https://localhost:306) → phpMyAdmin (SSL)  

# Control the services

Because your probably need to restart the one or other service sooner or later, you probably want to set up some aliases:

    curl -L https://gist.github.com/frdmn/7853158/raw/bash_aliases -o /tmp/.bash_aliases
    cat /tmp/.bash_aliases >> ~/.bash_aliases

    # If you use Bash
    echo "source ~/.bash_aliases" >> ~/.bash_profile
    # If you use ZSH
    echo "source ~/.bash_aliases" >> ~/.zshrc

You can either open a new Terminal window/session or enter the following command to reload the shell configuration in your current one:

    source ~/.bash_profile
    # or
    source ~/.zshrc

Now you can use short aliases instead of typing in `launchctl` arguments and plist paths.

## Nginx

You can start, stop and restart Nginx with:

    nginx.start
    nginx.stop
    nginx.restart

To quickly tail the latest error or access logs:

    nginx.logs.access
    nginx.logs.default.access
    nginx.logs.phpmyadmin.access
    nginx.logs.default-ssl.access
    nginx.logs.error
    nginx.logs.phpmyadmin.error

Check config:

    sudo nginx -t

## PHP-FPM

Start, start and restart PHP-FPM:

    php-fpm.start
    php-fpm.stop
    php-fpm.restart

Check config:

    php-fpm -t

## MySQL

Start, start and restart your MySQL server:

    mysql.start
    mysql.stop
    mysql.restart

# FAQ

Here are some of the frequently asked questions out of the comment section below. In case you have any issue or problem, try to check below if you find your problem listed.  

## Nginx: `[emerg] mkdir() "/usr/local/var/run/nginx/client_body_temp"`

Upgraded to Yosemite and now Nginx doesn't start anymore? Try to reinstall the brew formula:

    brew reinstall --force nginx

## PHP-FPM: `lsof -Pni4 | grep LISTEN | grep php` doesn't return anything  

Make sure your `$PATH` variable is properly set:

    echo $PATH | grep php56

If that command doesn'T return anything you probably forgot to adjust your `.zshrc`/`.bash_profile`. Make sure to add this line at the end:

    export PATH="$(brew --prefix homebrew/php/php56)/bin:$PATH"

## git: `Could not resolve host: git.frd.mn`

Probably an outage of my private hosted GitLab server. To fix this, simply try to get in contact with me. Either via [Twitter](https://twitter.com/frdmn), [E-Mail](mailto:j@frd.mn) IRC (frdmn@freenode/espernet) or the comment section below. I'll try to respond as soon as possible and fix potential issues.

## curl: `Failed to connect to localhost port 80: Connection refused`

This is an IPv6 related issue, originating in the `/etc/hosts` file of your Mac. To fix this, find the line "fe80::1%lo0 localhost" and comment it out. Or just use this one liner:

    sudo sed -i "" 's/^fe80\:\:/\#fe80\:\:/g' /etc/hosts

## brew: `configure: error: Can not find OpenSSL's <evp.h>`

Make sure Xcode as well as Xcode's CLI tools as installed and up to date!

## Mavericks: Compilation error while building PHP / missing zlib

    $ sudo ln -s /Applications/Xcode5-DP.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX10.9.sdk/usr/include /usr/include

---

Let me know in case you stuck at some point or you have some suggestions!
