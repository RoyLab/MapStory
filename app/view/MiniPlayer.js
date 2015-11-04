Ext.define('MapStory.view.MiniPlayer', {
    extend: 'Ext.Container',
    xtype: 'miniplayer',
    requires: [
        'Ext.Img',
        'Ext.Label',
    ],

    config: {

        // recommended height: 75
        id:MapStory.Config.getMiniPlayerId(),

        layout:{
            type:'hbox',
            align:'center',
        },

        style:'background:#f7f7f7',

        items:[
        {
            xtype:'component',
            height:1,
            style:'background:#bbb',
            docked:'top'
        },
        {
            xtype:'container',
            docked:'top',
            height:3,
            layout:'hbox',

            items:[{
                xtype:'component',
                id:'_mn_used',
                style:'background:#459ffa',
                height:3,
                flex:0
            },
            {
                xtype:'component',
                style:'background:#fff',
                height:3,
                flex:1
            }]
        },
        {
            xtype:'image',
            src:'resources/images/album.jpg',
            width:75,
            height:75,

                listeners:{
                    tap:{
                        //event: 'tap',
                        fn: function() {
                            console.log('fdasfdsfad');
                            Ext.getCmp('mainview').push(Ext.create('MapStory.view.test'));
                        }
                    }
                }
            /*listeners:{
                tap: function() {
                    Ext.getCmp('mainview').push(Ext.create('MapStory.view.Player'));
                }
            }*/
        },
        {
            xtype:'spacer',
            width:20
        },
        {
            xtype:'container',
            layout:'vbox',

            items:[{
                xtype:'label',
                id:'_mp_mainTitle',
                style:'background:#transparent;font-family: monospace;font-size:1.4em',
                margin:'0 0 7 0',
                html:'关于地图故事'              
            },
            {
                xtype:'label',
                id:'_mp_location',
                style:'background:#transparent;font-family: monospace;font-size:1.0em',
                html:'上海交通大学闵行校区'           
            }]
        },
        {xtype:'spacer'},
        {
            xtype:'button',
            style:'background: url(resources/images/stop.png);\
                    background-repeat: no-repeat;\
                    background-position:center;',
            id:'_mn_playButton',
            border:0,
            width:52,
            height:52, 
        },
        {
            xtype:'spacer',
            width:20
        }]
    },


    start:function(){
        Ext.getCmp('_mn_playButton').setStyle('background: url(resources/images/start.png);\
                    background-repeat: no-repeat;\
                    background-position:center;');  
    },

    stop:function(){
        Ext.getCmp('_mn_playButton').setStyle('background: url(resources/images/stop.png);\
                    background-repeat: no-repeat;\
                    background-position:center;');  
    },

    applyText:function(title, location){
        Ext.getCmp('_mp_mainTitle').setHtml(title);
        Ext.getCmp('_mp_location').setHtml(location);
    },

    showWaitingPanel:function(caller){

        caller = this;

        if (!caller.overlay) {
            caller.overlay = Ext.Viewport.add({
                xtype: 'panel',
                modal: true,
                hideOnMaskTap: false,
                showAnimation: {
                    type: 'popIn',
                    duration: 250,
                    easing: 'ease-out'
                },
                hideAnimation: {
                    type: 'popOut',
                    duration: 250,
                    easing: 'ease-out'
                },
                centered: true,
                width:200,
                height: 50,
                styleHtmlContent: true,
                html: '<p>正在为您准备下一曲目...</p>',
                scrollable: true
            });
        }

        caller.overlay.show();        
    },

    hideWaitingPanel:function(){
        if (this.overlay){
            this.overlay.hide();
        }
    }

});
