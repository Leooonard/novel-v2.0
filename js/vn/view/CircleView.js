import {
   DeviceView
}
from "./DeviceView.js"

function getTemplate() {
   return "<div class = 'Circle'></div>"
}

export class CircleView extends DeviceView {
   constructor() {
      super()
      this._template = getTemplate()
      this._$element = $(this._template)
   }

   get width() {
      return parseFloat(this._$element.css("width"))
   }

   set width(w){
      this._$element.css("width", w)
      this._$element.css("height", w)
      this._$element.css("border-radius", w)
   }
}