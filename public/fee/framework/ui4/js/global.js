/**
 * 本js脚本用于为页面提供全局性设置。
 * 原则上要求所有页面均引用。
 */

//获取浏览器类型
function getBrowserType(){
   if(navigator.userAgent.indexOf("MSIE")>=0 || navigator.userAgent.indexOf("Trident")>=0) {  
        return "MSIE";  
   } else if(navigator.userAgent.indexOf("Firefox")>=0){  
        return "Firefox";  
   } else if(navigator.userAgent.indexOf("Chrome")>=0){
	   return "Chrome";
   } else if(navigator.userAgent.indexOf("Safari")>=0) {  
        return "Safari";  
   } else if(navigator.userAgent.indexOf("Camino")>=0){  
        return "Camino";  
   } else if(isMozilla=navigator.userAgent.indexOf("Gecko/")>=0){  
        return "Gecko";  
   }else{
	   return "MSIE";
   }
}
//判断是否是IE8
function isIE8() {
	var _el = document.createElement('DIV'),_style = _el.style,_agent = navigator.userAgent,_platform = navigator.platform;
    var isopera = ("opera" in window); 
    var isie = (("all" in document) && ("attachEvent" in _el) && !isopera); //IE10-
	var isieold = (isie && !("msInterpolationMode" in _style)); // IE6 and older
	var isie7 = isie && !isieold && (!("documentMode" in document) || (document.documentMode == 7));
	var isie8 = isie && ("documentMode" in document) && (document.documentMode == 8);
	var isie9 =  isie && ("performance" in window) && (document.documentMode >= 9);
	var isie10 = isie && ("performance" in window) && (document.documentMode == 10);
	var isie11 = ("msRequestFullscreen" in _el) && (document.documentMode >= 11); 
	return isie8;
}
//判断是否是IE
function isIE() {
	var _el = document.createElement('DIV'),_style = _el.style,_agent = navigator.userAgent,_platform = navigator.platform;
    var isopera = ("opera" in window); 
    var isie = (("all" in document) && ("attachEvent" in _el) && !isopera); //IE10-
	return isie;
}

var _GLOBAL_BROWSER_TYPE_ = getBrowserType();


//由于Firefox无全局event，故定义全局event为当前事件
if(_GLOBAL_BROWSER_TYPE_.indexOf("Firefox")>=0){
    var _E = function(){
        var c=_E.caller; 
        while(c && c.caller) c=c.caller;
        if(c && c.arguments && c.arguments[0]) {
        	c.arguments[0].srcElement = c.arguments[0].target;
        	return c.arguments[0];
        }else
        	return null;
        
    };
    //Firefox支持的方法，为caller定义额外的属性
    Object.defineProperty(Object.prototype, 'event', {
        get : _E
    });
   // window.__defineGetter__("event", _E);
}


//实现适用于各主流浏览器的关闭窗口函数
window.closeIgnoreAgent = function() {
    if (_GLOBAL_BROWSER_TYPE_.indexOf("MSIE") >= 0) {
        if (navigator.userAgent.indexOf("MSIE 6.0") >= 0) {
            window.opener = null; 
            window.close();
        }
        else {
            window.open('', '_top'); 
            window.top.close();
        }
    }
    else if (_GLOBAL_BROWSER_TYPE_.indexOf("Firefox") >= 0) {
        window.location.href = 'about:blank ';
        //window.history.go(-2);
    }
    else {
        window.opener = null; 
        window.open('', '_self', '');
        window.close();
    }
};
/*
(function($) {
	$.fn.namespace = function() {
	    var a=arguments, o=null, i, j, d;
	    for (i=0; i<a.length; i=i+1) {
	        d=a[i].split(".");
	        o=window;
	        for (j=0; j<d.length; j=j+1) {
	            o[d[j]]=o[d[j]] || {};
	            o=o[d[j]];
	        }
	    }
	    return o;
	};
});*/

$.namespace = function() {
    var a=arguments, o=null, i, j, d;
    for (i=0; i<a.length; i=i+1) {
        d=a[i].split(".");
        o=window;
        for (j=0; j<d.length; j=j+1) {
            o[d[j]]=o[d[j]] || {};
            o=o[d[j]];
        }
    }
    return o;
};