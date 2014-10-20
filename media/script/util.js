/*
	杂项功能放置在该js文件内.
*/

(function(){
	var novelUtil= {
		getID: function(IDArray){
			/*
				返回一个唯一的ID号. ID号用于唯一的标示一台设备. 返回值ID号为字符串.
				ID号的长度不定, 但是有最大长度. 即范围在0 - 999...之间
			*/
			while(true){	
				var seed= Math.random(); //一个在0-1内的值. 随机ID号种子. [0, 1)
				var length= 10; //决定随机ID号的最大长度. 
				var randomNumber= parseInt(seed* Math.pow(10, length));
				randomNumber= randomNumber.toString(); //转成字符串格式.

				//与已经存在的ID号进行比较. 如果存在相同的, 则重新生成新的随机字符串.
				for(var i= 0; i< IDArray.length; i++){
					if(randomNumber== IDArray[i]){
						continue;
					}
				}

				//生成了唯一的ID号字符串, 可以使用, 返回该字符串.
				return randomNumber;
			}
		},
		registerID: function(ID, IDArray){
			/*
				将一个唯一的ID号加入ID号数组.
				只有经过此步骤, 该ID号才是经过认证的, 之后可以使用.
			*/

			if(typeof(ID)!= 'string'){ //不是字符串类型, 出错.
				return false;
			}

			for(var i= 0; i< IDArray.length; i++){
				if(ID== IDArray[i]){ //该ID号已经存在, 无法保证唯一性, 出错.
					return false;
				}
			}

			//该ID号是唯一的存在, 加入ID数组, 注册成功.
			IDArray.push(ID);
			return true;
		},
		getModelID: function(modelIDArray){
			/*
				该函数返回一个设备ID号, 设备ID号应是唯一的. 返回值ID号为字符串
			*/

			while(true){	
				var seed= Math.random(); //一个在0-1内的值. 随机ID号种子. [0, 1)
				var length= 10; //决定随机ID号的最大长度. 
				var randomNumber= parseInt(seed* Math.pow(10, length));
				randomNumber= randomNumber.toString(); //转成字符串格式.

				//与已经存在的ID号进行比较. 如果存在相同的, 则重新生成新的随机字符串.
				for(var i= 0; i< modelIDArray.length; i++){
					if(randomNumber== modelIDArray[i]){
						continue;
					}
				}

				//生成了唯一的ID号字符串, 可以使用, 返回该字符串.
				return randomNumber;
			}
		},
		registerModelID: function(ID, modelIDArray){
			/*
				将一个唯一的ID号加入设备ID号数组.
				只有经过此步骤, 该ID号才是经过认证的, 之后可以使用.
			*/

			if(typeof(ID)!= 'string'){ //不是字符串类型, 出错.
				return false;
			}

			for(var i= 0; i< modelIDArray.length; i++){
				if(ID== modelIDArray[i]){ //该ID号已经存在, 无法保证唯一性, 出错.
					return false;
				}
			}

			//该ID号是唯一的存在, 加入ID数组, 注册成功.
			modelIDArray.push(ID);
			return true;
		},
		testjQuery: function(obj){
			/*
				用于判断对象是否是jQuery对象.
			*/
			if(obj instanceof jQuery){
				return true;
			}else{
				return false;
			}
		},
	};
	window.novelUtil= novelUtil;
})();