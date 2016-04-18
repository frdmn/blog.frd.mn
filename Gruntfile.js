module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        info: grunt.file.readJSON('info.json'),
        dirs: {
            bower: 'bower_components',
            build: 'build/assets/js',
            css: 'assets/css',
            js: 'assets/js',
            images: 'assets/images',
            icons: 'assets/icons'
        },

        // SCSS
        sass: {
            dev: {
                options: {
                    outputStyle: 'expanded',
                    loadPath: '.'
                },
                files: {
                    '<%= dirs.css %>/style.css': '<%= dirs.css %>/style.scss',
                    '<%= dirs.css %>/print.css': '<%= dirs.css %>/print.scss'
                }
            },
            build: {
                options: {
                    outputStyle: 'compressed',
                    loadPath: '.'
                },
                files: {
                    '<%= dirs.css %>/style.css': '<%= dirs.css %>/style.scss',
                    '<%= dirs.css %>/print.css': '<%= dirs.css %>/print.scss'
                }
            }
        },

        // CSS autoprefixer
        autoprefixer: {
            options: {
                browsers: ['last 2 versions']
            },
            dist: {
                files: {
                    '<%= dirs.css %>/style.css': '<%= dirs.css %>/style.css'
                }
            }
        },

        // Connect Server
        connect: {
            server: {
                options: {
                    port: 9001,
                    base: ''
                }
            }
        },

        mdspell: {
            options: {
                ignoreAcronyms: true,
                ignoreNumbers: true
            },
            files: {
                src: ['src/**/*.md']
            },
        },

        // Concat
        concat: {
            options: {
                separator: ';',
            },
            dist: {
                src: [
                    '<%= dirs.bower %>/jquery/dist/jquery.js',
                    '<%= dirs.bower %>/headroom.js/dist/headroom.js',
                    '<%= dirs.bower %>/headroom.js/dist/jQuery.headroom.js',
                    '<%= dirs.bower %>/clipboard/dist/clipboard.js',
                    '<%= dirs.js %>/*.js',
                    '!<%= dirs.js %>/build.js'
                ],
                dest: '<%= dirs.js %>/build.js',
            },
        },

        // Replace
        replace: {
            dist: {
                options: {
                    patterns: [
                        {
                            match: 'DISQUS_PUBLIC_KEY',
                            replacement: '<%= info.disqusPublicKey %>'
                        }
                    ]
                },
                files: [
                    {expand: true, flatten: true, src: ['<%= dirs.build %>/build.js'], dest: '<%= dirs.build %>/'}
                ]
            }
        },

        cacheBust: {
            taskName: {
                options: {
                    baseDir: 'build',
                    assets: ['assets/js/build.js','assets/css/*.css', 'assets/images/**', 'assets/icons/**/*.css'],
                    deleteOriginals: true
                },
                files: [{
                    expand: true,
                    cwd: 'build',
                    src: ['**/index.html']
                }]
            }
        },

        // JShint
        jshint: {
            all: [
                'Gruntfile.js',
                '<%= dirs.js %>/*.js',
                '!<%= dirs.js %>/highlight.pack.js',
                '!<%= dirs.js %>/build.js'
            ]
        },

        // HTMLhint
        htmlhint: {
            html: {
                options: {
                    'tag-pair': true
                },
                src: ['*.html']
            }
        },

        // Uglify
        uglify: {
            all: {
                files: {
                    '<%= dirs.js %>/build.js': ['<%= dirs.js %>/build.js']
                }
            }
        },

        // Imagemin
        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: '<%= dirs.images %>',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: '<%= dirs.images %>'
                }]
            }
        },

        // Grunticon
        grunticon: {
            icons: {
                files: [{
                    expand: true,
                    cwd: '<%= dirs.icons %>',
                    src: ['*.svg', '*.png'],
                    dest: "<%= dirs.icons %>/grunticon"
                }],
                options: {
                    cssprefix: ".icon--",
                    customselectors: {
                      "*": [".icon--$1:before"]
                    }
                }
            }
        },

        // Browser Sync
        browser_sync: {
            dev: {
                bsFiles: {
                    src : 'assets/css/style.css'
                },
                options: {
                    watchTask: true,
                    server: {
                        baseDir: ""
                    },
                    ghostMode: {
                        clicks: true,
                        scroll: true,
                        links: true,
                        forms: true
                    },
                }
            }
        },

        // Execute metalsmith
        execute: {
            build: {
                src: ['index.js']
            },
            dev: {
                src: ['copy_dev_assets.js']
            }
        },

        // Watch
        watch: {
            options: {
                livereload: true
            },
            sass: {
                files: ['<%= dirs.css %>/*.scss'],
                tasks: ['sass:dev', 'autoprefixer', 'execute:dev', 'replace']
            },
            images: {
                files: ['<%= dirs.images %>/*.{png,jpg,gif}'],
                tasks: ['imagemin']
            },
            icons: {
                files: ['<%= dirs.icons %>/*'],
                tasks: ['grunticon']
            },
            html: {
                files: ['*.html'],
                tasks: ['htmlhint', 'execute:dev', 'replace']
            },
            templates: {
                files: ['templates/**/*.hbt'],
                tasks: ['execute:build', 'replace']
            },
            content: {
                files: ['src/**/*.md'],
                tasks: ['mdspell', 'execute:build', 'replace']
            },
            scripts: {
                files: ['Gruntfile.js', '<%= dirs.js %>/*.js'],
                tasks: ['jshint', 'concat', 'execute:dev', 'replace'],
                options: {
                    spawn: false
                }
            }
        }
    });

    grunt.registerTask('default', ['sass:build', 'autoprefixer', 'concat', 'uglify', 'imagemin', 'grunticon', 'mdspell', 'execute:build', 'replace', 'cacheBust']);
    grunt.registerTask('dev', ['connect', 'watch', 'notify']);
    grunt.registerTask('dev:sync', ['browser_sync', 'watch', 'notify']);
};
