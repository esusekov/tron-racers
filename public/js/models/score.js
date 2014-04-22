define([
    'backbone',
], function(
    Backbone
){

    var Model = Backbone.Model.extend({
    	defaults: {
    		name: '',
    		score: 0,
    		id: -1
    	}
    });

    return Model;
});