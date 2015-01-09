
'use strict';

var App = angular.module('todo-timer', ['ui.sortable']);

App.controller('toDoCtrl', ['$scope', '$timeout', function($scope, $timeout) {
	$scope.init = function() {
		$scope.model = [/*{
			'task': 'This is a test task',
			'done': false,
			'time': 0,
			'primary': true
		}, {
			'task': 'This is another test task',
			'done': false,
			'time': 0,
			'primary': false
		}*/];

		// Global time is stored in seconds
		$scope.globalTimeNum = 0;
		$scope.restTimeNum = 300;

	};


	// Task functions
	$scope.addTask = function() {
		// Add to the end of the array model
		if ($scope.newTask.length > 0) {
			$scope.model.push({ task: $scope.newTask, done: false, time: 0, primary: false });
			updatePrimaryTask();
		}
		$scope.newTask= '';
	};

	$scope.deleteTask = function(ind) {
		$scope.model.splice(ind, 1);
		updatePrimaryTask();
	};

	$scope.completeTask = function(ind) {
		$scope.model[ind].done = !$scope.model[ind].done;
		updatePrimaryTask();
	};

	$scope.clearCompleteTasks = function() {
		$scope.model = $scope.model.filter(function(item) { return !item.done; });
		updatePrimaryTask();
	};


	// Timer interface functions
	$scope.startTimer = function() {
		if (!_globalTimerRunning) {
			$scope.stopRest();
			incrementTimer();
		}
	};

	$scope.stopTimer = function() {
		$timeout.cancel($scope.timeout);
		_globalTimerRunning = false;
	};

	$scope.resetTimer = function() {
		$scope.stopTimer();
		$scope.globalTimeNum = 0;
	};

	$scope.startRest = function() {
		if (!_restTimerRunning) {
			$scope.stopTimer();
			decrementRest();
		}
	};

	$scope.stopRest = function() {
		$timeout.cancel($scope.restTimeout);
		_restTimerRunning = false;
	};

	$scope.resetRest = function() {
		$scope.stopRest();
		$scope.restTimeNum = 300;
	};

	$scope.formatTime = function(time) {
		return formatTime(time);
	}


	// Timer helper functions
	var _globalTimerRunning = false;
	var _restTimerRunning = false;

	function incrementTimer() {
		_globalTimerRunning = true;

		if ($scope.model.length > 0) {
			var primaryInd = getTopIncompleteTaskIndex();
			if (primaryInd > -1) {
				$scope.model[primaryInd].time++;
			}
		}

		$scope.globalTimeNum++;
		$scope.timeout = $timeout(incrementTimer, 1000);
	}

	function decrementRest() {
		if ($scope.restTimeNum == 0) {
			return;
		}
		_restTimerRunning = true;
		$scope.restTimeNum--;
		$scope.restTimeout = $timeout(decrementRest, 1000);
	}

	function formatTime(time) {
		// if (typeof(time) !== 'int') {
		// 	return '';
		// }

		// Format seconds into hours:minutes:seconds format
		var hours = Math.floor(time / 3600);
		var minutes = Math.floor((time - (hours * 3600)) / 60);
		var seconds = time - (hours * 3600) - (minutes * 60);

		// Add leading zeros if necessary
		if (hours < 10) {
			hours = '0' + hours;
		}
		if (minutes < 10) {
			minutes = '0' + minutes;
		}
		if (seconds < 10) {
			seconds = '0' + seconds;
		}

		return hours + ':' + minutes + ':' + seconds;
	}

	function getTopIncompleteTaskIndex() {
		for (var i = 0; i < $scope.model.length; i++) {
			if (!$scope.model[i].done) {
				return i;
			}
		}
		return -1;
	}

	function updatePrimaryTask() {
		for (var i = 0; i < $scope.model.length; i++) {
			$scope.model[i].primary = false;
		}

		var primaryInd = getTopIncompleteTaskIndex();
		if (primaryInd > -1) {
			$scope.model[primaryInd].primary = true;
		}
	}


	// Configure the sortable
	$scope.sortableOptions = {
		'handle': ".fa-reorder",
		'stop': function(event, ui) {
			// After each re-order, we need to change the primary task
			updatePrimaryTask();
		}
	};
}]);

App.directive('ngEnter', function() {
	return function (scope, elem) {
		$(elem).keyup(function(event) {
			if (event.keyCode === 13) {
				scope.$apply(function() {
					scope.addTask();
				});
			}
		});
	};
});
