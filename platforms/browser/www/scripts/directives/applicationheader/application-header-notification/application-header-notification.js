'use strict';

/**
*header notification 
 */
angular.module('starsApp')
	.directive('applicationHeaderNotification',function(){
		return {
        templateUrl:'scripts/directives/applicationheader/application-header-notification/application-header-notification.html',
        restrict: 'E',
        replace: true,
	}
	});


