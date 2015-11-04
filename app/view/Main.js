Ext.define('MapStory.view.Main', {
    extend: 'Ext.navigation.View',
    xtype: 'main',
    requires: [
        'Ext.TitleBar',
        'MapStory.view.MiniPlayer'
    ],
    config: {

        navigationBar: {

            items: [
                {
                    xtype: 'button',
                    id: 'listButton',
                    align:'right',
                    iconCls: 'list',
                    ui: 'plain',
                    handler: function(){
                        if(Ext.Viewport.getMenus().right.isHidden()){
                            Ext.Viewport.showMenu('right');
                        }
                        else
                        {
                            Ext.Viewport.hideMenu('right');
                        }
                    }
                },
            ]
        },

        id:'mainview',

        items:[
        {
            title:'地图故事：交大2015',
            layout: {
                type: 'vbox',
                align:'center'
            },

            items: [
            {
                xtype:'button',
                //ui:'normal',
                id:'refresh_map_button',
                margin:5,
                iconCls:'refresh',
                hideAnimation: Ext.os.is.Android ? false : {
                    type: 'fadeOut',
                    duration: 500
                },
            },
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
    },

    initialize: function(){
        Ext.Viewport.setMenu(this.createMenu(),{
            side: 'right',
            reveal: true
        });
    },
 
    createMenu: function(){
        var menu = Ext.create('Ext.Menu', {
            width: 250,
            scrollable: 'vertical',
            style:'background: url(resources/images/menubg.jpg);\
                    background-repeat: no-repeat;\
                    background-position:bottom;',
            items: [
                {
                    xtype: 'button',
                    text: '搜索视频',
                },
                {
                    xtype: 'button',
                    text: '意见反馈',
                },
                {
                    xtype: 'button',
                    text: '帮助',
                }
            ]
        });
        return menu;
    }
});