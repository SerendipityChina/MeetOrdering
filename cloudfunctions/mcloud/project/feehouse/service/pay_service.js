/**
 * Notes: 支付模块业务逻辑
 * Ver : CCMiniCloud Framework 3.2.11 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2022-07-04 07:48:00 
 */

const BaseProjectService = require('./base_project_service.js');
const dataUtil = require('../../../framework/utils/data_util.js');
const cloudBase = require('../../../framework/cloud/cloud_base.js');

const timeUtil = require('../../../framework/utils/time_util.js');
const config = require('../../../config/config.js');
const PayModel = require('../model/pay_model.js');

const PAY_TIMEOUT = 60 * 5; //支付过期时间 秒  实测最少60秒有效 官方文档写的5分钟 


class PayService extends BaseProjectService {
 


}

module.exports = PayService;