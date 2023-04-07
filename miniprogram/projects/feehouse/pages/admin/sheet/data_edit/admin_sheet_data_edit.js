const AdminBiz = require('../../../../../../comm/biz/admin_biz.js');
const AdminSheetBiz = require('../../../../biz/admin_sheet_biz.js');
const pageHelper = require('../../../../../../helper/page_helper.js'); 
const cloudHelper = require('../../../../../../helper/cloud_helper.js');  

Page({

	/** 
	 * 页面的初始数据
	 */
	data: { 
		isEdit: true,
		forms: []
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		if (!AdminBiz.isAdmin(this)) return;

		if (!pageHelper.getOptions(this, options)) return;
		await AdminSheetBiz.loadSheetDetail(this);

		let forms = this.data.sheet.SHEET_OBJ.fields;


		let parent = pageHelper.getPrevPage(2);
		if (!parent) return;
		let idx = options.idx;
		let sheetData = parent.data.dataList.list[idx];

		let data = sheetData.SHEET_DATA_FORMS;
		for (let k = 0; k < forms.length; k++) {
			for (let j = 0; j < data.length; j++) {
				if (forms[k].mark == data[j].mark) {
					forms[k].val = data[j].val;
					break;
				}
			}
		}
		this.setData({
			sheetDataId: sheetData._id,
			forms
		});


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
	onPullDownRefresh: async function () {
		await AdminSheetBiz.loadSheetDetail(this);
		wx.stopPullDownRefresh();
	},

	/** 
	 * 数据提交
	 */
	bindFormSubmit: async function () {
		if (!AdminBiz.isAdmin(this)) return;

		let forms = AdminSheetBiz.validateFormData(this.data.forms);
		if (forms === false) return;  

		let data = {
			sheetDataId: this.data.sheetDataId,
			forms
		}


		try {
			// 先创建，再上传 
			await cloudHelper.callCloudSumbit('admin/sheet_data_edit', data).then(res => {

				let callback = async function () {
					let node = {
						'SHEET_DATA_FORMS': data.forms
					}
					pageHelper.modifyPrevPageListNodeObject(data.sheetDataId, node);
					wx.navigateBack();

				}
				pageHelper.showSuccToast('修改成功', 2000, callback);
			});


		} catch (err) {
			console.log(err);
		}

	},

	bindBlur: function (e) {
		AdminSheetBiz.bindSheetDataBlur(e, this);
	}

})