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
            title:'地图故事：交大2015',
            layout:'vbox',

            items: [
            {
                xtype:'container',
                style:'background:#eee',
                flex:1,
                layout:'fit',
                items:[
                {
                    xtype:'container',
                    style:'box-shadow:inset 1px 1px  6px #000; background:transparent; display: inline-block;',
                    margin:'15 17 16 15',
                },
                {
                    xtype:'container',
                    //src:'resources/images/album2.jpg',
                    id:MapStory.Config.getMapId(),
                    margin:20,
                    //style:'position: relative;',
                }]
            },
            {
                xtype:'miniplayer',
                docked:'bottom',
            },
            /*{
                xtype:'panel',
                id:'allmap',
                flex:1
            }*/] 
        }],
    }
});