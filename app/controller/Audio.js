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
            playButton:'#playButton'
        },

        isPlaying:false
	},

	launch: function(app){
        
	},

    playAndStop:function(){

        if (!this.getIsPlaying()){
            this.setIsPlaying(true);
            this.getPlayButton().setSrc('resources/images/start.png');
        } else{
            this.setIsPlaying(false);
            this.getPlayButton().setSrc('resources/images/stop.png');                        
        }

    }
});