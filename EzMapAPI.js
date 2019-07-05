/*
|------------------------------------------------------------------------------
|                                   EzMapAPI.js
|@author: qianleyi
|@date: 2015-11-27
|@descript: 基础地图初始化配置设置
|------------------------------------------------------------------------------
*/
var ezMap = {
	/**
	 * 二维数组：可以插入多个图层对象
	 * 参数说明：[]表示图层组,数组中[i][0]表示图层名,[i][1]表示图层的URL,[i][2]表示图层的参数设置
	 * 参数类型：Array
	 * 取值范围：无限制
	 * 默认值：无
	 */
	MapSrcURL: [
		/** 最上层图层 */
		// ["K2", "http://172.25.18.113:7001/EzServer/Maps/K2For2010", {
		// 	 crs: '3857',
		//   type: 'EzMap2010Local',
		//   imageSRC: '../images/shiliang.png'
		// }],
		//-------------------------------------
		//Geog2010 格式模板
		["导航","http://41.188.16.233:8080/PGIS_S_TileMapServer/Maps/GDDH-new",{
			noWrap:true,
			maxZoom:18,
			minZoom:1,
			crs:"4326",
			isTDT:true,
			print:true,
			layers:"h",
			imageSRC:'images/layer_daohang.png',
				customOpts:{
					isTDT:true,
					print:true,
					layers:"h"}
		}],
		["水系","http://41.188.16.233:8080/PGIS_S_TileMapServer/Maps/TDTSX", {
			crs:'4326',	
			imageSRC:'images/layer_shuixi.png',
			customOpts:{
				isTDT:true,
				print:true,
				layers:""}
		}],
		["地貌","http://41.188.16.233:8080/PGIS_S_TileMapServer/Maps/TDTDM", {
			crs:'4326',	
			imageSRC:'images/layer_dimao.png',
			customOpts:{
				isTDT:true,
				print:true,
				layers:""}
		}],
		["交通","http://41.188.16.233:8080/PGIS_S_TileMapServer/Maps/TDTJT", {
			crs:'4326',	
			maxZoom:17,
			minZoom:1, 
			imageSRC:'images/layer_jiaotong.png',
			customOpts:{
				isTDT:true,
				print:true,
				layers:"jt"}
		}],
		["矢量", "http://41.188.16.233:8080/PGIS_S_TileMapServer/Maps/TDTSL", {
			maxZoom:20,
			minZoom:1,             
			crs: '4326',
			imageSRC: 'images/layer_shiliang.png',
			customOpts:{
				isTDT:true,
				print:true,
				layers:"quanguosl"}
		}],
		["矢影叠加","http://41.188.16.233:8080/PGIS_S_TileMapServer/Maps/TDTSY", {
			crs:'4326',	
			imageSRC:'images/layer_shiying.png',
			customOpts:{
				isTDT:true,
				print:true,
				layers:""}
		}],
		["影像","http://41.188.16.233:8080/PGIS_S_TileMapServer/Maps/TDTYX", {
			crs:'4326',	
			imageSRC:'images/layer_yingxiang.png',
			customOpts:{
				isTDT:true,
				print:true,
				layers:""}
		}],
	],
	/**
	 * 参数说明：设置地图初始化中心位置
	 * 参数类型：Array<Float,Float>
	 * 取值范围：无限制
	 * 默认值：无
	 */
	//CenterPoint: [104.114129,37.550339],
	CenterPoint: [120.14802,30.21093],
	// CenterPoint: [106.7054, 26.8419],
	// CenterPoint: [492567.23876, 326339.30273],
	/**
	 * 参数说明：设置全图显示时地图显示范围
	 * 参数类型：[minx,miny,maxx,maxy]
	 * 取值范围：无限制
	 * 默认值：无
	 */
		MapFullExtent: [52.986954,18.297655,134.394575,75.991846],
	//MapFullExtent: [116.264129,39.590339,116.564129,39.79],
	/**
	 * 参数说明：设置地图初始显示级别
	 * 参数类型：Int
	 * 取值范围：无限制
	 * 默认值：无
	 */
	MapInitLevel: 8,
	/**
	 * 参数说明：设置地图显示的最大级别
	 * 参数类型：Int
	 * 取值范围：无限制
	 * 默认值：无
	 */
	MapMaxLevel: 20,
	/**
	 * 参数说明：设置地图显示的最小级别
	 * 参数类型：Int
	 * 取值范围：无限制
	 * 默认值：无
	 */
	MapMinLevel: 2,
	/**
	 * 参数说明：是否添加地图级别控制条hover样式
	 * 参数类型：Boolean
	 * 取值范围：无限制
	 * 默认值：无
	 */
	isTitleArea: true,
	/**
	 * 参数说明：Animation 瓦片是否提前加载
	 * 参数类型：Boolean
	 * 取值范围：无限制
	 * 默认值：false
	 */
	loadTilesWhileAnimating: false
};

(function(ezMap) {
	var scriptName = "EzMapAPI\\.js";
	var keyWord = "key";
	(function(ezMap) {
			var isOL = new RegExp("(^|(.*?\\/))(" + scriptName + ")(\\?|$)");
			var scripts = document.getElementsByTagName('script');
			for (var i = 0, len = scripts.length; i < len; i++) {
				var src = scripts[i].getAttribute('src');
				if (src) {
					var match = src.match(isOL);
					if (match) {
						var key = src.indexOf(keyWord + "=");
						if (key == -1) {
							break;
						}
						var get_par = src.slice(keyWord.length + key + 1);
						var nextPar = get_par.indexOf("&");
						if (nextPar != -1) {
							get_par = get_par.slice(0, nextPar);
						}
						ezMap.AuthorKey = get_par;
						break;
					}
				}
			}
	})(ezMap);
})(ezMap);