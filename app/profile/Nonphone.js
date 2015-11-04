Ext.define('MapStory.profile.Nonphone', {
    extend: 'Ext.app.Profile',

    config: {
        name: 'Nonphone',
        controllers:['Audio']
    },

    isActive: function() {
    	return (typeof Media == 'undefined');
    },

    launch:function(){
    }
});