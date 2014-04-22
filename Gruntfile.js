module.exports = function (grunt) {

    grunt.initConfig({
        watch: {
            fest: {
                files: ['templates/*.xml'],
                tasks: ['fest'],
                options: {
                    atBegin: true
                }
            },
            sass: {
                files: ['public/css/*.scss'],
                tasks: ['sass'],
                options: {
                    atBegin: true
                }
            },
            express: {
                files:  [
                    'routes/**/*.js',
                    'app.js'
                ],
                tasks:  [ 'express' ],
                options: {
                    spawn: false
                }
            },
            server: {
                files: [
                    'public/js/**/*.js',
                    'public/css/**/*.css'
                ],
                options: {
                    interrupt: true,
                    livereload: true
                }
            }
        },
        requirejs: {
            build: { /* Подзадача */
                options: {
                    almond: true,
                    baseUrl: "public/js",
                    mainConfigFile: "public/js/main.js",
                    name: "main",
                    optimize: "none",
                    out: "public/js/build/main.js"
                }
            }
        },
        concat: {
            build: { /* Подзадача */
                options: {
                    separator: ';\n'
                },
                src: ['public/js/lib/almond.js','public/js/build/main.js'],
                dest: 'public/js/build.js'
            }
        },
        uglify: {
            build: { /* Подзадача */
                files: [
                    {
                    src: ['public/js/build.js'],
                    dest: 'public/js/build.min.js'
                    }
                ]
            }
        },
        sass: {
            css: { /* Подзадача */
                files: [
                    {
                        expand: true,
                        cwd: 'public/css', /* исходная директория */
                        src: '*.scss', /* имена шаблонов */
                        dest: 'public/css', /* результирующая директория */
                        ext: '.css'
                    }
                ]
            }
        },
        express: {
            server: {
                options: {
                    livereload: true,
                    port: 8000,
                    script: 'app.js'
                }
            }
        },
        fest: {
            templates: {
                files: [{
                    expand: true,
                    cwd: 'templates',
                    src: '*.xml',
                    dest: 'public/js/tmpl'
                }],
                options: {
                    template: function (data) {
                        return grunt.template.process(
                            'define(function () { return <%= contents %> ; });',
                            {data: data}
                        );
                    }
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-fest');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.registerTask('default', ['express', 'watch']);
    grunt.registerTask(
        'build',
        [
            'fest', 'requirejs:build',
            'concat:build', 'uglify:build'
        ]
    );
};
