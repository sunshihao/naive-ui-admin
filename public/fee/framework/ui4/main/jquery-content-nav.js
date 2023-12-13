//禁用ajax缓存
$.ajaxSetup ({
	cache: false //close AJAX cache
});
// 三级导航链接
$(document).ready(function(){

});
// 三级导航选中
function currentcont(doc){
	$(".contNav ul li").removeClass('current');
	$(doc).addClass('current');
}

function loadContentIFrame(func_id,func_url,func_name){
	$("#contIFrame").attr("src", func_url);
}