
'use strict';

var App = angular.module('todo-timer', ['ui.sortable']);

App.controller('toDoCtrl', ['$scope', '$timeout', function($scope, $timeout) {
	$scope.init = function() {
		$scope.model = [{
			'task': 'This is a test task',
			'done': false,
			'time': 0
		}, {
			'task': 'This is another test task',
			'done': false,
			'time': 0
		}];

		// Global time is stored in seconds
		$scope.globalTimeNum = 0;
		$scope.globalTime = formatTime($scope.globalTimeNum);

		$scope.restTimeNum = 300;
		$scope.restTime = formatTime($scope.restTimeNum);

		$scope.show = "All";
		$scope.currentShow = 0;
	};


	// Task functions
	$scope.addTask = function() {
		// Add to the end of the array model
		if ($scope.newTask.length > 0) {
			$scope.model.push({ task: $scope.newTask, done: false });
		}
		$scope.newTask= '';
	};

	$scope.deleteTask = function(ind) {
		$scope.model.splice(ind, 1);
	};

	$scope.completeTask = function(ind) {
		$scope.model[ind].done = !$scope.model[ind].done;
	};

	$scope.clearCompleteTasks = function() {
		$scope.model = $scope.model.filter(function(item) { return !item.done; });
	};


	// Timer interface functions
	$scope.startTimer = function() {
		if (!_globalTimerRunning) {
			incrementTimer();
		}
	};

	$scope.stopTimer = function() {
		$timeout.cancel($scope.timeout);
		_globalTimerRunning = false;
	};

	$scope.resetTimer = function() {
		$scope.stopTimer();
		adjustTime(0);
	};

	$scope.startRest = function() {
		if (!_restTimerRunning) {
			decrementRest();
		}
	};

	$scope.stopRest = function() {
		$timeout.cancel($scope.restTimeout);
		_restTimerRunning = false;
	};

	$scope.resetRest = function() {
		$scope.stopRest();
		adjustRest(300);
	};

	$scope.formatTime = function(time) {
		formatTime(time);
	}


	// Timer helper functions
	var _globalTimerRunning = false;
	var _restTimerRunning = false;

	function adjustTime(newTime) {
		$scope.globalTimeNum = newTime;
		$scope.globalTime = formatTime($scope.globalTimeNum);
	}

	function incrementTimer() {
		_globalTimerRunning = true;
		var newTime = $scope.globalTimeNum + 1;
		adjustTime(newTime);
		$scope.timeout = $timeout(incrementTimer, 1000);
	}

	function adjustRest(newTime) {
		$scope.restTimeNum = newTime;
		$scope.restTime = formatTime($scope.restTimeNum);
	}

	function decrementRest() {
		if ($scope.restTimeNum == 0) {
			return;
		}
		_restTimerRunning = true;
		var newTime = $scope.restTimeNum - 1;
		adjustRest(newTime);
		$scope.restTimeout = $timeout(decrementRest, 1000);
	}

	function formatTime(time) {
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

	// Configure the sortable
	$scope.sortableOptions = {
		handle: ".fa-reorder"
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
