let generatedIDArray = []

function getRandomString() {
   const BaseString = "abcdefghijklmnopqrstuvwxyz"
   const StringLength = 3
   let randomString = ""
   for (let i = 0; i < StringLength; i++) {
      var index = getRandomInt(0, 25)
      randomString += BaseString[index]
   }
   return randomString
}

function getRandomInt(min, max) {
   return Math.floor(Math.random() * (max - min)) + min;
}

function isIDExist(ID) {
   for (let i = 0; i < generatedIDArray.length; i++) {
      let generatedID = generatedIDArray[i]
      if (generatedID === ID) {
         return true
      }
   }

   return false
}

export class UniqueIDManager {
   constructor() {

   }

   static getUniqueID() {
      const MaxTryTimes = 10000
      let nowTryTimes = 0
      while (nowTryTimes < MaxTryTimes) { //防止无限循环
         const prefix = "vn-"
         let randomString = getRandomString()
         let uniqueID = prefix + randomString
         if (!isIDExist(uniqueID)) {
            generatedIDArray.push(uniqueID)
            return uniqueID
         }
         nowTryTimes++
      }
      throw new Error("can't generate new unique ID, too many devices")
   }
}