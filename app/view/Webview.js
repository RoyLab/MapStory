Ext.define('MapStory.view.Webview', {
    extend: 'Ext.Container',

    xtype: 'webview',

    config: {
        /**
         * @cfg {String} url URL to load
         */
        url : 'http://localhost:8080',
        title:'附近的视频',

        /**
         * @cfg
         * @inheritdoc
         *
         * Add your own style
         */
        baseCls : Ext.baseCSSPrefix + 'iframe'
    },

    initialize: function() {
        var me = this;
        me.callParent();
alert(true);
        me.iframe = this.element.createChild({
            tag   : 'iframe',
            src   : this.getUrl(),
            style : 'width: 100%; height: 100%;'
        });

        me.relayEvents(me.iframe, '*');
    }

});
