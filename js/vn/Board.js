import {
   zIndexManager
}
from "./ZIndexManager.js"
import {
   eventDispatcher
}
from "./EventDispatcher.js"
import {
   MouseDownHandler
}
from "./MouseHandler/MouseDownHandler.js"
import {
   MouseMoveHandler
}
from "./MouseHandler/MouseMoveHandler.js"
import {
   MouseUpHandler
}
from "./MouseHandler/MouseUpHandler.js"

import {Manager} from "./Manager.js"

const MouseDownDirectListenerMap = {
   left: leftMouseDownListener,
   middle: middleMouseDownListener,
   right: rightMouseDownListener,
}

const MouseUpDirectListenerMap = {
   left: leftMouseUpListener,
   middle: middleMouseUpListener,
   right: rightMouseUpListener,
}

let $board = undefined
let mouseMoved = false
let mouseDownHandler = undefined
let mouseMoveHandler = undefined
let mouseUpHandler = undefined

export function registerBoard($boardElement) {
   $board = $boardElement
   mouseDownHandler = new MouseDownHandler($board)
   mouseMoveHandler = new MouseMoveHandler($board)
   mouseUpHandler = new MouseUpHandler($board)
   $board.on("mousedown", mouseDownListener)
   $board.on("mouseover", mouseOverListener)
   $board.on("mouseout", mouseOutListener)
}

function mouseDownListener(event) {
   let $target = getEventTarget(event)
   if (!isTarget($target)) {
      return false
   }

   mouseDownHandler.store(event)
   mouseMoveHandler.setLastCoord(mouseDownHandler.x, mouseDownHandler.y)
   let direct = mouseDownHandler.getMouseDirect()
   let listener = MouseDownDirectListenerMap[direct]
   listener(event)

   return false
}

function getEventTarget(event) {
   return $(event.target)
}

function isTarget($element) {
   if ($element.data("vn") === undefined) {
      return false
   } else {
      return true
   }
}

function leftMouseDownListener(event) {
   stickyMouseDownElement(mouseDownHandler.$target) //sticky，置顶。 
   inhebitDoubleMouseDown()
   inhebitHoverListeners()
   activateNextListener()
   eventDispatcher.dispatch("LeftMouseDown", mouseDownHandler.$target)
}

function middleMouseDownListener(event) {}

function rightMouseDownListener(event) {}

function stickyMouseDownElement($element) {
   var device = Manager.getDeviceByElement($element)
   zIndexManager.sticky(device)
}

function activateMouseDown(){
   $board.on("mousedown", mouseDownListener)
}

function inhebitDoubleMouseDown() {
   $board.off("mousedown")
}

function activateHoverListeners() {
   $board.on("mouseover", mouseOverListener)
   $board.on("mouseOut", mouseOutListener)
}

function inhebitHoverListeners() {
   $board.off("mouseover")
   $board.off("mouseOut")
}

function inhebitNextListener() {
   $board.off("mousemove")
   $board.off("mouseup")
}

function activateNextListener() {
   $board.on("mousemove", mouseMoveListener)
   $board.on("mouseup", mouseUpListener)
}

function mouseMoveListener(event) {
   mouseMoved = true
   mouseMoveHandler.store(event)

   eventDispatcher.dispatch("MouseMove", mouseDownHandler.$target, {
      originX: mouseMoveHandler.lastX,
      originY: mouseMoveHandler.lastY,
      newX: mouseMoveHandler.x,
      newY: mouseMoveHandler.y,
      dx: mouseMoveHandler.dx,
      dy: mouseMoveHandler.dy,
   })

   return false
}

function mouseUpListener(event) {
   mouseUpHandler.store(event)
   if (mouseDownHandler.which === mouseUpHandler.which) {
      let direct = mouseUpHandler.getMouseDirect()
      let listener = MouseUpDirectListenerMap[direct]
      listener(event)
   }
   mouseMoved = false
   mouseDownHandler.restore()
   mouseMoveHandler.restore()
   mouseUpHandler.restore()

   return false
}

function leftMouseUpListener(event) {
   if (!!mouseMoved) {
      eventDispatcher.dispatch("LeftClick", mouseDownHandler.$target)
   }
   activateMouseDown()
   activateHoverListeners()
   inhebitNextListener()
}

function middleMouseUpListener(event) {}

function rightMouseUpListener(event) {}

function mouseOverListener(event) {
   let $target = getEventTarget(event)
   if (!isTarget($target)) {
      return false
   }

   eventDispatcher.dispatch("MouseOver", $target)

   return false
}

function mouseOutListener(event) {
   let $target = getEventTarget(event)
   if (!isTarget($target)) {
      return false
   }

   eventDispatcher.dispatch("MouseOut", $target)

   return false
}