import {
   Manager
}
from "./Manager.js"

import {registerBoard} from "./Board.js"

let $board = $("#vnBoard")
registerBoard($board)
Manager.setBoard($board)
let $addBtn = $("#addDevice")
$addBtn.on("click", function(event) {
   let device = Manager.generateDevice()
   Manager.appendDevice(device)
})

let $playBtn = $("#play")
$playBtn.on("click", function(event){
	Manager.playAnimation([0, 1, 2, 3])
})