// import "/fee/framework/common/js/common-util.js";
// import "/fee/framework/ui4/js/jquery-1.11.2.min.js";
// import "/fee/framework/ui4/js/jquery.form.js";
// /*  jquery validate */
// import "/fee/framework/ui4/widget/validate/js/jquery.metadata.js";
// import "/fee/framework/ui4/widget/validate/js/jquery.validate.js";
// import "/fee/framework/ui4/widget/validate/js/jquery.validate.method.js";
// import "/fee/framework/ui4/widget/validate/js/validate_msg/messages_zh.js";
// /* bootstrap 组件 */
// import "/fee/framework/ui4/js/bootstrap/bootstrap.min.js";
// /* jqGrid 组件 */
// import "/fee/framework/ui4/widget/jqgrid/js/jquery.jqGrid.js";
// import "/fee/framework/ui4/widget/jqgrid/js/jquery.jqGrid.ilead.js";
// import "/fee/framework/ui4/widget/jqgrid/js/grid.locale-cn.js";
// /* <!--layui 时间控件  */
// import "/fee/framework/ui4/widget/layui/js/laydate.js";
// import "/fee/framework/ui4/widget/layui/js/layer.js";
// import "/fee/framework/ui4/widget/bootstrap-modallayer/js/modal_layer.js";
// /* select2 下拉（ajax，自动补全）组件  */
// import "/fee/framework/ui4/widget/select2/js/select2.js";
// import "/fee/framework/ui4/widget/select2/js/select2.ext.js";
// import "/fee/framework/ui4/widget/select2/js/i18n/zh-CN.js";
// import "/fee/framework/ui4/main/select-util.js";
// /* sweetalert样式  */
// import "/fee/ecside/sweetalert/sweetalert.min.js";
// /* 国际化支持 */
// // import "/fee/framework/resource/globalize/jquery.i18n.properties.js";
// import "/fee/framework/ui4/js/global.js";
// import "/fee/framework/ui4/js/ui4-common.js";
// import "/fee/framework/ui4/js/form-util.js";
// /* jquery 滚动条 */
// import "/fee/framework/ui4/widget/scroll/js/jquery.nicescroll.js";



window.onload = function(){

  var jspBars = [
    "/fee/framework/common/js/common-util.js",
    "/fee/framework/ui4/js/jquery-1.11.2.min.js",
    "/fee/framework/ui4/js/jquery.form.js",
    "/fee/framework/ui4/widget/validate/js/jquery.metadata.js",
    "/fee/framework/ui4/widget/validate/js/jquery.validate.js",
    "/fee/framework/ui4/widget/validate/js/jquery.validate.method.js",
    "/fee/framework/ui4/widget/validate/js/validate_msg/messages_zh.js",
    "/fee/framework/ui4/js/bootstrap/bootstrap.min.js",
    "/fee/framework/ui4/widget/jqgrid/js/jquery.jqGrid.js",
    "/fee/framework/ui4/widget/jqgrid/js/jquery.jqGrid.ilead.js",
    "/fee/framework/ui4/widget/jqgrid/js/grid.locale-cn.js",
    "/fee/framework/ui4/widget/layui/js/laydate.js",
    "/fee/framework/ui4/widget/layui/js/layer.js",
    "/fee/framework/ui4/widget/bootstrap-modallayer/js/modal_layer.js",
    "/fee/framework/ui4/widget/select2/js/select2.js",
    "/fee/framework/ui4/widget/select2/js/select2.ext.js",
    "/fee/framework/ui4/widget/select2/js/i18n/zh-CN.js",
    "/fee/framework/ui4/main/select-util.js",
    "/fee/ecside/sweetalert/sweetalert.min.js",
    "/fee/framework/ui4/js/global.js",
    "/fee/framework/ui4/js/ui4-common.js",
    "/fee/framework/ui4/widget/scroll/js/jquery.nicescroll.js"
  ];

  // 原生性加载顺序研究
  console.log('00') 
  for(let item of jspBars){
    let script = document.createElement("script");
    script.setAttribute("type","text/javascript");
    script.src = item;
    document.getElementsByTagName("head")[0].appendChild(script);
  }

  // 全局化参数
  var WEB_CTX_PATH = "/app/fee";
  var LOCALE_LANG = "zh";
}();

