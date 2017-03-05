const request = require("superagent")
const async = require("async")
const luck = require('./app/getdata')
const schedule = require('node-schedule')
const moment = require('moment')
const v = new Vue({
	el:"#app",
	data:{
		username:'1006123126',
		password:'hdd0313',
		code:'',
		codeURL:'',
		cookie:'',
		logins:true,
		lotter:{
			lssue:0,
			items:'crazy28',
			Singular:["0","12","0","40","0","84","0","144","0","220","0","276","0","300","0","292","0","252","0","180","0","112","0","60","0","24","0","4"],
			EvenNum:["4","0","24","0","60","0","112","0","180","0","252","0","292","0","300","0","276","0","220","0","144","0","84","0","40","0","12","0"],
			Big:["0","0","0","0","0","0","0","0","0","0","0","0","0","0","300","292","276","252","220","180","144","112","84","60","40","24","12","4"],
			Dec:["4","12","24","40","60","84","112","144","180","220","252","276","292","300","0","0","0","0","0","0","0","0","0","0","0","0","0","0"],
			lotteryData:[]
		},
		playData:{},
		MsgText:'',
		LotterS:'',
		LotterDate:0
	},methods:{
		getdata(){
			luck.GetLuckData()
		},login(){
			luck.Login()
		},Lottr(){
			luck.Lottr()
		}	
	}
})

//获取秒
schedule.scheduleJob('1-59 * * * * *',()=>{
	if(v.logins == false){
		luck.GetLuckData()
		var tmp = (Number(v.LotterDate)-1)
		var mm = moment(new Date()).format("mm")
		var ss = moment(new Date()).format("ss")
		if(tmp == mm && ss == 50){
			luck.Lottr()
		}
	}
})
luck.GetCodeImg()