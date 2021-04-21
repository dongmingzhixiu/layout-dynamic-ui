# v1.1.8
## [添加轻量级结构化Web文档渲染](./ld-doc.md)
### 优化 `ld-doc`
-　添加行号，添加复制按钮，点击添加到剪贴板。

# v1.1.2
## [添加轻量级结构化Web文档渲染](./ld-doc.md)
## 支持标签
### p, h1 , h2 , h3 , slot(具名插槽) , tip(tip|tip_p 主题色，tip_d 危险色，tip_w 警告色 tip_i 信息色 tip_s 成功色)
> 添加代码支持，使用的是[prismjs](https://prismjs.com/#languages-list)，需要支持代码高亮时需要闯入`codeLanguages`参数；
> codeLanguages=["html", "css", "javascript", "php", "dart", "bash", "shell", "sql"];
> 也就是说在对象参数中可以使用如上的标签

# v1.1.1
## [添加后台管理页组件](./ld-frame.md)
## 优化
- 1.优化[`ld-menu-tree`](./ld-menu-tree.md) 组件
- 2.优化[`ld-page-tabs`](./ld-page-tabs.md)组件

# v1.0.9
## [添加标签页组件](./ld-page-tabs.md)

# v1.0.8
## [添加菜单树组件](./ld-menu-tree.md)

# v1.0.6
## 修复一系列打包后出现的问题
- 1.修复[`ld-table`](./ld-table.md) 自动加载数据打包后出现问题
- 2.修改[`axios`](./axios.md)封装后生产环境和开发环境地址不能使用问题，改为统一一个地址
- 3.修改[`ld-table`](./ld-table.md) 表格得到数据后装饰数据的出现错误问题
- 4.修复[`ld-table`](./ld-table.md) npm打包后数据报错问题
## 添加支持
- 1.添加[`ld-forms`](./ld-forms.md) 子项组件支持getOptions远程数据加载方式的 支持
- 2.添加[`ld-forms`](./ld-forms.md) 自动保存方法支持
- 3.添加[`ld-forms`](./ld-forms.md) 自动初始化表单值的配置支持
- 4.添加[`ld-table`](./ld-table.md) 动态加载另一张表字段支持
