const pageHelper = require('../../../../../helper/page_helper.js');
const cloudHelper = require('../../../../../helper/cloud_helper.js');
const ProjectBiz = require('../../../biz/project_biz.js');
const PassportBiz = require('../../../../../comm/biz/passport_biz.js');
const wxCharts = require("../../../../../lib/tools/wxcharts-min.js");

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		isLoad: false,
		type: 'column',
		time: 180,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		ProjectBiz.initPage(this);
		//if (!await PassportBiz.loginMustBackWin(this)) return;  

		this._loadList();
	},

	bindTypeTap: function (e) {
		let type = pageHelper.dataset(e, 'type');
		this.setData({ type });
		this._loadChart(this.data.chart, type);
	},

	bindTimeTap: function (e) {
		let time = Number(pageHelper.dataset(e, 'time'));
		this.setData({ time, isLoad: false });
		this._loadList();
	},

	_loadList: async function () {
		let opts = {
			title: 'bar'
		}
		let chart = await cloudHelper.callCloudData('sheet/my_chart', { time: this.data.time }, opts);
		if (!chart) {
			this.setData({ isLoad: null });
			return;
		}

		this.setData({ isLoad: true, chart });
		this._loadChart(chart, this.data.type);
	},

	_loadChart: function (chart, type) {
		new wxCharts({
			canvasId: 'columnCanvas',
			type,
			categories: chart.categories,
			series: [{
				name: '',
				data: chart.data,
				color: '#FFD78C'
			}],
			xAxis: {
				disableGrid: true,
			},
			yAxis: {
				gridColor: '#f2f2f2',
				format: function (val) {
					return val + '';
				},
				/*max: 20,*/
				min: 0
			},
			width: 350,
			height: 210,
			legend: false,
			dataLabel: false,
			dataPointShape: true,
			extra: {
				lineStyle: 'curve'
			}
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

	bindShowSheetDataTap: function (e) {
		let idx = pageHelper.dataset(e, 'idx');
		let show = this.data.chart.list[idx].show;
		if (!show)
			show = true;
		else
			show = false;
		this.setData({
			['chart.list[' + idx + '].show']: show
		});
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
		await this._loadList();
		wx.stopPullDownRefresh();
	},

	bindRefreshTap: async function (e) {
		await this._loadList();
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	bindCommListCmpt: function (e) {
	},


	url: function (e) {
		pageHelper.url(e, this);
	},


})