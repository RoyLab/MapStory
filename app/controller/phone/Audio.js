Ext.define('MapStory.controller.phone.Audio',{

    extend:'MapStory.controller.Audio',

    config:{

    },

    pause: function(){
        this.mp3player.pause();
    },

    resume: function(){
        this.mp3player.play();
    },


    restart: function(){
        this.mp3player.seekTo(0);
        this.mp3player.play();
    },


    playNewFile: function(fileName, length){

        var caller = this,
            loaded = true,
            timer = null;

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
                caller.getPlayer().hideWaitingPanel();
                caller.getCurrentAudio().isPlaying = caller.STAT_PLAYING;
                break;
            case Media.MEDIA_STOPPED:
                caller.onStopped(caller);
                break;
            case Media.MEDIA_PAUSED:
                clearInterval(timer);
                caller.getPlayer().stop();
                caller.getCurrentAudio().isPlaying = caller.STAT_PAUSE;
                break;
            }
        };

        function updateSlider(){

            caller.mp3player.getCurrentPosition(function(t){
                var raw = t/caller.getCurrentAudio().duration;
                caller.getSlider().setFlex(caller.helpers.convert(raw));
                caller.requestNew(caller.getCurrentAudio().duration-t);
            });
        }
    },
});