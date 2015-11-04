Ext.define('MapStory.view.test2', {
    extend: 'Ext.NavigationView',
    xtype: 'test2',
    requires: [
        'Ext.Img',
        'Ext.Carousel',
        'Ext.Label',
    ],

    config: {
        title:'terst',
        id:'test2',

        showAnimation:'slide',

        items:[
        {
            xtype:'panel',
            border:5,
            flex:1,
            layout:'fit',
            items:[{
                xtype:'image',
                src:'resources/images/album.jpg',
                width:80,
                height:80,

                listeners:{
                    tap:{
                        //event: 'tap',
                        fn: function() {
                            console.log('fdasfdsfad');
                            Ext.getCmp('test2').push(Ext.create('MapStory.view.test'));
                        }
                    }
                }
            }]
        }]

    }
});
