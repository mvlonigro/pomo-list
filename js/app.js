
'use strict';

var App = angular.module('todo-timer', [/*'ui.sortable'*/]);

App.controller('toDoCtrl', ['$scope', function ($scope) {
	$scope.init = function () {
		$scope.model = [];

		$scope.show = "All";
		$scope.currentShow = 0;
	};

	$scope.addTask = function () {
		// Add to the end of the array model
		if ($scope.newTask.length > 0) {
			$scope.model.push({ task: $scope.newTask, done: false });
		}
		$scope.newTask= '';
	};

	$scope.deleteTask = function (ind) {
		$scope.model.splice(ind, 1);
	};

	$scope.completeTask = function (ind) {
		$scope.model[ind].done = !$scope.model[ind].done;
	}

	$scope.clearCompleteTasks = function () {
		$scope.model = $scope.model.filter(function(item) { return !item.done; });
	}
}]);


// App.directive('editInPlace', function () {
// 	// Runs during compile
// 	return {
// 		restrict: 'E',
// 		scope: { value: '=' },
// 		template: '<span class="todoName" ng-dblclick="edit()" ng-bind="value" ng-class="{ \'completed-task\': todo.done }"></span><input class="todoField" ng-model="vaulue"></input>',
// 		link: function($scope, iElm, iAttrs, controller) {
// 			var inputElement = angular.element(iElm.children()[1]);

// 			iElm.addClass('edit-in-place');

// 			$scope.editing = false;

// 			$scope.edit = function () {
// 				$scope.editing = true;

// 				iElm.addClass('active');

// 				inputElement.focus();
// 			};

// 			inputElement.on('blur', function () {
// 				$scope.editing = false;
// 				iElm.removeClass('active');
// 			});

// 		}
// 	};
// });

App.directive('ngEnter', function () {
	// Runs during compile
	return function (scope, elem) {
		$(elem).keyup(function (event) {
			if (event.keyCode === 13) {
				scope.$apply(function () {
					scope.addTask();
				});
			}
		});
	};
});