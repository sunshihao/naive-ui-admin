//禁用ajax缓存
$.ajaxSetup ({
	cache: false //close AJAX cache
});
//定义命名空间根据模块名和页面名称定义
jQuery.namespace("UI4.leftNav");
UI4.leftNav = function(){
	var navPath = "";
	return {
		init : function() {

		},
		openRightFrame : function(node_type,parent_node_id,menu_name1,menu_name2,content_url,obj){
			if(node_type!=null && node_type!="1") {
				$(".leftNav ul li").removeClass('current');
				$(obj).addClass('current');
			}	
			UI4.leftNav.loadRnavAndContIframe(content_url,parent_node_id,node_type,menu_name1,menu_name2, obj);
		},
		loadTnavAndContIframe : function(content_url,obj) {
			$(".leftNav ul li").removeClass('current');
			$(obj).addClass('current');
			iLead.main.setContentHeight(true);
			$("#contIFrame").attr("src", WEB_CTX_PATH + content_url);
		},
		loadRnavAndContIframe : function(content_url,parent_node_id,node_type,menu_name1,menu_name2, obj){
			if(node_type!=null && node_type!="1"){  //叶子节点
				$("#rightnav").html("");
				iLead.main.setContentHeight(true);
				$("#contIFrame").attr("src", content_url);		
			}else{		
				var expandedStatus = $("#leftnav-li-" + parent_node_id).attr('aria-expanded');
				if(typeof(expandedStatus) == "undefined") {
					expandedStatus = "false";
				}
				if(expandedStatus=="false") {
					$.ajax({
						   type: "POST",
						   url: WEB_CTX_PATH + "/func_privilege.do?method=getSubMenusByUserAndParent",
						   data: "rootNodeId=" + parent_node_id,
						   dataType : "json",
						   success: function(msg){
							  var str = "";
						      $.each(msg.result, function(i, n) {
						    	  str = str +  "<li onclick=\"UI4.leftNav.loadTnavAndContIframe('" + n.functionUrl + "', this)\"><a data-original-title=\"" + n.functionName + "\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\""+  "\" href=\"#\"><span class=\"" + n.iconClass + "\"></span><span class=\"left-nav-text\">" + n.functionName + "</span></a></li>";		    	 
						      });
						      $(".leftnav_li_" + parent_node_id).html(str);
						      $("[data-toggle='tooltip']").tooltip();
						      $("#leftnav-li-" + parent_node_id).collapse('show');
						   },
						   error: function(XMLHttpRequest, textStatus, errorThrown) {
		                      alert("请求三级菜单错误！");
		                   }
					});
				}else {
					$("#leftnav-li-" + parent_node_id).collapse('hide');
				}
			}
			
		}
	}
}();
jQuery().ready(function() {
	UI4.leftNav.init();
});