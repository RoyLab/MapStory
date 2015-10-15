Ext.define('MapStory.Config', {

	extend:'Ext.Base',
    singleton : true,
  
    config : {  
        website:'http://londit-50c03e41547f8.com.1130.url-test.com',
        mapId:'mapview',
        miniPlayerId:'mplayer',
        _resPrefix:null
    },

    constructor : function(config) {  
        this.initConfig(config);  
    },


    getResourcePrefix: function(){
        if (this.get_resPrefix() == null){
            var re = new RegExp('cordova_plugins.js'),
                scripts = document.getElementsByTagName('script');

            for (var i = 0, ii = scripts.length; i < ii; i++) {
                var path = scripts[i].getAttribute('src');
                if(re.test(path)){
                    this.set_resPrefix(path.replace(re, '')+'resources/');
                    return this.get_resPrefix();
                }
            }
            this.set_resPrefix('resources/');
        }
        return this.get_resPrefix();
    }
});  