define([
    'backbone',
    'models/score'
], function(
    Backbone,
    score
){

    var Collection = Backbone.Collection.extend({
    	model: score,
        url: '/scores?limit=10',
    	comparator: function(item) {
    		return -item.get('score');
    	}
    });

    return new Collection([
    ]);
});