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

        isPlaying:0, // 0: stop
        aLength:14,
        aContent:'/android_asset/www/resources/mp3/welcome.mp3'
	},

	launch: function(app){

	},

    playAndStop:function(){

        k = this.getPlayButton();
        if (!this.getIsPlaying()){
            this.setIsPlaying(true);
            this.getPlayer().start();
            this.play(this.getAContent(), this.getALength());
        } else{
            this.setIsPlaying(false);
            this.getPlayer().stop();
        }

    },

    play: function(fileName, length){

        var caller = this,
            loaded = true;

        caller.setALength(length);

        if (typeof Media != 'undefined'){
            if (caller.mp3player){
                caller.mp3player.release();
            }
            caller.mp3player = new Media(fileName, null, onMediaError, onMediaStatusChanged);
        }else{
            console.error('No Media support found.')
            caller.webPlayer = true;
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
        }

        if (caller.mp3player && loaded){
            caller.mp3player.play();
            var timer = setInterval(updateSlider, 500);
        }

        function onMediaError(e){
            loaded = false;
            caller.mp3player = null;
            caller.getPlayer().stop();
            alert('Error: '+ e.code);
        };

        function onMediaStatusChanged(newStatus){
            if (newStatus == Media.MEDIA_STOPPED){
                clearInterval(timer);
                caller.getPlayer().stop();
            }
        };

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