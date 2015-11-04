/*
    This file is generated and updated by Sencha Cmd. You can edit this file as
    needed for your application, but these edits will have to be merged by
    Sencha Cmd when it performs code generation tasks such as generating new
    models, controllers or views and when running "sencha app upgrade".

    Ideally changes to this file would be limited and most work would be done
    in other places (such as Controllers). If Sencha Cmd cannot merge your
    changes and its generated code, it will produce a "merge conflict" that you
    will need to resolve manually.
*/

Ext.application({
    name: 'MapStory',

    requires: [
        'Ext.MessageBox',
        'MapStory.Config'
    ],

    views: [
        'Main',
        'Player'
    ],

    controllers:[
        'Map'
    ],

    profiles: ['Phone','Nonphone'],

    icon: {
        '57': 'resources/icons/Icon.png',
        '72': 'resources/icons/Icon~ipad.png',
        '114': 'resources/icons/Icon@2x.png',
        '144': 'resources/icons/Icon~ipad@2x.png'
    },

    isIconPrecomposed: true,

    startupImage: {
        '320x460': 'resources/startup/320x460.jpg',
        '640x920': 'resources/startup/640x920.png',
        '768x1004': 'resources/startup/768x1004.png',
        '748x1024': 'resources/startup/748x1024.png',
        '1536x2008': 'resources/startup/1536x2008.png',
        '1496x2048': 'resources/startup/1496x2048.png'
    },

    launch: function() {
        // Destroy the #appLoadingIndicator element
        Ext.fly('appLoadingIndicator').destroy();

        // Initialize the main view
        Ext.Viewport.add(Ext.create('MapStory.view.Main'));
        Ext.Viewport.setMenu(this.createMenu(),{
            side: 'left',
            cover: false
        });
    },

    createMenu: function(){

        return Ext.create('Ext.Menu', {

            width: 250,
            scrollable: true,
            style:'background: url(resources/images/menubg.jpg);\
                    background-repeat: no-repeat;\
                    background-position:bottom;',
            items: [
                {
                    xtype: 'button',
                    text: '搜索视频',

                    handler:function(){
                        Ext.Viewport.hideMenu('left');
                        setTimeout(function(){
                            Ext.getCmp('mainview').push(Ext.create('MapStory.view.Webview'));
                        }, 500);
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
    },

    onUpdated: function() {
        Ext.Msg.confirm(
            "Application Update",
            "This application has just successfully been updated to the latest version. Reload now?",
            function(buttonId) {
                if (buttonId === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});
