Ext.define('MapStory.controller.Map',{

	extend:'Ext.app.Controller',

	config:{

	},

	init: function(app){
		this.loadjs("http://webapi.amap.com/maps?v=1.3&key=c66c95a7afc6d74979632a589b5b656e");
	},

	launch: function(app){

		MapStory.Config.mapInitCount = 0;
		MapStory.Config.mapInit = setInterval(this.createMap, 100);
	},

	createMap: function() {

		MapStory.Config.mapInitCount ++;


		if (!AMap)
		{
			if (MapStory.Config.mapInitCount == 10)
			{
				console.error('Fail to load Mapjs.');
        		clearInterval(MapStory.Config.mapInit);
			}
			return;
		}

		var position=new AMap.LngLat(121.434052,31.024768);
        MapStory.Config.mapview = new AMap.Map(MapStory.Config.getMapId(), {
            view: new AMap.View2D({//创建地图二维视口
              center:position,//创建中心点坐标
              zoom:16, //设置地图缩放级别
              //rotation:0 //设置地图旋转角度
             }),
            //resizeEnable: true,
            //rotateEnable: true
        });

        var mapview = MapStory.Config.mapview,
        	sw = new AMap.LngLat(121.422701,31.016566),
        	ne = new AMap.LngLat(121.452398,31.034954);
        mapview.setLimitBounds(new AMap.Bounds(sw,ne));

        console.info('Loaded Mapjs in ' + MapStory.Config.mapInitCount + ' tries.')
        clearInterval(MapStory.Config.mapInit);
	},

	loadjs: function(script_filename) {
	    var script = document.createElement('script');
	    script.setAttribute('type', 'text/javascript');
	    script.setAttribute('src', script_filename);
	    script.setAttribute('id', 'amapjs');
	 
	    script_id = document.getElementById('amapjs');
	    if(script_id){
	        document.getElementsByTagName('head')[0].removeChild(script_id);
	    }
	    document.getElementsByTagName('head')[0].appendChild(script);
	}
});