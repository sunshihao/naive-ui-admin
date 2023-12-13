
// 身份证验证方法
function isIdCardNo(num) {
	var len = num.length, re;
	if (len == 15)
		re = new RegExp(/^(\d{6})()?(\d{2})(\d{2})(\d{2})(\d{3})$/);
	else if (len == 18)
		re = new RegExp(/^(\d{6})()?(\d{4})(\d{2})(\d{2})(\d{3})(\d)$/);
	else {
		// alert("请输入15或18位身份证号,您输入的是 "+len+ "位");
		return false;
	}
	var a = num.match(re);
	if (a != null) {
		if (len == 15) {
			var D = new Date("19" + a[3] + "/" + a[4] + "/" + a[5]);
			var B = D.getYear() == a[3] && (D.getMonth() + 1) == a[4]
					&& D.getDate() == a[5];
		} else {
			var D = new Date(a[3] + "/" + a[4] + "/" + a[5]);
			var B = D.getFullYear() == a[3] && (D.getMonth() + 1) == a[4]
					&& D.getDate() == a[5];
		}
		if (!B) {
			// alert("输入的身份证号 "+ a[0] +" 里出生日期不对！");
			return false;
		}
	}

	return true;
}

// 手机号码验证
jQuery.validator.addMethod("mobile", function(value, element) {
	var length = value.length;
	var mobile = /^((\(\d{2,3}\))|(\d{3}\-))?1[3,8,5]{1}\d{9}$/;
	return this.optional(element) || (length == 11 && mobile.test(value));
}, "手机号码格式错误");

// 电话号码验证
jQuery.validator.addMethod("phone", function(value, element) {
	var tel = /^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/;
	return this.optional(element) || (tel.test(value));
}, "电话号码格式错误");

// 邮政编码验证
jQuery.validator.addMethod("zipCode", function(value, element) {
	var tel = /^[0-9]{6}$/;
	return this.optional(element) || (tel.test(value));
}, "邮政编码格式错误");

// QQ号码验证
jQuery.validator.addMethod("qq", function(value, element) {
	var tel = /^[1-9]\d{4,9}$/;
	return this.optional(element) || (tel.test(value));
}, "qq号码格式错误");

// IP地址验证
jQuery.validator
		.addMethod(
				"ip",
				function(value, element) {
					var ip = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
					return this.optional(element)
							|| (ip.test(value) && (RegExp.$1 < 256
									&& RegExp.$2 < 256 && RegExp.$3 < 256 && RegExp.$4 < 256));
				}, "Ip地址格式错误");

// 字母和数字的验证
jQuery.validator.addMethod("chrnum", function(value, element) {
	var chrnum = /^([a-zA-Z0-9]+)$/;
	return this.optional(element) || (chrnum.test(value));
}, "只能输入数字和字母(字符A-Z, a-z, 0-9)");

// 中文的验证
jQuery.validator.addMethod("chinese", function(value, element) {
	var chinese = /^[\u4e00-\u9fa5]+$/;
	return this.optional(element) || (chinese.test(value));
}, "只能输入中文");


// 下拉框验证
jQuery.validator.addMethod("selectNone", function(value, element) {
	return value == "请选择";
}, "必须选择一项");

// 字节长度验证
jQuery.validator.addMethod("byteRangeLength", function(value, element, param) {
	var length = value.length;
	for (var i = 0; i < value.length; i++) {
		if (value.charCodeAt(i) > 127) {
			length++;
		}
	}
	return this.optional(element) || (length >= param[0] && length <= param[1]);
}, jQuery.validator.format("请确保输入的值在{0}-{1}个字节之间(一个中文字算2个字节)"));

// 字符验证
jQuery.validator.addMethod("stringCheck", function(value, element) {
	return this.optional(element) || /^[\u0391-\uFFE5\w]+$/.test(value);
}, "只能包括中文字、英文字母、数字和下划线");

// 中文字两个字节
jQuery.validator.addMethod("byteRangeLength",
		function(value, element, param) {
			var length = value.length;
			for (var i = 0; i < value.length; i++) {
				if (value.charCodeAt(i) > 127) {
					length++;
				}
			}
			return this.optional(element)
					|| (length >= param[0] && length <= param[1]);
		}, "请确保输入的值在{0}-{1}个字节之间(一个中文字算2个字节)");
//Check字节长度  chejq add 2017-07-03
jQuery.validator.addMethod("checkByteLength",
		function(value,element,param){
			var newLen = value.replace(/[^x00-xFF]/g,'**').length;
			return this.optional(element)||newLen <= param[0];
		}, "请确保输入的值在{0}个字节之内(一个中文字算2个字节)");
// 身份证号码验证
jQuery.validator.addMethod("isIdCardNo", function(value, element) {
	return this.optional(element) || isIdCardNo(value);
}, "请正确输入您的身份证号码");

// 护照号码验证
jQuery.validator.addMethod("isPassportNo", function(value, element) {
	var passPortNo=/^1[45][0-9]{7}|G[0-9]{8}|P[0-9]{7}|S[0-9]{7,8}|D[0-9]+$/;
	return this.optional(element) || passPortNo.test(value);
}, "请正确输入您的护照号码");

// 手机号码验证
jQuery.validator.addMethod("isMobile", function(value, element) {
	var length = value.length;
	var mobile = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
	return this.optional(element) || (length == 11 && mobile.test(value));
}, "请正确填写您的手机号码");

// 电话号码验证
jQuery.validator.addMethod("isTel", function(value, element) {
	var tel = /^\d{3,4}-?\d{7,9}$/; // 电话号码格式010-12345678
	return this.optional(element) || (tel.test(value));
}, "请正确填写您的电话号码");

// 联系电话(手机/电话皆可)验证
jQuery.validator.addMethod("isPhone", function(value, element) {
	var length = value.length;
	var mobile = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
	var tel = /^\d{3,4}-?\d{7,9}$/;
	return this.optional(element) || (tel.test(value) || mobile.test(value));

}, "请正确填写您的联系电话");

// 邮政编码验证
jQuery.validator.addMethod("isZipCode", function(value, element) {
	var tel = /^[0-9]{6}$/;
	return this.optional(element) || (tel.test(value));
}, "请正确填写您的邮政编码");

//日期比较
jQuery.validator.addMethod("dateCompare", function(value, element, param) {
	var startDate = $jQuery(param).val();
	var endDate = value;
	return this.optional(element) || startDate.replace("-", "") <= endDate.replace("-", "");
}, "结束日期必须大于开始日期!");


//日期比较
jQuery.validator.addMethod("dateCompares", function(value, element, param) {
	var startDate = $jQuery(param).val();
	var endDate = value;
	startDate = startDate.replaceAll("-", "");
	startDate = startDate.replace(":", "");
	endDate = endDate.replaceAll("-", "");
	endDate = endDate.replace(":", "");
	return this.optional(element) || startDate <= endDate;
}, "结束日期必须大于开始日期!");

//数值比较
jQuery.validator.addMethod("valueCompare", function(value, element, param) {
	var startValue = $jQuery(param).val();
	var endValue = value;
	return this.optional(element) || startValue <= endValue;
}, "");

// 数字校验（正数） wenyadd 2014-04-27
jQuery.validator.addMethod("isNumberh", function(value, element) {
	var zfnum = /^[0-9]+(\.[0-9]{0,2})?$/;
	return this.optional(element) || (zfnum.test(value));
}, "请正确输入正数");

//数值比较,超过最大值出警告。
jQuery.validator.addMethod("valueCompareToMax", function(value, element, param) {
	var startValue = $jQuery(param).val();
	var endValue = value;
	return this.optional(element) || parseFloat(startValue) >= parseFloat(endValue);
}, "");
//数值比较,小于等于最小值出警告。
jQuery.validator.addMethod("valueCompareToMin", function(value, element, param) {
	return this.optional(element) || parseFloat(value) > parseFloat(param);
}, "");
// 车主司机多选
jQuery.validator.addMethod("checkValidate", function(value, element, param) {
	var checkLength = $jQuery("input[name='"+param+"']:checked").length;
	return checkLength!=0;
}, "车主司机必须选择一个");

//m位整数n位小数校验
jQuery.validator.addMethod("float",function(value,element,param){
	if(value==null||value==""){
		return true;
	}
	var pattern=/^[\d\.]*$/;
	if(!pattern.test(value)){
		return;
	}
	var index=value.indexOf(".");
	if(index>-1){
		var arrValue=value.split(".");
		if(arrValue.length>2){
			return false;
		}
		if(arrValue[0].length>param[0]){
			return false;
		}else if(arrValue[1].length>param[1]){
			return false;
		}
		if(isNaN(parseInt(arrValue[0]))){
			return false;
		}
		if(arrValue[0].length>1){
			if(parseInt(arrValue[0].substr(0, 1))==0)
				return false;
		}
		if(isNaN(parseInt(arrValue[1]))){
			return false;
		}
	}else{
		if(value.length>param[0]){
			return false;
		}
		if(isNaN(parseInt(value))){
			return false;
		}
		if(value.length>1){
			if(parseInt(value.substr(0, 1))==0)
				return false;
		}
	}
	return true;
},jQuery.validator.format("最大只能输入{0}位整数{1}位小数"));

//特殊字符验证  wenyadd  2014/5/20  begin
/**
 * 校验是否包含特殊字符。
 */
function checkSpeChar(obj)
{
  var allowSpeChar = "";
  var values = obj.value;
  // trim掉字符串前后的空格
  values = values.trim();
  obj.value = values;
  var __allowSpeChar = obj.getAttribute("allowSpeChar");
  if (__allowSpeChar!=undefined)
  {
	allowSpeChar = __allowSpeChar;
  }
  var allHTMLChar="%?#&<>\"\'\\\/*|`~!$^()[]{}";
  for (var i = 0; i < values.length; i++) 
  {
    if (allHTMLChar.indexOf(values.charAt(i)) >= 0 && allowSpeChar.indexOf(values.charAt(i))<0) 
    {
    	obj.select();
    	alert("不能包含特殊字符["+values.charAt(i)+"]");
	    return false;
    }
  }
  return true;
}
//特殊字符验证  wenyadd  2014/5/20  end
//编码校验  限制为数字，字母，-或_ add by liuxiaoyong 
jQuery.validator.addMethod("isCode",function(value, element){
	var code=/^[A-Za-z0-9\\_-]*$/;
	return this.optional(element) || code.test(value);
}, "请正确输入编码");
//end
//国内银行卡号校验 add by liuxiaoyong start
function isBankAccount(bankno){
	if (bankno.length < 16 || bankno.length > 19) {
		//$("#banknoInfo").html("银行卡号长度必须在16到19之间");
		return false;
	}
	var num = /^\d*$/;  //全数字
	if (!num.exec(bankno)) {
		//$("#banknoInfo").html("银行卡号必须全为数字");
		return false;
	}
	//开头6位
	var strBin="10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99";    
	if (strBin.indexOf(bankno.substring(0, 2))== -1) {
		//$("#banknoInfo").html("银行卡号开头6位不符合规范");
		return false;
	}
    var lastNum=bankno.substr(bankno.length-1,1);//取出最后一位（与luhm进行比较）

    var first15Num=bankno.substr(0,bankno.length-1);//前15或18位
    var newArr=new Array();
    for(var i=first15Num.length-1;i>-1;i--){    //前15或18位倒序存进数组
        newArr.push(first15Num.substr(i,1));
    }
    var arrJiShu=new Array();  //奇数位*2的积 <9
    var arrJiShu2=new Array(); //奇数位*2的积 >9
    
    var arrOuShu=new Array();  //偶数位数组
    for(var j=0;j<newArr.length;j++){
        if((j+1)%2==1){//奇数位
            if(parseInt(newArr[j])*2<9)
            arrJiShu.push(parseInt(newArr[j])*2);
            else
            arrJiShu2.push(parseInt(newArr[j])*2);
        }
        else //偶数位
        arrOuShu.push(newArr[j]);
    }
    
    var jishu_child1=new Array();//奇数位*2 >9 的分割之后的数组个位数
    var jishu_child2=new Array();//奇数位*2 >9 的分割之后的数组十位数
    for(var h=0;h<arrJiShu2.length;h++){
        jishu_child1.push(parseInt(arrJiShu2[h])%10);
        jishu_child2.push(parseInt(arrJiShu2[h])/10);
    }        
    
    var sumJiShu=0; //奇数位*2 < 9 的数组之和
    var sumOuShu=0; //偶数位数组之和
    var sumJiShuChild1=0; //奇数位*2 >9 的分割之后的数组个位数之和
    var sumJiShuChild2=0; //奇数位*2 >9 的分割之后的数组十位数之和
    var sumTotal=0;
    for(var m=0;m<arrJiShu.length;m++){
        sumJiShu=sumJiShu+parseInt(arrJiShu[m]);
    }
    
    for(var n=0;n<arrOuShu.length;n++){
        sumOuShu=sumOuShu+parseInt(arrOuShu[n]);
    }
    
    for(var p=0;p<jishu_child1.length;p++){
        sumJiShuChild1=sumJiShuChild1+parseInt(jishu_child1[p]);
        sumJiShuChild2=sumJiShuChild2+parseInt(jishu_child2[p]);
    }      
    //计算总和
    sumTotal=parseInt(sumJiShu)+parseInt(sumOuShu)+parseInt(sumJiShuChild1)+parseInt(sumJiShuChild2);
    
    //计算Luhm值
    var k= parseInt(sumTotal)%10==0?10:parseInt(sumTotal)%10;        
    var luhm= 10-k;
    
    if(lastNum==luhm){
   
    return true;
    }
    else{
   
    return false;
    }        
}
jQuery.validator.addMethod("isBankAccount", function(value, element) {
	return this.optional(element) || isBankAccount(value);
}, "请正确输入银行账号");
//end
//不能输入单引号 weny add2014/05/26
jQuery.validator.addMethod("SpecialChar", function(value, element, param) {
	var tel = /^[^']*$/;
	return this.optional(element) || (tel.test(value));
}, "不能输入特殊字符");

jQuery.validator.addMethod("time", function(value, element, param) {
	var time = /^([01][0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
	return this.optional(element) || (time.test(value));
}, "请正确输入时间【00:00】");
