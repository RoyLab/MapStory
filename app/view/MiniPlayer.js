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
                style:'background:#459ffa',
                height:3,
                flex:16
            },
            {
                xtype:'component',
                style:'background:#fff',
                height:3,
                flex:39
            }]
        },
        {
            xtype:'image',
            src:'resources/images/album.jpg',
            width:75,
            height:75,

            listeners:{
                tap: function() {
                    Ext.getCmp('mainview').push(Ext.create('MapStory.view.Player'));
                }
            }
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
                style:'background:#transparent;font-family: monospace;font-size:1.4em',
                margin:'0 0 7 0',
                html:'暂无广播曲目'              
            },
            {
                xtype:'label',
                style:'background:#transparent;font-family: monospace;font-size:1.0em',
                html:'未知地点'           
            }]
        },
        {xtype:'spacer'},
        {
            xtype:'image',
            src:'resources/images/stop.png',
            id:'playButton',
            width:50,
            height:50,
        },
        {
            xtype:'spacer',
            width:20
        }]
    }
});
