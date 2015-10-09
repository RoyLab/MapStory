Ext.define('MapStory.view.Main', {
    extend: 'Ext.NavigationView',
    xtype: 'main',
    requires: [
        'Ext.TitleBar',
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
                xtype:'button',
                text:'No one answer.'
            },
            /*{
                xtype:'dtplayer',
                docked:'bottom',
                flex:1
            },
            {
                xtype:'panel',
                id:'allmap',
                flex:1
            }*/] 
        }],
    }
});