const cloudHelper = require('../../../../../helper/cloud_helper.js');
const pageHelper = require('../../../../../helper/page_helper.js');
const ProjectBiz = require('../../../biz/project_biz.js');
const PassportBiz = require('../../../../../comm/biz/passport_biz.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		isLoad: false
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	async onLoad(options) {
		ProjectBiz.initPage(this);
		//if (!await PassportBiz.loginMustBackWin(this)) return;

		if (!pageHelper.getOptions(this, options)) return;
		pageHelper.getOptions(this, options, 'idx');

		this._loadDetail();
	},


	_loadDetail: async function () {

		let id = this.data.id;
		if (!id) return;

		let params = {
			id
		};
		let opt = {
			title: 'bar'
		};
		let sheetData = await cloudHelper.callCloudData('sheet/my_data_detail', params, opt);
		if (!sheetData) {
			this.setData({
				isLoad: null
			})
			return;
		};

		this.setData({
			isLoad: true,
			sheetData
		});

	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady() {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow() {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide() {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload() {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	async onPullDownRefresh() {
		await this._loadDetail();
		wx.stopPullDownRefresh();
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom() {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage() {

	},

	_updateResult: async function (id, idx) {
		try {
			let params = {
				id
			}
			let opts = {
				title: 'bar'
			}
			await cloudHelper.callCloudSumbit('sheet/pay_result', params, opts).then(async res => {
				this.setData({
					['sheetData.SHEET_DATA_PAY_STATUS']: res.data.status
				});
				let parent = pageHelper.getPrevPage(2);
				if (parent) {
					parent.setData({
						['dataList.list[' + idx + '].SHEET_DATA_PAY_STATUS']: res.data.status
					})
				}

			});

		}
		catch (err) {
			console.log(err);
		}
	},

	bindPayTap: async function (e) {
		let id = this.data.id;
		let idx = this.data.idx;

		let params = {
			id
		}
		let opts = {
			title: '支付中'
		}
		let that = this;
		await cloudHelper.callCloudSumbit('sheet/prepay', params, opts).then(async res => {
			const payment = res.data.payment;
			wx.requestPayment({
				...payment,
				success(result) {
					wx.showModal({
						title: '温馨提示',
						showCancel: false,
						content: '支付完成',
						success(res) {

						}
					});

				},
				fail(err) {
					pageHelper.showModal('支付失败， 请重新支付~');
					console.error('pay fail', err);
				},
				async complete() {
					await that._updateResult(id, idx);
				}
			})


		});
	},

})