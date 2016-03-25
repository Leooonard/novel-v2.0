import {eventDispatcher} from "./EventDispatcher.js"

class ZIndexManager {
   constructor(baseZIndex) {
      this._zIndexMap = new Map()
      this._baseZIndex = baseZIndex
   }

   put(device) {
      var maxZIndex = findMaxZIndex(this._zIndexMap, this._baseZIndex)
      maxZIndex = IncreaseZIndex(maxZIndex)
      this._zIndexMap.set(device, maxZIndex)
      eventDispatcher.dispatch("ZIndexUpdate", device, maxZIndex)
   }

   remove(device) {
      this._zIndexMap.delete(device)
   }

   sticky(device) {
      if (!this._zIndexMap.has(device)) {
         throw new Error("please use put() function before you sticky a device")
      }

      this._zIndexMap = integrateMap(this._zIndexMap, this._baseZIndex)
      this.put(device)
   }
}

function findMaxZIndex(zIndexMap, baseZIndex) {
   let maxZIndex = baseZIndex
   for (let entry of zIndexMap) {
      let zIndex = entry[1]
      if (zIndex > maxZIndex) {
         maxZIndex = zIndex
      }
   }
   return maxZIndex
}

function IncreaseZIndex(zIndex) {
   return zIndex + 1
}

function integrateMap(zIndexMap, baseZIndex) {
   if (needToIntegrate(zIndexMap, baseZIndex)) {
      var sortedZIndexArray = sortZIndexMapByValue(zIndexMap)
      for (var i = 0; i < sortedZIndexArray.length; i++) {
         var zIndexDevice = sortedZIndexArray[i][0]
         zIndexMap.set(zIndexDevice, baseZIndex + i + 1)
      }
   }
   return zIndexMap
}

function sortZIndexMapByValue(zIndexMap) {
   return [...zIndexMap.entries()].sort((a, b) => a[1] >= b[1])
}

function needToIntegrate(zIndexMap, baseZIndex) {
   let maxZIndex = findMaxZIndex(zIndexMap, baseZIndex)
   let mapSize = zIndexMap.size
   const multiplier = 10
   if ((maxZIndex - baseZIndex) > mapSize * multiplier) {
      return true
   } else {
      return false
   }
}

export let zIndexManager = new ZIndexManager(100)