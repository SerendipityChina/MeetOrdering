/**
 * Notes: 数据表格记录实体
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2023-02-04 19:20:00 
 */


const BaseProjectModel = require('./base_project_model.js');

class SheetDataModel extends BaseProjectModel {

}

// 集合名
SheetDataModel.CL = BaseProjectModel.C('sheet_data');

SheetDataModel.DB_STRUCTURE = {
	_pid: 'string|true',
	SHEET_DATA_ID: 'string|true', 
	SHEET_DATA_SHEET_ID: 'string|true|comment=FK',
	SHEET_DATA_SHEET_TITLE: 'string|false',


	SHEET_DATA_PAY_TRADE_NO: 'string|false|comment=商家订单号 32位',
	SHEET_DATA_PAY_STATUS: 'int|true|default=0|comment=支付状态 0=未支付 1=已支付 99=无需支付',
	SHEET_DATA_PAY_FEE: 'int|true|default=0|comment=已支付费用 分',
	SHEET_DATA_PAY_TIME: 'int|true|default=0|comment=支付时间',

	SHEET_DATA_NAME: 'string|false|姓名',
	SHEET_DATA_MOBILE: 'string|false|手机号',
	SHEET_DATA_FEE: 'int|true|default=0|comment=需支付费用 分',

	SHEET_DATA_FORMS: 'array|true|default=[]',
	SHEET_DATA_OBJ: 'object|true|default={}',

	SHEET_DATA_ADD_TIME: 'int|true',
	SHEET_DATA_EDIT_TIME: 'int|true',
	SHEET_DATA_ADD_IP: 'string|false',
	SHEET_DATA_EDIT_IP: 'string|false',
};

// 字段前缀
SheetDataModel.FIELD_PREFIX = "SHEET_DATA_";


module.exports = SheetDataModel;