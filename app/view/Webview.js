Ext.define('MapStory.view.Webview', {
    extend: 'Ext.Component',

    xtype: 'webview',

    config: {
        url : 'http://sina.cn/',
        title:'附近的视频',

    },

    initialize:function(){
        this.callParent();
        var self = this;
        setTimeout(function(){self.createIframe(self.getUrl());}, 1000);
    },

    createIframe:function(url){
        var comp = document.createElement('iframe');
        comp.setAttribute('src', url);
        comp.setAttribute('width', '100%');
        comp.setAttribute('height', '100%');

        var elem = document.getElementById(this.getId());
        //elem.removeChild(elem.childNodes[0]);
        elem.appendChild(comp);
    }

});
