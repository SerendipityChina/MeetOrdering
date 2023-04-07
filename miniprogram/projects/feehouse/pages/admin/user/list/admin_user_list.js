const AdminBiz = require('../../../../../../comm/biz/admin_biz.js');
const pageHelper = require('../../../../../../helper/page_helper.js');
const cacheHelper = require('../../../../../../helper/cache_helper.js');
const cloudHelper = require('../../../../../../helper/cloud_helper.js');
const projectSetting = require('../../../../public/project_setting.js');
 

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		curIdx: -1, 

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		if (!AdminBiz.isAdmin(this)) return;

		//设置搜索菜单
		await this._getSearchMenu();
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
		let id = pageHelper.dataset(e, 'id');

		let params = {
			id
		}

		let callback = async () => {
			try {
				let opts = {
					title: '删除中'
				}
				await cloudHelper.callCloudSumbit('admin/user_del', params, opts).then(res => {

					pageHelper.delListNode(id, this.data.dataList.list, 'USER_MINI_OPENID');
					this.data.dataList.total--;
					this.setData({
						dataList: this.data.dataList
					});
					pageHelper.showSuccToast('删除成功');
				});
			} catch (e) {
				console.log(e);
			}
		}
		pageHelper.showConfirm('确认删除？删除不可恢复', callback);

	}, 
 

	bindStatusTap: async function (e) {
		if (!AdminBiz.isAdmin(this)) return;
		let status = pageHelper.dataset(e, 'status');

		let idx = Number(pageHelper.dataset(e, 'idx'));

		let dataList = this.data.dataList;
		let id = dataList.list[idx].USER_MINI_OPENID;

		let params = {
			id,
			status, 
		}

		let cb = async () => {
			try {
				await cloudHelper.callCloudSumbit('admin/user_status', params).then(res => { 
						let data2Name = 'dataList.list[' + idx + '].USER_STATUS';
						this.setData({ 
							[data2Name]: status
						});

					this.setData({  
						curIdx: -1,
					});
					pageHelper.showSuccToast('操作成功');
				});
			} catch (e) {
				console.log(e);
			}
		}

		if (status == 8) {
			pageHelper.showConfirm('该用户审核不通过，用户修改资料后可重新提交审核', cb)
		}
		else
			pageHelper.showConfirm('确认执行此操作?', cb);
	}, 
 

	_getSearchMenu: async function () {

		let sortItems1 = [
			{ label: '创建时间', type: '', value: '' },
			{ label: '创建时间正序', type: 'sort', value: 'USER_ADD_TIME|asc' },
			{ label: '创建时间倒序', type: 'sort', value: 'USER_ADD_TIME|desc' },
		];
		 
		let sortMenus = [
			{ label: '全部', type: '', value: '' },
			{ label: '正常', type: 'status', value: 1 },
			{ label: '禁用', type: 'status', value: 9 },
			{ label: '已注册', type: 'type', value: 1 },
			{ label: '待注册', type: 'type', value: 0 }

		]


		this.setData({
			search: '',
			sortItems: [sortItems1],
			sortMenus,
			isLoad: true
		})


	}

})