const AdminBiz = require('../../../../../../comm/biz/admin_biz.js');
const pageHelper = require('../../../../../../helper/page_helper.js'); 
const AdminSheetBiz = require('../../../../biz/admin_sheet_biz.js');
const projectSetting = require('../../../../public/project_setting.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: { 
		isLoad: false,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		if (!pageHelper.getOptions(this, options)) return;
		if (!AdminBiz.isAdmin(this)) return;


		let idx = options.idx;
		let parent = pageHelper.getPrevPage(2);
		if (!parent) return;

		this.setData({
			sheet: parent.data.dataList.list[idx],
			sheetId: parent.data.dataList.list[idx]._id,
			_params: { sheetId: this.data.id }
		});

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
	onShow: async function () { },

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

	url: async function (e) {
		pageHelper.url(e, this);
	},

	bindCommListCmpt: function (e) {
		pageHelper.commListListener(this, e);
	},


	bindDelTap: async function (e) {
		if (!AdminBiz.isAdmin(this)) return;
		AdminSheetBiz.delSheetData(e, this);

	},

	bindRefundTap: async function (e) {
		if (!AdminBiz.isAdmin(this)) return;
		AdminSheetBiz.refundSheetData(e, this);
	},

	/** 搜索菜单设置 */
	_getSearchMenu: function () {
		let sortItem1 = [
			{ label: '全部', type: '', value: '' },
			{ label: '已缴费', type: 'status', value: '1' },
			{ label: '待缴费', type: 'status', value: '0' },
			{ label: '无须缴费', type: 'status', value: '99' },
			{ label: '金额倒序', type: 'sort', value: 'SHEET_DATA_FEE|DESC' },
			{ label: '金额正序', type: 'sort', value: 'SHEET_DATA_FEE|ASC' }];

		let sortItems = [];
		let sortMenus = sortItem1;

		this.setData({
			search: '',
			sortItems,
			sortMenus,
			isLoad: true
		});

	},


})