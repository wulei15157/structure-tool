module.exports = function(grunt){
  // 1. 初始化插件配置
  grunt.initConfig({
      //主要编码处


      // 合并js
   concat: {
       options: { //可选项配置
           separator: ';' //使用;连接合并
       },
       build: { //此名称任意
           src: ["src/js/*.js"], //合并哪些js文件  合并js下面所有的js文件：src/js/**/*.js 
           dest: "build/js/built.js" //输出的js文件
       }
   },

//压缩js
pkg : grunt.file.readJSON('package.json'),
uglify : {
  options: {  //不是必须的
    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
    '<%= grunt.template.today("yyyy-mm-dd") %> */'
  },
  build: {
    files: {
      'build/js/built-<%=pkg.name%>-<%=pkg.version%>.min.js': ['build/js/built.js']
    }
  }
},

//js语法检查

jshint : {
  options: {
    jshintrc : '.jshintrc' //指定配置文件
  },
  build : ['Gruntfile.js', 'src/js/*.js'] //指定检查的文件
},




  })
  // 2. 加载插件任务
	grunt.loadNpmTasks('grunt-contrib-concat')
	grunt.loadNpmTasks('grunt-contrib-uglify')
	grunt.loadNpmTasks('grunt-contrib-jshint')


  // 3. 注册构建任务 grunt 执行任务是同步的
	grunt.registerTask('default', ['concat','uglify','jshint'])
}
