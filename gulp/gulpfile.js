 var gulp = require('gulp');
  var del = require('del');
  var clean = require('gulp-clean'); //直接用del也是一样的
 // var path = require('path') //自带 
 var sass = require('gulp-sass');
  sass.compiler = require('node-sass');

 // var concat = require('gulp-concat') // 合并(js/css)
 // var uglify = require('gulp-uglify') //压缩js
 // var rename = require('gulp-rename') //压缩之后重命名
 // var connect = require('gulp-connect');
  var open = require('open');
 // var cleanCss = require('gulp-clean-css')
 // var less = require('gulp-less')
 // var htmlmin = require('gulp-htmlmin') //压缩html
 // var livereload = require('gulp-livereload')
  var $ = require('gulp-load-plugins')(); //打包加载gulp插件,即上面的插件都不用自己导入。
 var autoprefixer = require('gulp-autoprefixer');   //css 兼容
 var jshint = require('gulp-jshint'); //js检查   npm i jshint gulp-jshint -D
 var notify = require('gulp-notify');    //提示         //npm install --save-dev gulp-notify




 // src 文件源  dest 文件拷贝目标
 //配置文件位置
 //*代表所有
 //datas:把同级两个文件夹一起合并到datas
 var paths = {
     root: {
           src: "dist"
     },
     html: {
         src: "*.html",
         dest: "dist"
     },
     css: {
         src: "src/css/**/*.css",
         dest: "dist/css/"
     },
     sass: {
         src: "src/sass/**/*.scss",
         dest: "src/css/"
     },
     less: {
         src: "src/less/**/*.less",
         dest: "src/css/"
     },
     js: {
         src: "src/js/*.js",
         dest: "dist/js/"
     },
     images: {
         src: "src/images/**/*",
         dest: "dist/images/"
     },
     datas: {
         src: ["json/*.json", "xml/*.xml", "!xml/04.xml"],
         dest: "dist/datas/"
     }
 };



 //配置任務

// 检查js
gulp.task('jshint', function () {
return gulp.src([paths.js.src,'./gulpfile.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
   //  .pipe(jshint.reporter('fail'))  
    .pipe(notify({message: '检查完成'}));
});



 //js  任务
 gulp.task('js', function() {
     return gulp.src(paths.js.src)
         .pipe($.concat('all.js')) //合并到临时文件  
         .pipe(gulp.dest(paths.js.dest))
         .pipe($.uglify()) //压缩
         .pipe($.rename({ suffix: '.min' })) //重命名  
         .pipe(gulp.dest(paths.js.dest))
         // .pipe(livereload())   实时刷新
         .pipe($.connect.reload());
          

 });
 // 转换less

 gulp.task('less', function() {
     return gulp.src(paths.less.src)
         .pipe($.less()) //编译less文件为css文件
         .pipe(gulp.dest(paths.less.dest))
         .pipe($.connect.reload());
 });



 //sass转换css
 gulp.task('sass', function() {
     return gulp.src(paths.sass.src)
         .pipe($.sass().on('error', sass.logError))
         .pipe(gulp.dest(paths.sass.dest))
         .pipe($.connect.reload());
 });


 gulp.task('css', function() {
     return gulp.src(paths.css.src)
          .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0', 'ios_saf>=6.0'],
            cascade: true, //是否美化属性值 默认：true     
            remove: true //是否去掉不必要的前缀 默认：true 
        }))   //css兼容
       .pipe($.concat('build.css')) //合并所有css
         .pipe(gulp.dest(paths.css.dest))
         .pipe($.rename({ suffix: '.min' })) //重命名
         .pipe($.cleanCss({ compatibility: 'ie8' }))  //压缩支持IE8选项配置
         .pipe(gulp.dest(paths.css.dest))
         // .pipe(livereload())
         .pipe($.connect.reload());
 });



 gulp.task('html', function() {
     return gulp.src(paths.html.src)
         .pipe($.htmlmin({ collapseWhitespace: true }))
         .pipe(gulp.dest(paths.html.dest))
         // .pipe(livereload())
         .pipe($.connect.reload());
 });


 gulp.task('images', function() {
     return gulp.src(paths.images.src)
         .pipe(gulp.dest(paths.images.dest))
         // .pipe(livereload())
         .pipe($.connect.reload());
 });
 gulp.task('datas', function() {
     return gulp.src(paths.datas.src)
         .pipe(gulp.dest(paths.datas.dest))
         // .pipe(livereload())
         .pipe($.connect.reload());
 });



/**
 * 清空目标目录
 */
gulp.task('clean', function() {
    return gulp.src('dist')
    .pipe(clean());
});


 gulp.task('del', function() {
     return del(paths.root.src);


 });




 gulp.task('server', function() {

     //配置服务器的选项
     $.connect.server({
         root: paths.root.src, //监视的源目标文件路径
         livereload: true, //是否实时刷新
         port: 5000 //开启端口号
     });

     // 自动开启链接
     open('http://localhost:5000'); //npm install open --save-dev
 });


 // 合并任务  gulp.series按順序完成任務    gulp.parallel 并行完成任务
 gulp.task('default', gulp.series(['del', 'html', 'sass', 'less', 'css', 'js', 'images', 'datas','jshint']));


//注册监视任务（半自动）
 gulp.task('watch', gulp.series('default', function(cb) {
    //开启监视  刷新
      $.livereload.listen();
       //监视指定的文件, 并指定对应的处理任务
     gulp.watch(paths.less.src, gulp.series(['less']));
     gulp.watch(paths.sass.src, gulp.series(['sass']));
     gulp.watch(paths.html.src, gulp.series(['html']));
     gulp.watch(paths.css.src, gulp.series(['css']));
     gulp.watch(paths.js.src, gulp.series(['js']));
     gulp.watch(paths.images.src, gulp.series(['images']));
     gulp.watch(paths.datas.src, gulp.series(['datas']));
    gulp.watch([paths.js.src,'./gulpfile.js'], gulp.series(['jshint']));

     cb();
 }));

//注册监视任务（全自动）
 gulp.task('server', gulp.series('default', function(cb) {
     //配置服务器的选项
     $.connect.server({
         root: 'dist/', //监视的源目标文件路径
         livereload: true, //是否实时刷新
         port: 5000 //开启端口号
     });
     // 自动开启链接
      open('http://localhost:5000'); //npm install open --save-dev
     gulp.watch(paths.less.src, gulp.series(['less']));
     gulp.watch(paths.sass.src, gulp.series(['sass']));
     gulp.watch(paths.html.src, gulp.series(['html']));
     gulp.watch(paths.css.src, gulp.series(['css']));
     gulp.watch(paths.js.src, gulp.series(['js']));
     gulp.watch(paths.images.src, gulp.series(['images']));
     gulp.watch(paths.datas.src, gulp.series(['datas']));
     gulp.watch([paths.js.src,'./gulpfile.js'], gulp.series(['jshint']));
  


     cb();
 }));


 //注册监视任务（全自动）
 //gulp.task('go', gulp.series('default', 'server', 'watch'))