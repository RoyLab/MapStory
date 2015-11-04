Ext.define('MapStory.view.test', {
    extend: 'Ext.Container',
    xtype: 'test',
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
            xtype:'panel',
            border:5,
            flex:1,
            layout:'fit',
            items:[{
                xtype:'image',
                src:'resources/images/album.jpg'
            }]
        },
        {
            xtype:'button',
            text:'fdafdfasd'
        }]

    }
});
