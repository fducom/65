/**
 * skladController
 *
 * @module    :: Controller
 * @description :: Contains logic for handling requests.
 */

module.exports = {
  
  // This losklad the sign-up page --> new.ejs
  'new': function(req, res) {
    res.view();
  },
  
      
  create: function(req, res, next) {

    var skladObj = {
      name: req.param('name'),
      title: req.param('title'),
	  price: req.param('price'),
      text: req.param('text'),
	  img: req.param('img'),
	  category: req.param('category')
    }

    // Create a sklad with the params sent from 
    // the sign-up form --> new.ejs
    Sklad.create(skladObj, function skladCreated(err, sklad) {

      // // If there's an error
      // if (err) return next(err);

      if (err) {
        console.log(err);
        req.session.flash = {
          err: err
        }

        // If error redirect back to sign-up page
        return res.redirect('/sklad/new');
      }

      // Log sklad in

      // Change status to online
      
      sklad.save(function(err, sklad) {
        if (err) return next(err);

      // add the action attribute to the sklad object for the flash message.
      sklad.action = " sklad ok"

      // Let other subscribed sockets know that the sklad was created.
      Sklad.publishCreate(sklad);

        // After successfully creating the sklad
        // redirect to the show action
        // From ep1-6: //res.json(sklad); 

        res.redirect('/sklad/show/' + sklad.id);
      });
    });
  },

  // render the profile view (e.g. /views/show.ejs)
  show: function(req, res, next) {
    Sklad.findOne(req.param('id'), function foundSklad(err, sklad) {
      if (err) return next(err);
      if (!sklad) return next();
      res.view({
        sklad: sklad
      });
    });
  },

  index: function(req, res, next) {

    // Get an array of all sklads in the sklad collection(e.g. table)
	Sklad.find({ category:'taxi'}).exec(function foundSklads(err, sklads) {
      if (err) return next(err);
      // pass the array down to the /views/index.ejs page
      res.view({
        sklads: sklads
      });
    });
  },
  accessorize: function(req, res, next) {

    // Get an array of all sklads in the sklad collection(e.g. table)
	Sklad.find({ category: 'accessorize'}).exec(function foundSklads(err, sklads) {
      if (err) return next(err);
      // pass the array down to the /views/index.ejs page
      res.view({
        sklads: sklads
      });
    });
  },
    casuals: function(req, res, next) {

    // Get an array of all sklads in the sklad collection(e.g. table)
	Sklad.find({ category: 'casuals' }).exec(function foundSklads(err, sklads) {
      if (err) return next(err);
      // pass the array down to the /views/index.ejs page
      res.view({
        sklads: sklads
      });
    });
  },
    heels: function(req, res, next) {

    // Get an array of all sklads in the sklad collection(e.g. table)
	Sklad.find({ category: 'heels' }).exec(function foundSklads(err, sklads) {
      if (err) return next(err);
      // pass the array down to the /views/index.ejs page
      res.view({
        sklads: sklads
      });
    });
  },
    taxi: function(req, res, next) {

    // Get an array of all sklads in the sklad collection(e.g. table)
	Sklad.find({ category: 'taxi' }).exec(function foundSklads(err, sklads) {
      if (err) return next(err);
      // pass the array down to the /views/index.ejs page
      res.view({
        sklads: sklads
      });
    });
  },
     events: function(req, res, next) {

    // Get an array of all sklads in the sklad collection(e.g. table)
	Sklad.find({ category: 'events' }).exec(function foundSklads(err, sklads) {
      if (err) return next(err);
      // pass the array down to the /views/index.ejs page
      res.view({
        sklads: sklads
      });
    });
  },
  pages: function(req, res, next) {

    // Get an array of all sklads in the sklad collection(e.g. table)
	Sklad.find({ category: '' }).exec(function foundSklads(err, sklads) {
      if (err) return next(err);
      // pass the array down to the /views/index.ejs page
      res.view({
        sklads: sklads
      });
    });
  },

  // render the edit view (e.g. /views/edit.ejs)
  edit: function(req, res, next) {

    // Find the sklad from the id passed in via params
    Sklad.findOne(req.param('id'), function foundSklad(err, sklad) {
      if (err) return next(err);
      if (!sklad) return next('sklad doesn\'t exist.');

      res.view({
        sklad: sklad
      });
    });
  },

  // process the info from edit view
  update: function(req, res, next) {

      var skladObj = {
        name: req.param('name'),
        title: req.param('title'),
		price: req.param('price'),
        text: req.param('text'),
		img: req.param('img'),
		category: req.param('category')
      }
    

    Sklad.update(req.param('id'), skladObj, function skladUpdated(err) {
      if (err) {
        return res.redirect('/sklad/edit/' + req.param('id'));
      }

      res.redirect('/sklad/show/' + req.param('id'));
    });
  },

  destroy: function(req, res, next) {

    Sklad.findOne(req.param('id'), function foundsklad(err, sklad) {
      if (err) return next(err);

      if (!sklad) return next('sklad doesn\'t exist.');

      Sklad.destroy(req.param('id'), function skladDestroyed(err) {
        if (err) return next(err);

        // Inform other sockets (e.g. connected sockets that are subscribed) that this sklad is now logged in
        Sklad.publishUpdate(sklad.id, {
          name: sklad.name,
          action: ' has been destroyed.'
        });

        // Let other sockets know that the sklad instance was destroyed.
        Sklad.publishDestroy(sklad.id);

      });        

      res.redirect('/sklad');

    });
  },

  // This action works with app.js socket.get('/sklad/subscribe') to
  // subscribe to the sklad model classroom and instances of the sklad
  // model
  subscribe: function(req, res) {
 
    // Find all current sklads in the sklad model
    Sklad.find(function foundsklads(err, sklads) {
      if (err) return next(err);
 
      // subscribe this socket to the sklad model classroom
      Sklad.subscribe(req.socket);
 
      // subscribe this socket to the sklad instance rooms
      Sklad.subscribe(req.socket, sklads);
 
      // This will avoid a warning from the socket for trying to render
      // html over the socket.
      res.send(200); 
    });
  }

};