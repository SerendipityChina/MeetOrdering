/**
 * Notes:表格模块控制器
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2023-03-12 04:00:00 
 */

const BaseProjectController = require('./base_project_controller.js');
const SheetService = require('../service/sheet_service.js');
const contentCheck = require('../../../framework/validate/content_check.js');
const timeUtil = require('../../../framework/utils/time_util.js');

class SheetController extends BaseProjectController {

	async prepay() {
		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new SheetService();
		return await service.prepay(this._userId, input.id);
	}

	async queryPayResult() {
		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new SheetService();
		return await service.queryPayResult(input.id);
	}


	async getMySheetDataDetail() {

		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new SheetService();
		let ret = await service.getMySheetDataDetail(this._userId, input.id);
		if (ret) {
			if (ret.SHEET_DATA_PAY_TIME != 0)
				ret.SHEET_DATA_PAY_TIME = timeUtil.timestamp2Time(ret.SHEET_DATA_PAY_TIME, 'Y-M-D h:m:s');
		}
		return ret;

	}

	async getMySheetChartList() {

		// 数据校验
		let rules = {
			time: 'must|int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new SheetService();
		return await service.getMySheetChartList(this._userId, input.time);

	}

	/** 我的列表 */
	async getMySheetDataList() {

		// 数据校验
		let rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			page: 'must|int|default=1',
			size: 'int',
			isTotal: 'bool',
			oldTotal: 'int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new SheetService();
		let result = await service.getMySheetDataList(this._userId, input);

		if (!result) return null;
		
		// 数据格式化
		let list = result.list;

		for (let k = 0; k < list.length; k++) {
			list[k].SHEET_DATA_ADD_TIME = timeUtil.timestamp2Time(list[k].SHEET_DATA_ADD_TIME, 'Y-M-D h:m:s');
			if (list[k].SHEET_DATA_PAY_TIME)
				list[k].SHEET_DATA_PAY_TIME = timeUtil.timestamp2Time(list[k].SHEET_DATA_PAY_TIME, 'Y-M-D h:m:s');
		}

		result.list = list;

		return result;

	}

}

module.exports = SheetController;