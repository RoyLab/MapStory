Ext.define('MapStory.view.Main', {
    extend: 'Ext.NavigationView',
    xtype: 'main',
    requires: [
        'Ext.TitleBar',
        'MapStory.view.MiniPlayer',
        'Ext.Menu'
    ],
    config: {
        showAnimation:'slide',
        navigationBar: {

            items: [
            {
                xtype:'button',
                id: '_main_statusButton',
                iconCls:'refresh',
                width:40,
            },
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
            }]
        },

        id:'mainview',


        items:[{
            title:'地图故事：交大2015',
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
        Ext.Viewport.setMenu(this.createMenu(),{
            side: 'right',
            reveal: true
        });
    },*/
 
    /*createMenu: function(){

        var self = this;

        var menu = Ext.create('Ext.Menu', {
            width: 250,
            scrollable: false,
            style:'background: url(resources/images/menubg.jpg);\
                    background-repeat: no-repeat;\
                    background-position:bottom;',
            items: [
                {
                    xtype: 'button',
                    text: '搜索视频',

                    handler:function(){
                        Ext.Viewport.hideMenu('right');
                        Ext.getCmp('mainview').push(Ext.create('MapStory.view.test'));
                    }
                },
                {
                    xtype: 'button',
                    text: '意见反馈',
                },
                {
                    xtype: 'button',
                    text: '帮助',
                },
                {
                    xtype: 'togglefield',
                    label: '模拟地点',
                    labelWidth:'60%',
                    value: 1,
                    listeners:{
                        change:function(){
                            MapStory.app.getController('Map').helpers.isSimLocation = (this.getValue())?true:false;
                        }
                    }
                }
            ]
        });
        return menu;
    }*/
});