let mix = require('laravel-mix')

mix
  .setPublicPath('./')
  .sass('assets/sass/popup.scss', 'dist/css') //compile to dist/css folder
  .js('assets/js/background.js', 'dist/js') //compile to dist/js folder
  .options({ processCssUrls: false })
