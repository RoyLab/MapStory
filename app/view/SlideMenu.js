Ext.define('MapStory.view.SlideMenu', {
    extend: 'Ext.Container',
    xtype: 'main',
    requires: [
        'Ext.Menu'
    ],
    config: {
        //..snip
    },
 
    //function goes here
    createMenu: function(){
        var menu = Ext.create('Ext.Menu', {
            width: 250,
            scrollable: 'vertical',
            items: [
                {
                    xtype: 'button',
                    text: 'Option 1',
                },
                {
                    xtype: 'button',
                    text: 'Option 2',
                }
            ]
        });
     
        return menu;
    }
 
});