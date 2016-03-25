import {
   Circle
}
from "./Device/Circle.js"
import {
   Manager
}
from "./Manager.js"

export class AnimationManager {
   constructor($board) {
      this._$board = $board
   }

   play(deviceArray, animationArray) {
      let animationSectionArray = []
      let sectionEnd = function(index){
         if(animationSectionArray[index] !== undefined){
            animationSectionArray[index]()
         }
      }  

      for (let i = 0; i < animationArray.length; i++) {
         let index = animationArray[i]
         let device = deviceArray[index]
         let circle = new Circle(device.x, device.y, 50)
         this._$board.append(circle.getView())

         let thresholdTest = function() {
            if (circle.width >= 300) {
               return false
            } else {
               return true
            }
         }

         let animation = function() {
            circle.width = circle.width + 2
            circle.updateCoord(-1, -1)
         }

         let duration = 16

         let callNextSection = function() {
            circle.getView().remove()
            sectionEnd(i + 1)
         }
         let section = this.makeSection(thresholdTest, animation, duration, callNextSection)
         animationSectionArray.push(section)
      }
      animationSectionArray[0]()
   }

   makeSection(thresholdTest, animation, duration, callNextSection) {
      let section = function() {
         setTimeout(function section() {
            if (thresholdTest()) {
               animation()
               setTimeout(section, duration)
            } else {
               callNextSection()
            }
         }, duration)
      }
      return section
   }
}