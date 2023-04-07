/**
 * Notes: 表格模块业务逻辑
 * Ver : CCMiniCloud Framework 3.2.11 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2022-07-04 07:48:00 
 */

const BaseProjectService = require('./base_project_service.js');
const util = require('../../../framework/utils/util.js');
const timeUtil = require('../../../framework/utils/time_util.js');
const cloudBase = require('../../../framework/cloud/cloud_base.js');
const SheetModel = require('../model/sheet_model.js');
const UserModel = require('../model/user_model.js');
const SheetDataModel = require('../model/sheet_data_model.js');
const PayService = require('../service/pay_service.js');
const PayModel = require('../model/pay_model.js');
const config = require('../../../config/config.js');

class SheetService extends BaseProjectService {


	async getMySheetChartList(userId, time = 180) {
		let where = {};
		if (!config.IS_DEMO) {
			let user = await UserModel.getOne({ USER_MINI_OPENID: userId });
			if (!user) return null;

			where = {
				SHEET_DATA_PAY_STATUS: 1,
				SHEET_DATA_NAME: user.USER_NAME,
				SHEET_DATA_MOBILE: user.USER_MOBILE,
				'sheet.SHEET_STATUS': SheetModel.STATUS.COMM
			};
		}
		else {
			where = {
				SHEET_DATA_PAY_STATUS: 1,
				SHEET_DATA_NAME: 'Tom',
				SHEET_DATA_MOBILE: '14600000000',
				'sheet.SHEET_STATUS': SheetModel.STATUS.COMM
			};
		}


		time = Number(time);
		time = this._timestamp - time * 86400 * 1000;

		where.SHEET_DATA_PAY_TIME = ['>=', time];

		let fields = 'SHEET_DATA_PAY_TIME,SHEET_DATA_FORMS,SHEET_DATA_FEE,sheet.SHEET_TITLE ';

		let orderBy = {
			'SHEET_DATA_PAY_TIME': 'desc',
			'SHEET_DATA_ADD_TIME': 'desc'
		};

		let joinParams = {
			from: SheetModel.CL,
			localField: 'SHEET_DATA_SHEET_ID',
			foreignField: '_id',
			as: 'sheet',
		};

		let list = await SheetDataModel.getListJoin(joinParams, where, fields, orderBy, 1, 200, false);
		list = list.list;

		if (list.length == 0) return null;

		let categories = [];
		let data = [];

		for (let k = 0; k < list.length; k++) {
			data.push(Number(list[k].SHEET_DATA_FEE / 100));
			categories.push(list[k].sheet.SHEET_TITLE.substr(0, 15));

			list[k].SHEET_DATA_PAY_TIME = timeUtil.timestamp2Time(list[k].SHEET_DATA_PAY_TIME);
		}
		return { categories, data, list: list.reverse() };

	}

	// 取得账单详情
	async getMySheetDataDetail(userId, sheetDataId) {
		let where = {};

		if (!config.IS_DEMO) {
			let user = await UserModel.getOne({ USER_MINI_OPENID: userId, USER_STATUS: UserModel.STATUS.COMM });
			if (!user) this.AppError('用户不存在或者状态异常');

			where = {
				_id: sheetDataId,
				SHEET_DATA_NAME: user.USER_NAME,
				SHEET_DATA_MOBILE: user.USER_MOBILE,
			}
		}
		else {
			where = {
				_id: sheetDataId,
				SHEET_DATA_NAME: 'Tom',
				SHEET_DATA_MOBILE: '14600000000',
			}
		}

		let sheetData = await SheetDataModel.getOne(where);
		if (!sheetData) return null;

		let sheet = await SheetModel.getOne({ _id: sheetData.SHEET_DATA_SHEET_ID, SHEET_STATUS: SheetModel.STATUS.COMM });
		if (!sheet) this.AppError('支付项目不存在');

		sheetData.sheet = sheet;
		return sheetData;
	}

	/** 取得我的分页列表 */
	async getMySheetDataList(userId, {
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序 
		page,
		size = 30,
		isTotal = true,
		oldTotal
	}) {


		orderBy = orderBy || {
			'SHEET_DATA_ADD_TIME': 'desc'
		};
		let fields = 'SHEET_DATA_PAY_TIME,SHEET_DATA_ADD_TIME,SHEET_DATA_FEE,SHEET_DATA_FORMS,SHEET_DATA_PAY_FEE,SHEET_DATA_PAY_STATUS,sheet.SHEET_TITLE,sheet.SHEET_OBJ';

		let where = {};
		if (!config.IS_DEMO) {
			let user = await UserModel.getOne({ USER_MINI_OPENID: userId });
			if (!user) return null;
			where = {
				SHEET_DATA_NAME: user.USER_NAME,
				SHEET_DATA_MOBILE: user.USER_MOBILE,
				'sheet.SHEET_STATUS': SheetModel.STATUS.COMM
			};
		}
		else {
			where = {
				SHEET_DATA_NAME: 'Tom',
				SHEET_DATA_MOBILE: '14600000000',
				'sheet.SHEET_STATUS': SheetModel.STATUS.COMM
			};
		}

		if (util.isDefined(search) && search) {
			where['SHEET_DATA_SHEET_TITLE'] = {
				$regex: '.*' + search,
				$options: 'i'
			};
		} else if (sortType) {
			// 搜索菜单
			switch (sortType) {
				case 'status': {
					where['SHEET_DATA_PAY_STATUS'] = Number(sortVal);
					break;
				}
				case 'sort': { //按时间倒序
					orderBy = this.fmtOrderBySort(sortVal, 'SHEET_DATA_ADD_TIME');
					break;
				}

			}
		}

		let joinParams = {
			from: SheetModel.CL,
			localField: 'SHEET_DATA_SHEET_ID',
			foreignField: '_id',
			as: 'sheet',
		};

		let result = await SheetDataModel.getListJoin(joinParams, where, fields, orderBy, page, size, isTotal, oldTotal);

		return result;
	}

	async statSheetData(sheetId) {
		let where = {
			SHEET_DATA_SHEET_ID: sheetId
		}

		// 总数
		let cnt = await SheetDataModel.count(where);


		// 总费用
		let fee = await SheetDataModel.sum(where, 'SHEET_DATA_FEE');


		// 已支付记录
		let wherePayCnt = {
			SHEET_DATA_SHEET_ID: sheetId,
			SHEET_DATA_PAY_STATUS: 1,
		}
		let payCnt = await SheetDataModel.count(wherePayCnt);

		// 无须支付
		let whereNoCnt = {
			SHEET_DATA_SHEET_ID: sheetId,
			SHEET_DATA_PAY_STATUS: 99,
		}
		let noCnt = await SheetDataModel.count(whereNoCnt);

		// 已支付金额
		let wherePayFee = {
			SHEET_DATA_SHEET_ID: sheetId,
			SHEET_DATA_PAY_STATUS: 1,
		}
		let payFee = await SheetDataModel.sum(wherePayFee, 'SHEET_DATA_PAY_FEE');

		let waitCnt = cnt - payCnt - noCnt;
		let waitFee = fee - payFee;
		let data = {
			SHEET_CNT: cnt,
			SHEET_PAY_CNT: payCnt,
			SHEET_WAIT_CNT: waitCnt,
			SHEET_NO_CNT: noCnt,

			SHEET_FEE: fee,
			SHEET_PAY_FEE: payFee,
			SHEET_WAIT_FEE: waitFee
		}
		await SheetModel.edit(sheetId, data);
		return { cnt, payCnt, waitCnt, noCnt, fee, payFee, waitFee };
	}

	// 修正本地订单状态
	async fixSheetDataPay(tradeNo, sheetId) {
		if (!tradeNo) {
			// 无支付号空单
			let data = {
				SHEET_DATA_PAY_STATUS: 0,
				SHEET_DATA_PAY_TRADE_NO: '',
				SHEET_DATA_PAY_FEE: 0,
				SHEET_DATA_PAY_TIME: 0,
			}

			await SheetDataModel.edit({ SHEET_DATA_PAY_TRADE_NO: tradeNo }, data);

			// 重新统计
			this.statSheetData(sheetId);

			return false;
		}

		let payService = new PayService();
		if (!await payService.fixPayResult(tradeNo)) {
			// 关闭未支付单
			payService.closePay(tradeNo);

			// 未支付
			let data = {
				SHEET_DATA_PAY_STATUS: 0,
				SHEET_DATA_PAY_TRADE_NO: '',
				SHEET_DATA_PAY_FEE: 0,
				SHEET_DATA_PAY_TIME: 0,
			}

			await SheetDataModel.edit({ SHEET_DATA_PAY_TRADE_NO: tradeNo }, data);

			// 重新统计
			this.statSheetData(sheetId);

			return false;
		}

		// 已支付
		let pay = await PayModel.getOne({ PAY_TRADE_NO: tradeNo });
		if (!pay) this.AppError('支付流水异常，请核查');

		// 更新支付信息
		let data = {
			SHEET_DATA_PAY_STATUS: 1,
			SHEET_DATA_PAY_TRADE_NO: tradeNo,
			SHEET_DATA_PAY_FEE: pay.PAY_TOTAL_FEE,
			SHEET_DATA_PAY_TIME: pay.PAY_END_TIME,
		}
		await SheetDataModel.edit({ SHEET_DATA_PAY_TRADE_NO: tradeNo }, data);


		// 重新统计
		this.statSheetData(sheetId);
		return true;
	}


	// 预支付
	async prepay(userId, sheetDataId) {

		this.AppError('[物业缴费]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	// 查询支付结果
	async queryPayResult(sheetDataId) {
		let sheetData = await SheetDataModel.getOne(sheetDataId);
		if (!sheetData) return { status: 0 };

		return {
			status: sheetData.SHEET_DATA_PAY_STATUS
		}
	}
}

module.exports = SheetService;