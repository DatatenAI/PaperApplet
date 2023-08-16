// 应用全局配置
module.exports = {
	staticUrl: 'https://chatwithpapers.oss-cn-hongkong.aliyuncs.com/images/',
	// baseUrl: 'https://website-chatpaper-yvimfzmzjx.cn-hongkong.fcapp.run',
	// TODO(yjb): checkout docs for HBuilder of switching configs between dev and prod.
	baseUrl: 'http://localhost:3000',//192.168.88.121
	// baseUrl: 'https://website-chatpaper-fsiijzmehw.cn-hongkong.fcapp.run',
	// baseUrl: 'https://chatPaper.carmela.tech',
	
	webViewUrl:'https://html2image.dataten.top', // 阿里云 OSS 域名
	// webViewUrl:'http://template.newjiabo.com/chatpaper',
	// webViewUrl:'https://registersysrem.newjiabo.com', // 胡师兄的域名
	// webViewUrl:'https://html2image.oss-cn-hongkong.aliyuncs.com',
	
	
	appId:'wx93f94152c830f126',
	// 应用信息
	appInfo: {
		// 应用名称
		name: "chat-paper",
		// 应用版本
		version: "1.1.0",
		// 应用logo
		logo: "/static/logo.png",
		// 官方网站
		site_url: "https://chatwithpaper.org/",
		// 政策协议
		agreements: [{
				title: "隐私政策",
				url: "https://ruoyi.vip/protocol.html"
			},
			{
				title: "用户服务协议",
				url: "https://ruoyi.vip/protocol.html"
			}
		]
	}
}