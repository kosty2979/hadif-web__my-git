/**
 * System configuration for Angular samples
 * Adjust as necessary for your application needs.
 */
(function (global) {
  System.config({
    paths: {
      // paths serve as alias
      'npm:': 'node_modules/'
    },
    // map tells the System loader where to look for things
    map: {
      // our app is within the app folder
      app: 'app',

      // angular bundles
      '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
      '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
      '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
      '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
      '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
      '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
      '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
      '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',

      // other libraries
      '@ngx-translate/core':       'npm:@ngx-translate/core/bundles/core.umd.js',
      '@ngx-translate/http-loader':'npm:@ngx-translate/http-loader/bundles/http-loader.umd.js',
      'rxjs':                      'npm:rxjs',
      'angular-in-memory-web-api': 'npm:angular-in-memory-web-api/bundles/in-memory-web-api.umd.js',
      'ts-md5':                    'npm:ts-md5',
      'ngx-rating':                'npm:ngx-rating/index.js',
      'moment':                    'npm:moment',
      'moment-timezone':           'npm:moment-timezone',
      'angular2-toaster':          'npm:angular2-toaster/bundles/angular2-toaster.umd.js',
      'angular2-contextmenu':      'npm:angular2-contextmenu/',
      'angular-confirmation-popover':      'npm:angular-confirmation-popover/dist/umd/angular-confirmation-popover.js'
        },
    // packages tells the System loader how to load when no filename and/or no extension
    packages: {
      'app': {
        main: './main.js',
        defaultExtension: 'js'
      },
      'rxjs': {
        defaultExtension: 'js'
      },
      'moment':{
        main: 'min/moment-with-locales.js', 
        defaultExtension: 'js'  
      },
      'moment-timezone':{
        main: 'builds/moment-timezone-with-data-2012-2022.js', 
        defaultExtension: 'js'  
      },
      'ts-md5': {main: '/md5.js'},
      'angular2-contextmenu': { 
        main: 'angular2-contextmenu.js', 
        defaultExtension: 'js' 
      }
    }
  });
})(this);
