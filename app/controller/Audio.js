Ext.define('MapStory.controller.Audio',{

	extend:'Ext.app.Controller',

	config:{

        control:{
            playButton:{
                tap:'playAndStop'
            }
        },

        refs:{
            player:'#'+MapStory.Config.getMiniPlayerId(),
            playButton:'#_mn_playButton',
            slider:'#_mn_used',
            statusButton:'#_main_statusButton',
        },


        currentAudio:{
            isPlaying:0,
            url:'',
            duration:-1,
            id:-1,
            title:'',
            location:'',
        },

        nextAudio:{
            url:MapStory.Config.getResourcePrefix()+'mp3/welcome.ogg',
            duration:3,
            id:-1,
            title:'关于地图故事',
            location:'上海交通大学',
            status:2, // 0 not request, 1 requesting, 2 received
        },

        audioExpiredTime:20000, // nextAudio will be stored for [audioExpiredTime] ms
        timer:null,
        isInit:false
	},

    STAT_STOP:0,
    STAT_PAUSE:1,
    STAT_PLAYING:2,

	launch: function(app){

	},

    pause: function(){
        this.mp3player.pause();
        this.getCurrentAudio().isPlaying = this.STAT_PAUSE;
        this.getPlayer().stop();
        clearInterval(this.getTimer());
    },

    resume: function(){

        var caller = this;
        this.mp3player.play();
        this.getCurrentAudio().isPlaying = this.STAT_PLAYING;
        this.getPlayer().start();
        this.setTimer(setInterval(function(){caller.updateSlider(caller)}, 500));
    },


    playAndStop:function(){

        var mapCtrl = MapStory.app.getController('Map');
        if (!mapCtrl.mapview){
            Ext.Msg.alert('网络错误','请保持网络连接', Ext.emptyFn);
            return;
        }

        var caller = this;

        switch(this.getCurrentAudio().isPlaying){

        case this.STAT_STOP:
            if (this.getNextAudio().status == 2){

                // 将候选MP3设置激活
                this.helpers.copySettings(this.getCurrentAudio(), this.getNextAudio());
                this.getNextAudio().status = 0;
                clearTimeout(this.audioExpiredTimeout);
                this.updateUI();

                if (this.getIsInit()){
                    caller.getPlayer().showWaitingPanel();
                } else {
                    this.setIsInit(true);
                }
                this.playNewFile(this.getCurrentAudio().url, this.getCurrentAudio().duration);

            } else{
                Ext.Msg.confirm('没有新的广播推送','是否再次播放当前曲目？', function(buttonId){
                    if (buttonId == 'yes'){
                        caller.restart();
                    }
                });
            }
            break;
        case this.STAT_PAUSE:
            this.resume();
            break;
        case this.STAT_PLAYING:
            this.pause();
            break;
        }

    },

    updateUI: function(){
        this.getPlayer().applyText(this.getCurrentAudio().title, this.getCurrentAudio().location);
    },



    // 向map请求下一条mp3，由update调用，负责判断是否真正发出请求，保证调用时播放器正在播放
    requestNew: function(remainder){

        if (remainder > 10 || this.getNextAudio().status != 0) return;
        console.debug('remainder: '+ remainder+ ', status: '+ this.getNextAudio().status);
        this.requestNewCore();
    },


    requestNewCore: function(){
        console.debug('requestNext');

        this.getNextAudio().status = 1;
        MapStory.Config.setBgImage(this.getStatusButton(), 'url(resources/images/wait2.gif)');
        var mapCtrl = MapStory.app.getController('Map');
        mapCtrl.requestNearestAudio(this);
    },

    // map 返回当前可用的mp3，响应audio.如果不达要求，audio可以再次提出请求
    setNextSong: function(data, idx){

        console.debug('setNextSong');

        if (data.datas[idx]._id == this.getCurrentAudio().id){ // 无效的返回，重新申请
            return false;
        } else {
            var next = this.getNextAudio();
            var content = data.datas[idx];
            next.status = 2;
            next.id = content._id;
            next.location = content._name;
            next.url = MapStory.Config.getWebsite()+content.mp3+'.mp3';
            next.title = content.title;
            next.duration = content.alength;
            MapStory.Config.setBgImage(this.getStatusButton(), 'none');
            this.watchConnection(0);

            // 如果这个时候播放器已经停止，则重启播放器
            if (this.getCurrentAudio().isPlaying == this.STAT_STOP){
                console.debug('restart player');
                this.playAndStop();
            } else {
                // 设定expired timeout
                this.audioExpiredTimeout = setTimeout(function(){
                    console.debug('mp3 expired');
                    next.status = 0;
                }, this.getAudioExpiredTime());
            }
            return true;
        }
    },

    onStopped: function(caller){

        caller = this;
        caller.getSlider().setFlex(10000);
        clearInterval(caller.getTimer());
        caller.getPlayer().stop();
        caller.getCurrentAudio().isPlaying = caller.STAT_STOP;
        
        if (caller.getNextAudio().status == 2){
            caller.playAndStop();
        } else{
            caller.getPlayer().stop();
            //TO-DO：提示当前没有可用的新广播
            console.debug('nan');
            if (caller.getNextAudio().status != 1){
                caller.requestNewCore();
            }

            caller.watchConnection(10000);
        }
    },
    
    watchConnection: function(interval){
        var mapCtrl = MapStory.app.getController('Map');
        mapCtrl.forceUpdateFrequency(interval);
    },

    helpers:{

        copySettings: function(target, source){
            target.url = source.url;
            target.duration = source.duration;
            target.id = source.id;
            target.title = source.title;
            target.location = source.location;
        },

        convert: function(value){
            if (value >= 1.0) return 10000;
            else return value / (1-value);
        }
    }
});