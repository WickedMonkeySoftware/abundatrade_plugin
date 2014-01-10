module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'js/<%= pkg.jsFile %>.js',
                dest: 'js/<%= pkg.jsFile %>.min.js'
            }
        },
        qunit: {
            all: ['tests/*.html']
        },
        watch: {
            files: ['tests/*.js', 'tests/*.html', 'js/*.js'],
            tasks: ['qunit']
        },
        php: {
            dist: {
                options: {
                    port: 80,
                    base: 'web',
                    open: true,
                    keepalive: true
                }
            }
        },
        phpcs: {
            application: {
                dir: 'src'
            },
            options: {
                bin: 'phpcs',
                standard: 'PSR-MOD'
            }
        },
        phplint: {
            options: {
                swapPath: 'tmp'
            },
            all: ['*.php', 'skel/*.php', 'tabs/*.php']
        },
        phpunit: {
            unit: {
                dir: 'phptests/unit'
            },
            options: {
                bin: 'phpunit',
                bootstrap: 'phptests/Bootstrap.php',
                colors: true,
                testdox: true
            }
        },
        php_analyzer: {
            application: {
                dir: '.'
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');

    //load php specific stuff
    grunt.loadNpmTasks('grunt-phpcs');
    grunt.loadNpmTasks('grunt-php');
    grunt.loadNpmTasks('grunt-phplint');
    grunt.loadNpmTasks('grunt-phpunit');
    grunt.loadNpmTasks('grunt-php-analyzer');

    // Default task(s).
    grunt.registerTask('default', ['qunit', 'uglify']);
    grunt.registerTask('test', ['qunit']);
    grunt.registerTask('precommit', ['phplint:all', 'phpunit:unit']);
    grunt.registerTask('server', ['php']);
};