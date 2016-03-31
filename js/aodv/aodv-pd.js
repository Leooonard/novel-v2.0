/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _Manager = __webpack_require__(1);
	
	var _Board = __webpack_require__(12);
	
	$(function () {
	   var $board = $("#experimentBoard");
	   (0, _Board.registerBoard)($board);
	   _Manager.Manager.setBoard($board);
	
	   var sourceDevice = _Manager.Manager.generateDevice();
	   sourceDevice.setName("源设备");
	   sourceDevice.setCoord(100, 100);
	   _Manager.Manager.appendDevice(sourceDevice);
	
	   var targetDevice = _Manager.Manager.generateDevice();
	   targetDevice.setName("目标设备");
	   targetDevice.setCoord(200, 100);
	   _Manager.Manager.appendDevice(targetDevice);
	
	   var $addDevice = $("#addDevice");
	   $addDevice.on("click", function (event) {
	      var device = _Manager.Manager.generateDevice();
	      _Manager.Manager.appendDevice(device);
	   });
	
	   var $startExperiment = $("#startExperiment");
	   $startExperiment.on("click", function () {
	      var data = _Manager.Manager.exportData();
	      var dataString = JSON.stringify(data);
	      var url = "./aodvStartExperiment";
	      $.post(url, dataString).done(function (response) {
	         if (!!response.ok) {
	            alert("执行成功");
	            var resultArray = response.result;
	            var $resultPanel = $("#resultPanel");
	            for (var i = 0; i < resultArray.length; i++) {
	               var result = resultArray[i];
	               var $result = $("<p></p>");
	               $result.text(result);
	               $resultPanel.append($result);
	            }
	            var pcapArray = response.pcap;
	            var $pcapPanel = $("#pcapPanel");
	            for (var _i = 0; _i < pcapArray.length; _i++) {
	               var pcap = pcapArray[_i];
	               var $pcap = $("<a></a>");
	               $pcap.text(_i + 1 + ".下载");
	               $pcap.attr("href", pcap);
	               $pcapPanel.append($pcap);
	            }
	            var traceArray = response.trace;
	            var $tracePanel = $("#tracePanel");
	            for (var _i2 = 0; _i2 < traceArray.length; _i2++) {
	               var trace = traceArray[_i2];
	               var $trace = $("<p></p>");
	               $trace.text(trace);
	               $tracePanel.append($trace);
	            }
	         } else {
	            alert("执行失败");
	         }
	      }).fail(function () {
	         alert("执行失败");
	      });
	   });
	
	   var $saveExperiment = $("#saveExperiment");
	   $saveExperiment.on("click", function () {
	      var data = _Manager.Manager.exportData();
	      var dataString = JSON.stringify(data);
	      var url = "./aodvSaveExperiment";
	      $.post(url, dataString).done(function (response) {
	         if (!!response.ok) {
	            alert("保存成功");
	         } else {
	            alert("保存失败");
	         }
	      }).fail(function (response) {
	         alert("保存失败");
	      });
	   });
	
	   var $loadExperiment = $("#loadExperiment");
	   $loadExperiment.on("click", function () {
	      var url = "./aodvLoadExperiment";
	      $.get(url).done(function (response) {
	         if (!!response.ok) {
	            alert("保存成功");
	            _Manager.Manager.clearBoard();
	            _Manager.Manager.initBoardByData(response.data);
	         } else {
	            alert("保存失败");
	         }
	      }).fail(function (response) {
	         alert("读取失败");
	      });
	   });
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	exports.Manager = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Device = __webpack_require__(2);
	
	var _Circle = __webpack_require__(7);
	
	var _ZIndexManager = __webpack_require__(10);
	
	var _AnimationManager = __webpack_require__(11);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var deviceArray = [];
	var $board = undefined;
	var animationManager = undefined;
	
	var Manager = exports.Manager = function () {
	   function Manager() {
	      _classCallCheck(this, Manager);
	   }
	
	   _createClass(Manager, null, [{
	      key: "setBoard",
	      value: function setBoard($b) {
	         $board = $b;
	         animationManager = new _AnimationManager.AnimationManager($board);
	      }
	   }, {
	      key: "clearBoard",
	      value: function clearBoard() {
	         for (var i = 0; i < deviceArray.length; i++) {
	            var device = deviceArray[i];
	            device.remove();
	            _ZIndexManager.zIndexManager.remove(device);
	         }
	         deviceArray = [];
	      }
	   }, {
	      key: "initBoardByData",
	      value: function initBoardByData(dataArray) {
	         for (var i = 0; i < dataArray.length; i++) {
	            var data = dataArray[i];
	            var device = Manager.generateDevice();
	            device.setName(data.name);
	            device.setCoord(data.x, data.y);
	            Manager.appendDevice(device);
	         }
	      }
	   }, {
	      key: "generateDevice",
	      value: function generateDevice() {
	         var device = new _Device.Device();
	         deviceArray.push(device);
	         device.setCoord(200, 200);
	         device.setName("设备" + deviceArray.length);
	         return device;
	      }
	   }, {
	      key: "generateCircle",
	      value: function generateCircle(x, y) {
	         var circle = new _Circle.Circle(x, y);
	         deviceArray.push(circle);
	         return circle;
	      }
	   }, {
	      key: "appendDevice",
	      value: function appendDevice(device) {
	         $board.append(device.getView());
	         _ZIndexManager.zIndexManager.put(device);
	      }
	   }, {
	      key: "appendCircle",
	      value: function appendCircle(circle) {
	         $board.append(circle.getView());
	         _ZIndexManager.zIndexManager.put(circle);
	      }
	   }, {
	      key: "removeCircle",
	      value: function removeCircle(circle) {
	         for (var i = 0; i < deviceArray.length; i++) {
	            var device = deviceArray[i];
	            if (device.getID() === circle.getID()) {
	               var $element = $("[data-id=" + circle.getID() + "]");
	               $element.remove();
	               _ZIndexManager.zIndexManager.remove(circle);
	               arrayRemoveAt(deviceArray, i);
	               return;
	            }
	         }
	      }
	   }, {
	      key: "getDeviceByElement",
	      value: function getDeviceByElement($element) {
	         var id = $element.attr("data-id");
	         for (var i = 0; i < deviceArray.length; i++) {
	            var device = deviceArray[i];
	            if (device.getID() === id) {
	               return device;
	            }
	         }
	         throw new Error("unknown $element(id = " + id + ")");
	      }
	   }, {
	      key: "playAnimation",
	      value: function playAnimation(animationArray) {
	         animationManager.play(deviceArray, animationArray);
	      }
	   }, {
	      key: "exportData",
	      value: function exportData() {
	         var dataArray = [];
	         for (var i = 0; i < deviceArray.length; i++) {
	            var device = deviceArray[i];
	            var x = device.x;
	            var y = device.y;
	            var index = i;
	            var data = {
	               x: x,
	               y: y,
	               index: index
	            };
	            dataArray.push(data);
	         }
	         return dataArray;
	      }
	   }]);
	
	   return Manager;
	}();
	
	function arrayRemoveAt(array, index) {
	   array.splice(index, 1);
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	exports.Device = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _UniqueIDManager = __webpack_require__(3);
	
	var _DeviceView = __webpack_require__(4);
	
	var _CoordManager = __webpack_require__(5);
	
	var _EventDispatcher = __webpack_require__(6);
	
	var _Manager = __webpack_require__(1);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Device = exports.Device = function () {
	   function Device() {
	      _classCallCheck(this, Device);
	
	      this._viewManager = new _DeviceView.DeviceView();
	      this._coordManager = new _CoordManager.CoordManager();
	      this._id = _UniqueIDManager.UniqueIDManager.getUniqueID();
	      this._viewManager.setID(this._id);
	      this._viewManager.setName("设备");
	
	      _EventDispatcher.eventDispatcher.on("ZIndexUpdate", this, this.updateZIndex);
	      _EventDispatcher.eventDispatcher.on("MouseMove", this, this.updateCoord);
	      _EventDispatcher.eventDispatcher.on("MouseOver", this, this.updateHoverView);
	      _EventDispatcher.eventDispatcher.on("MouseOut", this, this.updateNormalView);
	      _EventDispatcher.eventDispatcher.on("LeftMouseDown", this, this.updateNormalView);
	      _EventDispatcher.eventDispatcher.on("DistanceCheck", this, this.distanceCheck);
	      _EventDispatcher.eventDispatcher.on("UnDistanceCheck", this, this.unDistanceCheck);
	   }
	
	   _createClass(Device, [{
	      key: "remove",
	      value: function remove() {
	         this._viewManager.getView().remove();
	      }
	   }, {
	      key: "setName",
	      value: function setName(name) {
	         this._viewManager.setName(name);
	      }
	   }, {
	      key: "setCoord",
	      value: function setCoord(x, y) {
	         this._coordManager.setCoord(x, y);
	         this._viewManager.setCoord(this._coordManager.x, this._coordManager.y);
	      }
	   }, {
	      key: "getView",
	      value: function getView() {
	         return this._viewManager.getView();
	      }
	   }, {
	      key: "getID",
	      value: function getID() {
	         return this._id;
	      }
	   }, {
	      key: "updateZIndex",
	      value: function updateZIndex(zIndex) {
	         this._viewManager.updateZIndex(zIndex);
	      }
	   }, {
	      key: "updateCoord",
	      value: function updateCoord(coordArg) {
	         this._coordManager.updateCoord(coordArg.dx, coordArg.dy);
	         this._viewManager.setCoord(this._coordManager.x, this._coordManager.y);
	      }
	   }, {
	      key: "updateHoverView",
	      value: function updateHoverView() {
	         var HoverClassName = "DeviceHover";
	         this._viewManager.addClass(HoverClassName);
	         this._circle = _Manager.Manager.generateCircle(this._coordManager.x, this._coordManager.y);
	         _Manager.Manager.appendCircle(this._circle);
	         _EventDispatcher.eventDispatcher.broadcast("DistanceCheck", {
	            x: this._coordManager.x,
	            y: this._coordManager.y,
	            device: this
	         });
	      }
	   }, {
	      key: "updateNormalView",
	      value: function updateNormalView() {
	         var HoverClassName = "DeviceHover";
	         this._viewManager.removeClass(HoverClassName);
	         _Manager.Manager.removeCircle(this._circle);
	         this._circle = undefined;
	         _EventDispatcher.eventDispatcher.broadcast("UnDistanceCheck");
	      }
	   }, {
	      key: "distanceCheck",
	      value: function distanceCheck(args) {
	         var InDistanceClassName = "InDistance";
	
	         if (this === args.device) {
	            return;
	         } else {
	            if (this._coordManager.inDistance(args.x, args.y)) {
	               this._viewManager.addClass(InDistanceClassName);
	            }
	         }
	      }
	   }, {
	      key: "unDistanceCheck",
	      value: function unDistanceCheck() {
	         var InDistanceClassName = "InDistance";
	         this._viewManager.removeClass(InDistanceClassName);
	      }
	   }, {
	      key: "x",
	      get: function get() {
	         return this._coordManager.x;
	      }
	   }, {
	      key: "y",
	      get: function get() {
	         return this._coordManager.y;
	      }
	   }, {
	      key: "name",
	      get: function get() {
	         return this._viewManager.name;
	      }
	   }]);
	
	   return Device;
	}();

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var generatedIDArray = [];
	
	function getRandomString() {
	   var BaseString = "abcdefghijklmnopqrstuvwxyz";
	   var StringLength = 3;
	   var randomString = "";
	   for (var i = 0; i < StringLength; i++) {
	      var index = getRandomInt(0, 25);
	      randomString += BaseString[index];
	   }
	   return randomString;
	}
	
	function getRandomInt(min, max) {
	   return Math.floor(Math.random() * (max - min)) + min;
	}
	
	function isIDExist(ID) {
	   for (var i = 0; i < generatedIDArray.length; i++) {
	      var generatedID = generatedIDArray[i];
	      if (generatedID === ID) {
	         return true;
	      }
	   }
	
	   return false;
	}
	
	var UniqueIDManager = exports.UniqueIDManager = function () {
	   function UniqueIDManager() {
	      _classCallCheck(this, UniqueIDManager);
	   }
	
	   _createClass(UniqueIDManager, null, [{
	      key: "getUniqueID",
	      value: function getUniqueID() {
	         var MaxTryTimes = 10000;
	         var nowTryTimes = 0;
	         while (nowTryTimes < MaxTryTimes) {
	            //防止无限循环
	            var prefix = "vn-";
	            var randomString = getRandomString();
	            var uniqueID = prefix + randomString;
	            if (!isIDExist(uniqueID)) {
	               generatedIDArray.push(uniqueID);
	               return uniqueID;
	            }
	            nowTryTimes++;
	         }
	         throw new Error("can't generate new unique ID, too many devices");
	      }
	   }]);
	
	   return UniqueIDManager;
	}();

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function getTemplate() {
	   return "<div class = 'Device' data-vn></div>";
	}
	
	var DeviceView = exports.DeviceView = function () {
	   function DeviceView() {
	      _classCallCheck(this, DeviceView);
	
	      this._template = getTemplate();
	      this._$element = $(this._template);
	   }
	
	   _createClass(DeviceView, [{
	      key: "setCoord",
	      value: function setCoord(x, y) {
	         this._$element.css("left", x);
	         this._$element.css("top", y);
	      }
	   }, {
	      key: "setID",
	      value: function setID(id) {
	         this._$element.attr("data-id", id);
	      }
	   }, {
	      key: "setName",
	      value: function setName(name) {
	         this._$element.get(0).textContent = name;
	      }
	   }, {
	      key: "getView",
	      value: function getView() {
	         return this._$element;
	      }
	   }, {
	      key: "updateZIndex",
	      value: function updateZIndex(zIndex) {
	         this._$element.css("z-index", zIndex);
	      }
	   }, {
	      key: "addClass",
	      value: function addClass(className) {
	         this._$element.addClass(className);
	      }
	   }, {
	      key: "removeClass",
	      value: function removeClass(className) {
	         this._$element.removeClass(className);
	      }
	   }, {
	      key: "width",
	      get: function get() {
	         return parseFloat(this._$element.css("width"));
	      }
	   }, {
	      key: "height",
	      get: function get() {
	         return parseFloat(this._$element.css("height"));
	      }
	   }, {
	      key: "name",
	      get: function get() {
	         return this._$element.get(0).textContent;
	      }
	   }]);
	
	   return DeviceView;
	}();

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var CoordManager = exports.CoordManager = function () {
	   function CoordManager() {
	      _classCallCheck(this, CoordManager);
	
	      this._x = 0;
	      this._y = 0;
	   }
	
	   _createClass(CoordManager, [{
	      key: "setCoord",
	      value: function setCoord(x, y) {
	         this._x = parseFloat(x);
	         this._y = parseFloat(y);
	      }
	   }, {
	      key: "updateCoord",
	      value: function updateCoord(dx, dy) {
	         this._x += dx;
	         this._y += dy;
	      }
	   }, {
	      key: "inDistance",
	      value: function inDistance(x, y) {
	         var DistanceThreshold = 150;
	         var xDistance = Math.pow(this._x - x, 2);
	         var yDistance = Math.pow(this._y - y, 2);
	         var distance = Math.pow(xDistance + yDistance, 0.5);
	         if (distance < DistanceThreshold) {
	            return true;
	         } else {
	            return false;
	         }
	      }
	   }, {
	      key: "x",
	      get: function get() {
	         return this._x;
	      }
	   }, {
	      key: "y",
	      get: function get() {
	         return this._y;
	      }
	   }]);
	
	   return CoordManager;
	}();

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	exports.eventDispatcher = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Manager = __webpack_require__(1);
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var EventDispatcher = function () {
	   function EventDispatcher() {
	      _classCallCheck(this, EventDispatcher);
	
	      this._eventDeviceMap = new Map();
	   }
	
	   _createClass(EventDispatcher, [{
	      key: "on",
	      value: function on(eventName, device, callback) {
	         if (this._eventDeviceMap.has(eventName)) {
	            this._eventDeviceMap.get(eventName).set(device, callback);
	         } else {
	            var deviceMap = new Map();
	            deviceMap.set(device, callback);
	            this._eventDeviceMap.set(eventName, deviceMap);
	         }
	      }
	   }, {
	      key: "dispatch",
	      value: function dispatch(eventName, $target, args) {
	         if (this._eventDeviceMap.has(eventName)) {
	            var deviceMap = this._eventDeviceMap.get(eventName);
	            var device = $target;
	            if (!deviceMap.has(device)) {
	               if (device instanceof jQuery) {
	                  device = _Manager.Manager.getDeviceByElement($target);
	               } else {
	                  return;
	               }
	            }
	            var callback = this._eventDeviceMap.get(eventName).get(device);
	            callback.call(device, args);
	
	            this.logDispatch(eventName, device);
	         }
	      }
	   }, {
	      key: "broadcast",
	      value: function broadcast(eventName, args) {
	         if (this._eventDeviceMap.has(eventName)) {
	            var deviceMap = this._eventDeviceMap.get(eventName);
	            var deviceArray = [].concat(_toConsumableArray(deviceMap.entries()));
	            for (var i = 0; i < deviceArray.length; i++) {
	               var device = deviceArray[i][0];
	               var callback = deviceArray[i][1];
	               callback.call(device, args);
	            }
	            this.logBroadcast(eventName);
	         }
	      }
	   }, {
	      key: "logDispatch",
	      value: function logDispatch(eventName, device) {
	         console.log(eventName + " fired by device " + device.getID());
	      }
	   }, {
	      key: "logBroadcast",
	      value: function logBroadcast(eventName) {
	         console.log(eventName + " broadcast by device ");
	      }
	   }]);
	
	   return EventDispatcher;
	}();
	
	var eventDispatcher = exports.eventDispatcher = new EventDispatcher();

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	exports.Circle = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _UniqueIDManager = __webpack_require__(3);
	
	var _CircleView = __webpack_require__(8);
	
	var _CircleCoordManager = __webpack_require__(9);
	
	var _EventDispatcher = __webpack_require__(6);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Circle = exports.Circle = function () {
	   function Circle(x, y, width) {
	      _classCallCheck(this, Circle);
	
	      width = width || 300;
	      this._viewManager = new _CircleView.CircleView();
	      this._viewManager.width = width;
	      this._coordManager = new _CircleCoordManager.CircleCoordManager(this._viewManager.width, 50);
	      this._id = _UniqueIDManager.UniqueIDManager.getUniqueID();
	      this._viewManager.setID(this._id);
	      this.setCoord(x, y);
	   }
	
	   _createClass(Circle, [{
	      key: "setCoord",
	      value: function setCoord(x, y) {
	         this._coordManager.setCoord(x, y);
	         this._viewManager.setCoord(this._coordManager.x, this._coordManager.y);
	      }
	   }, {
	      key: "updateCoord",
	      value: function updateCoord(dx, dy) {
	         this._coordManager.updateCoord(dx, dy);
	         this._viewManager.setCoord(this._coordManager.x, this._coordManager.y);
	      }
	   }, {
	      key: "getView",
	      value: function getView() {
	         return this._viewManager.getView();
	      }
	   }, {
	      key: "getID",
	      value: function getID() {
	         return this._id;
	      }
	   }, {
	      key: "width",
	      get: function get() {
	         return this._viewManager.width;
	      },
	      set: function set(w) {
	         this._viewManager.width = w;
	         this._coordManager.width = w;
	      }
	   }, {
	      key: "x",
	      get: function get() {
	         return this._coordManager.x;
	      }
	   }, {
	      key: "y",
	      get: function get() {
	         return this._coordManager.y;
	      }
	   }]);
	
	   return Circle;
	}();

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	exports.CircleView = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _DeviceView2 = __webpack_require__(4);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	function getTemplate() {
	   return "<div class = 'Circle'></div>";
	}
	
	var CircleView = exports.CircleView = function (_DeviceView) {
	   _inherits(CircleView, _DeviceView);
	
	   function CircleView() {
	      _classCallCheck(this, CircleView);
	
	      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CircleView).call(this));
	
	      _this._template = getTemplate();
	      _this._$element = $(_this._template);
	      return _this;
	   }
	
	   _createClass(CircleView, [{
	      key: "width",
	      get: function get() {
	         return parseFloat(this._$element.css("width"));
	      },
	      set: function set(w) {
	         this._$element.css("width", w);
	         this._$element.css("height", w);
	         this._$element.css("border-radius", w);
	      }
	   }]);
	
	   return CircleView;
	}(_DeviceView2.DeviceView);

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.CircleCoordManager = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _CoordManager2 = __webpack_require__(5);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var CircleCoordManager = exports.CircleCoordManager = function (_CoordManager) {
	  _inherits(CircleCoordManager, _CoordManager);
	
	  function CircleCoordManager(circleWidth, deviceWidth) {
	    _classCallCheck(this, CircleCoordManager);
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CircleCoordManager).call(this));
	
	    _this._circleWidth = circleWidth;
	    _this._deviceWidth = deviceWidth;
	    return _this;
	  }
	
	  _createClass(CircleCoordManager, [{
	    key: "setCoord",
	    value: function setCoord(x, y) {
	      _get(Object.getPrototypeOf(CircleCoordManager.prototype), "setCoord", this).call(this, x, y);
	      this._x -= (this._circleWidth - this._deviceWidth) / 2;
	      this._y -= (this._circleWidth - this._deviceWidth) / 2;
	    }
	  }, {
	    key: "width",
	    set: function set(width) {
	      this._circleWidth = width;
	    }
	  }]);
	
	  return CircleCoordManager;
	}(_CoordManager2.CoordManager);

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	exports.zIndexManager = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _EventDispatcher = __webpack_require__(6);
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var ZIndexManager = function () {
	   function ZIndexManager(baseZIndex) {
	      _classCallCheck(this, ZIndexManager);
	
	      this._zIndexMap = new Map();
	      this._baseZIndex = baseZIndex;
	   }
	
	   _createClass(ZIndexManager, [{
	      key: "put",
	      value: function put(device) {
	         var maxZIndex = findMaxZIndex(this._zIndexMap, this._baseZIndex);
	         maxZIndex = IncreaseZIndex(maxZIndex);
	         this._zIndexMap.set(device, maxZIndex);
	         _EventDispatcher.eventDispatcher.dispatch("ZIndexUpdate", device, maxZIndex);
	      }
	   }, {
	      key: "remove",
	      value: function remove(device) {
	         this._zIndexMap.delete(device);
	      }
	   }, {
	      key: "sticky",
	      value: function sticky(device) {
	         if (!this._zIndexMap.has(device)) {
	            throw new Error("please use put() function before you sticky a device");
	         }
	
	         this._zIndexMap = integrateMap(this._zIndexMap, this._baseZIndex);
	         this.put(device);
	      }
	   }]);
	
	   return ZIndexManager;
	}();
	
	function findMaxZIndex(zIndexMap, baseZIndex) {
	   var maxZIndex = baseZIndex;
	   var _iteratorNormalCompletion = true;
	   var _didIteratorError = false;
	   var _iteratorError = undefined;
	
	   try {
	      for (var _iterator = zIndexMap[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	         var entry = _step.value;
	
	         var zIndex = entry[1];
	         if (zIndex > maxZIndex) {
	            maxZIndex = zIndex;
	         }
	      }
	   } catch (err) {
	      _didIteratorError = true;
	      _iteratorError = err;
	   } finally {
	      try {
	         if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	         }
	      } finally {
	         if (_didIteratorError) {
	            throw _iteratorError;
	         }
	      }
	   }
	
	   return maxZIndex;
	}
	
	function IncreaseZIndex(zIndex) {
	   return zIndex + 1;
	}
	
	function integrateMap(zIndexMap, baseZIndex) {
	   if (needToIntegrate(zIndexMap, baseZIndex)) {
	      var sortedZIndexArray = sortZIndexMapByValue(zIndexMap);
	      for (var i = 0; i < sortedZIndexArray.length; i++) {
	         var zIndexDevice = sortedZIndexArray[i][0];
	         zIndexMap.set(zIndexDevice, baseZIndex + i + 1);
	      }
	   }
	   return zIndexMap;
	}
	
	function sortZIndexMapByValue(zIndexMap) {
	   return [].concat(_toConsumableArray(zIndexMap.entries())).sort(function (a, b) {
	      return a[1] >= b[1];
	   });
	}
	
	function needToIntegrate(zIndexMap, baseZIndex) {
	   var maxZIndex = findMaxZIndex(zIndexMap, baseZIndex);
	   var mapSize = zIndexMap.size;
	   var multiplier = 10;
	   if (maxZIndex - baseZIndex > mapSize * multiplier) {
	      return true;
	   } else {
	      return false;
	   }
	}
	
	var zIndexManager = exports.zIndexManager = new ZIndexManager(100);

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	exports.AnimationManager = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Circle = __webpack_require__(7);
	
	var _Manager = __webpack_require__(1);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var AnimationManager = exports.AnimationManager = function () {
	   function AnimationManager($board) {
	      _classCallCheck(this, AnimationManager);
	
	      this._$board = $board;
	   }
	
	   _createClass(AnimationManager, [{
	      key: "play",
	      value: function play(deviceArray, animationArray) {
	         var _this = this;
	
	         var animationSectionArray = [];
	         var sectionEnd = function sectionEnd(index) {
	            if (animationSectionArray[index] !== undefined) {
	               animationSectionArray[index]();
	            }
	         };
	
	         var _loop = function _loop(i) {
	            var index = animationArray[i];
	            var device = deviceArray[index];
	            var circle = new _Circle.Circle(device.x, device.y, 50);
	            _this._$board.append(circle.getView());
	
	            var thresholdTest = function thresholdTest() {
	               if (circle.width >= 300) {
	                  return false;
	               } else {
	                  return true;
	               }
	            };
	
	            var animation = function animation() {
	               circle.width = circle.width + 2;
	               circle.updateCoord(-1, -1);
	            };
	
	            var duration = 16;
	
	            var callNextSection = function callNextSection() {
	               circle.getView().remove();
	               sectionEnd(i + 1);
	            };
	            var section = _this.makeSection(thresholdTest, animation, duration, callNextSection);
	            animationSectionArray.push(section);
	         };
	
	         for (var i = 0; i < animationArray.length; i++) {
	            _loop(i);
	         }
	         animationSectionArray[0]();
	      }
	   }, {
	      key: "makeSection",
	      value: function makeSection(thresholdTest, animation, duration, callNextSection) {
	         var section = function section() {
	            setTimeout(function section() {
	               if (thresholdTest()) {
	                  animation();
	                  setTimeout(section, duration);
	               } else {
	                  callNextSection();
	               }
	            }, duration);
	         };
	         return section;
	      }
	   }]);
	
	   return AnimationManager;
	}();

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	exports.registerBoard = registerBoard;
	
	var _ZIndexManager = __webpack_require__(10);
	
	var _EventDispatcher = __webpack_require__(6);
	
	var _MouseDownHandler = __webpack_require__(13);
	
	var _MouseMoveHandler = __webpack_require__(15);
	
	var _MouseUpHandler = __webpack_require__(16);
	
	var _Manager = __webpack_require__(1);
	
	var MouseDownDirectListenerMap = {
	   left: leftMouseDownListener,
	   middle: middleMouseDownListener,
	   right: rightMouseDownListener
	};
	
	var MouseUpDirectListenerMap = {
	   left: leftMouseUpListener,
	   middle: middleMouseUpListener,
	   right: rightMouseUpListener
	};
	
	var $board = undefined;
	var mouseMoved = false;
	var mouseDownHandler = undefined;
	var mouseMoveHandler = undefined;
	var mouseUpHandler = undefined;
	
	function registerBoard($boardElement) {
	   $board = $boardElement;
	   mouseDownHandler = new _MouseDownHandler.MouseDownHandler($board);
	   mouseMoveHandler = new _MouseMoveHandler.MouseMoveHandler($board);
	   mouseUpHandler = new _MouseUpHandler.MouseUpHandler($board);
	   $board.on("mousedown", mouseDownListener);
	   $board.on("mouseover", mouseOverListener);
	   $board.on("mouseout", mouseOutListener);
	}
	
	function mouseDownListener(event) {
	   var $target = getEventTarget(event);
	   if (!isTarget($target)) {
	      return false;
	   }
	
	   mouseDownHandler.store(event);
	   mouseMoveHandler.setLastCoord(mouseDownHandler.x, mouseDownHandler.y);
	   var direct = mouseDownHandler.getMouseDirect();
	   var listener = MouseDownDirectListenerMap[direct];
	   listener(event);
	
	   return false;
	}
	
	function getEventTarget(event) {
	   return $(event.target);
	}
	
	function isTarget($element) {
	   if ($element.data("vn") === undefined) {
	      return false;
	   } else {
	      return true;
	   }
	}
	
	function leftMouseDownListener(event) {
	   stickyMouseDownElement(mouseDownHandler.$target); //sticky，置顶。
	   inhebitDoubleMouseDown();
	   inhebitHoverListeners();
	   activateNextListener();
	   _EventDispatcher.eventDispatcher.dispatch("LeftMouseDown", mouseDownHandler.$target);
	}
	
	function middleMouseDownListener(event) {}
	
	function rightMouseDownListener(event) {}
	
	function stickyMouseDownElement($element) {
	   var device = _Manager.Manager.getDeviceByElement($element);
	   _ZIndexManager.zIndexManager.sticky(device);
	}
	
	function activateMouseDown() {
	   $board.on("mousedown", mouseDownListener);
	}
	
	function inhebitDoubleMouseDown() {
	   $board.off("mousedown");
	}
	
	function activateHoverListeners() {
	   $board.on("mouseover", mouseOverListener);
	   $board.on("mouseOut", mouseOutListener);
	}
	
	function inhebitHoverListeners() {
	   $board.off("mouseover");
	   $board.off("mouseOut");
	}
	
	function inhebitNextListener() {
	   $board.off("mousemove");
	   $board.off("mouseup");
	}
	
	function activateNextListener() {
	   $board.on("mousemove", mouseMoveListener);
	   $board.on("mouseup", mouseUpListener);
	}
	
	function mouseMoveListener(event) {
	   mouseMoved = true;
	   mouseMoveHandler.store(event);
	
	   _EventDispatcher.eventDispatcher.dispatch("MouseMove", mouseDownHandler.$target, {
	      originX: mouseMoveHandler.lastX,
	      originY: mouseMoveHandler.lastY,
	      newX: mouseMoveHandler.x,
	      newY: mouseMoveHandler.y,
	      dx: mouseMoveHandler.dx,
	      dy: mouseMoveHandler.dy
	   });
	
	   return false;
	}
	
	function mouseUpListener(event) {
	   mouseUpHandler.store(event);
	   if (mouseDownHandler.which === mouseUpHandler.which) {
	      var direct = mouseUpHandler.getMouseDirect();
	      var listener = MouseUpDirectListenerMap[direct];
	      listener(event);
	   }
	   mouseMoved = false;
	   mouseDownHandler.restore();
	   mouseMoveHandler.restore();
	   mouseUpHandler.restore();
	
	   return false;
	}
	
	function leftMouseUpListener(event) {
	   if (!!mouseMoved) {
	      _EventDispatcher.eventDispatcher.dispatch("LeftClick", mouseDownHandler.$target);
	   }
	   activateMouseDown();
	   activateHoverListeners();
	   inhebitNextListener();
	}
	
	function middleMouseUpListener(event) {}
	
	function rightMouseUpListener(event) {}
	
	function mouseOverListener(event) {
	   var $target = getEventTarget(event);
	   if (!isTarget($target)) {
	      return false;
	   }
	
	   _EventDispatcher.eventDispatcher.dispatch("MouseOver", $target);
	
	   return false;
	}
	
	function mouseOutListener(event) {
	   var $target = getEventTarget(event);
	   if (!isTarget($target)) {
	      return false;
	   }
	
	   _EventDispatcher.eventDispatcher.dispatch("MouseOut", $target);
	
	   return false;
	}

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.MouseDownHandler = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _MouseHandler2 = __webpack_require__(14);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var MouseDownHandler = exports.MouseDownHandler = function (_MouseHandler) {
		_inherits(MouseDownHandler, _MouseHandler);
	
		function MouseDownHandler($b) {
			_classCallCheck(this, MouseDownHandler);
	
			return _possibleConstructorReturn(this, Object.getPrototypeOf(MouseDownHandler).call(this, $b));
		}
	
		_createClass(MouseDownHandler, [{
			key: "getMouseDirect",
			value: function getMouseDirect() {
				var which = this._event.which;
				switch (which) {
					case 1:
						return "left";
					case 2:
						return "middle";
					case 3:
						return "right";
					default:
						throw new Error("unknown event.which = " + which);
				}
			}
		}, {
			key: "which",
			get: function get() {
				return this._event.which;
			}
		}, {
			key: "x",
			get: function get() {
				return this.getCoord(this._event).x;
			}
		}, {
			key: "y",
			get: function get() {
				return this.getCoord(this._event).y;
			}
		}, {
			key: "$target",
			get: function get() {
				var $target = $(event.target);
				return $target;
			}
		}]);
	
		return MouseDownHandler;
	}(_MouseHandler2.MouseHandler);

/***/ },
/* 14 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var MouseHandler = exports.MouseHandler = function () {
		function MouseHandler($b) {
			_classCallCheck(this, MouseHandler);
	
			this._$board = $b;
		}
	
		_createClass(MouseHandler, [{
			key: "store",
			value: function store(event) {
				this.storeEvent(event);
			}
		}, {
			key: "storeEvent",
			value: function storeEvent(event) {
				this._event = event;
			}
		}, {
			key: "restore",
			value: function restore() {
				this.restoreEvent();
			}
		}, {
			key: "restoreEvent",
			value: function restoreEvent() {
				this._event = undefined;
			}
		}, {
			key: "getCoord",
			value: function getCoord(event) {
				var offset = this._$board.offset();
				var x = event.clientX - offset.left;
				var y = event.clientY - offset.top;
				return {
					x: x,
					y: y
				};
			}
		}]);
	
		return MouseHandler;
	}();

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	exports.MouseMoveHandler = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _MouseHandler2 = __webpack_require__(14);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var MouseMoveHandler = exports.MouseMoveHandler = function (_MouseHandler) {
	   _inherits(MouseMoveHandler, _MouseHandler);
	
	   function MouseMoveHandler($b) {
	      _classCallCheck(this, MouseMoveHandler);
	
	      return _possibleConstructorReturn(this, Object.getPrototypeOf(MouseMoveHandler).call(this, $b));
	   }
	
	   _createClass(MouseMoveHandler, [{
	      key: "store",
	      value: function store(event) {
	         //第一次触发move事件后，坐标的更新就通过上次event对象来进行。
	         if (this._event !== undefined) {
	            var coord = this.getCoord(this._event);
	            this.setLastCoord(coord.x, coord.y);
	         }
	
	         this.storeEvent(event);
	      }
	   }, {
	      key: "hasLastCoord",
	      value: function hasLastCoord() {
	         if (this._lastCoord === undefined) {
	            return false;
	         } else {
	            return true;
	         }
	      }
	   }, {
	      key: "setLastCoord",
	      value: function setLastCoord(x, y) {
	         this._x = x;
	         this._y = y;
	      }
	   }, {
	      key: "lastX",
	      get: function get() {
	         return this._x;
	      }
	   }, {
	      key: "lastY",
	      get: function get() {
	         return this._y;
	      }
	   }, {
	      key: "x",
	      get: function get() {
	         return this.getCoord(this._event).x;
	      }
	   }, {
	      key: "y",
	      get: function get() {
	         return this.getCoord(this._event).y;
	      }
	   }, {
	      key: "dx",
	      get: function get() {
	         return this.x - this.lastX;
	      }
	   }, {
	      key: "dy",
	      get: function get() {
	         return this.y - this.lastY;
	      }
	   }]);
	
	   return MouseMoveHandler;
	}(_MouseHandler2.MouseHandler);

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.MouseUpHandler = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _MouseHandler2 = __webpack_require__(14);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var MouseUpHandler = exports.MouseUpHandler = function (_MouseHandler) {
		_inherits(MouseUpHandler, _MouseHandler);
	
		function MouseUpHandler($b) {
			_classCallCheck(this, MouseUpHandler);
	
			return _possibleConstructorReturn(this, Object.getPrototypeOf(MouseUpHandler).call(this, $b));
		}
	
		_createClass(MouseUpHandler, [{
			key: "getMouseDirect",
			value: function getMouseDirect() {
				var which = this._event.which;
				switch (which) {
					case 1:
						return "left";
					case 2:
						return "middle";
					case 3:
						return "right";
					default:
						throw new Error("unknown event.which = " + which);
				}
			}
		}, {
			key: "which",
			get: function get() {
				return this._event.which;
			}
		}]);
	
		return MouseUpHandler;
	}(_MouseHandler2.MouseHandler);

/***/ }
/******/ ]);
//# sourceMappingURL=aodv-pd.js.map