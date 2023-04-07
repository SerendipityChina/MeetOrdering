module.exports = { //feehouse
	PROJECT_COLOR: '#6588E6',
	NAV_COLOR: '#ffffff',
	NAV_BG: '#6588E6',

	// setup
	SETUP_CONTENT_ITEMS: [
		{ title: '关于我们', key: 'SETUP_CONTENT_ABOUT' },
		{ title: '物业服务', key: 'SETUP_CONTENT_SVR' }, 
	],

	// 用户
	USER_REG_CHECK: false,
	USER_FIELDS: [
		{ mark: 'building', title: '楼栋房号', type: 'text', must: true },
	],


	NEWS_NAME: '公告通知',
	NEWS_CATE: [
		{ id: 1, title: '最新通知', style: 'leftbig1' },
		{ id: 2, title: '缴费须知', style: 'leftbig1' },
	],
	NEWS_FIELDS: [],


	SHEET_NAME: '账单',
	SHEET_CATE: [
		{ id: 1, title: '账单' },
	],
	SHEET_FIELDS: [
		{ mark: 'start', title: '账务开始日期', type: 'text', must: true },
		{ mark: 'end', title: '账务结束日期', type: 'text', must: true },
		{ mark: 'desc', title: '费用简要说明', type: 'textarea', must: false },
		{
			mark: 'fields', title: '数据列', type: 'rows',
			ext: {
				titleName: '数据列',
				hasDetail: false,
				hasVal: false,
				maxCnt: 30,
				minCnt: 2,
				checkDetail: true,
				hasPic: false,
				checkPic: true
			},
			def: [
				{ mark: 'name', title: '姓名', edit: false },
				{ mark: 'mobile', title: '手机', edit: false },
				{ mark: 'money', title: '应缴金额', edit: false },
				{ title: '房号' },
				{ title: '房租' },
				{ title: '物业费' },
				{ title: '水电费' },
				{ title: '备注' }
			],
			must: true
		}

	],
}