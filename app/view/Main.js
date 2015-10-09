Ext.define('MapStory.view.Main', {
    extend: 'Ext.NavigationView',
    xtype: 'main',
    requires: [
        'Ext.TitleBar',
        'MapStory.view.MiniPlayer'
    ],
    config: {

        id:'mainview',

        items:[
        {
            xtype:'container',
            title:'MapStory',
            layout:'vbox',

            items: [
            {
                xtype:'component',
                flex:0
            },
            {
                xtype:'miniplayer',
                docked:'bottom',
                flex:1
            },
            /*{
                xtype:'panel',
                id:'allmap',
                flex:1
            }*/] 
        }],
    }
});