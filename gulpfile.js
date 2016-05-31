var
gulp            = require('gulp'),
sass            = require('gulp-sass'),
shell           = require('gulp-shell'),
data            = require('gulp-data'),
nunjucksRender  = require('gulp-nunjucks-render'),
browserSync     = require('browser-sync'),
file            = require('gulp-file'),
plumber         = require('gulp-plumber'),
yaml            = require('gulp-yaml'),
File            = require('vinyl'),
md5             = require('md5'),
es              = require('event-stream'),
intercept       = require('gulp-intercept'),
minimist        = require('minimist'),
fs              = require('fs'),
flatten         = require('gulp-flatten'),
Diacritic       = require('diacritic'),
packagejson     = require('./package.json');




// define options & configuration ///////////////////////////////////

// get arguments from command line
var argv = minimist(process.argv.slice(2));

// command line options (usage: gulp --optionname)
var cliOptions = {
  verbose   : false || argv.verbose,
  nosync    : false || argv.nosync
};

// gulpfile options
var options = {
  path: './source/templates/', // base path to templates
  dataPath: './source/data/', // base path to datasets
  ext: '.html', // extension to use for templates
  dataExt: '.json', // extension to use for data
  manageEnv: nunjucksEnv, // function to manage nunjucks environment
  libraryPath: 'node_modules/govlab-styleguide/dist/', // path to installed sass/js library distro folder
  defaultData: './source/data/default.json' // default dataset to use if no automatically generated template is found
};

// initialize browsersync
gulp.task('bs', function() {
  if (!cliOptions.nosync) {
    bs.init({
      server: 'public',
      open: false
    });
  }
});

// DENNYS CUSTOM FUNCTIONS
// define custom functions ///////////////////////////////////

// converts string t to a slug (eg 'Some Text Here' becomes 'some-text-here')
function slugify(t) {
  return t ? Diacritic.clean(t.toString().toLowerCase())
  .replace(/\s+/g, '-')
  .replace(/[^\w\-]+/g, '')
  .replace(/\-\-+/g, '-')
  .replace(/^-+/, '')
  .replace(/-+$/, '')
  : false ;
}

// define custom functions ///////////////////////////////////
function returnPerson(p) {
  var person;
  var peopleJSON = require('./source/data/people.json');
  for (var i = 0; i < peopleJSON.data.length; i++) {
    var fullName = peopleJSON.data[i].name.first + " " + peopleJSON.data[i].name.last;
    if (fullName === p) {
      person = peopleJSON.data[i];
    } 
  }
  return person;
}

function sortJsonDescByDate(d) {
  var sortedData = d.sort(function(a,b) {
    return new Date(b.date.start) - new Date(a.date.start);
  });
  return sortedData;
}

function sortJsonAscByDate(d) {
  var sortedData = d.sort(function(a,b) {
    return new Date(a.date.start) - new Date(b.date.start);
  });
  return sortedData;
}

function isOutdated(d) {
  var today = new Date();
  if (today > new Date(d)) {
    return true;
  } else {
    return false;
  }
}

function getLatestCourses(data) {
  var latestCourses = [];
  var sortedCourses = sortJsonDescByDate(data);
  for (var i = 0; i < 3; i++) {
    latestCourses.push(sortedCourses[i]);
  }
  // console.log(latestCourses);
  return sortJsonAscByDate(latestCourses);
}



// DEV TASKS

















// CLAUDIOS ORIGINAL GULP
// set up nunjucks environment
function nunjucksEnv(env) {
  env.addFilter('slug', slugify);
  env.addFilter('returnPerson', returnPerson);
  env.addFilter("sortJsonDescByDate", sortJsonDescByDate);
  env.addFilter("sortJsonAscByDate", sortJsonAscByDate);
  env.addFilter("isOutdated", isOutdated);
  env.addFilter("getLatestCourses", getLatestCourses);
}

gulp.task('browserSyncDesign', function() {
  browserSync({
    server: {
      baseDir: 'public' // This is the DIST folder browsersync will serve
    },
    open: false
  })
})

gulp.task('sassDesign', function() {
  return gulp.src('source/sass/styles.scss')  // sass entry point
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest('public/css'))
  .pipe(browserSync.stream());
});

gulp.task('imgDesign', function() {
  return gulp.src('source/img/**/*')
  .pipe(plumber())
  .pipe(gulp.dest('public/img'))
  .pipe(browserSync.stream());
});

gulp.task('jsDesign', function() {
  return gulp.src(['node_modules/govlab-styleguide/js/**/*', 'source/js/**/*'])
  .pipe(plumber())
  .pipe(gulp.dest('public/js'))
  .pipe(browserSync.stream());
});

// Nunjucks
gulp.task('nunjucksDesign', function() {

  var options = {
    path: 'source/templates',
    ext: '.html'
  };
  // nunjucksRender.nunjucks.configure(['source/templates/']);

  return gulp.src('source/templates/**/*.+(html|nunjucks)')
  .pipe(plumber())
  // Adding data to Nunjucks
  .pipe(data(function() {
    return require('./source/data/data.json');
  }))
  .pipe(nunjucksRender(options))
  .pipe(gulp.dest('public'))
  .pipe(browserSync.reload({
    stream: true
  }));
});

gulp.task('deploy', ['sass', 'nunjucks', 'js', 'img'], shell.task([
  'git subtree push --prefix public origin gh-pages'
  ])
);

// Claudio's Design Task
gulp.task('design', ['browserSyncDesign', 'sassDesign', 'nunjucksDesign', 'jsDesign', 'imgDesign'], function (){
  gulp.watch('source/sass/**/*.scss', ['sassDesign']);
  gulp.watch('source/templates/**/*.html', ['nunjucksDesign']);
  gulp.watch('source/img/**/*', ['imgDesign']);
  gulp.watch('source/js/**/*', ['jsDesign']);
});


// Default Task for generating the site
gulp.task('default', ['browserSync', 'sass', 'nunjucks', 'js', 'img'], function (){
  gulp.watch('source/sass/**/*.scss', ['sass']);
  gulp.watch('source/templates/**/*.html', ['nunjucks']);
  gulp.watch('source/img/**/*', ['img']);
  gulp.watch('source/js/**/*', ['js']);
});