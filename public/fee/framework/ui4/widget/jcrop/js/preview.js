(function ($) {
$.fn.uploadPreview = function (opts) {
    var _self = this,
        _this = $(this);
    opts = jQuery.extend({
        Img: "ImgPr",
        Width: 100,
        Height: 100,
        ImgType: ["gif", "jpeg", "jpg", "bmp", "png"],
        Callback: function () {}
    }, opts || {});
    
    if(opts.Img != "" ) {
    	if(typeof(WEB_CTX_PATH) == 'undefined' || WEB_CTX_PATH == '') {
    		alert(window.location.host);
    	}else {
    		$("#" + opts.Img).attr("src",WEB_CTX_PATH + "/framework/ui4/widget/jcrop/css/bg3.png");
    	}
	    
    }
    
    _self.getObjectURL = function (file) {
        var url = null;
        if (window.createObjectURL != undefined) {
            url = window.createObjectURL(file)
        } else if (window.URL != undefined) {
            url = window.URL.createObjectURL(file)
        } else if (window.webkitURL != undefined) {
            url = window.webkitURL.createObjectURL(file)
        }
        return url
    };
    _this.change(function () {
        if (this.value) {
            if (!RegExp("\.(" + opts.ImgType.join("|") + ")$", "i").test(this.value.toLowerCase())) {
                alert("选择文件错误,图片类型必须是" + opts.ImgType.join("，") + "中的一种");
                this.value = "";
                return false
            }
            var _el = document.createElement('DIV'),_style = _el.style,_agent = navigator.userAgent,_platform = navigator.platform;
            var isopera = ("opera" in window);
            var isie = (("all" in document) && ("attachEvent" in _el) && !isopera);
    		    var isie8 = isie && ("documentMode" in document) && (document.documentMode == 8);
            var obj = $("#" + opts.Img);
            if (isie) {
                var input = this;
                //var input = uploader.get('target').all('input').getDOMNode();
                input.select();
                //确保IE9下，不会出现因为安全问题导致无法访问
//                input.blur();

                var src = document.selection.createRange().text;
                var objsub = $("#" + opts.Img + "_forie8");
                if(!objsub.length){
                    objsub = $("<div id='" + opts.Img + "_forie8'></div>");
                    obj.attr('src', src);
                    obj.after(objsub);
                }
                objsub.css("filter","progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled='true',sizingMethod='scale',src='" + src + "');");
                opts.Callback(src, objsub);
            } else {
                obj.attr('src', _self.getObjectURL(this.files[0]));
                opts.Callback(_self.getObjectURL(this.files[0]),obj);
            }

        }
    })
};


})(jQuery);
