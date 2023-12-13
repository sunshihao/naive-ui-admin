/*
 * Translated default messages for the jQuery validation plugin.
 * Locale: ZH (Chinese, 中文 (Zhōngwén), 汉语, 漢語)
 */
(function ($) {
	$.extend($.validator.prototype, {
		defaultShowErrors: function() {
			var i, elements, error;
			for ( i = 0; this.errorList[i]; i++ ) {
				error = this.errorList[i];
				if ( this.settings.highlight ) {
					this.settings.highlight.call( this, error.element, this.settings.errorClass, this.settings.validClass, error.message );
				}
				this.showLabel( error.element, error.message );
			}
			if ( this.errorList.length ) {
				this.toShow = this.toShow.add( this.containers );
			}
			if ( this.settings.success ) {
				for ( i = 0; this.successList[i]; i++ ) {
					this.showLabel( this.successList[i] );
				}
			}
			if ( this.settings.unhighlight ) {
				for ( i = 0, elements = this.validElements(); elements[i]; i++ ) {
					this.settings.unhighlight.call( this, elements[i], this.settings.errorClass, this.settings.validClass );
				}
			}
			this.toHide = this.toHide.not( this.toShow );
			this.hideErrors();
			this.addWrapper( this.toShow ).show();
		},
		showLabel : function( element, message ) {
		}
	});
	$.extend($.validator.defaults, {
		highlight: function( element, errorClass, validClass, message ) {
			var ele;
			if ( element.type === "radio" ) {
				ele = this.findByName(element.name);
			} else {
				ele = $(element);
			}
			if(ele.is("select")){
				ele = ele.next(".select2")||ele;
			}
			ele.addClass("error").removeClass(validClass);
			if(!ele.prop("data-toggle")){
				ele.attr({
					"data-toggle":"tooltip",
					"data-placement":"bottom",
					"data-original-title":message
				}).tooltip();
			}
		},
		unhighlight: function( element, errorClass, validClass ) {
			var ele;
			if ( element.type === "radio" ) {
				ele = this.findByName(element.name);
			} else {
				ele = $(element);
			}
			if(ele.is("select")){
				ele = ele.next(".select2")||ele;
			}
			ele.removeClass("error").addClass(validClass);
			ele.attr({
				"data-toggle":"",
				"data-placement":"",
				"data-original-title":""
			});
		},
		onfocusout: function( element ) {
			if ( !this.checkable(element) && (element.name in this.submitted || !this.optional(element)) ) {
				if($(element).hasClass("laydate-icon-default")){
					//由于点击周边失去焦点时先触发失去焦点事件导致时间控件的校验异常，谷加上此判断并特殊处理
					var that = this;
					setTimeout(function(){that.element(element);},200);
				}else{
					this.element(element);
				}
			}
		}
	});
	$.extend($.validator.messages, {
		required: '必选字段',
		remote: "请修正该字段",
		email: "请输入正确格式的电子邮件",
		url: "请输入合法的网址",
		date: "请输入合法的日期",
		dateISO: "请输入合法的日期 (ISO).",
		number: "请输入合法的数字",
		digits: "只能输入整数",
		creditcard: "请输入合法的信用卡号",
		equalTo: "请再次输入相同的值",
		accept: "请输入拥有合法后缀名的字符串",
		maxlength: $.validator.format("请输入一个长度最多是 {0} 的字符串"),
		minlength: $.validator.format("请输入一个长度最少是 {0} 的字符串"),
		rangelength: $.validator.format("请输入一个长度介于 {0} 和 {1} 之间的字符串"),
		range: $.validator.format("请输入一个介于 {0} 和 {1} 之间的值"),
		max: $.validator.format("请输入一个最大为 {0} 的值"),
		min: $.validator.format("请输入一个最小为 {0} 的值")
	});
}(jQuery));