Ext.define('MapStory.Config', {

	extend:'Ext.Base',
    singleton : true,
  
    config : {  
        website:'http://202.120.38.143/~shengbin/map/',
        mapId:'mapview',
        miniPlayerId:'mplayer',
        _resPrefix:null,

        simPath:[
        [121.430994,31.017467],
        [121.430522,31.018635],
        [121.431799,31.019692],
        [121.431466,31.02166],
        [121.433859,31.022313],
        [121.436348,31.022506],
        [121.438226,31.022313],
        [121.440833,31.023104]]
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
    },

    // 可能会覆盖其他效果
    setBgImage:function(elem, url){
        elem.setStyle(this.getBgImageCSS(url));
    },

    getBgImageCSS:function(url){
        var it = 'background: $1;\
                    background-repeat: no-repeat;\
                    background-position:center;'.replace('$1', url);
        return it;
    }
});  