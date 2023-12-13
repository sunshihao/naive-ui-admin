(function(factory) {
	"use strict";
	if (typeof define === "function" && define.amd) {
		// AMD. Register as an anonymous module.
		define([
			"jquery"
		], factory);
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function($) {
	/* 严格模式
	 * 消除Javascript语法的一些不合理、不严谨之处，减少一些怪异行为;
	 * 消除代码运行的一些不安全之处，保证代码运行的安全；
	 * 提高编译器效率，增加运行速度;
	 * 为未来新版本的Javascript做好铺垫*/
	"use strict";
	$.ileadTab = $.ileadTab || {};
	if (!$.ileadTab.hasOwnProperty("defaults")) {
		$.ileadTab.defaults = {};
	}
	//定义全局函数
	$.extend($.ileadTab, {
		test: function() {
			alert("ceshi");
		},
		//设置对象继承函数
		extend: function(methods) {
			$.extend($.fn.ileadTab, methods);
			if (!this.no_legacy_api) {
				$.fn.extend(methods);
			}
		},
		//设置对象继承函数调用可以通过("")
		getAccessor: function(obj, expr) {
			var ret, p, prm = [],
				i;
			if (typeof expr === 'function') {
				return expr(obj);
			}
			ret = obj[expr];
			if (ret === undefined) {
				try {
					if (typeof expr === 'string') {
						prm = expr.split('.');
					}
					i = prm.length;
					if (i) {
						ret = obj;
						while (ret && i--) {
							p = prm.shift();
							ret = ret[p];
						}
					}
				} catch (e) {}
			}
			return ret;
		},
		//设置对象继承函数调用可以通过("")
		getMethod: function(name) {
			return this.getAccessor($.fn.ileadTab, name);
		}

	});
	//默认对象函数设置
	$.fn.ileadTab = function(pin) {
		//设置对象继承函数调用可以通过("")
		if (typeof pin === 'string') {
			var fn = $.ileadTab.getMethod(pin);
			if (!fn) {
				throw ("ileadTab - No such method: " + pin);
			}
			var args = $.makeArray(arguments).slice(1);
			return fn.apply(this, args);
		}
		return this.each(function(i, n) {
			//alert(i + "======" + n);只能有一个值
			if (this.ileadTab) {
				return;
			}
			var localData;
			if (pin != null && pin.data !== undefined) {
				localData = pin.data;
				pin.data = [];
			}
			//设置参数
			var p = $.extend(true, {
				theme: "0",
				direction: 0,
				tabCount: 0,
				showTabCount: 2, //默认显示2个
				moreText: "Dropdown",
				showType: "default", //justified
				onTabChange: null,
				tabCompleteAction:null,
				ifCloseBtn:false,
				tabs:{}//title,content,url
			}, $.ileadTab.defaults, pin);
			if (localData !== undefined) {
				p.data = localData;
				pin.data = localData;
			}
			var ts = this;
			this.p = p;
			ts.p.id = this.id;
			ts.p.beforeIndex = 1
				//inti widget
				//tab組建渲染開始
				//0:defalut上左  1:上右 2:下左 3:下右 4:左 5:右		
			var tabDirectionArray = ['', 'tabs-reversed', '', 'tabs-reversed', 'tabs-left', 'tabs-right'];
			var tabHeader = "";
			var tabContentLength = $("#" + ts.p.id + " > div").length;
			var tabContentLength2 = $("#" + ts.p.id).find(".ilead-tab-content").length;

			var ileadTab = {
				//私有函数设置
				privateFunction: function() {
					alert("私有函數測試");
				},
				creatHeader: function() {
					var tabHeaderLis = '';
					var hideTabHeaderLis = "";
					var tabCounts = $("#" + ts.p.id + " > div").length;
					var tabContents = ($("#" + ts.p.id + " > div").length > 0) ? $("#" + ts.p.id + " > div") : $("#" + ts.p.id).find(".ilead-tab-content");
					var ifCloseBtn = ts.p.ifCloseBtn;
					$.each(tabContents, function(tabInd, tab) {
						//判斷Id為空的話，需要設置默認id
						if (tabInd == 0) {
							if(ifCloseBtn){
								tabHeaderLis = tabHeaderLis + '<li class="active" tabindex=' + (tabInd + 1) + '><a href="#' + tab.id + '" data-toggle="tab">' + $(tab).attr("tab-title") + '<i id="closeBtn_' + (tabInd + 1) + '" class="icon-home closeBtn"></i></a></li>';
							}else {
								tabHeaderLis = tabHeaderLis + '<li class="active" tabindex=' + (tabInd + 1) + '><a href="#' + tab.id + '" data-toggle="tab">' + $(tab).attr("tab-title") + '</a></li>';
							}							
							//$(tab).attr("class", "tab-pane fade active in");
							$(tab).addClass("tab-pane fade active in");
						} else {
							if (ts.p.showTabCount > 0) {
								if (tabInd + 1 > ts.p.showTabCount) {
									hideTabHeaderLis = hideTabHeaderLis + '<li tabindex=' + (tabInd + 1) + '><a href="#' + tab.id + '" tabindex="-1" data-toggle="tab">' + $(tab).attr("tab-title") + '</a></li>';
								} else {
									if(ifCloseBtn){
										tabHeaderLis = tabHeaderLis + '<li tabindex=' + (tabInd + 1) + '><a href="#' + tab.id + '" data-toggle="tab">' + $(tab).attr("tab-title") + '<i id="closeBtn_' + (tabInd + 1) + '" class="icon-home closeBtn"></i></a></li>';
								    }else {
								    	tabHeaderLis = tabHeaderLis + '<li tabindex=' + (tabInd + 1) + '><a href="#' + tab.id + '" data-toggle="tab">' + $(tab).attr("tab-title") + '</a></li>';
								    }
								}
							} else {
								if(ifCloseBtn){
									tabHeaderLis = tabHeaderLis + '<li tabindex=' + (tabInd + 1) + '><a href="#' + tab.id + '" data-toggle="tab">' + $(tab).attr("tab-title") + '<i id="closeBtn_' + (tabInd + 1) + '" class="icon-home closeBtn"></i></a></li>';
							    }else {
							    	tabHeaderLis = tabHeaderLis + '<li tabindex=' + (tabInd + 1) + '><a href="#' + tab.id + '" data-toggle="tab">' + $(tab).attr("tab-title") + '</a></li>';
							    }
							}
							$(tab).addClass("tab-pane fade");
							//$(tab).attr("class", "tab-pane fade");
						}
					});
					var hideTabHeaderLi = '';
					if (ts.p.showTabCount > 0 && tabCounts > ts.p.showTabCount) {
						hideTabHeaderLi = '<li class="dropdown"><a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown"> ' + ts.p.moreText + '<i class="fa fa-angle-down"></i></a><ul class="dropdown-menu" role="menu" id="ilead_tab_header_hide">' + hideTabHeaderLis + '</ul></li>';
					}

					var tabHeaderUl = '<ul id="ilead_tab_header" class="nav nav-tabs ' + tabDirectionArray[ts.p.direction] + '" >' + tabHeaderLis + hideTabHeaderLi + '</ul>';

					return tabHeaderUl;
				},
				createBodyContents: function() {
					var bodyContents = '<div class="tab-content">' + $("#" + ts.p.id).html() + '</div>';
					return bodyContents;
				},
				creatHeaderByTabs : function() {
					var tabHeaderLis = '';
					var hideTabHeaderLis = "";
					var tabCounts = $("#" + ts.p.id + " > div").length;
					var tabContents = ($("#" + ts.p.id + " > div").length > 0) ? $("#" + ts.p.id + " > div") : $("#" + ts.p.id).find(".ilead-tab-content");
					var ifCloseBtn = ts.p.ifCloseBtn;
					var tabObjs = ts.p.tabs;
					if(tabObj != null && tabObj.length > 0) {
                        $.each(tabObjs, function(tabInd, tab){
                            if (tab.hasOwnProperty("title") && (tab.hasOwnProperty("content") || tab.hasOwnProperty("url"))) {
                                //判斷Id為空的話，需要設置默認id
								if (tabInd == 0) {
									if(ifCloseBtn){
										tabHeaderLis = tabHeaderLis + '<li class="active" tabindex=' + (tabInd + 1) + '><a href="#ileadTab' + (tabInd + 1) + '" data-toggle="tab">' + tab.title + '<i id="closeBtn_' + (tabInd + 1) + '" class="icon-home closeBtn"></i></a></li>';
									}else {
										tabHeaderLis = tabHeaderLis + '<li class="active" tabindex=' + (tabInd + 1) + '><a href="#ileadTab' + (tabInd + 1) + '" data-toggle="tab">' + tab.title + '</a></li>';
									}							
									//$(tab).attr("class", "tab-pane fade active in");
									$(tab).addClass("tab-pane fade active in");
								} else {
									if (ts.p.showTabCount > 0) {
										if (tabInd + 1 > ts.p.showTabCount) {
											hideTabHeaderLis = hideTabHeaderLis + '<li tabindex=' + (tabInd + 1) + '><a href="#ileadTab' + (tabInd + 1) + '" tabindex="-1" data-toggle="tab">' + tab.title + '</a></li>';
										} else {
											if(ifCloseBtn){
												tabHeaderLis = tabHeaderLis + '<li tabindex=' + (tabInd + 1) + '><a href="#ileadTab' + (tabInd + 1) + '" data-toggle="tab">' + tab.title + '<i id="closeBtn_' + (tabInd + 1) + '" class="icon-home closeBtn"></i></a></li>';
										    }else {
										    	tabHeaderLis = tabHeaderLis + '<li tabindex=' + (tabInd + 1) + '><a href="#ileadTab' + (tabInd + 1) + '" data-toggle="tab">' + tab.title + '</a></li>';
										    }
										}
									} else {
										if(ifCloseBtn){
											tabHeaderLis = tabHeaderLis + '<li tabindex=' + (tabInd + 1) + '><a href="#ileadTab' + (tabInd + 1) + '" data-toggle="tab">' + tab.title + '<i id="closeBtn_' + (tabInd + 1) + '" class="icon-home closeBtn"></i></a></li>';
									    }else {
									    	tabHeaderLis = tabHeaderLis + '<li tabindex=' + (tabInd + 1) + '><a href="#ileadTab' + (tabInd + 1) + '" data-toggle="tab">' + tab.title + '</a></li>';
									    }
									}
									$(tab).addClass("tab-pane fade");
									//$(tab).attr("class", "tab-pane fade");
								}					            
                            }else {
                            	alert("属性错误，没有找到tabs下的相关属性");
                            	return;
                            }
                        });
                        var hideTabHeaderLi = '';
						if (ts.p.showTabCount > 0 && tabCounts > ts.p.showTabCount) {
							hideTabHeaderLi = '<li class="dropdown"><a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown"> ' + ts.p.moreText + '<i class="fa fa-angle-down"></i></a><ul class="dropdown-menu" role="menu" id="ilead_tab_header_hide">' + hideTabHeaderLis + '</ul></li>';
						}	
						var tabHeaderUl = '<ul id="ilead_tab_header" class="nav nav-tabs ' + tabDirectionArray[ts.p.direction] + '" >' + tabHeaderLis + hideTabHeaderLi + '</ul>';
					}else {
						alert("属性错误，没有找到tabs");
                        return;
					}
				},
				createBodyContentsByTabs : function() {
					/**<div  id="tab_1_8" class="ilead-tab-content" tab-title="tab8">
									<p> Trust fund seitan letterpress, keytar raw denim keffiyeh etsy art party before they sold out master cleanse gluten-free squid scenester freegan cosby sweater. Fanny pack portland seitan DIY, art party locavore wolf cliche high life echo park
										Austin. Cred vinyl keffiyeh DIY salvia PBR, banh mi before they sold out farm-to-table VHS viral locavore cosby sweater. Lomo wolf viral, mustache readymade thundercats keffiyeh craft beer marfa ethical. Wolf salvia freegan, sartorial keffiyeh
										echo park vegan. </p>
							</div>**/
					var tabObjs = ts.p.tabs;
					var tabContents = "";
				    if($.isEmptyObject(tabObjs) != true && tabObj != null && tabObj.length > 0) {
				    	$.each(tabObjs, function(tabInd, tab){
				    		if (tab.hasOwnProperty("title") && (tab.hasOwnProperty("content") || tab.hasOwnProperty("url"))) {
				    			var tabCon = '';
				    			if(tab.hasOwnProperty("content")) {
				    				tabCon = tab.content;
				    			}else if(tab.hasOwnProperty("url")) {
				    				tabCon = '<iframe id="ileadTabFrame' + (tabInd + 1) + '" src="' + tabObj.url + '"  frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="no" ></iframe>';
				    			}else {
				    				
				    			}
				    			tabContents = tabContents + '<div  id="ileadTab' + (tabInd + 1) + '" class="ilead-tab-content" tab-title="' + tab.title +'">' + tabCon + '</div>';
				    		}
				    	});
				    }
				    $("#" + ts.p.id).html(tabContents);			    
				}	
				
			};
			
			/***
			 * 
			 * 判断是否使用tabs模式，控件支持两种模式
			 * 1：已经包含tabContent的div初始化
			 * 2：配置Tabs参数初始化
			 ***/
			

			if (tabContentLength != 0) {

			} else if (tabContentLength2 != 0) {

			} else if(ts.p.tabs.length != 0) {
				ileadTab.createBodyContentsByTabs();
			} else {
				alert("未找到tabContent");
				return;
			}
			//創建tab的header和tabContent
			var tabHeader = ileadTab.creatHeader();
			var tabBody = ileadTab.createBodyContents();
			if (ts.p.direction == 0) {
				$("#" + ts.p.id).html( tabHeader + tabBody );
			} else if (ts.p.direction == 1) {
				$("#" + ts.p.id).html(tabHeader + tabBody);
			} else if (ts.p.direction == 2) {
				$("#" + ts.p.id).html(tabBody + tabHeader);
			} else if (ts.p.direction == 3) {
				$("#" + ts.p.id).html(tabBody + tabHeader);
			} else if (ts.p.direction == 4) {
				tabHeader = '<div class="col-md-3 col-sm-3 col-xs-3">' + tabHeader + '</div>';
				tabBody = '<div class="col-md-9 col-sm-9 col-xs-9">' + tabBody + '</div>';
				$("#" + ts.p.id).html('<div class="row">' + tabHeader + tabBody + '</div>');
			} else if (ts.p.direction == 5) {
				tabHeader = '<div class="col-md-3 col-sm-3 col-xs-3">' + tabHeader + '</div>';
				tabBody = '<div class="col-md-9 col-sm-9 col-xs-9">' + tabBody + '</div>';
				$("#" + ts.p.id).html('<div class="row">' + tabBody + tabHeader + '</div>');
			}
			//tab組建渲染結束
			
			//绑定TabComplete方法，用于tab组件渲染结束后加载
			$(ts).triggerHandler("tabCompleteAction");
			if($.isFunction(ts.p.tabCompleteAction)) {ts.p.tabCompleteAction.call(ts);}
			
			//设置组件样式 需要判断
			$("#" + ts.p.id).find(".tab-content").addClass("bordered");
			$("#" + ts.p.id).addClass("tabbable tabbable-tabdrop");
			//设置组件样式结束
			
			//设置响应式触发
			$(ts).trigger("resize");
			App.init();
			//$(".test").prop("outerHTML");獲取當親html和內部的所有內容
			//tab組建事件			
			$(ts).find(".nav").find("li").not(".dropdown").click(function(e) {
				var dbcr = null;
				if ($(this).attr("class") != "active") {
					var ri = $(this).attr("tabindex");
					var tabId = $(this).find("a").attr("href");
					var beforeTabIndex = ts.p.beforeIndex;
					if ($.isFunction(ts.p.onTabChange)) {
						dbcr = ts.p.onTabChange.call(ts, tabId, ri, beforeTabIndex, e);
						if (dbcr != null) {
							return dbcr;
						}
					}
					ts.p.beforeIndex = ri;
				} else {
					//點擊當前active的tab
				}
			});
			//初始化关闭按钮--closeBtn
			$(ts).find(".closeBtn").on("click", function(event) {
				event.stopPropagation();
				alert(this.id);
				var tabId = $(this).parent("a").attr("href").replace("#", "");
				var currentLi = $(this).parent("a").parent();				
				//alert($(currentLi).attr("class"));//undefined active
				var currentClass = $(currentLi).attr("class");
				//下一个获
				var nextTabsLen = $(this).parent("a").parent().next("li").length;
			    var prevTabsLen = $(this).parent("a").parent().prev("li").length;
				var nextNode = $(this).parent("a").parent().next("li").find("a");
				var prevNode = $(this).parent("a").parent().prev("li").find("a");
				$(this).parent("a").parent().remove();
				$("#" + tabId).remove();
				if(currentClass == "active") {
				    if(nextTabsLen == 0 && prevTabsLen != 0) {
				        //选择前一个
				        $(nextNode).trigger("click");
					}else if(nextTabsLen != 0) {
					    //选择后一个
					    $(prevNode).trigger("click");
					}else {
					    //当前删除Tab就有一个
					}
				}
				//处理下拉的tab内容 								
				$(ts).trigger("resize");			    
			});			
			
		});
	};
	//自定义对象函数继承使用，每一个开发人员需要继承此函数来扩展组件
	$.ileadTab.extend({
		extendFunction: function() {
			alert("擴展函數類對象函數！");
		},
		getGridParam: function(name, module) {
			var $t = this[0],
				ret;
			if (!$t) {
				return;
			}
			if (module === undefined && typeof module !== 'string') {
				module = 'ileadTab'; //$t.p
			}
			ret = $t.p;
			if (module !== 'ileadTab') {
				try {
					ret = $($t).data(module);
				} catch (e) {
					ret = $t.p;
				}
			}
			if (!name) {
				return ret;
			}
			return ret[name] !== undefined ? ret[name] : null;
		},
		getTabTextByIndex: function(tabInd) {
			try {
				var $t = this;
				if ($.isNumeric(tabInd)) {
					var tabLength = $($t).find(".tab-pane").length;
					if (tabInd == 0) {
						throw "输入参数错误！";
					} else if (tabInd + 1 > tabLength) {
						throw "输入参数错误！";
					} else {
						var result = $($t).find(".tab-pane").get(tabInd - 1);
						return $(result).text();
					}
				} else {
					throw "输入参数错误！";
				}
			} catch (err) {
				alert(err);
			}
			return "";
		},
		getTabTextById: function(tabId) {
			try {
				var $t = this;
				var result = $($t).find("#" + tabId);
				return $(result).text();
			} catch (err) {
				alert(err);
			}
			return "";
		},
		getTabTextByClass: function(tabClass) {
			try {
				var $t = this;
				var result = $($t).find("." + tabClass);
				return $(result).text();
			} catch (err) {
				alert(err);
			}
			return "";
		},
		getTabHtmlByIndex: function(tabInd) {
			try {
				var $t = this;
				if ($.isNumeric(tabInd)) {
					var tabLength = $($t).find(".tab-pane").length;
					if (tabInd == 0) {
						throw "输入参数错误！";
					} else if (tabInd + 1 > tabLength) {
						throw "输入参数错误！";
					} else {
						var result = $($t).find(".tab-pane").get(tabInd - 1);
						return $(result).html();
					}
				} else {
					throw "输入参数错误！";
				}
			} catch (err) {
				alert(err);
			}
			return "";
		},
		getTabHtmlById: function(tabId) {
			try {
				var $t = this;
				var result = $($t).find("#" + tabId);
				return $(result).html();
			} catch (err) {
				alert(err);
			}
			return "";
		},
		getTabHtmlByClass: function(tabClass) {
			try {
				var $t = this;
				var result = $($t).find("." + tabClass);
				return $(result).html();
			} catch (err) {
				alert(err);
			}
			return "";
		},
		getTabsHtml: function(separator) {
			try {
				var $t = this;
				var tabs = $($t).find(".tab-pane");
				var result = "";
				$.each(tabs, function(tabInd, tab) {
					if (tabInd == 0) {
						result = $(tab).html();
					} else {
						result = result + separator + $(tab).html();
					}
				});
				return result;
			} catch (err) {
				alert(err);
			}
			return "";
		},
		getTabsText: function(separator) {
			try {
				var $t = this;
				var tabs = $($t).find(".tab-pane");
				var result = "";
				$.each(tabs, function(tabInd, tab) {
					if (tabInd == 0) {
						result = $(tab).html();
					} else {
						result = result + separator + $(tab).text();
					}
				});
				return result;
			} catch (err) {
				alert(err);
			}
			return "";
		},
		getTabsCounts: function() {
			try {
				var $t = this;
				var tabs = $($t).find(".tab-pane");
				return tabs.length;
			} catch (err) {
				alert(err);
			}
			return 0;
		},
		setTabHtmlById: function(tabId, tabContent) {
			try {
				var $t = this;
				$($t).find("#" + tabId).html(tabContent);
			} catch (err) {
				alert(err);
			}
		},
		setTabHtmlByIndex: function(tabInd, tabContent) {
			try {
				var $t = this;
				if ($.isNumeric(tabInd)) {
					var tabLength = $($t).find(".tab-pane").length;
					if (tabInd == 0) {
						throw "输入参数错误！";
					} else if (tabInd + 1 > tabLength) {
						throw "输入参数错误！";
					} else {
						var result = $($t).find(".tab-pane").get(tabInd - 1).html(tabContent);
					}
				} else {
					throw "输入参数错误！";
				}
			} catch (err) {
				alert(err);
			}
		},
		setTabHtmlByClass: function(tabClass, tabContent) {
			try {
				var $t = this;
				$($t).find("." + tabClass).html(tabContent);
			} catch (err) {
				alert(err);
			}
		},
		setTabActiveHtml: function(tabContent) {
			try {
				var $t = this;
				$($t).find(".tab-pane.active").html(tabContent);
			} catch (err) {
				alert(err);
			}
		},
		getTabActiveText: function() {
			try {
				var $t = this;
				return $($t).find(".tab-pane.active").text();
			} catch (err) {
				alert(err);
			}
			return "";
		},
		getTabActiveHtml: function() {
			try {
				var $t = this;
				return $($t).find(".tab-pane.active").html();
			} catch (err) {
				alert(err);
			}
			return "";
		},
		addTabByText: function(tabJsonObject, tabInd, ifFTB) {
			try {
				var $t = this;
				var tabObj = null;
				if (typeof(tabJsonObject) != "undefined") {
					if ($.type(tabJsonObject) === "string") {
						tabObj = $.parseJSON(tabJsonObject);
						if (tabObj != null) {
							if (tabObj.hasOwnProperty("title") && (tabObj.hasOwnProperty("content") || tabObj.hasOwnProperty("url"))) {
								var tabShowCounts = $($t).ileadTab('getGridParam', 'showTabCount');
								var tabCounts = $($t).find(".tab-pane").length;
								//若tabInd为空或者未定义，默认将tap页插入到最后
								
								if (typeof(tabInd) === "undefined" || tabInd === null || tabInd === "") {
									//add Header
									//alert($($t).find("#ilead_tab_header").find("li").length);
									//alert($($t).find("#ilead_tab_header").find("li").find("a[tabindex!='-1']").length);
									if (tabShowCounts == tabCounts && tabShowCounts > 0) {
										var moreText = $($t).ileadTab('getGridParam', 'moreText');
                                        var hideTabHeaderStr = '<li tabindex=' + (tabCounts + 1) + ' class="active"><a href="#tab_' + (tabCounts + 1) + '" tabindex="-1" data-toggle="tab">' + tabObj.title + '</a></li>';
									    var hideTabHeader = '<li class="dropdown active"><a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown"> ' + moreText + '<i class="fa fa-angle-down"></i></a><ul class="dropdown-menu" role="menu" id="ilead_tab_header_hide">' + hideTabHeaderStr + '</ul></li>';
									    $($t).find("#ilead_tab_header").find("li").removeClass("active");
										$($t).find(".tab-content").find("div").removeClass("active in");
									    $($t).find("#ilead_tab_header").find("li").last().after(hideTabHeader);
									    //$($t).find(".dropdown").addClass("active");
									    if(tabObj.hasOwnProperty("url")){
											var iframeBody= '<iframe src="' + tabObj.url + '"  frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="no" ></iframe>';
											$($t).find(".tab-content").prepend('<div  id="tab_' + (tabCounts + 1) + '" class="ilead-tab-content tab-pane fade active in" tab-title="' + tabObj.title + '">' + iframeBody + '</div>');
										}else {
											$($t).find(".tab-content").prepend('<div  id="tab_' + (tabCounts + 1) + '" class="ilead-tab-content tab-pane fade active in" tab-title="' + tabObj.title + '">' + tabObj.content + '</div>');
										}
									}else if(tabShowCounts < tabCounts && tabShowCounts > 0 ){
										$($t).find("#ilead_tab_header").find("li").removeClass("active");
										$($t).find(".tab-content").find("div").removeClass("active in");
										$($t).find(".dropdown").addClass("active");
										$($t).find("#ilead_tab_header").find("li").last().after('<li tabindex=' + (tabCounts + 1) + ' class="active"><a href="#tab_' + (tabCounts + 1) + '" tabindex="-1" data-toggle="tab">' + tabObj.title + '</a></li>');
										if(tabObj.hasOwnProperty("url")){
											var iframeBody= '<iframe src="' + tabObj.url + '"  frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="no" ></iframe>';
											$($t).find(".tab-content").prepend('<div  id="tab_' + (tabCounts + 1) + '" class="ilead-tab-content tab-pane fade active in" tab-title="' + tabObj.title + '">' + iframeBody + '</div>');
										}else {
											$($t).find(".tab-content").prepend('<div  id="tab_' + (tabCounts + 1) + '" class="ilead-tab-content tab-pane fade active in" tab-title="' + tabObj.title + '">' + tabObj.content + '</div>');
										}										
									}else if(tabShowCounts <= 0) {
										
										$($t).find("#ilead_tab_header").find("li").removeClass("active");
										$($t).find(".tab-content").find("div").removeClass("active in");
										$($t).find(".dropdown").addClass("active");
										var liCount = $($t).find("#ilead_tab_header").find("li").length;
										if(liCount == 0) {
											($t).find("#ilead_tab_header").html('<li tabindex=' + (tabCounts + 1) + ' class="active"><a href="#tab_' + (tabCounts + 1) + '"  data-toggle="tab">' + tabObj.title + '<i id="closeBtn_' + (tabCounts + 1) + '" class="icon-home closeBtn"></i></a></li>');
										}else {
											$($t).find("#ilead_tab_header").find("li").last().after('<li tabindex=' + (tabCounts + 1) + ' class="active"><a href="#tab_' + (tabCounts + 1) + '"  data-toggle="tab">' + tabObj.title + '<i id="closeBtn_' + (tabCounts + 1) + '" class="icon-home closeBtn"></i></a></li>');											
										}
										
										if(tabObj.hasOwnProperty("url")) {
											var iframeBody= '<iframe src="' + tabObj.url + '"  frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="no"  style="width: 100%;"></iframe>';
											$($t).find(".tab-content").prepend('<div  id="tab_' + (tabCounts + 1) + '" class="ilead-tab-content tab-pane fade active in" tab-title="' + tabObj.title + '">' + iframeBody + '</div>');
										}else {
											$($t).find(".tab-content").prepend('<div  id="tab_' + (tabCounts + 1) + '" class="ilead-tab-content tab-pane fade active in" tab-title="' + tabObj.title + '">' + tabObj.content + '</div>');
										}
									}
									//处理下拉的tab内容 								
									$($t).trigger("resize");
									App.init();
									$($t).find(".closeBtn").on("click", function(event) {
										event.stopPropagation();
										var tabId = $(this).parent("a").attr("href").replace("#", "");
										var currentLi = $(this).parent("a").parent();				
										//alert($(currentLi).attr("class"));//undefined active
										var currentClass = $(currentLi).attr("class");
										//下一个获
										var nextTabsLen = $(this).parent("a").parent().next("li").length;
									    var prevTabsLen = $(this).parent("a").parent().prev("li").length;
										var nextNode = $(this).parent("a").parent().next("li").find("a");
										var prevNode = $(this).parent("a").parent().prev("li").find("a");
										$(this).parent("a").parent().remove();
										$("#" + tabId).remove();
										if(currentClass == "active") {
										    if(nextTabsLen == 0 && prevTabsLen != 0) {
										        //选择前一个
										        $(nextNode).trigger("click");
											}else if(nextTabsLen != 0) {
											    //选择后一个
											    $(prevNode).trigger("click");
											}else {
											    //当前删除Tab就有一个
											}
										}
										//处理下拉的tab内容 								
										$($t).trigger("resize");			    
									});
								} else {
									

								}
							} else {
								alert("bubaohan");
							}
						} else {
							throw "第一个参数格式错误";
						}
					} else if ($.type(tabJsonObject) === "object") {
						tabObj = tabJsonObject;
					} else {
						throw "第一个参数类型错误！";
					}
				} else {
					throw "第一个参数不能为空或者未定义！";
				}
			} catch (err) {
				alert(err);
			}
		},
		addTabByHtml: function(tabJsonObject, tabInd, ifFTB) {

		},
		addTabByURL: function(tabJsonObject, tabInd, ifFTB) {

		},
		refreshHeader: function(id) {
			var $t = this;
			var tabHeaderLis = '';
			var hideTabHeaderLis = "";
			//var tabCounts = $("#" + id + " > div").length;
			var tabContents = ($("#" + id + " > div").length > 0) ? $("#" + id + " > div") : $("#" + id).find(".ilead-tab-content");
			var tabShowCounts = $($t).ileadTab('getGridParam', 'showTabCount');
			var tabCounts = $($t).find(".tab-pane").length;
			var moreText = $($t).ileadTab('getGridParam', 'moreText');
			var direction = $($t).ileadTab('getGridParam', 'direction');
			$.each(tabContents, function(tabInd, tab) {
				//判斷Id為空的話，需要設置默認id
				if (tabInd == 0) {
					tabHeaderLis = tabHeaderLis + '<li class="active" tabindex=' + (tabInd + 1) + '><a href="#' + tab.id + '" data-toggle="tab">' + $(tab).attr("tab-title") + '</a></li>';
					//$(tab).attr("class", "tab-pane fade active in");
					$(tab).addClass("tab-pane fade active in");
				} else {
					if (tabShowCounts > 0) {
						if (tabInd + 1 > tabShowCounts) {
							hideTabHeaderLis = hideTabHeaderLis + '<li tabindex=' + (tabInd + 1) + '><a href="#' + tab.id + '" tabindex="-1" data-toggle="tab">' + $(tab).attr("tab-title") + '</a></li>';
						} else {
							tabHeaderLis = tabHeaderLis + '<li tabindex=' + (tabInd + 1) + '><a href="#' + tab.id + '" data-toggle="tab">' + $(tab).attr("tab-title") + '</a></li>';
						}
					} else {
						tabHeaderLis = tabHeaderLis + '<li tabindex=' + (tabInd + 1) + '><a href="#' + tab.id + '" data-toggle="tab">' + $(tab).attr("tab-title") + '</a></li>';
					}
					$(tab).addClass("tab-pane fade");
					//$(tab).attr("class", "tab-pane fade");
				}
			});
			var hideTabHeaderLi = '';
			if (tabShowCounts > 0 && tabCounts > tabShowCounts) {
				hideTabHeaderLi = '<li class="dropdown"><a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown"> ' + moreText + '<i class="fa fa-angle-down"></i></a><ul class="dropdown-menu" role="menu" id="ilead_tab_header_hide">' + hideTabHeaderLis + '</ul></li>';
			}
			var tabHeaderUl = '<ul id="ilead_tab_header" class="nav nav-tabs ' + tabDirectionArray[direction] + '" >' + tabHeaderLis + hideTabHeaderLi + '</ul>';
			return tabHeaderUl;
		},
		createBodyContents: function(id) {
			var bodyContents = '<div class="tab-content">' + $("#" + id).html() + '</div>';
			return bodyContents;
		},
		setActiveTabById : function(tabId) {
			try {
				var $t = this;
				if(typeof($("#" + tabId)) == "undefined" || $("#" + tabId) == null) {
					throw "找不到标识" + tabId;
				}else if($("#" + tabId).length > 1) {
					throw "重复标识" + tabId;
				}else {
					var bodyObject = $($t).find(".tab-content");
					var tabIndex = $(bodyObject).find(".tab-pane").index($("#" + tabId ));
					$($t).setActiveTabByIndex(tabIndex + 1);
				}
			} catch (err) {
				alert(err);
			}
		},
		setActiveTabByIndex : function(tabInd) {
			try {
				var $t = this;
				if ($.isNumeric(tabInd)) {
					var tabLength = $($t).find(".tab-pane").length;
					if (tabInd == 0) {
						throw "输入参数错误！";
					} else if (tabInd > tabLength) {
						throw "输入参数错误超过了已有的tab个数！";
					} else {
						var headObject = $($t).find("#ilead_tab_header");
						$(headObject).find("li[tabindex='" + tabInd + "']").find("a").trigger("click");
					}
				} else {
					throw "输入参数错误！";
				}
			} catch (err) {
				alert(err);
			}
		}
	});
}));