window.App = Ember.Application.create();

App.Router.map(function() {
  this.resource('posts');
});

App.ApplicationRoute = Ember.Route.extend({
  setupController: function(controller, model) {
    controller.set('loggedIn', !!localStorage.jwt);
  },

  actions: {
    logout: function() {
      delete localStorage.jwt;
      this.controllerFor('application').set('loggedIn', false);
      this.transitionTo('index');
    }
  }
});

App.PostsRoute = Ember.Route.extend({
  model: function() {
    return Ember.$.ajax({
      dataType: 'json',
      url: '/api/posts',
      headers: {
        'Authorization': 'Bearer ' + localStorage.jwt
      }
    }).then(function(data) {
      return data;
    }, function() {
      return this.transitionTo('index');
    }.bind(this));
  }
});

App.IndexController = Ember.Controller.extend({
  needs: 'application',
  loggedInBinding: 'controllers.application.loggedIn',

  actions: {
    login: function() {
      delete localStorage.jwt

      Ember.$.post('/auth', {
        auth: {
          username: this.get('username'),
          password: this.get('password')
        }
      }).then(function(data) {
        localStorage.jwt = data.token;
        this.get('controllers.application').set('loggedIn', true);
      }.bind(this), function() {
        alert('Login failed');
      });
    }
  }
});
