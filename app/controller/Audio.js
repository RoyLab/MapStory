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
            slider:'#_mn_used'
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
            url:MapStory.Config.getResourcePrefix()+'mp3/welcome.mp3',
            duration:14,
            id:-1,
            title:'关于地图故事',
            location:'上海交通大学',
            status:2, // 0 not request, 1 requesting, 2 received
        },

        audioExpiredTime:20000 // nextAudio will be stored for [audioExpiredTime] ms
	},

    STAT_STOP:0,
    STAT_PAUSE:1,
    STAT_PLAYING:2,

	launch: function(app){

        var caller = this;

        // for test only
        /*setTimeout(function(){
            caller.setAChanged(true);
            caller.setATitle('第二首曲子');
        }, 10000);*/
	},

    playAndStop:function(){

        var caller = this;

        switch(this.getCurrentAudio().isPlaying){

        case this.STAT_STOP:
            if (this.getNextAudio().status == 2){
                this.helper.copySettings(this.getCurrentAudio(), this.getNextAudio());
                this.updateUI();
                this.play(this.getCurrentAudio().url, this.getCurrentAudio().duration);
                this.getNextAudio().status = 0;
                clearTimeout(this.audioExpiredTimeout);
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


    pause: function(){
        if (typeof Media != 'undefined'){
            this.mp3player.pause();
        }
    },

    resume: function(){
        if (typeof Media != 'undefined'){
            this.mp3player.play();
        }
    },


    restart: function(){
        if (typeof Media != 'undefined'){
            this.mp3player.seekTo(0);
            this.mp3player.play();
        }
    },

    updateUI: function(){
        this.getPlayer().applyText(this.getCurrentAudio().title, this.getCurrentAudio().location);
    },

    play: function(fileName, length){

        var caller = this,
            loaded = true,
            timer = null;

        if (typeof Media != 'undefined'){

            // do some clean
            if (caller.mp3player){
                caller.mp3player.release();
            }
            caller.getCurrentAudio().isPlaying = caller.STAT_STOP;
            caller.mp3player = new Media(fileName, null, onMediaError, onMediaStatusChanged);
            caller.mp3player.play();

            function onMediaError(e){
                alert('Error: '+e.code+', fileName: '+fileName);
            };

            function onMediaStatusChanged(newStatus){

                console.log(newStatus);
                switch(newStatus){
                case Media.MEDIA_RUNNING:
                    timer = setInterval(updateSlider, 500);
                    caller.getPlayer().start();
                    caller.getCurrentAudio().isPlaying = caller.STAT_PLAYING;
                    break;
                case Media.MEDIA_STOPPED:
                    clearInterval(timer);
                    caller.getSlider().setFlex(10000);
                    caller.getCurrentAudio().isPlaying = caller.STAT_STOP;

                    //能不能call release
                    if (caller.getNextAudio().status == 2){
                        caller.playAndStop();
                    } else{
                        caller.getPlayer().stop();
                        //TO-DO：提示当前没有可用的新广播
                        console.debug('nan');
                        if (caller.getNextAudio().status != 1){
                            caller.requestNewCore();
                        }
                    }
                    break;
                case Media.MEDIA_PAUSED:
                    clearInterval(timer);
                    caller.getPlayer().stop();
                    caller.getCurrentAudio().isPlaying = caller.STAT_PAUSE;
                    break;
                }
            };
        }else{
            console.warn('No Media support found.')
            caller.mp3player = Ext.create('Ext.Audio',{
                url:fileName,
                hidden:true,
                listeners:{
                    ended:function(){
                        caller.getSlider().setFlex(10000);
                        clearInterval(timer);
                        caller.getPlayer().stop();
                    }
                }
            });

            if (caller.mp3player && loaded){
                caller.mp3player.play();
                caller.getPlayer().start();
                timer = setInterval(updateSlider, 500);
            }
        }

        function updateSlider(){

            function convert(value){
                if (value >= 1.0) return 10000;
                else return value / (1-value);
            }

            if (typeof Media != 'undefined'){
                caller.mp3player.getCurrentPosition(function(t){
                    var raw = t/caller.getCurrentAudio().duration;
                    caller.getSlider().setFlex(convert(raw));
                    caller.requestNew(caller.getCurrentAudio().duration-t);
                });
            }
            else{
                var raw = caller.mp3player.getCurrentTime()/caller.getCurrentAudio().duration;
                caller.getSlider().setFlex(convert(raw));
                caller.requestNew(caller.getCurrentAudio().duration-caller.mp3player.getCurrentTime());
            }
        }
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
        var mapCtrl = MapStory.app.getController('Map');
        mapCtrl.requestNearestAudio(this);
    },

    // map 返回当前可用的mp3，响应audio.如果不达要求，audio可以再次提出请求
    setNextSong: function(data, idx){

        b = idx;
        k = data; 

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

    helper:{
        copySettings: function(target, source){
            target.url = source.url;
            target.duration = source.duration;
            target.id = source.id;
            target.title = source.title;
            target.location = source.location;
        }
    }
});