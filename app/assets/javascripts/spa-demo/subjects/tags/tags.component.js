(function() {
  "use strict";

  angular
    .module("spa-demo.subjects")
    .component("sdTagEditor", {
      templateUrl: tagEditorTemplateUrl,
      controller: TagEditorController,
      bindings: {
        authz: "<"
      },
      require: {
        tagsAuthz: "^sdTagsAuthz"
      }
    })
    .component("sdTagSelector", {
      templateUrl: tagSelectorTemplateUrl,
      controller: TagSelectorController,
      bindings: {
        authz: "<"
      }
    })
    ;


  tagEditorTemplateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
  function tagEditorTemplateUrl(APP_CONFIG) {
    return APP_CONFIG.tag_editor_html;
  }
  tagSelectorTemplateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
  function tagSelectorTemplateUrl(APP_CONFIG) {
    return APP_CONFIG.tag_selector_html;
  }

  TagEditorController.$inject = ["$scope","$q",
                                   "$state","$stateParams",
                                   "spa-demo.authz.Authz",
                                   "spa-demo.subjects.Tag"];
  function TagEditorController($scope, $q, $state, $stateParams,
                                 Authz, Tag) {
    var vm=this;
    vm.create = create;
    vm.clear  = clear;
    vm.update  = update;
    vm.remove  = remove;

    vm.$onInit = function() {
      console.log("TagEditorController",$scope);
      $scope.$watch(function(){ return Authz.getAuthorizedUserId(); },
                    function(){
                      if ($stateParams.id) {
                        reload($stateParams.id);
                      } else {
                        newResource();
                      }
                    });
    }

    return;
    //////////////
    function newResource() {
      vm.item = new Tag();
      vm.tagsAuthz.newItem(vm.item);
      return vm.item;
    }

    function reload(tagId) {
      var itemId = tagId ? tagId : vm.item.id;
      console.log("re/loading tag", itemId);
      vm.item = Tag.get({id:itemId});
      vm.tagsAuthz.newItem(vm.item);
    }

    function create() {
      vm.item.errors = null;
      vm.item.$save().then(
        function(){
          console.log("tag created", vm.item);
          $state.go(".",{id:vm.item.id});
        },
        handleError);
    }

    function clear() {
      newResource();
      $state.go(".",{id: null});
    }

    function update() {
      vm.item.errors = null;
      var update=vm.item.$update();
    }

    function remove() {
      vm.item.$remove().then(
        function(){
          console.log("tag.removed", vm.item);
          clear();
        },
        handleError);
    }

    function handleError(response) {
      console.log("error", response);
      if (response.data) {
        vm.item["errors"]=response.data.errors;
      }
      if (!vm.item.errors) {
        vm.item["errors"]={}
        vm.item["errors"]["full_messages"]=[response];
      }
      $scope.tagform.$setPristine();
    }
  }

  TagSelectorController.$inject = ["$scope",
                                     "$stateParams",
                                     "spa-demo.authz.Authz",
                                     "spa-demo.subjects.Tag"];
  function TagSelectorController($scope, $stateParams, Authz, Tag) {
    var vm=this;

    vm.$onInit = function() {
      console.log("TagSelectorController",$scope);
      $scope.$watch(function(){ return Authz.getAuthorizedUserId(); },
                    function(){
                      if (!$stateParams.id) {
                        vm.items = Tag.query();
                      }
                    });
    }
    return;
    //////////////
  }

})();
