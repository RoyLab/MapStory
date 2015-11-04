Ext.define('MapStory.profile.Phone', {
    extend: 'Ext.app.Profile',

    config: {
        name: 'Phone',
        controllers:['Audio']
    },

    isActive: function() {
    	return (typeof Media != 'undefined');
    },

    launch:function(){
    }
});