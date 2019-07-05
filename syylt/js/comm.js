	var map, Range = {};
	var markers = new Array();
	var markerList = new Array();
	//var markerParam = new Array();	// 栏目自定义信息，包括自定义中心点，自定义层级等信息
	var current = 0;	// 当前导航定位
	var lastclick = 0; //上次点击ID
	var ix = 0;        //label序号
	var lastix = 0;    //上次的label序号
	var zoom = 11;
	var center = new T.LngLat(119.414520,28.455410);		// 初始化中心点
	var center1 = new T.LngLat(119.409030,28.524810);		// 打开弹窗后的中心点；
	var bound1 = new T.LngLat(118.414760,29.014150);		// 范围点
	var bound2 = new T.LngLat(120.213780,27.926470);		// 范围点

	$(function() {
		var $map = $("#map");
		if($map.length > 0) {
			$map.css({'height':($("body").outerHeight()-$map.offset().top)+'px'});	// 保留出头部的高度
			initmap();	// 初始化地图设置
			drawarea();
			$("#rebg").click(function(){
			$("#modal-marker").removeClass("showbg");
		    $(".tdt-marker-pane > img:eq("+ix+")").attr("src","http://syylt.demo.wmin.net.cn/uploadfile/201906/795edd624a.png");
            $(".maerkerid"+lastclick).removeClass("clicked_label");
				});
		}
	});
	$(window).resize(function() {	// 浏览器容器改变时执行
		var $map = $("#map");
		$map.css({'height':($("body").outerHeight()-$map.offset().top)+'px'});	// 保留出头部的高度
	});
	function initmap() {	// 初始
	
	
		map = new T.Map('map',{minZoom:11, center: center, zoom: zoom, maxBounds: new T.LngLatBounds(bound1, bound2)});	// 初始化地图模块，设置中心点，设置层级，限制最小层级值，限制范围
		//console.log(TMAP_HYBRID_MAP);
		//map.centerAndZoom(center, zoom);											//设置中心点
		map.setMapType(TMAP_HYBRID_MAP);											//设置地图类型，TMAP_HYBRID_MAP卫星图
		var layer = map.getLayers();
		//map.removeLayer(layer[1]);
	}
	function drawarea() {	// 加载地图行政区划范围
		if($.isEmptyObject(Range) == false) {	// 判定是否重新加载范围
			map.addOverLay(Range);
		} else {
			$.ajax({
				url : THEME_PATH + "areadata.json", dataType : "json", success : function(json) {
					var points = [];
					for(var i = 0; i < json.data.length; i++) {
							points.push(new T.LngLat(json.data[i][0], json.data[i][1]));
					}
					Range = new T.Polygon(points, {color: "#32c58b", weight: 4, opacity: 1, fillColor: "#FFFFFF", fillOpacity: 0});
					map.addOverLay(Range);	//向地图上添加面
				}, error : function(msg) {console.log(msg);}
			});
		}
	}

	function toggle(catid, el) {	// 加载分类栏目点位坐标数据
		var title = $(el).data('title') + '分布列表';
		if(current === catid) {
			return false;
		} else if(current === 0 || current !== catid) {
			current = catid;
		}
		$(el).siblings().removeClass('active'), $(el).toggleClass('active');
		//改动 初始化时候弹窗由隐藏改为显示,像素为0;
		//$("#modal-marker").modal('hide');
		$("#modal-marker").modal('show');
		$(".markerPoint").removeClass('clicked_label');
		$("#modal-marker").removeClass("showbg");
		map.clearOverLays();
		map.centerAndZoom(center, zoom);
		drawarea();
		var item;
		if(typeof(markers[catid]) == "undefined") {
				$.get('/index.php?s=news&c=api&m=template&name=list.html&catid='+catid, function(html) {
						$('body').append(html);
						for(var id in markers[catid]) {
							item = markers[catid][id];
							map.addLayer(item.marker);
							map.addLayer(item.label);
						}
						/*	自定义中心点和层级
						if(markerParam[catid].center != '' && markerParam[catid].zoom != 0) {
							map.centerAndZoom(markerParam[catid].center, markerParam[catid].zoom);
						} else {
							map.centerAndZoom(center, zoom+1);
						}*/
				});
		} else {
			for(var id in markers[catid]) {
				item = markers[catid][id];
				map.addLayer(item.marker);
				map.addLayer(item.label);
			}
			/*	自定义中心点和层级
			if(markerParam[catid].center != '' && markerParam[catid].zoom != 0) {
				map.centerAndZoom(markerParam[catid].center, markerParam[catid].zoom);
			} else {
				map.centerAndZoom(center, zoom+1);
			}*/
		}
		// 加载列表数据
		$('.point-list').show(), $('.point-list .title').text(title), $('.point-list ul').html('');
		if(typeof(markerList[catid]) == "undefined") {
			$.ajax({	// 载入地图初始状态
				url:'/index.php?c=api&m=data2&format=json&auth='+SITE_AUTH+'& param=list action=module module=news catid='+catid+' field=id,title order=updatetime_desc',
				type:'get', dataType:'json', async: false, success:function(result) {
					if(result.msg == '') {
						markerList[catid] = result.return;
						for(var id in result.return) {
							$('.point-list ul').append("<li onclick='javascript:click_point("+result.return[id].id+", 1);'>"+result.return[id].title+"</li>");
						}
					} else {alert(result.msg);}
				}, error : function(msg) {console.log(msg);}
			});
		} else {
			for(var id in markerList[catid]) {
				$('.point-list ul').append("<li onclick='javascript:click_point("+markerList[catid][id].id+", 1);'>"+markerList[catid][id].title+"</li>");
			}
		}
	}
	//通过ID找到元素的序号
function findIndexById(id){
	//alert($(".markerPoint:eq(2)").);
	return $("[data-id="+id+"]").index(".markerPoint");
	}

	function click_point(id, type) {	// 加载点位坐标数据
	
		if(type == 1) map.centerAndZoom(center, zoom);
		//$("#marker-marker").modal('show');
		ix = parseInt(findIndexById(id));
		lastix = parseInt(findIndexById(lastclick));
		//alert(ix);
		//$(".tdt-marker-icon").removeClass("clicked");
		$(".tdt-marker-pane > img:eq("+ix+")").attr("src","http://syylt.demo.wmin.net.cn/uploadfile/201906/795edd624a.png");

		$(".markerPoint").removeClass("clicked_label");
		//$("#modal-marker").addClass('temshow'+id);
		
//alert(lastclick + " id is:"+id);
	if(lastclick ==id && $("#modal-marker").hasClass("showbg")){
			
		
		//$(".tdt-marker-pane > img:eq("+ix+")").addClass("clicked");
		//改为换图片
		$(".tdt-marker-pane > img:eq("+ix+")").attr("src","http://syylt.demo.wmin.net.cn/uploadfile/201906/795edd624a.png");
		//$("#modal-marker").modal('hide');
		$("#modal-marker").removeClass('showbg');
	$('.maerkerid'+id).removeClass("clicked_label");
			}
		else if(lastclick != id && $("#modal-marker").hasClass("showbg")){
			$("#modal-marker").removeClass('showbg');
			$.get('/index.php?s=news&c=show&id='+id, function(html) {
			$("#modal-content").html(html);
			//$(".tdt-marker-pane > img:eq("+ix+")").addClass("clicked");
			$(".tdt-marker-pane > img:eq("+lastix+")").attr("src","http://syylt.demo.wmin.net.cn/uploadfile/201906/795edd624a.png");
			$(".tdt-marker-pane > img:eq("+ix+")").attr("src","http://syylt.demo.wmin.net.cn/uploadfile/201906/f0f2c1f845.png");
			
			//animateCSS('.maerkerid'+id, 'bounce');
            //使bounce效果失效
			animateCSS('.maerkerid'+id, 'bounce2');
			$('.maerkerid'+id).addClass("clicked_label");
		});
			setTimeout(function(){
			
		//$("#modal-marker").modal('show');
		$("#modal-marker").addClass('showbg');
		$("#modal-marker").attr("dataid",id);
				},700);
			
			}
		else{
			$("#modal-marker").removeClass('showbg');
			$.get('/index.php?s=news&c=show&id='+id, function(html) {
			$("#modal-content").html(html);
			$(".tdt-marker-pane > img:eq("+ix+")").addClass("clicked");
			$(".tdt-marker-pane > img:eq("+ix+")").attr("src","http://syylt.demo.wmin.net.cn/uploadfile/201906/f0f2c1f845.png");
			animateCSS('.maerkerid'+id, 'bounce2');
			$('.maerkerid'+id).addClass("clicked_label");
		});
		//$("#modal-marker").modal('show');
		$("#modal-marker").addClass('showbg');
		$("#modal-marker").attr("dataid",id);
			}
			lastclick = id;
	}

	function animateCSS(element, animationName, callback) {	// 动画bounceInDown
    const node = document.querySelector(element)
		node.classList.remove('animated', 'bounceInDown')
    node.classList.add('animated', animationName)
/*    function handleAnimationEnd() {
        node.classList.remove('animated', animationName)
		node.classList.add('animated', 'bounceInDown')
        node.removeEventListener('animationend', handleAnimationEnd)
        if (typeof callback === 'function') callback()
    }
    node.addEventListener('animationend', handleAnimationEnd)*/
	
	node.classList.remove('animated', animationName)
	setTimeout(function(){node.classList.add('animated', 'bounceInDown')},10)
	if (typeof callback === 'function') callback()
}