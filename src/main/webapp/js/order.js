$(document).ready(function(){
	
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
    
})


var order = new Vue({
	el:"#order",
	data:{
		content:""
	},
	methods:{
		deleteit: function(id){
			deleteTheOrder(id);
		},
	    cancelit: function(id){
	    	cancelTheOrder(id);
	    },
		refundit: function(id){
			applyrefund(id);
		}
	},
	created:function(){
		getOrderList();	
	}
})

//获取所有订单
function getOrderList(){
	$.ajax({
		type:"get",
		url:"../order/get_order",
		async:true,
		success:function(res){
			console.log(res);
			if(res.status == 0){
				order.content = res.data;
				for(var i = 0; i <order.content.length; i++){
					order.content[i].closetime = comptime(order.content[i].closetime);
					//alert(order.content[i].closetime);
					order.content[i].createtime = format(order.content[i].createtime);
				}
				console.log(order.content);
			}
			else{
				toastr.info(res.msg);
			}
			
		}
	});
}

//申请退款
function applyrefund(id){
	$.ajax({
		type:"POST",
		url:"../order/apply_refund",
		data:{
			id:id
		},
		async:true,
		success:function(res){
			console.log(res)
			if(res.status == 1)
				toastr.info(res.msg);
				else if(res.status == 0)
				{
					toastr.success(res.msg);
				}
				location.reload();
		}
	});
	console.log("执行取消退款操作,id为",id)
}

//取消退款
function cancelTheOrder(id){
	$.ajax({
		type:"POST",
		url:"../order/cancel_order",
		data:{
			id:id
		},
		async:true,
		success:function(res){
			console.log(res)
			if(res.status == 1)
				toastr.info(res.msg);
				else if(res.status == 0)
				{
					toastr.success(res.msg);
				}
				location.reload();
		}
	});
	console.log("执行取消退款操作,id为",id)
}

//删除订单
function deleteTheOrder(id){
	$.ajax({
		type:"POST",
		url:"../order/delete_order",
		data:{
			id:id
		},
		async:true,
		success:function(res){
			console.log(res)
			if(res.status == 1)
				toastr.info(res.msg);
				else if(res.status == 0)
				{
					toastr.success(res.msg);
				}
				location.reload();
		}
	});
	console.log("执行删除操作,id为",id)
}

function add0(m){return m<10?'0'+m:m }
function format(shijianchuo)
{
//shijianchuo是整数，否则要parseInt转换
var time = new Date(shijianchuo);
var y = time.getFullYear();
var m = time.getMonth()+1;
var d = time.getDate();
var h = time.getHours();
var mm = time.getMinutes();
var s = time.getSeconds();
return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
}

//比较当前时间和closetime的大小
function comptime(closetime){
	var timestamp =  Date.parse(new Date());
	if(timestamp>closetime)
		return true;
	else
		return false;
}