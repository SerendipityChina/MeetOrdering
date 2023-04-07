const pageHelper = require('../../../../../helper/page_helper.js'); 
const ProjectBiz = require('../../../biz/project_biz.js');
const PassportBiz = require('../../../../../comm/biz/passport_biz.js');

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
	 
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		ProjectBiz.initPage(this);
	//	if (!await PassportBiz.loginMustBackWin(this)) return;

		this._getSearchMenu();
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	bindRefreshTap: async function (e) {
		await this.selectComponent("#list").reload();
	},

	bindCommListCmpt: function (e) {
		pageHelper.commListListener(this, e);
	},

	/** 搜索菜单设置 */
	_getSearchMenu: function () {
		let sortItem1 = [
			{ label: '全部', type: '', value: '' },
			{ label: '待缴费', type: 'status', value: '0' },
			{ label: '已缴费', type: 'status', value: '1' }, 
			{ label: '无须缴费', type: 'status', value: '99' },
			{ label: '时间倒序', type: 'sort', value: 'SHEET_DATA_ADD_TIME|desc' },
			{ label: '时间正序', type: 'sort', value: 'SHEET_DATA_ADD_TIME|asc' },
			{ label: '金额倒序', type: 'sort', value: 'SHEET_DATA_FEE|desc' },
			{ label: '金额正序', type: 'sort', value: 'SHEET_DATA_FEE|asc' }
		];

		let sortItems = [];
		let sortMenus = sortItem1;

		this.setData({
			search: '',
			sortItems,
			sortMenus,
			isLoad: true
		});

	}, 
 

	url: function (e) {
		pageHelper.url(e, this);
	},


})