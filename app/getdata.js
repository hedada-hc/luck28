/*
 *  获取开奖数据	
 * 2017年2月17日22:19:05
 */
const request = require("superagent")
const fs = require("fs")
const moment = require('moment')


class getdata{
	//获取数据集
	GetLuckData(){
		let url = `http://www.juxiangyou.com/fun/play/interaction/?jxy_parameter=%7B%22c%22%3A%22quiz%22%2C%22fun%22%3A%22getEachList%22%2C%22items%22%3A%22crazy28%22%2C%22pageSize%22%3A23%2C%22pageIndex%22%3A1%7D&xtpl=fun%2Fprivate%2Fjc-index-tbl&params%5Bitems%5D=${v.lotter.items}`
		let num = 0
		var get = new getdata()
		request.get(url)
			.set("Accept","application/json, text/javascript, */*; q=0.01")
			.set("Accept-Encoding","gzip, deflate")
			.set("Accept-Language","zh-CN,zh;q=0.8")
			.set("Content-Type","application/x-www-form-urlencoded; charset=UTF-8")
			.set("Host","www.juxiangyou.com")
			.set("Origin","http://www.juxiangyou.com")
			.set("Referer","http://www.juxiangyou.com")
			.set("Connection"," Keep-Alive")
			.set("User-Agent","Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36")
			.end((error,success) => {
				try{
					if(success.text.length >= 200){
						var tmpJSon = JSON.parse(success.text)
						var tmpJSons = JSON.parse(success.text)

						tmpJSon = get.HandleArr(tmpJSon)
						v.playData = tmpJSon
						v.lotter.lssue = (v.playData[0].num + 1)
						var tmp = get.ProfitModel(v.playData[0])

						v.LotterDate = tmpJSons.itemList[4].date.split(":")[1]
						v.lotter.lotteryData = tmp
						//console.log(v.lotter.lotteryData,v.playData[0])
						
					}else{
						console.log(num += 1)
						get.GetLuckData()
					}
				}catch(err){

				}
			})
	}

	//处理采集的数据
	HandleArr(data){
		// [{"num":1111,"res":[6,1,5,12]}]  date:"03-05 19:33"
		let tmp = []
		for(let i=0;i<data.itemList.length;i++){
			if(data.itemList[i].jcjg1 != false){
				let tmp_res = data.itemList[i].jcjg1.split("+")
				tmp_res[2] = tmp_res[2].split("=")[0]
				tmp.push(JSON.parse(`{"date":"${data.itemList[i].date}","num":${data.itemList[i].num},"req":[${tmp_res[0]},${tmp_res[1]},${tmp_res[2]}],"res":${data.itemList[i].jcjg2}}`))
			}
		}
		return tmp
	}

	


	StrCookie(cookie){
		var tmp = ''
		for(var i=0;i<cookie.length;i++){
			if(tmp == ''){
				tmp += `${cookie[i].split(";")[0]}`
			}else{
				tmp += `; ${cookie[i].split(";")[0]}`
			}
		}
		return tmp
	}

	GetCodeImg(){
		//获取验证码orcookie
		var CodeUrl = "http://www.juxiangyou.com/verify"
		request.get(CodeUrl)
			.set("Accept","application/json, text/javascript, */*; q=0.01")
			.set("Accept-Encoding","gzip, deflate")
			.set("Accept-Language","zh-CN,zh;q=0.8")
			.set("Content-Type","application/x-www-form-urlencoded; charset=UTF-8")
			.set("Host","www.juxiangyou.com")
			.set("Origin","http://www.juxiangyou.com")
			.set("Referer","http://www.juxiangyou.com")
			.set("Connection"," Keep-Alive")
			.set("User-Agent","Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36")
			.end((error,success)=>{
			fs.writeFile('./code.png',success.body,(err)=>{
				v.codeURL = `./code.png?${new Date().getTime()}`
				console.log(success)
				v.cookie = new getdata().StrCookie(success.header['set-cookie'])
			})
		})
	}

	//登录模块
	Login(){
		//登录
		var PostUrl = "http://www.juxiangyou.com/login/auth"
		request.post(PostUrl)
			.set("Accept","application/json, text/javascript, */*; q=0.01")
			.set("Accept-Encoding","gzip, deflate")
			.set("Accept-Language","zh-CN,zh;q=0.8")
			.set("Content-Type","application/x-www-form-urlencoded; charset=UTF-8")
			.set("Host","www.juxiangyou.com")
			.set("Origin","http://www.juxiangyou.com")
			.set("Referer","http://www.juxiangyou.com")
			.set("Connection"," Keep-Alive")
			.set("User-Agent","Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36")
			.set("Cookie",v.cookie)
			.set("X-Requested-With","XMLHttpRequest")
			.send(`jxy_parameter=%7B%22c%22%3A%22index%22%2C%22fun%22%3A%22login%22%2C%22account%22%3A%22${v.username}%40qq.com%22%2C%22password%22%3A%22${v.password}%22%2C%22verificat_code%22%3A%22${v.code}%22%2C%22is_auto%22%3Afalse%7D`)
			.end((error,success)=>{
				var json = JSON.parse(success.text)
				if(json.code == 10000){
					v.cookie = new getdata().StrCookie(success.header['set-cookie'])
					console.log("登录成功！")
					setTimeout(
						function(){
							v.logins = false
						},1000)
				}else{
					console.log(json.msg)
				}
			})
	}

	//投注模块
	Lottr(){
		var url = "http://www.juxiangyou.com/fun/play/interaction"
		var LottrData = "jxy_parameter=" + escape(`{"fun":"lottery","c":"quiz","items":"${v.lotter.items}","lssue":"${v.lotter.lssue}","lotteryData":${JSON.stringify(v.lotter.lotteryData)}}`)
		request.post(url)
			.type("form")
			.set("Accept","application/json, text/javascript, */*; q=0.01")
			.set("Accept-Encoding","gzip, deflate")
			.set("Accept-Language","zh-CN,zh;q=0.8")
			.set("Content-Type","application/x-www-form-urlencoded; charset=UTF-8")
			.set("Host","www.juxiangyou.com")
			.set("Origin","http://www.juxiangyou.com")
			.set("Connection"," Keep-Alive")
			.set("User-Agent","Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36")
			.set("Cookie",v.cookie)
			.set("X-Requested-With","XMLHttpRequest")
			.send(LottrData)
			.end((err,msg)=>{
				try{
					var json = JSON.parse(msg.text)
					if(json.code = 10000){
						v.MsgText = `第${v.lotter.lssue}期,投注成功！`
						console.log(`第${v.lotter.lssue}期,投注成功！`)
					}else{
						v.MsgText = `第${v.lotter.lssue}期,投注失败原因不详！`
						console.log(msg)
					}
				}catch(err){
					v.MsgText = `第${v.lotter.lssue}期,投注失败原因不详！`
					console.log(msg)
				}
				
			})
	}

	//计算投注
	ProfitModel(data){
		if(data.req != undefined){
			if(data.res >= 10){
				var res = Number(data.res.toString().substr(1,1)) 
				var num1 = res + data.req[0]
				num1 = num1 >=10? num1.toString().substr(1,1) : num1
				var num2 = res + data.req[1]
				num2 = num2 >=10? num2.toString().substr(1,1) : num2
				var num3 = res + data.req[2]
				num3 = num3 >=10? num3.toString().substr(1,1) : num3
				var res = Number(num1) + Number(num2) + Number(num3)
				//if(res >= 15){
				//	return v.lotter.Dec
				//}else{
				//	return v.lotter.Big
				//}
				var lotter = res %2? v.lotter.Singular:v.lotter.EvenNum
				return lotter
				
			}else{
				var res = data.res
				var num1 = res + data.req[0]
				num1 = num1 >=10? num1.toString().substr(1,1) : num1
				var num2 = res + data.req[1]
				num2 = num2 >=10? num2.toString().substr(1,1) : num2
				var num3 = res + data.req[2]
				num3 = num3 >=10? num3.toString().substr(1,1) : num3
				var res = Number(num1) + Number(num2) + Number(num3)
				//if(res >= 15){
				//	return v.lotter.Dec
				//}else{
				//	return v.lotter.Big
				//}
				var lotter = res %2? v.lotter.Singular:v.lotter.EvenNum
				return lotter
			}
		}
		
	}

}
module.exports = new getdata()