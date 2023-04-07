/**
 * Notes: 数据表格后台管理
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2023-02-23 07:48:00 
 */

const BaseProjectAdminService = require('./base_project_admin_service.js');
const util = require('../../../../framework/utils/util.js');
const dataCheck = require('../../../../framework/validate/data_check.js');
const SheetModel = require('../../model/sheet_model.js');
const PayModel = require('../../model/pay_model.js');
const UserModel = require('../../model/user_model.js');
const SheetDataModel = require('../../model/sheet_data_model.js');
const cloudBase = require('../../../../framework/cloud/cloud_base.js');
const cloudUtil = require('../../../../framework/cloud/cloud_util.js');
const dataUtil = require('../../../../framework/utils/data_util.js');
const exportUtil = require('../../../../framework/utils/export_util.js');
const PayService = require('../pay_service.js');
const SheetService = require('../sheet_service.js');

// 导出数据KEY
const EXPORT_SHEET_DATA_KEY = 'EXPORT_SHEET_DATA';

class AdminSheetService extends BaseProjectAdminService {


	/**取得分页列表 */
	async getAdminSheetList({
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序
		whereEx, //附加查询条件
		page,
		size,
		isTotal = true,
		oldTotal
	}) {

		orderBy = orderBy || {
			'SHEET_ORDER': 'asc',
			'SHEET_ADD_TIME': 'desc'
		};
		let fields = '*';

		let where = {};
		where.and = {
			_pid: this.getProjectId() //复杂的查询在此处标注PID
		};

		if (util.isDefined(search) && search) {
			where.or = [{
				SHEET_TITLE: ['like', search]
			},];

		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'cateId': {
					where.and.SHEET_CATE_ID = String(sortVal);
					break;
				}
				case 'status': {
					where.and.SHEET_STATUS = Number(sortVal);
					break;
				}
				case 'sort': {
					orderBy = this.fmtOrderBySort(sortVal, 'SHEET_ADD_TIME');
					break;
				}
			}
		}

		return await SheetModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);
	}

	/**添加 */
	async insertSheet({
		title,
		cateId,
		cateName,

		order,
		forms
	}) {

		this.AppError('[物业缴费]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/**删除数据 */
	async delSheet(id) {
		this.AppError('[物业缴费]该功能暂不开放，如有需要请加作者微信：cclinux0730');

	}

	/**获取信息 */
	async getSheetDetail(id) {
		let fields = '*';

		let where = {
			_id: id
		}

		let sheet = await SheetModel.getOne(where, fields);
		if (!sheet) return null;

		return sheet;
	}

	// 更新forms信息
	async updateSheetForms({
		id,
		hasImageForms
	}) {
		this.AppError('[物业缴费]该功能暂不开放，如有需要请加作者微信：cclinux0730');

	}


	/**更新数据 */
	async editSheet({
		id,
		title,
		cateId, // 二级分类 
		cateName,

		order,
		forms
	}) {

		this.AppError('[物业缴费]该功能暂不开放，如有需要请加作者微信：cclinux0730');

	}

	/**修改状态 */
	async statusSheet(id, status) {
		this.AppError('[物业缴费]该功能暂不开放，如有需要请加作者微信：cclinux0730');

	}

	//#############################


	/**账单数据分页列表 */
	async getAdminSheetDataList({
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序
		sheetId,
		page,
		size,
		isTotal = true,
		oldTotal
	}) {

		orderBy = orderBy || {
			'SHEET_DATA_ADD_TIME': 'desc'
		};
		let fields = '*';
		let where = {};

		if (sheetId != 'null')
			where.SHEET_DATA_SHEET_ID = sheetId;

		if (util.isDefined(search) && search) {
			where['SHEET_DATA_FORMS.val'] = {
				$regex: '.*' + search,
				$options: 'i'
			};
		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'status': {
					where.SHEET_DATA_PAY_STATUS = Number(sortVal);
					break;
				}
				case 'sort': {
					orderBy = this.fmtOrderBySort(sortVal, 'SHEET_DATA_ADD_TIME');
					break;
				}
			}
		}

		return await SheetDataModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);
	}


	/**流水分页列表 */
	async getAdminPayFlowList({
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序 
		page,
		size,
		isTotal = true,
		oldTotal
	}) {

		orderBy = orderBy || {
			'PAY_ADD_TIME': 'desc'
		};
		let fields = '*';
		let where = {};

		if (!search) search = '';
		search = String(search).trim();
		if (search) {
			let openId = 'null';
			let user = await UserModel.getOne({ USER_MOBILE: search });
			if (user) openId = user.USER_MINI_OPENID;
			where.PAY_USER_ID = openId;
		}

		if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'status': {
					where.PAY_STATUS = Number(sortVal);
					break;
				}
				case 'sort': {
					orderBy = this.fmtOrderBySort(sortVal, 'PAY_ADD_TIME');
					break;
				}
			}
		}

		return await PayModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);
	}



	/** 清空数据 */
	async clearSheetAll(sheetId) {
		this.AppError('[物业缴费]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}


	/** 删除单个记录 */
	async delSheetData(sheetDataId) {
		this.AppError('[物业缴费]该功能暂不开放，如有需要请加作者微信：cclinux0730');

	}


	async refundSheetData(sheetDataId) {
		this.AppError('[物业缴费]该功能暂不开放，如有需要请加作者微信：cclinux0730');

	}

	// 添加单个记录
	async insertSheetData(sheetId, {
		forms
	}) {

		this.AppError('[物业缴费]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	// 更新单个数据
	async editSheetData(sheetDataId, {
		forms,
	}) {
		this.AppError('[物业缴费]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}


	// #####################导出
	/**获取表格数据 */
	async getSheetExcel() {
		return await exportUtil.getExportDataURL(EXPORT_SHEET_DATA_KEY);
	}

	/**删除表格数据 */
	async delSheetExcel() {
		return await exportUtil.deleteDataExcel(EXPORT_SHEET_DATA_KEY);
	}



	/**导出表格数据 type=data/temp */
	async exportSheetExcel({ sheetId, type = 'data' }) {

		this.AppError('[物业缴费]该功能暂不开放，如有需要请加作者微信：cclinux0730');

	}


	//################### import
	// 导入数据
	async importSheetExcel(sheetId, cloudId, isClearOld = false) {

		this.AppError('[物业缴费]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	//##################表单数据处理


}

module.exports = AdminSheetService;