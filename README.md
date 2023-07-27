# PaperApplet

量拾小程序的前端代码

## 运行
1. 下载[HBuilder X](https://www.dcloud.io/hbuilderx.html?lang=en)。
2. 下载[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)，并在HBuilder X内（菜单栏的“工具” -> “设置” -> “运行配置” -> “小程序运行配置” -> “微信开发者工具路径”）设置微信开发者工具的路径。
3. 在HBuilder X内用微信开发者工具运行代码（工具栏“运行”按钮 -> “微信开发者工具”，如果没有“微信开发者工具”的选项，需要到工具栏“运行”按钮 -> “自定义菜单” -> “显示微信开发者工具菜单”）。
4. HBuilder X会自动打开微信开发者工具，并打开小程序。运行过程中可能会需要安装额外的包，按照提示安装并重新运行代码即可。

## 问题解决
如果上述运行步骤出现问题（比如HBuilder X或微信开发者工具的console中有报错），可能可以通过以下方法进行解决：
1. 检查微信开发者工具服务端口（菜单栏“设置” -> “安全” -> “服务端口”）是否开启。
2. 检查manifest中的“微信小程序配置” -> “微信小程序AppID”是否与微信开发者工具中登录的帐号的AppID（可以在[这里](https://developers.weixin.qq.com/sandbox?tab=miniprogram&hl=zh)查看，链接打不开的话多刷新几遍，或者粘贴到浏览器中运行）一致。
3. 检查config.js中配置是否正确，尤其是AppID是否与第2条中一致，baseUrl是否正确（如果是本地测试，需要与本地后端运行的端口一致，一般为`http://localhost:3000`）。
4. 此外[后端仓库](https://github.com/DatatenAI/ChatPaperAPI)中的.env文件中的WX_APPID和WX_SECRETKEY需要与微信开发者工具的登录帐号的（查看方法同第2条）一致。
5. 本仓库config.js和[后端仓库](https://github.com/DatatenAI/ChatPaperAPI).env中的其它配置（比如数据库链接、OSS链接等）也需要根据开发需求进行调整（比如连接哪一个测试数据库）。