/**
 * news
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {

  schema: true,

  attributes: {
  	
  	name: {
  		type: 'string',
  		required: true
  	},

  	title: {
  		type: 'string'
  	},
	
	text: {
  		type: 'text'
  	},
	
	price: {
  		type: 'text'
  	},
	
	img: {
  		type: 'string'
  	},
	
	category: {
  		type: 'string'
  	},



    toJSON: function() {
      var obj = this.toObject();
      delete obj._csrf;
      return obj;
    }
   
  }
  
 
};
