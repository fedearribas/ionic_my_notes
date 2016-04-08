angular.module('mynotes.user', [])
.factory('User', function($http) {

  var apiUrl = 'http://localhost:8200';

	var token = localStorage['apiToken'] || '';

  function isNotEmpty(token) {
      return token !== '';
    }   

	function setHeader(token) {
      $http.defaults.headers.common.Authorization = 'Bearer ' + token;
    }

    if (isNotEmpty(token)) {
      setHeader(token);
    }

	return {
		login: function(credentials) {
     return $http.post(apiUrl + '/authenticate', credentials)
        .then(function (response) {
          token = localStorage['apiToken'] = response.data.token;
          setHeader(token);
        });
		},
		isLoggedIn: function() {
			return isNotEmpty(token);
		},
    logout: function(){
      token = localStorage['apiToken'] = "";     
    }
	};
});