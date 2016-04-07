---
title: "Install Nginx, PHP and MySQL on OS X"
date: 2014-10-19T04:34:00.000Z
disqus_id: 13
slug: install-nginx-php-fpm-mysql-and-phpmyadmin-on-os-x-mavericks-using-homebrew
---

Recently I got a new MacBook Pro and decided to set it up from scratch, because I've used the same Time Machine backup to migrate from about four years over and over again.

Perfect time to get rid of the LAMP (Linux Apache MySQL PHP) web server stack and replace it with Nginx and PHP-FPM. Below you can read a detailed guide how to setup Nginx, PHP-FPM, MySQL and phpMyAdmin on OS X 10.9 / Mavericks.

> **Updated for Yosemite users**: Updated the guide for OS X 10.10 since Yosemite is officially released. The steps are basically the same as for the Mavericks installation.

# Xcode

First of all, get the latest *Xcode* version (6.1) via the Mac App Store: [Mac App Store link](https://itunes.apple.com/en/app/xcode/id497799835)

As soon as the download is finished, open Xcode.app in your `/Applications` folder and agree to the licence.

Open a new Terminal.app window and install the *Xcode command line tools*:

```shell
xcode-select --install
```

Confirm the installation dialog with `Install`.

Back in *Xcode*, hit <kbd>⌘</kbd> + <kbd>,</kbd> to access the `Preferences` and then navigate to the `Locations` tab to set the `Command Line Tools` to the latest version available — `Xcode 6.1 (61A1052c)` in my example:

![Xcode.app → Preferences → Location | Command Line Tools](/assets/images/posts/install-nginx-php-fpm-mysql-and-phpmyadmin-on-os-x-mavericks-using-homebrew/1.png)

Make sure you have at least *Xcode* 6.1!

# Homebrew

Now you need to install *Homebrew*, a package manager for OS X — kind of like `apt` is one for Linux. `brew` works the same, just for Mac operating systems. It will make sure that you receive the latest updates of your installed packages, so you don't need to worry about outdated versions or vulnerable security flaws, etc.

First, you need to download and install *Homebrew* using the following command:

```shell
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

Check for any conflicts or problems (If you have conflicts, sort them out before you continue with this guide):

```shell
brew doctor
```

Make sure the doctor responds with something along the lines:

> Your system is ready to brew.

In case you already had *Homebrew* installed, update the existing *Homebrew* installation as well as the installed packages:

```shell
brew update && brew upgrade
```

# PHP-FPM

Because Homebrew doesn't come with a formula for *PHP-FPM* by default, you need to `tap` (or register) a special *PHP* repository first:

```shell
brew tap homebrew/dupes
brew tap homebrew/php
```

Now you can install *PHP* using the following command. The arguments make sure it compiles with *MySQL* support and doesn't configure the default Apache:

```shell
brew install --without-apache --with-fpm --with-mysql php56
```

Homebrew is now going to download and compile the *PHP-FPM* source code for you. Give it some time, it could take some minutes. ☕

## Setup PHP CLI binary

If you want to use the *PHP* command line tools, you need to update the `$PATH` environment variable of your shell profile.

**If you use the default *Bash* shell:**

```shell
echo 'export PATH="/usr/local/sbin:$PATH"' >> ~/.bash_profile && . ~/.bash_profile
```

**If you use *ZSH*:**

```shell
echo 'export PATH="/usr/local/sbin:$PATH"' >> ~/.zshrc && . ~/.zshrc
```

If you are not sure which one you use, run `echo $SHELL` in a Terminal.app window. Since I use *ZSH* it returns this:

```
/bin/zsh
```

## Setup auto start

Create a folder for the LaunchAgents and symlink the start/stop service:

```shell
mkdir -p ~/Library/LaunchAgents
ln -sfv /usr/local/opt/php56/homebrew.mxcl.php56.plist ~/Library/LaunchAgents/
```

Now try to start *PHP-FPM*:

```shell
launchctl load -w ~/Library/LaunchAgents/homebrew.mxcl.php56.plist
```

Assure *PHP-FPM* is running. To do so, check if there is an open listener on port `9000`:

```shell
lsof -Pni4 | grep LISTEN | grep php
```

The output should look something like this:

```
php-fpm   69659  frdmn    6u  IPv4 0x8d8ebe505a1ae01      0t0  TCP 127.0.0.1:9000 (LISTEN)
php-fpm   69660  frdmn    0u  IPv4 0x8d8ebe505a1ae01      0t0  TCP 127.0.0.1:9000 (LISTEN)
php-fpm   69661  frdmn    0u  IPv4 0x8d8ebe505a1ae01      0t0  TCP 127.0.0.1:9000 (LISTEN)
php-fpm   69662  frdmn    0u  IPv4 0x8d8ebe505a1ae01      0t0  TCP 127.0.0.1:9000 (LISTEN)    
```

# MySQL

Next step is to install our *MySQL* server:

```shell
brew install mysql
```

And set up the start/stop service, so the *MySQL* server gets automatically started and stopped when the Mac is shutdown/powered on:

```shell
ln -sfv /usr/local/opt/mysql/*.plist ~/Library/LaunchAgents
```

To start if manually for now, run:

```shell
launchctl load ~/Library/LaunchAgents/homebrew.mxcl.mysql.plist
```

## Secure the installation

To secure our *MySQL* server, we'll execute the provided `secure_mysql_installation` binary to change the root password, remove anonymous users and disable remote root logins:

```shell
mysql_secure_installation
```

```
> Enter current password for root (enter for none):
```

Press <kbd>Enter</kbd> since you don't have one set.

```
Change the root password? [Y/n]
```

Confirm using <kbd>Enter</kbd> to accept the suggested default answer (`Y`), choose a root password, add it to your *1Password* keychain or just write it down and finally enter it here in the prompt.

```
> Remove anonymous users? [Y/n]
```

Yes - <kbd>Enter</kbd>. They are not necessary.

```
> Disallow root login remotely? [Y/n]
```

<kbd>Enter</kbd> — No need to log in as root from any other IP than 127.0.0.1.

```
> Remove test database and access to it? [Y/n]
```

<kbd>Enter</kbd> — You don't need the testing tables.

```
> Reload privilege tables now? [Y/n]
```

<kbd>Enter</kbd> — Reload the privilege tables to ensure all of the changes made so far will take effect immediately.

## Test connection

```shell
mysql -uroot -p
```

Enter your root password and you should see the *MySQL* console:

```
Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql>
```

Since you now know that this works, you can log out and quit the session using `\q`:

```
mysql> \q
Bye
```

# phpMyAdmin

Install `autoconf`, which is needed for the installation of *phpMyAdmin*:

```shell
brew install autoconf
```

And set the `$PHP_AUTOCONF` environment variable:

**If you use the default *Bash* shell:**

```shell
echo 'PHP_AUTOCONF="'$(which autoconf)'"' >> ~/.bash_profile && . ~/.bash_profile
```

**or if you use *ZSH*:**

```shell
echo 'PHP_AUTOCONF="'$(which autoconf)'"' >> ~/.zshrc && . ~/.zshrc
```

Since now you're all set, you can finish this part with the actual installation of *phpMyAdmin*:

```shell
brew install phpmyadmin
```

# Nginx

Install the default *Nginx* with:

```shell
brew install nginx
```

## Setup auto start

Since you want to use port 80 (default HTTP port), you have to run the *Nginx* process with root privileges:

```shell
sudo cp -v /usr/local/opt/nginx/*.plist /Library/LaunchDaemons/
sudo chown root:wheel /Library/LaunchDaemons/homebrew.mxcl.nginx.plist
```

(Only the root user is allowed to open listening ports < 1024)

## Test web server

Start *Nginx* for the first with:

```shell
sudo launchctl load /Library/LaunchDaemons/homebrew.mxcl.nginx.plist
```

The default configuration currently active so it will listen on port 8080 instead of the HTTP default port 80. Ignore that for now:

```shell
curl -IL http://127.0.0.1:8080
```

The output should look like this:

```
HTTP/1.1 200 OK
Server: nginx/1.6.2
Date: Mon, 19 Oct 2014 19:07:47 GMT
Content-Type: text/html
Content-Length: 612
Last-Modified: Mon, 19 Oct 2014 19:01:32 GMT
Connection: keep-alive
ETag: "5444dea7-264"
Accept-Ranges: bytes
```

Stop *Nginx* again:

```shell
sudo launchctl unload /Library/LaunchDaemons/homebrew.mxcl.nginx.plist
```

# More configuration

## nginx.conf

Create these bunch of folders which we're going to use for the upcoming configuration:

```shell
mkdir -p /usr/local/etc/nginx/logs
mkdir -p /usr/local/etc/nginx/sites-available
mkdir -p /usr/local/etc/nginx/sites-enabled
mkdir -p /usr/local/etc/nginx/conf.d
mkdir -p /usr/local/etc/nginx/ssl
sudo mkdir -p /var/www
sudo chown :staff /var/www
sudo chmod 775 /var/www
```

Remove the current `nginx.conf` (which is also available as `/usr/local/etc/nginx/nginx.conf.default` in case you want to restore the defaults) and download my custom from *GitHub*:

```shell
rm /usr/local/etc/nginx/nginx.conf
curl -L https://gist.github.com/frdmn/7853158/raw/nginx.conf -o /usr/local/etc/nginx/nginx.conf
```

The configuration is simple and as lightweight as possible: worker settings, log format/paths and some includes. None of unnecessary (and probably commented out) stuff like in the `nginx.conf.default`.

## Load PHP FPM

Download my custom *PHP-FPM* configuration from *GitHub*:

```shell
curl -L https://gist.github.com/frdmn/7853158/raw/php-fpm -o /usr/local/etc/nginx/conf.d/php-fpm
```

## Setup example virtual hosts

```shell
curl -L https://gist.github.com/frdmn/7853158/raw/sites-available_default -o /usr/local/etc/nginx/sites-available/default
curl -L https://gist.github.com/frdmn/7853158/raw/sites-available_default-ssl -o /usr/local/etc/nginx/sites-available/default-ssl
curl -L https://gist.github.com/frdmn/7853158/raw/sites-available_phpmyadmin -o /usr/local/etc/nginx/sites-available/phpmyadmin
```

Clone my example virtual hosts (including 404/403 error pages and a `phpinfo()` status site) using `git`:

```shell
git clone http://git.frd.mn/frdmn/nginx-virtual-host.git /var/www
rm -rf /var/www/.git
```

And remove the `.git` folder so your content won't get tracked by git.

## Setup SSL

Create a folder for our SSL certificates and private keys:

```shell
mkdir -p /usr/local/etc/nginx/ssl
```

Generate 4096 bit RSA keys and the self-sign the certificates in one command:

```shell
openssl req -new -newkey rsa:4096 -days 365 -nodes -x509 -subj "/C=US/ST=State/L=Town/O=Office/CN=localhost" -keyout /usr/local/etc/nginx/ssl/localhost.key -out /usr/local/etc/nginx/ssl/localhost.crt
openssl req -new -newkey rsa:4096 -days 365 -nodes -x509 -subj "/C=US/ST=State/L=Town/O=Office/CN=phpmyadmin" -keyout /usr/local/etc/nginx/ssl/phpmyadmin.key -out /usr/local/etc/nginx/ssl/phpmyadmin.crt
```

## Enable virtual hosts

Now you need to symlink the virtual hosts that you want to enable into the `sites-enabled` folder:

```shell
ln -sfv /usr/local/etc/nginx/sites-available/default /usr/local/etc/nginx/sites-enabled/default
ln -sfv /usr/local/etc/nginx/sites-available/default-ssl /usr/local/etc/nginx/sites-enabled/default-ssl
ln -sfv /usr/local/etc/nginx/sites-available/phpmyadmin /usr/local/etc/nginx/sites-enabled/phpmyadmin
```

And start *Nginx* again:

```shell
sudo launchctl load /Library/LaunchDaemons/homebrew.mxcl.nginx.plist
```

# Final tests

Congratulations, that's it! Everything should be set up and running. Click on the links below to ensure that your virtual hosts show the correct content:

| Virtual host | Expected content |
| :------ | :------ |
| [http://localhost](http://localhost) | "Nginx works" page |
| [http://localhost/info](http://localhost/info) |  `phpinfo()` status |
| [http://localhost/nope](http://localhost/nope) | "Not Found" page |
| [https://localhost:443](https://localhost:443) | "Nginx works" page (SSL) |
| [https://localhost:443/info](https://localhost:443/info) | `phpinfo()` (SSL) |
| [https://localhost:443/nope](https://localhost:443/nope) | "Not Found" page (SSL) |
| [https://localhost:306](https://localhost:306) | phpMyAdmin (SSL) |

# Control the services

Because your probably need to restart the one or other service sooner or later, you probably want to set up some aliases:

```shell
curl -L https://gist.github.com/frdmn/7853158/raw/bash_aliases -o /tmp/.bash_aliases
cat /tmp/.bash_aliases >> ~/.bash_aliases
```

**If you use the default *Bash* shell:**

```shell
echo "source ~/.bash_aliases" >> ~/.bash_profile && . ~/.bash_profile
```

**or if you use *ZSH*:**

```shell
echo "source ~/.bash_aliases" >> ~/.zshrc &&  ~/.zshrc
```

Now you can use handy short aliases instead of typing the long `launchctl` commands:

## Nginx

You can start, stop and restart *Nginx* with:

```shell
nginx.start
nginx.stop
nginx.restart
```

To quickly tail the latest error or access logs:

```shell
nginx.logs.access
nginx.logs.default.access
nginx.logs.phpmyadmin.access
nginx.logs.default-ssl.access
nginx.logs.error
nginx.logs.phpmyadmin.error
```

Check config:

```shell
sudo nginx -t
```

## PHP-FPM

Start, start and restart *PHP-FPM*:

```shell
php-fpm.start
php-fpm.stop
php-fpm.restart
```

Check config:

```shell
php-fpm -t
```

## MySQL

Start, start and restart your *MySQL* server:

```shell
mysql.start
mysql.stop
mysql.restart
```

# FAQ

Here are some of the frequently asked questions out of the comment section below. In case you encounter any issue or problem, check below if you find a solution.

### Nginx: '[emerg] mkdir() "/usr/local/var/run/nginx/client_body_temp"'

> Upgraded to Yosemite and now *Nginx* doesn't start anymore? Try to reinstall the `brew` formula:
> ```shell
> brew reinstall --force nginx
> ```

### PHP-FPM: 'lsof -Pni4 | grep LISTEN | grep php' doesn't return anything  

> Make sure your `$PATH` variable is properly set:
>
> ```shell
> echo $PATH | grep php56
> ```
>
> If that command doesn't return anything at all, you probably forgot to adjust your `.zshrc`/`.bash_profile`. Make sure to add this line at the end:
>
> ```shell
>export PATH="$(brew --prefix homebrew/php/php56)/bin:$PATH"
> ```

### git: 'Could not resolve host: git.frd.mn'

> Probably an outage of my private hosted *GitLab* server. To fix this, simply try to get in touch with me. Either via [Twitter](https://twitter.com/frdmn), [E-Mail](mailto:j@frd.mn) IRC (frdmn@freenode/espernet) or the comment section below.

### curl: 'Failed to connect to localhost port 80: Connection refused'

> This is an IPv6 related issue, originating in the `/etc/hosts` file of your Mac. To fix this, find the line "`fe80::1%lo0 localhost`" and comment it out. Or just use this one-liner:
>
> ```shell
> sudo sed -i "" 's/^fe80\:\:/\#fe80\:\:/g' /etc/hosts
> ```

### brew: 'configure: error: Can not find OpenSSL's <evp.h>'

> Make sure *Xcode* as well as Xcode's CLI tools as installed and up to date!

### Mavericks: Compilation error while building PHP / missing zlib

> Try to restore the `/usr/include` directory:
>
> ```shell
> sudo ln -s /Applications/Xcode5-DP.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX10.9.sdk/usr/include /usr/include
> ```

---

Let me know in case you're stuck at some point or have general feedback or suggestions!
