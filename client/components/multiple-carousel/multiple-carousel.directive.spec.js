'use strict';

describe('Directive: multipleCarousel', function () {

  // load the directive's module and view
  beforeEach(module('movitWebApp'));
  beforeEach(module('components/multiple-carousel/multiple-carousel.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<multiple-carousel></multiple-carousel>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the multipleCarousel directive');
  }));
});
