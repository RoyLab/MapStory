Ext.define('MapStory.controller.Map',{

	extend:'Ext.app.Controller',

	config:{

	},

	launch: function(app){

		this.createMap();
	},

	createMap: function() {

		if (typeof AMap == 'undefined')
		{
			console.error('Fail to load Mapjs.');
			return;
		}

		var position=new AMap.LngLat(121.436305,31.025227);
        this.mapview = new AMap.Map(MapStory.Config.getMapId(), {
            view: new AMap.View2D({//创建地图二维视口
              center:position,//创建中心点坐标
              zoom:16, //设置地图缩放级别
              //rotation:0 //设置地图旋转角度
             }),
          	zooms:[15, 17]

            //resizeEnable: true,
            //rotateEnable: true
        });

        var mapview = this.mapview,
        	sw = new AMap.LngLat(121.422701,31.016566),
        	ne = new AMap.LngLat(121.452398,31.034954);
        mapview.setLimitBounds(new AMap.Bounds(sw,ne));

	}/*,

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
	}*/
});