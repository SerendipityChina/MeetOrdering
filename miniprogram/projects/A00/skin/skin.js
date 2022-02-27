module.exports = {
	PID: 'A00',

	NAV_COLOR: '#ffffff',
	NAV_BG: '#3B74F5',

	MEET_NAME: '会议', 
 
	MENU_ITEM: ['首页', '日程安排', '我的'], // 第1,4,5菜单

	NEWS_CATE: '1=大会资讯,2=参会流程,3=特邀嘉宾,4=会场信息',
	MEET_TYPE: '1=专题论坛|leftbig2,2=交流沙龙|leftbig3',

	DEFAULT_FORMS: [{
			type: 'line',
			title: '姓名',
			desc: '请填写您的姓名',
			must: true,
			len: 50,
			onlySet: {
				mode: 'all',
				cnt: -1
			},
			selectOptions: ['', ''],
			mobileTruth: true,
			checkBoxLimit: 2,
		},
		{
			type: 'line',
			title: '手机',
			desc: '请填写您的手机号码',
			must: true,
			len: 50,
			onlySet: {
				mode: 'all',
				cnt: -1
			},
			selectOptions: ['', ''],
			mobileTruth: true,
			checkBoxLimit: 2,
		}
	]
}