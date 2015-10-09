Ext.define('MapStory.view.MiniPlayer', {
    extend: 'Ext.Container',
    xtype: 'miniplayer',
    requires: [
        'Ext.Img',
        'Ext.Label',
    ],

    config: {

        layout:{
            type:'hbox',
            align:'center',
        },

        cls:'mp3player',

        height:80,

        items:[
        {
            xtype:'container',
            docked:'top',
            height:3,
            layout:'hbox',

            items:[{
                xtype:'component',
                cls:'progressbar',
                height:3,
                flex:16
            },
            {
                xtype:'component',
                height:3,
                flex:39,
            }],
        },
        {
            xtype:'image',
            src:'resources/images/album.jpg',
            width:80,
            height:80,

            listeners:{
                tap: function() {
                        Ext.getCmp('mainview').push(Ext.create('MapStory.view.Player'));
                }
            }
        },
        {xtype:'spacer'},
        {
            xtype:'label',
            html:'Story Goes Here',
        },
        {xtype:'spacer'},
        {
            xtype:'component',
            width:80,
            height:64,
            cls:'play',
        }]
    }
});
