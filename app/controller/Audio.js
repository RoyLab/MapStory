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
            playButton:'#_mn_playButton'
        },

        isPlaying:0, // 0: stop, 1: playing, 2: pause
        aLength:14,
        aContent:MapStory.Config.getResourcePrefix()+'mp3/welcome.mp3'
	},

    STAT_STOP:0,
    STAT_PAUSE:1,
    STAT_PLAYING:2,

	launch: function(app){

	},

    playAndStop:function(){

        switch(this.getIsPlaying()){

        case this.STAT_STOP:
            this.play(this.getAContent(), this.getALength());
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

    play: function(fileName, length){

        var caller = this,
            loaded = true,
            timer = null;

        if (typeof Media != 'undefined'){

            // do some clean
            if (caller.mp3player){
                caller.mp3player.release();
            }
            caller.setIsPlaying(caller.STAT_STOP);
            caller.mp3player = new Media(fileName, null, onMediaError, onMediaStatusChanged);
            caller.mp3player.play();

            function onMediaError(e){
                alert('Error: '+e.code+', fileName: '+fileName);
            };

            function onMediaStatusChanged(newStatus){

                switch(newStatus){
                case Media.MEDIA_RUNNING:
                    timer = setInterval(updateSlider, 500);
                    caller.getPlayer().start();
                    caller.setIsPlaying(caller.STAT_PLAYING);
                    break;
                case Media.MEDIA_STOPPED:
                    clearInterval(timer);
                    caller.getPlayer().stop();
                    caller.setIsPlaying(caller.STAT_STOP);
                    break;
                case Media.MEDIA_PAUSED:
                    clearInterval(timer);
                    caller.getPlayer().stop();
                    caller.setIsPlaying(caller.STAT_PAUSE);
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
                        clearInterval(timer);
                        caller.getPlayer().stop();
                    }
                }
            });

            if (caller.mp3player && loaded){
                caller.mp3player.play();
                timer = setInterval(updateSlider, 500);
            }
        }

        function updateSlider(){

           /* if (caller.webPlayer){
                caller.setValue(100*caller.mp3player.getCurrentTime()/caller.getALength());
            }
            else{
                var time = 0;
                caller.mp3player.getCurrentPosition(function(t){
                    caller.setValue(100*t/caller.getALength());
                });
            }*/
        }
    },


});