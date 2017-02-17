/*
 *  获取开奖数据	
 * 2017年2月17日22:19:05
 */
const request = require("superagent")
const Promise = request("promise")
let promise = new Promise()
console.log(promise)
class getdata{
	//获取数据集
	GetLuckData(url){
		let res = ''
		request.get(url)
			.end((error,success) => {
				//res = this.HandleArr(JSON.parse(success.text))
				promise.resolve(JSON.parse(success.text))
				//console.log(res)
			})
		return promise	
	}

	//处理采集的数据
	HandleArr(data){
		// [{"num":1111,"res":[6,1,5,12]}]
		let tmp = []
		for(let i=0;i<data.itemList.length;i++){
			if(data.itemList[i].jcjg1 != false){
				let tmp_res = data.itemList[i].jcjg1.split("+")
				tmp_res[2] = tmp_res[2].split("=")[0]
				tmp.push(JSON.parse(`{"num":${data.itemList[i].num},"req":[${tmp_res[0]},${tmp_res[1]},${tmp_res[2]}],"res":${data.itemList[i].jcjg2}}`))
			}
		}
		return tmp
	}

	//计算模式盈利
	ProfitModel(data){
		for(let i = 0; i < data.length; i++){
			if(data){}
		}
	}
}

// let get = new getdata()
// //for(let i=1;i<10;i++){
// 	let url = `http://www.juxiangyou.com/fun/play/interaction/?jxy_parameter=%7B%22c%22%3A%22quiz%22%2C%22fun%22%3A%22getEachList%22%2C%22items%22%3A%22crazy28%22%2C%22pageIndex%22%3A2%7D&params%5Bitems%5D=crazy28`
// 	console.log(get.GetLuckData(url) )
//}
