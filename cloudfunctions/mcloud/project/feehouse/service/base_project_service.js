/**
 * Notes: 业务基类 
 * Date: 2021-03-15 04:00:00 
 */

const dbUtil = require('../../../framework/database/db_util.js');
const util = require('../../../framework/utils/util.js');
const AdminModel = require('../../../framework/platform/model/admin_model.js');
const NewsModel = require('../model/news_model.js');
const SheetModel = require('../model/sheet_model.js');
const BaseService = require('../../../framework/platform/service/base_service.js');

class BaseProjectService extends BaseService {
	getProjectId() {
		return util.getProjectId();
	}

	async initSetup() {
		let F = (c) => 'bx_' + c;
		const INSTALL_CL = 'setup_feehouse';
		const COLLECTIONS = ['setup', 'admin', 'log', 'news', 'fav', 'user', 'pay', 'sheet', 'sheet_data'];
		const CONST_PIC = '/images/cover.gif';

		const NEWS_CATE = '1=最新通知,2=缴费须知';

		if (await dbUtil.isExistCollection(F(INSTALL_CL))) {
			return;
		}

		console.log('### initSetup...');

		let arr = COLLECTIONS;
		for (let k = 0; k < arr.length; k++) {
			if (!await dbUtil.isExistCollection(F(arr[k]))) {
				await dbUtil.createCollection(F(arr[k]));
			}
		}

		if (await dbUtil.isExistCollection(F('admin'))) {
			let adminCnt = await AdminModel.count({});
			if (adminCnt == 0) {
				let data = {};
				data.ADMIN_NAME = 'admin';
				data.ADMIN_PASSWORD = 'e10adc3949ba59abbe56e057f20f883e';
				data.ADMIN_DESC = '超管';
				data.ADMIN_TYPE = 1;
				await AdminModel.insert(data);
			}
		}

		if (await dbUtil.isExistCollection(F('sheet'))) {
			let sheetCnt = await SheetModel.count({});
			if (sheetCnt == 0) {
				let data = {};
				data.SHEET_TITLE = '2023年4月物业账单';
				data.SHEET_CATE_ID = '1';
				data.SHEET_OBJ = {
					start: '2023.04.01', end: '2023.04.30',
					fields: [
						{ mark: 'name', title: '姓名', detail: [], edit: false, pic: '', val: '' },
						{ mark: 'mobile', title: '手机', detail: [], edit: false, pic: '', val: '' },
						{ mark: 'money', title: '金额', detail: [], edit: false, pic: '', val: '' },
						{ mark: 'x1', title: '房号', detail: [], edit: true, pic: '', val: '' },
						{ mark: 'x2', title: '房租', detail: [], edit: true, pic: '', val: '' },
						{ mark: 'x3', title: '物业费', detail: [], edit: true, pic: '', val: '' },
						{ mark: 'x4', title: '水电费', detail: [], edit: true, pic: '', val: '' },
					]
				};
				await SheetModel.insert(data);
			}
		}


		if (await dbUtil.isExistCollection(F('news'))) {
			let newsCnt = await NewsModel.count({});
			if (newsCnt == 0) {
				let newsArr = NEWS_CATE.split(',');
				for (let j in newsArr) {
					let title = newsArr[j].split('=')[1];
					let cateId = newsArr[j].split('=')[0];

					let data = {};
					data.NEWS_TITLE = title + '标题1';
					data.NEWS_DESC = title + '简介1';
					data.NEWS_CATE_ID = cateId;
					data.NEWS_CATE_NAME = title;
					data.NEWS_CONTENT = [{ type: 'text', val: title + '内容1' }];
					data.NEWS_PIC = [CONST_PIC];

					await NewsModel.insert(data);
				}
			}
		}

		if (!await dbUtil.isExistCollection(F(INSTALL_CL))) {
			await dbUtil.createCollection(F(INSTALL_CL));
		}
	}

}

module.exports = BaseProjectService;