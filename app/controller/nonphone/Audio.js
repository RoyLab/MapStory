Ext.define('MapStory.controller.nonphone.Audio',{

	extend:'MapStory.controller.Audio',

    requires:[
        'Ext.Audio'
    ],

	config:{
    },

    restart: function(){
        this.mp3player.setCurrentTime(0);
        this.resume();
    },


    playNewFile: function(fileName, length){

        var caller = this,
            timer = null;

        if (!caller.mp3player){
            caller.mp3player = Ext.create('Ext.Audio',{
                url:fileName,
                hidden:true,
                listeners:{
                    ended:function(){
                        caller.onStopped(caller);
                    }
                }
            });           
        } else {
            caller.mp3player.setUrl(fileName);
        }

        if (caller.mp3player){
            caller.resume();
        }

        setTimeout(function(){caller.getPlayer().hideWaitingPanel();}, 2000);
    },

    updateSlider: function(caller){

        var raw = caller.mp3player.getCurrentTime()/caller.getCurrentAudio().duration;
        caller.getSlider().setFlex(caller.helpers.convert(raw));
        caller.requestNew(caller.getCurrentAudio().duration-caller.mp3player.getCurrentTime());
    }
});