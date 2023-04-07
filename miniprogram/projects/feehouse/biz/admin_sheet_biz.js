/**
 * Notes: 登记模块后台管理模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2022-06-24 07:48:00 
 */

const BaseBiz = require('../../../comm/biz/base_biz.js');
const SheetBiz = require('./sheet_biz.js');
const projectSetting = require('../public/project_setting.js');
const pageHelper = require('../../../helper/page_helper.js');
const cloudHelper = require('../../../helper/cloud_helper.js');
const dataHelper = require('../../../helper/data_helper.js');
const validate = require('../../../helper/validate.js');

class AdminSheetBiz extends BaseBiz {

	static async delSheetData(e, that) {
		let id = pageHelper.dataset(e, 'id');
		if (!id) return;

		let params = {
			sheetDataId: id,
		}

		let callback = async () => {
			try {
				let opts = {
					title: '删除中'
				}
				await cloudHelper.callCloudSumbit('admin/sheet_data_del', params, opts).then(res => {
					pageHelper.delListNode(id, that.data.dataList.list, '_id');
					that.data.dataList.total--;
					that.setData({
						dataList: that.data.dataList
					});
					pageHelper.showSuccToast('删除成功');
				});
			} catch (e) {
				console.log(e);
			}
		}
		pageHelper.showConfirm('确认删除？删除后不可恢复', callback);
	}

	static async refundSheetData(e, that) {
		let id = pageHelper.dataset(e, 'id');
		let idx = pageHelper.dataset(e, 'idx');
		if (!id) return;

		let params = {
			sheetDataId: id,
		}

		let callback = async () => {
			try {
				let opts = {
					title: '退款中'
				}
				await cloudHelper.callCloudSumbit('admin/sheet_data_refund', params, opts).then(res => {
					that.setData({
						['dataList.list[' + idx + '].SHEET_DATA_PAY_STATUS']: 0
					});
					pageHelper.showModal('退款成功！退款后资金将在1-5分钟内原路返回给用户');
				});
			} catch (e) {
				console.log(e);
			}
		}
		pageHelper.showConfirm('确认退款？退款后资金将在1-5分钟内原路返回给用户', callback);
	}

	static validateFormData(getData) {
		let forms = [];

		for (let k = 0; k < getData.length; k++) {
			getData[k].val = String(getData[k].val).trim();

			if (getData[k].mark == 'money') {
				if (getData[k].val.length == 0) {
					pageHelper.showModal(getData[k].title + '不能为空');
					return false;
				}


				if (validate.checkMoney(getData[k].val)) {
					pageHelper.showModal(getData[k].title + ' [' + getData[k].val + '] 应该为金额格式，如：12.5');
					return false;
				}


				getData[k].val = dataHelper.fmtMoney(getData[k].val);
			}
			else if (getData[k].mark == 'name') {
				if (getData[k].val.length == 0) {
					pageHelper.showModal('请填写正确的' + getData[k].title);
					return false;
				}
			}
			else if (getData[k].mark == 'mobile') {
				if (getData[k].val.length != 11) {
					pageHelper.showModal('请填写正确的' + getData[k].title);
					return false;
				}
			}


			forms.push({ mark: getData[k].mark, title: getData[k].title, val: getData[k].val });

		}
		return forms;
	}

	static initFormData(id = '') {
		let cateIdOptions = SheetBiz.getCateList();

		return {
			id,

			cateIdOptions,
			fields: projectSetting.SHEET_FIELDS,

			formTitle: '',
			formCateId: (cateIdOptions.length == 1) ? cateIdOptions[0].val : '',
			formOrder: 9999,

			formForms: []
		}

	}


	static bindSheetDataBlur(e, that) {
		let idx = pageHelper.dataset(e, 'idx');
		let val = e.detail.value.trim();
		that.data.forms[idx].val = val;
	}

	static async loadSheetDetail(that) {

		let id = that.data.id;
		if (!id) return;

		let params = {
			id
		};
		let opt = {
			title: 'bar'
		};
		let sheet = await cloudHelper.callCloudData('admin/sheet_detail', params, opt);
		if (!sheet) {
			that.setData({ isLoad: null });
			return;
		};

		that.setData({
			isLoad: true,
			sheet
		});
	}
}

AdminSheetBiz.CHECK_FORM = {
	title: 'formTitle|must|string|min:2|max:50|name=标题',
	cateId: 'formCateId|must|id|name=分类',
	order: 'formOrder|must|int|min:0|max:9999|name=排序号',
	forms: 'formForms|array',
};

module.exports = AdminSheetBiz;