var userController = require('../users/userController.js');
var helpers = require('./helpers.js'); // our custom middleware
var ForgeOauth2 = require('forge-oauth2');
var request=require('request')

module.exports = function (app, express) {
  app.get('/oauth',
    function(req, res) {
      console.log('routing /oauth with code: ', req.query['code'])
      var apiInstanceAuth = new ForgeOauth2.ThreeLeggedApi();
      var apiInstanceIdentity = new ForgeOauth2.InformationalApi();
      var auth_code = req.query['code'];
      var redirect_uri = 'http://localhost:3000/oauth'
      var client_id = 'GrVYNeLqf1YnATpnNPnnFdMcDDB0EfQR';
      var client_secret = 'JaMArO6H4A8UGjCJ';
      var grant_type = 'authorization_code'

      apiInstanceAuth.gettoken(client_id, client_secret, grant_type, auth_code, redirect_uri, function(error, data, response) {

        if (error) {
            console.log('Error on gettoken call: ', error);
            res.redirect('/login');
        } else {
            var _accessToken = data.access_token;
            var _refreshToken = data.refresh_token;
            console.log('API called successfully. Returned data: ', data);
            ForgeOauth2.ApiClient.instance.authentications['oauth2_access_code'].accessToken = data.access_token;
            apiInstanceIdentity.aboutMe(function(error, data, response) {
                if (error) {
                    console.log('error getting user profile')
                    res.redirect('/signin')
                } else {
                    console.log('*** Storing user data ***')
                    req.session.regenerate(function() {
                        req.session.user = data['userName'];
                        console.log('session username: ', req.session.user)
                        req.session.userdata = data;
                        req.session.accessToken = _accessToken;
                        req.session.refreshToken = _refreshToken;
                        console.log('session userdata: ', req.session.userdata)
                        console.log('session accessToken: ', req.session.accessToken)
                        console.log('session established:', JSON.stringify(req.session))

                        res.redirect('/#/authenticated');
                    })
                } //end of successul login

            }); //end of get profile

        } // end of successful token processing
      }); // end of getToken

    }); //app.get /oauth

  app.get('/api/trending', function(req, res){
    var options = req.query;
    options = {
      method: 'GET',
      url: options.url+'&limit=' + options.limit
    };
    request.get(options.url, function(err, data, body) {
      if (err) {
          return res.send('error');
      }
      res.send(body);
    });

  });


  app.get('/api/search', function(req, res){
    var options = req.query;
    options = {
      method: 'GET',
      url: options.url+'&q=' + options.q
    };
    request.get(options.url, function(err, data, body) {
      if (err) {
          return res.send('error');
      }
      res.send(body);
    });

  });

  app.post('/api/users/signin', userController.signin);
  app.post('/api/users/signup', userController.signup);
  app.get('/api/users/signedin', userController.checkAuth);

  // If a request is sent somewhere other than the routes above,
  // send it through our custom error handler
  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);
};
