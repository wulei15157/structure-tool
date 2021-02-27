//webpack入口文件   webpack本身只能构建js 和  json
//运行指令 开发环境：webpack ./src/entry.js -o ./build/build.js --mode=development
//  生产环境：webpack ./src/entry.js -o ./build/build.js --mode=production

document.write('entry.js is working')

function add(a,b){
return a+b

}
add(1,2)
console.log(add(1,2))