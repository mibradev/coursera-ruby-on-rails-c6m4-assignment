(function() {
  "use strict";

  angular
    .module("spa-demo.subjects")
    .factory("spa-demo.subjects.Tag", TagFactory);

  TagFactory.$inject = ["$resource","spa-demo.config.APP_CONFIG"];
  function TagFactory($resource, APP_CONFIG) {
    var service = $resource(APP_CONFIG.server_url + "/api/tags/:id",
        { id: '@id'},
        { update: {method:"PUT"} }
      );
    return service;
  }
})();
