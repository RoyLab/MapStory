Ext.define('MapStory.controller.Map',{

	extend:'Ext.app.Controller',

	config:{

        position: new AMap.LngLat(121.436305,31.025227),
        searchOptions:{orderBy: '_id:ASC'},
        searchPlugin:null,
        geoResult:null,
        marker:null
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

        this.mapview = new AMap.Map(MapStory.Config.getMapId(), {
            view: new AMap.View2D({//创建地图二维视口
              center:this.getPosition(),//创建中心点坐标
              zoom:16, //设置地图缩放级别
             }),
          	zooms:[15, 17],
            resizeEnable: true
        });

        var mapview = this.mapview,
        	sw = new AMap.LngLat(121.422701,31.016566),
        	ne = new AMap.LngLat(121.452398,31.034954);
        //mapview.setLimitBounds(new AMap.Bounds(sw,ne));

        this.createGeolocationPlugin(mapview);
        this.createCloudSearchPlugin(mapview);
	},

	createGeolocationPlugin: function(mapview){
		
        this.setMarker(new AMap.Marker({
            map:mapview,
            position:this.getPosition(),//基点位置                 
            offset:new AMap.Pixel(-12,-11),//相对于基点的偏移位置
            icon:"resources/images/arrow_icon2.png",
            angle:-90
        }));             

        mapview.plugin('AMap.Geolocation', function () {

            geolocation = new AMap.Geolocation({
                enableHighAccuracy: true,//是否使用高精度定位，默认:true
                timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                maximumAge: 0,           //定位结果缓存0毫秒，默认：0
                convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                showButton: true,        //显示定位按钮，默认：true
                buttonPosition: 'RB',    //定位按钮停靠位置，默认：'LB'，左下角
                buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                showMarker: false,        //定位成功后在定位到的位置显示点标记，默认：true
                showCircle: false,        //定位成功后用圆圈表示定位精度范围，默认：true
                panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
                zoomToAccuracy:false      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            });
            mapview.addControl(geolocation);
            geolocation.watchPosition();

            AMap.event.addListener(geolocation, 'complete', 
                function (data) {

                    (function(){
                        var str = '定位成功\n';
                        str += '经度：' + data.position.getLng() + '\n';
                        str += '纬度：' + data.position.getLat() + '\n'; 
                        str += '精度：' + data.accuracy + ' 米\n';
                        str += '是否经过偏移：' + (data.isConverted ? '是' : '否') + '\n';
                        console.info(str);
                    })();

                    var mapCtrl = MapStory.app.getController('Map');
                    mapCtrl.onGeolocationSuccess(data);
                    mapCtrl.cloudSearchCallback(data);
                }
            );//返回定位信息

            AMap.event.addListener(geolocation, 'error', 
                function onError (data) {
                    console.warn('定位失败');
        	});
        });
	},


    createCloudSearchPlugin: function(data){

        AMap.service(["AMap.CloudDataSearch"], function(){
            var mapCtrl = MapStory.app.getController('Map');
            mapCtrl.setSearchPlugin(new AMap.CloudDataSearch('55e433fce4b02580c5f3037c', mapCtrl.getSearchOptions())); //构造云数据检索类
        });
    },


    cloudSearchCallback: function(data){

        var mapCtrl = MapStory.app.getController('Map');

        if (mapCtrl.getSearchPlugin()){

            mapCtrl.getSearchPlugin().searchNearBy(data.position, 30000, 
                function(status, result) {

                    if (status === 'complete' && result.info === 'OK') {
                        var nearest = mapCtrl.chooseNearest(result);
                        console.log('the current music is :'+result.datas[nearest].mp3);
                    }else{
                        console.info('No mp3 available.')
                    }
                }
            );          
        }
    },

    onGeolocationSuccess: function(data){
        this.setGeoResult(data);
        this.getMarker().setPosition(data.position);
    },

    chooseNearest: function(result){

        var length = 10000,
            index = 0,
            location = this.getGeoResult().position;
        for (var i = 0; i < result.count; i++){
            var dx = location.getLng()-result.datas[i]._location.getLng(),
                dy = location.getLat()-result.datas[i]._location.getLat();
            var d = dx*dx+dy*dy;
            if (length > d){
                index = i;
                length = d;
            }
        }
        return index;
    }

	/**
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