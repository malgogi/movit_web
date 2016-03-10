'use strict';

describe('Directive: searchbar', function () {

  // load the directive's module and view
  beforeEach(module('movitWebApp'));
  beforeEach(module('components/searchbar/searchbar.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<searchbar></searchbar>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the searchbar directive');
  }));
});
