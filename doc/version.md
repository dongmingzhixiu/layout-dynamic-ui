# v.1.5.1
## 优化 `ld-forms`中的`ld-image`添加旋转图片参数；优化图片最大数量显示处理。
## 修复其他问题


# v.1.5.0
## 优化 `ld-table`多级表头的嵌套模式，只需要在对应列中包含`children`关键字即可。形如 `{label:'地址',prop:'address',children:[{label:'市',prop:'city'},{label:'街道',prop:'town'}]}`
## 修复其他问题


# v.1.4.9
## 修复`ld-forms`中`image`组件因为hash问题引起的异常
## 添加`ld-frame`中添加头部小工具最大最小化
## 添加全局变量`headToolInfo`,通过 get set获取和设置头部工具的操作状态
## 修复其他问题


# v.1.4.7
## 为`ld-table`解决替换列因查询异常，导致数据替换失败问题
## 为`this.$ld.util.request`相关方法打包后异常问题,并且添加`headers`设置
## 为`ld-forms`的`save-forms-data-before`保存数据之前的装饰函数支持Promise模式
## 优化`ld-image`插件，支持上传图片和图片显示，添加 `getImagePath`参数和全局`this.$ld.getImagePath`参数，支持对初始化加载图片路径的修改和补充
## 添加`requestFile`文件上传请求方法，固定的`Content-type='multipart/form-data;boundary=时间戳'`
## 修复其他问题

# v.1.4.6
## 为`ld-doc`的猫链接添加hash值。
## 为`ld-forms`组件change添加value联动值设置。
## 优化`ld-doc`组件在地址栏不显示锚点信息
## 优化`ld-menu-tree`组件折叠后鼠标悬浮不显示二级菜单问题。（当折叠后，鼠标悬浮显示二级菜单时会在控制台报`Maximum call stack size exceeded.`错误。不折叠时不会出现该错误！）该错误通过多种方式解决目前任然存在该问题,尽可能的保证鱼和熊掌都有。
## 修复其他问题

# v.1.4.5
## 为`ld-forms`的图片组件添加`accept`参数，在选择图片弹窗时，对文件类型进行过滤。
## 修复其他问题


# v.1.4.4
## 为`ld-menu-tree`是否展示所有子节点参数
## 默认展开`ld-doc`的大纲

# v1.4.3
## 添加`ld-forms`添加联动时，动态获取数据条件和当前表单数据关联的功能[联动参数注入](./ld-forms.md##联动参数动态注入)
## 修复已知其他问题


# v1.4.2
## 修复`ld-table`树形菜单第一列样式问题
## 修改`ld-table`参数`elTablProperty`为`elTableProperty`
## 修改`ld-table`参数`el-tabl-property`为`el-table-property`
## 修复`ld-forms`组件联动后仍然被验证问题
## 修复`ld-forms`初始组件时没有被联动
## 修复已知其他问题

##
# v1.4.1
## 修复`ld-frame`点击触发已打开窗口不能再次选中问题
## 添加`ld-frame`刷新方法
## 修复已知其他问题

# v1.4.0
## 添加 `getMonthDiff` 和 `getYearDiff`方法
## 优化`ld-menu-tree`折叠后文字显示问题
## 修复已知其他问题


# v1.3.9
## 修复`ld-doc`文档点击锚链接新开窗口问题
## 修复`ld-table`多级表头顺序错乱问题
## 修复已知其他问题

# v1.3.8
## 修复`ld-forms`组件校验问题
## 为`ld-doc`添加大纲插槽，可通过插槽自定义大纲
## 修复已知其他错误


# v1.3.7
## 修复`ld-forms`中的日期样式问题，添加日期范围提示文字支持
## 优化`ld-forms`中的图片组件最大选择问题
## 修复已知其他错误


# v1.3.6
## 修复`ld-menu-tree`组件样式异常问题
## 新增使用mockjs时axios支持,使用代码进行设置`this.$ld.requestSetting.config.isMock = true;`

# v1.3.5
## 修复`ld-doc`组件点击左侧菜单跳转到文件内容异常
## 修复已知其他错误

# v1.3.4
## 修复打包后 this.$ld.util.cookie.get()方法出错问题！
## 为`ld-page-tabs`的tabs参数中的子项设置 是否显示关闭和刷新按钮 参数，满足特殊需求,同样适用于`ld-frame`!
## 修复`ld-table`自动加载数据时，list参数异常问题
## 修复已知其他错误

# v1.2.9
## 为`ld-doc` 添加是否显示大纲参数 `show-outline`
## 添加全局请求超时处理函数

# v1.2.8
## 添加复制到剪贴板方法[`copyToClipboard`](./ld-util.md#copyToClipboard)
## 优化 `ld-doc` 添加大纲，大纲
## 修复`ld-frame`组件，关闭页面后，再次打开不选中问题！

# v1.2.6
## 优化 `ld-page-loading` 使用`Loaders.css`支持更加丰富的加载动画

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
