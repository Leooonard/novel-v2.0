function getTemplate() {
   return "<div class = 'Device' data-vn></div>"
}

export class DeviceView {
   constructor() {
      this._template = getTemplate()
      this._$element = $(this._template)
   }

   setCoord(x, y) {
      this._$element.css("left", x)
      this._$element.css("top", y)
   }

   setID(id){
      this._$element.attr("data-id", id)
   }

   setName(name){
      this._$element.get(0).textContent = name
   }

   getView(){
      return this._$element
   }

   updateZIndex(zIndex){
      this._$element.css("z-index", zIndex)
   }

   addClass(className){
      this._$element.addClass(className)
   }

   removeClass(className){
      this._$element.removeClass(className)
   }

   get width() {
      return parseFloat(this._$element.css("width"))
   }

   get height(){
      return parseFloat(this._$element.css("height"))
   }

   get name(){
      return this._$element.get(0).textContent
   }
}