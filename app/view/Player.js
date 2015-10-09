Ext.define('MapStory.view.Player', {
    extend: 'Ext.Container',
    xtype: 'main',
    requires: [
        'Ext.Img',
        'Ext.Carousel',
        'Ext.Label',
    ],

    config: {

        id:'player2i',

        title:'terst',

        layout:'vbox',

        showAnimation:'slide',

        items:[
        {
            xtype:'carousel',
            border:5,
            flex:1,
            items:[{
                xtype:'image',
                layout:'fill',
                src:'resources/images/album.jpg',

            },
            {
                xtype:'image',
                layout:'fill',
                src:'resources/images/album2.jpg',
            }]
        },
        {
            xtype:'button',
            text:'fdafdfasd'
        }]

    }
});
