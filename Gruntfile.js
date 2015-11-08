module.exports = function(grunt) {
  grunt.initConfig({
    swig_it: {
      'dist': {
        options: {
          data: require('./cv.json')
        },
        src: ['./cv.html'],
        dest: 'dist'
      }
    },

    html_pdf: {
      'dist': {
        options: {
          format: 'A4',
          orientation: 'portrait',
          quality: '75',
          border: {
            top: '0.5in',
            right: '0.7in',
            bottom: '0.5in',
            left: '0.7in'
          }
        },
        files: {
          'dist/cv.pdf': ['dist/cv.html']
        }
      }
    },

    clean: {
      'dist': ['dist']
    },

    'gh-pages': {
      options: {
        base: 'dist',
        repo: 'https://' + process.env.GH_TOKEN + '@github.com/loki2302/cv-generator.git'
      },
      src: '**/*'
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-swig-it');
  grunt.loadNpmTasks('grunt-html-pdf');
  grunt.loadNpmTasks('grunt-gh-pages');

  grunt.registerTask('default', ['clean', 'swig_it', 'html_pdf']);
  grunt.registerTask('deploy', ['default', 'gh-pages']);
};
