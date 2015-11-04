Ext.define('MapStory.view.Main', {
    extend: 'Ext.NavigationView',
    xtype: 'main',
    requires: [
        'Ext.TitleBar',
        'MapStory.view.MiniPlayer',
        'Ext.Menu'
    ],
    config: {

        id:'mainview',

        layout:{
            type:'card',
            animation:{
                duration:300,
                type:'slide'
            }
        },
        
        navigationBar: {

            backButton: {
                // Back button configuration
            },

            items: [
            {
                xtype: 'button',
                id: 'listButton',
                iconCls: 'list',
                ui: 'plain',
                handler: function(){
                    if(Ext.Viewport.getMenus().left.isHidden()){
                        Ext.Viewport.showMenu('left');
                    }
                    else
                    {
                        Ext.Viewport.hideMenu('left');
                    }
                }
            },
            {
                xtype:'button',
                id: '_main_statusButton',
                align:'right',
                width:40,
            }]
        },

        items:[{
            title:'地图故事：交大2015',
            id:'homepage',

            layout: {
                type: 'vbox',
                align:'center'
            },

            items: [
            {
                xtype:'container',
                style:'background:#eee',
                flex:1,
                layout:'fit',
                width:'100%',
                items:[
                {
                    xtype:'container',
                    style:'box-shadow:inset 1px 1px  6px #000; background:transparent; display: inline-block;',
                    margin:'15 17 16 15',
                },
                {
                    xtype:'container',
                    id:MapStory.Config.getMapId(),
                    margin:20,
                }]
            },
            {
                xtype:'miniplayer',
                docked:'bottom',
            }] 
        }]
    },

    /*initialize: function(){

 
    },*/
 
});