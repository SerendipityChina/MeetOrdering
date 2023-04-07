const AdminBiz = require('../../../../../../comm/biz/admin_biz.js');
const SheetBiz = require('../../../../biz/sheet_biz.js');
const pageHelper = require('../../../../../../helper/page_helper.js');
const timeHelper = require('../../../../../../helper/time_helper.js');
const cloudHelper = require('../../../../../../helper/cloud_helper.js'); 

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
		if (!AdminBiz.isAdmin(this)) return;
  

		//设置搜索菜单
		this._getSearchMenu();

	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () { },

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: async function () { },

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () { },

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () { },

	url: async function (e) {
		pageHelper.url(e, this);
	},

	bindCommListCmpt: function (e) {
		pageHelper.commListListener(this, e);
	},

	bindEditTap: async function (e) {
		if (!AdminBiz.isAdmin(this)) return;

		let id = pageHelper.dataset(e, 'id');
		let idx = pageHelper.dataset(e, 'idx');
		wx.navigateTo({
			url: '../edit/admin_sheet_edit?id=' + id + '&idx=' + idx,
		});
	},

	bindCreateTap: async function (e) {
		if (!AdminBiz.isAdmin(this)) return;

		let idx = pageHelper.dataset(e, 'idx');

		wx.navigateTo({
			url: '../add/admin_sheet_add?idx=' + idx,
		});
	},

	bindDataTap: async function (e) {
		if (!AdminBiz.isAdmin(this)) return;
		let itemList = ['账单数据列表', '账单数据批量导入', '单个数据录入','导出账单数据Excel表格'];

		let id = pageHelper.dataset(e, 'id');
		let idx = pageHelper.dataset(e, 'idx');
		wx.showActionSheet({
			itemList,
			success: async res => {
				switch (res.tapIndex) {
					case 0: {
						wx.navigateTo({
							url: '../data_list/admin_sheet_data_list?id=' + id + '&idx=' + idx,
						});
						break;
					}
					case 1: {
						wx.navigateTo({
							url: '../import/admin_sheet_import?id=' + id + '&idx=' + idx,
						});
						break;
					}
					case 2: {
						wx.navigateTo({
							url: '../data_add/admin_sheet_data_add?id=' + id,
						});
						break;
					}
					case 3: {
						wx.navigateTo({
							url: '../export/admin_sheet_export?id=' + id + '&idx=' + idx,
						});
						break;
					}
					case 4: {
						this._clear(e);
						break;
					}
				}
			},
			fail: function (res) { }
		})
	},

	_clear: async function (e) {
		if (!AdminBiz.isAdmin(this)) return;
		let id = pageHelper.dataset(e, 'id');

		let params = {
			id
		}

		let callback = async () => {
			try {
				let opts = {
					title: '处理中'
				}
				await cloudHelper.callCloudSumbit('admin/sheet_clear', params, opts).then(res => { 

					pageHelper.showNoneToast('清空完成，请刷新数据');
				});
			} catch (err) {
				console.log(err);
			}
		}
		pageHelper.showConfirm('确认清空所有未支付数据？清空后不可恢复', callback);

	},

	bindStatusMoreTap: async function (e) {
		if (!AdminBiz.isAdmin(this)) return;
		let itemList = ['启用', '停用 (不显示)', '删除'];
		wx.showActionSheet({
			itemList,
			success: async res => {
				switch (res.tapIndex) {
					case 0: { //启用
						e.currentTarget.dataset['status'] = 1;
						await this._setStatus(e);
						break;
					}
					case 1: { //停止 
						e.currentTarget.dataset['status'] = 0;
						await this._setStatus(e);
						break;
					}
					case 2: { //删除
						await this._del(e);
						break;
					}
				}
			},
			fail: function (res) { }
		})
	},

	_del: async function (e) {
		if (!AdminBiz.isAdmin(this)) return;
		let id = pageHelper.dataset(e, 'id');

		let params = {
			id
		}

		let callback = async () => {
			try {
				let opts = {
					title: '删除中'
				}
				await cloudHelper.callCloudSumbit('admin/sheet_del', params, opts).then(res => {
					pageHelper.delListNode(id, this.data.dataList.list, '_id');
					this.data.dataList.total--;
					this.setData({
						dataList: this.data.dataList
					});
					pageHelper.showSuccToast('删除成功');
				});
			} catch (err) {
				console.log(err);
			}
		}
		pageHelper.showConfirm('确认删除？删除后用户记录数据将一并删除且不可恢复', callback);

	},

	_setStatus: async function (e) {
		if (!AdminBiz.isAdmin(this)) return;
		let id = pageHelper.dataset(e, 'id');
		let status = Number(pageHelper.dataset(e, 'status'));
		let params = {
			id,
			status
		}

		try {
			await cloudHelper.callCloudSumbit('admin/sheet_status', params).then(res => {
				pageHelper.modifyListNode(id, this.data.dataList.list, 'SHEET_STATUS', status, '_id');
				pageHelper.modifyListNode(id, this.data.dataList.list, 'statusDesc', res.data.statusDesc, '_id');
				this.setData({
					dataList: this.data.dataList
				});
				pageHelper.showSuccToast('设置成功');
			});
		} catch (err) {
			console.log(err);
		}
	},

	bindDetailTap: async function (e) {
		if (!AdminBiz.isAdmin(this)) return;

		let id = pageHelper.dataset(e, 'id');
		let idx = pageHelper.dataset(e, 'idx');

		let params = {
			id
		};
		let opt = {
			title: '刷新中'
		};
		let sheet = await cloudHelper.callCloudData('admin/sheet_detail', params, opt);
		if (!sheet) return;

		sheet.SHEET_ADD_TIME  = timeHelper.timestamp2Time(sheet.SHEET_ADD_TIME,'Y-M-D h:m:s');

		this.setData({
			['dataList.list[' + idx + ']']: sheet
		});
	},

	_getSearchMenu: function () {
		let cateIdOptions = SheetBiz.getCateList();

		let sortItem1 = [{ label: '分类', type: '', value: 0 }];
		sortItem1 = sortItem1.concat(cateIdOptions);

		let sortItem2 = [
			{ label: '排序', type: '', value: 0 },
			{ label: '记录数倒序', type: 'sort', value: 'SHEET_CNT|desc' },
			{ label: '记录数正序', type: 'sort', value: 'SHEET_CNT|asc' },
			{ label: '已支付数倒序', type: 'sort', value: 'SHEET_PAY_CNT|desc' },
			{ label: '已支付数正序', type: 'sort', value: 'SHEET_PAY_CNT|asc' },
			{ label: '未支付数倒序', type: 'sort', value: 'SHEET_WAIT_CNT|desc' },
			{ label: '未支付数正序', type: 'sort', value: 'SHEET_WAIT_CNT|asc' },
			{ label: '已缴费金额倒序', type: 'sort', value: 'SHEET_PAY_FEE|desc' },
			{ label: '已缴费金额正序', type: 'sort', value: 'SHEET_PAY_FEE|asc' },
			{ label: '未缴费金额倒序', type: 'sort', value: 'SHEET_WAIT_FEE|desc' },
			{ label: '未缴费金额正序', type: 'sort', value: 'SHEET_WAIT_FEE|asc' },
		];

		let sortItems = [];
		if (sortItem1.length > 2) sortItems.push(sortItem1);
		sortItems.push(sortItem2);

		let sortMenus = [
			{ label: '全部', type: '', value: '' },
			{ label: '正常', type: 'status', value: 1 },
			{ label: '停用', type: 'status', value: 0 },
			{ label: '最新', type: 'sort', value: 'new' },
		]
		this.setData({
			search: '',
			cateIdOptions,
			sortItems,
			sortMenus,
			isLoad: true
		})
	}

})