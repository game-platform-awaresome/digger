var id;//游戏的id
/**
 * QRCode生成
 */
//var qrcode = new QRCode(document.getElementById("qrcode"), {
//	width : 100,
//	height : 100
//});
//
//
$(document).ready(function(){
	
//	var qrText = "扫描付款";
//	qrcode.makeCode(qrText);
	
	/*
	 * 跳转
	 */
	$(function(){
		id=getUrlParam('id');
		if(id!=null){
			gamedetails(id); //获取游戏属性
			getWishState(id); //获取该游戏的愿望清单状态
			gameisbuy(id);   //判断这款游戏是否已被用户购买过了 
		}
		else 
			history.go(-1);
	});
	
	//提示框
	$(function(){
		toastr.options= {
		"closeButton":true,//显示关闭按钮
		"debug":false,//启用debug
		"positionClass":"toast-top-center",//弹出的位置
		"showDuration":"300",//显示的时间
		"hideDuration":"1000",//消失的时间
		"timeOut":"3000",//停留的时间
		"extendedTimeOut":"1000",//控制时间
		"showEasing":"swing",//显示时的动画缓冲方式
		"hideEasing":"linear",//消失时的动画缓冲方式
		"showMethod":"fadeIn",//显示时的动画方式
		"hideMethod":"fadeOut"//消失时的动画方式
		};
		});

    //点击确认购买动
    $("#btn_buy").click(function(e){
    	if(game.contents.discount==null||game.contents.discount==0){
    		price = game.contents.price;
    	}
    	else
    		price = game.contents.price*game.contents.discount*0.1;
    	var ordernum = GetDateNow();
    	$.ajax({
			type:"POST",
			url:"../order/create",
			data:{
				gameid:id,
				price:price,
				ordernum:ordernum,
				issend:0
			},
			async:true,
			success: function(res){
				console.log(res);
				if(res.status == 1){
					toastr.info(res.msg);
					game.iswish = false;
				}
				else if(res.status == 0)
				{
					game.iswish = true;
					toastr.success(res.msg);
					window.location.href = "../order/goAlipay?ordernum=" + ordernum;
				}
			}
		});
    })
    
})

/*
	 * 取路径参数
	 */
	function getUrlParam(name) {
	    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	    var r = window.location.search.substr(1).match(reg);
	    if (r != null) return decodeURI(r[2]); return null; 
	}


var game = new Vue({
	el:'#game',
	data:{
//		head_img:"https://cdn.rail.tgp.qq.com/info/games/2000352/27d1c5e3f37e219feb118895f7f37165.jpg",
		prename:"所有游戏",
//		gamename:"NBA2KOL2",
		iswish:false,
		isbuy:false,
		isshelf:false,
//		cover_img:"https://cdn.rail.tgp.qq.com/info/games/2000352/2c2dc799c98d1904cd062e60a0924cef.jpg",
//		video_src:"https://media.w3.org/2010/05/sintel/trailer.mp4",
		anno:{
			img:"https://shp.qpic.cn/tgp_hpic/0/1534348829368_articleCover_e88348b8-0da0-40e0-accf-ceaea3b56d4e/0",
			title:"8月16日停机更新公告",
			part:"60祯、球员数据更新来啦",
			createdtime:"2018-08-16 00:01:41"
		},
		selective:[
		],
		id:null,
		contents:""
	},
	methods:{
		addToWish:function(){
			//增加到愿望清单
			this.id = id;
			addToWish(this.id)
			console.log("执行了添加到愿望清单功能")
		},
		deleteFromWish:function(){
			//从愿望清单中删除
			this.id = id;
			deleteFromWish(this.id)
			console.log("执行了从愿望清单中取消的功能")
		}
	},
	created: function(){
	}
})


//获取该游戏的愿望清单状态
function getWishState(id){
	$.ajax({
			type:"get",
			url:"../wish/get_wishgame",
			data:{
				gameid:id
			},
			async:true,
			success: function(res){
				console.log(res);
				if(res.status == 1){
					game.iswish = false;
				}
				else if(res.status == 0)
				{
					game.iswish = true;
				}
			}
		});
}

//该游戏加入愿望清单
function addToWish(id){
	$.ajax({
		type:"POST",
		url:"../wish/add_wishgame",
		data:{
			gameid:id
		},
		async:true,
		success:function(res){
			console.log(res)
			if(res.status==0){
			    getWishState(id);
			}
			else if(res.status==1)
			{
				game.iswish = false;
				toastr.info(res.msg);
				console.log(res.msg);
			}
		}
	});
}

//将该游戏从愿望清单中删除
function deleteFromWish(id){
	$.ajax({
		type:"POST",
		url:"../wish/delete_wishgame",
		data:{
			gameid:id
		},
		async:true,
		success:function(res){
			console.log(res)
			if(res.status==0){
			    getWishState(id);
			}
			else if(res.status==1)
			{				
				game.iswish = false;
				toastr.info(res.msg);
				console.log(res.msg);
			}
		}
	});
}

//检查游戏是否被用户购买
function gameisbuy(id){
	$.ajax({
		type:"POST",
		url:"../order/isbuy_order",
		data:{
			gameid:id
		},
		async:true,
		success:function(res){
			console.log(res)
			if(res.status==0){
			    game.isbuy = true;
			}
			else if(res.status==1)
			{				
				game.isbuy = false;
				console.log(res.msg);
			}
		}
	});
}



//获取游戏属性（包括折扣信息），其中让这款游戏的点击量+1（有判断是否刷点击量的机制）
function gamedetails(id){
	$.ajax({
		type:"get",
		url:"../game/detail/"+id,
		async:true,
		success: function(res){
			console.log(res.data)
			if(res.status==0){
			    game.contents = res.data[0]
			    game.selective = game.contents.category.split(",");
			    var a = game.contents.shelftime.split("-");
			    var shelftime=new Date();
			    shelftime.setFullYear(a[0],a[1]-1,a[2]);
			    var today = new Date();
			    if (today<shelftime)
			    {
			        game.isshelf=true;
			    }
			    else
			    {
			        game.ishelf=false;
			    }
			}
		}
	});
}

//生成订单号
function GetDateNow() {
	var vNow = new Date();
	var sNow = "";
	sNow += String(vNow.getFullYear());
	sNow += String(vNow.getMonth() + 1);
	sNow += String(vNow.getDate());
	sNow += String(vNow.getHours());
	sNow += String(vNow.getMinutes());
	sNow += String(vNow.getSeconds());
	sNow += String(vNow.getMilliseconds());
	return sNow;
}
