Ext.define('MapStory.controller.Map',{

	extend:'Ext.app.Controller',

	config:{

        control:{
            /*refreshButton:{
                tap:function() {
                    var button = this.getRefreshButton();
                    button.setIconCls('');
                    button.setStyle('background: url(resources/images/spinner.gif);');
                    button.setBorder(0);
                    button.setHeight(32);
                    button.setWidth(32);
                    //button.setIcon("resources/images/spinner.gif");
                    setTimeout(function(){
                        button.hide();
                    },1000);
                }
            }*/
        },

        refs:{
            //refreshButton:'#refresh_map_button'
        },


        initPosition:null,
        searchOptions:{orderBy: '_id:ASC'},
        searchPlugin:null,
        geolocationPlugin:null,
        geoResult:null,
        marker:null,
        bounds:null,
        loadjsTimer:null,
        //pingTimer:null,
        //pingCount:2,
        validLocation: 0,//计数器，延迟决定是否认为当前不属于交大
        audioConfig:{
            audioCtrl: null,
            requestNextAudio: false,
        }
	},


	launch: function(app){

        var caller = this;
        clearInterval(caller.getLoadjsTimer());

        /*console.info('ping');
        new caller.helpers.ping("202.120.38.143/~shengbin/map/null.jpg", function(response, e){

            console.log(response+'.....');
            console.log(e);
            if (response == 'responded'){
                caller.setPingCount(2);
            } else {
                var count = caller.getPingCount();
                caller.setPingCount(count-1);
                    console.info(count);
                if (count == 0){
                    console.info('ping2');
                    var b = new Android_Toast({content: 'Please check your connection and try again.'});
                }
            }
        });*/

        if (typeof AMap == 'undefined')
        {
            console.warn('Fail to load Mapjs.');
            caller.setLoadjsTimer(
                setInterval(function(){
                    caller.helpers.loadjs("http://webapi.amap.com/maps?v=1.3&key=c66c95a7afc6d74979632a589b5b656e", 
                        function(param){
                            caller.launch(param);
                        }, app);
                    }, 2000));
            return;
        }

        this.initParam();
		this.createMap();
	},

    initParam: function(){

        this.setInitPosition(new AMap.LngLat(121.436305,31.025227));
        this.setBounds(new AMap.Bounds(new AMap.LngLat(121.422701,31.016566),
                                new AMap.LngLat(121.452398,31.034954)));
    },

	createMap: function() {

        this.mapview = new AMap.Map(MapStory.Config.getMapId(), {
            view: new AMap.View2D({//创建地图二维视口
              center:this.getInitPosition(),//创建中心点坐标
              zoom:16, //设置地图缩放级别
             }),
          	zooms:[15, 17],
            resizeEnable: true
        });

        var mapview = this.mapview;

        mapview.setLimitBounds(this.getBounds());

        this.createCloudLayer(mapview);
        this.createGeolocationPlugin(mapview);
        this.createCloudSearchPlugin(mapview);
	},

	createGeolocationPlugin: function(mapview){
		
        var caller = this;

        this.setMarker(new AMap.Marker({
            map:mapview,
            position:this.getInitPosition(),//基点位置                 
            offset:new AMap.Pixel(-12,-11),//相对于基点的偏移位置
            icon:"resources/images/arrow_icon2.png",
            angle:-90
        }));             

        mapview.plugin('AMap.Geolocation', function () {

            var geolocation = new AMap.Geolocation({
                enableHighAccuracy: true,//是否使用高精度定位，默认:true
                timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                maximumAge: 0,           //定位结果缓存0毫秒，默认：0
                convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                showButton: true,        //显示定位按钮，默认：true
                buttonPosition: 'RB',    //定位按钮停靠位置，默认：'LB'，左下角
                buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                showMarker: false,        //定位成功后在定位到的位置显示点标记，默认：true
                showCircle: false,        //定位成功后用圆圈表示定位精度范围，默认：true
                panToLocation: false,     //定位成功后将定位到的位置作为地图中心点，默认：true
                zoomToAccuracy:false      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            });
            caller.setGeolocationPlugin(geolocation);
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

                    caller.onGeolocationSuccess(data);
                }
            );//返回定位信息

            AMap.event.addListener(geolocation, 'error', 
                function (e) {
                    console.warn('定位失败');
                    console.warn(e);
        	});
        });

        if (navigator.compass){
            navigator.compass.watchHeading(function(heading){
                caller.getMarker().setRotation(heading.magneticHeading-90);
            }, null);
        }
	},


    onGeolocationSuccess: function(data){
        // sim location
        if (this.helpers.isSimLocation){
            data.position = this.helpers.getSimLocation();
        }
        this.setGeoResult(data);
        var self = this;
        if (this.getBounds().contains(data.position)){
            this.getMarker().setPosition(data.position);
            this.mapview.setCenter(data.position);
            this.setValidLocation(3);
            if (this.helpers.clockSwitch1){
                clearTimeout(this.helpers.clock1);
                this.helpers.clock1 = setTimeout(function(){self.getGeolocationPlugin().getCurrentPosition();}, this.helpers.clockSwitch1);
            }
        } else {
            var count = this.getValidLocation();
            this.setValidLocation(count-1);
            if (count < 1){
                this.getMarker().setPosition(data.position);
                Ext.Msg.alert('定位错误','您不在交大闵行校区内！', Ext.emptyFn);
            }
        }

        if (this.getAudioConfig().requestNextAudio){
            this.cloudSearch(this.getAudioConfig().audioCtrl);
        }
    },

    createCloudLayer: function(mapview){

        mapview.plugin('AMap.CloudDataLayer', function() {
            var layerOptions = { 
                //query:{keywords: '三'},
                clickable:true
            };
            var cloudDataLayer = new AMap.CloudDataLayer('55e433fce4b02580c5f3037c', layerOptions); //实例化云图层类
            cloudDataLayer.setMap(mapview); //叠加云图层到地图

            AMap.event.addListener(cloudDataLayer, 'click', function (result) {
                var clouddata = result.data;
                var infoWindow = new AMap.InfoWindow({
                    content:"<h3><font face=\"微软雅黑\"color=\"#3366FF\">"+ clouddata._name +"</font></h3><hr />地址："+ clouddata._address + "<br />",
                    size:new AMap.Size(300, 0),
                    autoMove:true,
                    offset:new AMap.Pixel(0,-25)
                });
            
                infoWindow.open(mapview, clouddata._location);
            });
        });
    },


    createCloudSearchPlugin: function(mapview){

        var caller = this;

        AMap.service(["AMap.CloudDataSearch"], function(){
            caller.setSearchPlugin(new AMap.CloudDataSearch('55e433fce4b02580c5f3037c', caller.getSearchOptions())); //构造云数据检索类
        });
    },


    requestNearestAudio: function(receiver){
        this.getAudioConfig().audioCtrl = receiver;

        // 立刻调用一次
        this.cloudSearch(receiver);
    },

    cloudSearch: function(receiver){

        var caller = this;

        if (caller.getSearchPlugin()){

            caller.getSearchPlugin().searchNearBy(caller.getGeoResult().position, 500, 
                function(status, result) {
                    if (status === 'complete' && result.info === 'OK') {
                        var nearest = caller.chooseNearest(result);
                        caller.getAudioConfig().requestNextAudio = false;
                        var res = receiver.setNextSong(result, nearest);
                        if (res){
                            console.info('the current music is :'+result.datas[nearest].mp3);
                        } else {
                            caller.getAudioConfig().requestNextAudio = true;
                            console.info('No more mp3 available.')
                        }
                    }else{
                        caller.getAudioConfig().requestNextAudio = true;
                        console.info('No mp3 available.')
                    }
                }
            );          
        }
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
    },

	forceUpdateFrequency: function(interval){

        var self = this;
        if (interval){
            this.helpers.clock1 = setInterval(function(){self.getGeolocationPlugin().getCurrentPosition();}, interval);
            this.helpers.clockSwitch1 = interval;
            self.getGeolocationPlugin().getCurrentPosition();
        } else {
            clearInterval(this.helpers.clock1);
        }
        this.helpers.clockSwitch1 = interval;
    },

	helpers:{

        clock1:null,
        clockSwitch1:0,

        isSimLocation:true,

        getSimLocation: function(){
            function computeDist(p1, p2){
                var a = Math.pow(p1[0]-p2[0], 2);
                var b = Math.pow(p1[1]-p2[1], 2);
                return Math.sqrt(a+b);
            }

            var pos = MapStory.Config.getSimPath(),
                timer = null;
            if (!this.dist){
                var dist = 0, cur = pos[0];
                for (var i = 1; i < pos.length; i++){
                    dist += computeDist(cur, pos[i]);
                    cur = pos[i];
                }
                this.step = dist/500;
                this.dist = dist;
                this.cur = 0;
                this.curIndex = 0;

                var self = this;
                timer = setInterval(function(){
                    self.cur += self.step;
                    var dist = computeDist(pos[self.curIndex], pos[self.curIndex+1]);
                    if (self.cur >= dist){
                        self.curIndex += 1;
                        if (pos.length - 1 == self.curIndex){
                            clearInterval(timer);
                            self.curIndex -= 1;
                            self.cur = 0;
                        } else {
                            self.cur -= dist;
                        }
                    }
                }, 2000);
            }

            var pos1 = pos[this.curIndex];
            var pos2 = pos[this.curIndex+1];
            var dist = computeDist(pos1, pos2);
            var coef = this.cur/dist;

            return new AMap.LngLat((1-coef)*pos1[0]+coef*pos2[0],
                (1-coef)*pos1[1]+coef*pos2[1]);
        },

        loadjs: function(script_filename, callback, param) {
        
            var script = document.createElement('script');
            script.setAttribute('type', 'text/javascript');
            script.setAttribute('src', script_filename);
            script.setAttribute('id', 'amapjs');
            if (script.addEventListener) {
                script.addEventListener('load', function () {
                    callback(param);
                }, false);
            } else if (script.attachEvent) {
                script.attachEvent('onreadystatechange', function () {
                    var target = window.event.srcElement;
                    if (target.readyState == 'loaded') {
                        callback(param);
                    }
                });
            }
         
            script_id = document.getElementById('amapjs');
            if(script_id){
                document.getElementsByTagName('head')[0].removeChild(script_id);
            }
            document.getElementsByTagName('head')[0].appendChild(script);
        }

        /*ping: function (ip, callback) {

            if (!this.inUse) {
                this.status = 'unchecked';
                this.inUse = true;
                this.callback = callback;
                this.ip = ip;
                var _that = this;
                this.img = new Image();
                this.img.onload = function () {
                    _that.inUse = false;
                    console.log('success');
                    _that.callback('responded');

                };
                this.img.onerror = function (e) {
                    if (_that.inUse) {
                        _that.inUse = false;
                        _that.callback('responded', e);
                    }

                };
                this.start = new Date().getTime();
                this.img.src = "http://" + ip;
                this.timer = setTimeout(function () {
                    if (_that.inUse) {
                        _that.inUse = false;
                        _that.callback('timeout');
                    }
                }, 1500);
            }    
        }*/
    }
});