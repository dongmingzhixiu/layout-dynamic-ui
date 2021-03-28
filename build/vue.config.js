module.exports = {
  // 将 examples 目录添加为新的页面
  pages: {
    index: {
      // page 的入口
      entry: 'src/lib/index.js',
      // 模板来源
      template: 'src/componetns/*.vue',
      // 输出文件名
      filename: 'index.js'
    }
  }
}