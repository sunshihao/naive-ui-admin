/**
 * @class StringBuffer类
 * @return 返回stringbuffer实例
 */
function StringBuffer()
{
    this._strings = [];
    if(arguments.length==1)
    {
        this._strings.push(arguments[0]);
    }
}
/**
 * 向stringbuffer中追加字符串
 * @param str 要追加的字符串
 */
StringBuffer.prototype.append = function(str)
{
    this._strings.push(str);
    return this;
};
/**
 * 返回stringbuffer中的内容
 * @return str 返回stringbuffer中的内容
 */
StringBuffer.prototype.toString = function()
{
    return this._strings.join("");
};
/**
 *  返回长度
 * @return str  返回长度
 */
StringBuffer.prototype.length = function()
{
    var str = this._strings.join("");
    return str.length;
};
/**
 * 取得arg在stringbuffer中第一次出现的位置
 * @param arg 要取得位置的字符串
 * @return 位置信息
 */
StringBuffer.prototype.indexOf = function(arg)
{
    var str = this._strings.join("");
    return str.indexOf(arg);
};
/**
 * 取得arg在stringbuffer中最后一次出现的位置
 * @param arg 要取得位置的字符串
 * @return 位置信息
 */
StringBuffer.prototype.lastIndexOf = function(arg)
{
    var str = this._strings.join("");
    return str.lastIndexOf(arg);
};
/**
 * 在stringbuffer中截取字符串
 * @param start 开始位置
 * @param end 结束位置
 * @return 截取之后的字符串
 */
StringBuffer.prototype.substring = function(start,end)
{
    var str = this._strings.join("");
    return str.substring(start,end);
};
/**
 * 取得stringbuffer中index位置的字符
 * @param index 位置
 * @return 返回index位置的字符
 */
StringBuffer.prototype.charAt = function(index)
{
    var str = this._strings.join("");
    return str.charAt(index);
};
/**
 * 字符串在数组中的开始位置
 * @param substr 要查找的字符串
 * @param start 开始查找的位置
 * @return 位置信息，如果不存在就返回-1
 */
//Array.prototype.indexOf=function(substr,start){
//	var ta,rt,d='\0';
//	if(start!=null){ta=this.slice(start);rt=start;}else{ta=this;rt=0;}
//	var str=d+ta.join(d)+d,t=str.indexOf(d+substr+d);
//	if(t==-1)return -1;rt+=str.slice(0,t).replace(/[^\0]/g,'').length;
//	return rt;
//};

Array.prototype.remove=function(dx)
{
    if(isNaN(dx)||dx>this.length){return false;}
    for(var i=0,n=0;i<this.length;i++)
    {
        if(this[i]!=this[dx])
        {
            this[n++]=this[i]
        }
    }
    this.length-=1
}
/**
 * 字符串在数组中的结束位置
 * @param substr 要查找的字符串
 * @param start 开始查找的位置
 * @return 位置信息，如果不存在就返回-1
 */
Array.prototype.lastIndexOf=function(substr,start){
	var ta,rt,d='\0';
	if(start!=null){ta=this.slice(start);rt=start;}else{ta=this;rt=0;}
	ta=ta.reverse();var str=d+ta.join(d)+d,t=str.indexOf(d+substr+d);
	if(t==-1)return -1;rt+=str.slice(t).replace(/[^\0]/g,'').length-2;
	return rt;
};
/**
 * 替换数组内部的值
 * @param reg 要替换的正则表达式
 * @param rpby 给替换为的内容
 * @return 替换之后的字符串
 */
Array.prototype.replace=function(reg,rpby){
	var ta=this.slice(0),d='\0';
	var str=ta.join(d);str=str.replace(reg,rpby);
	return str.split(d);
};

/**
 * 检查输入字符串是否是包含HTML特殊字符&、<、>、"
 * @return 如果包含返回true，否则返回false
 */
String.prototype.isIncludeHtmlChar = function()
{
  /*字符串中仅有下列字符，则字符串为数字*/
	var allHTMLChar="&<>\"";
  for (var i = 0; i < this.length; i++) {
    if (allHTMLChar.indexOf(this.charAt(i)) >= 0) {
      return true;
    }
  }
  return false;
};
/**
 * 替换字符中的url特殊字符为标准字符：
 * @return 返回替换之后的字符串
 */
String.prototype.toUrlString=function()
{
   return this.replace(/\%/g,"%25").replace(/\//g,"%2F").replace(/\?/g,"%3F").replace(/\+/g,"%2B").replace(/\#/g,"%23").replace(/\&/g,"%26");
};
/**
 * 字符串不区分大小写的比较
 * @param arg 要比较的字符串
 * @return 如果相同返回true，否则返回false
 */
String.prototype.equalsIgnoreCase=function(arg)
{
        return (new String(this.toLowerCase())==(new String(arg)).toLowerCase());
};
/**
 * 取得字符串的长度，双字节按照两个长度计算
 * @return 取得字符串的长度，双字节按照两个长度计算
 */
String.prototype.lengthb=function()
{
        return this.replace(/[^\x00-\xff]/g,"**").length;
};
/**
 * 字符串比较
 * @param arg 要比较的字符串
 * @return 如果相同返回true，否则返回false
 */
String.prototype.equals=function(arg)
{
        return (this.toString()==arg.toString());
};
/**
 * 去掉字符串两边的空格
 * @return 去掉空格之后的字符串
 */
String.prototype.trim = function()
{
	return this.replace(/^\s+|\s+$/g,"");
};
/**
 * 去掉字符串左边的空格
 * @return 去掉空格之后的字符串
 */
String.prototype.ltrim = function()
{
	return this.replace(/^\s+/,"");
};
/**
 * 去掉字符串右边的空格
 * @return 去掉空格之后的字符串
 */
String.prototype.rtrim = function()
{
	return this.replace(/\s+$/,"");
};
/**
 * 判断字符串是否从toffset位起始，以prefix开头
 * @param prefix 开始的字符串
 * @param toffset 开始位置
 * @return 如果从toffset位起始，以prefix开头，返回true，否则返回false
 */
String.prototype.startsWith=function(prefix,toffset)
{
	if(toffset==undefined)
		{toffset=0;}
	if(prefix==undefined)
		{return false;}
	if(this.indexOf(prefix)==toffset)
		{return true;}
	return false;
};
/**
 * 把字符串转换为Date对象，字符串的格式：yyyy-MM-dd或者yyyy/MM/dd
 * @return 把字符串转换为Date对象，如果不是日期，返回NaN
 */
String.prototype.toDate=function()
{
	return new Date(Date.parse(this.replace(/-/g,   "/")));
};
/**
 * 判断字符串是以prefix结束
 * @param prefix 结束的字符串
 * @return 如果以prefix结束，返回true，否则返回false
 */
String.prototype.endsWith=function(suffix)
{
	if(suffix==undefined)
		{return false;}
	if(this.lastIndexOf(suffix)==this.length-suffix.length)
		{return true;}
	return false;
};
/**
 * 把字符串中的s1替换位s2
 * @param s1 要被替换的字符串
 * @param s2 要替换成的字符串
 * @return 替换之后的字符串
 */

String.prototype.replaceAllNew = function(reallyDo, replaceWith, ignoreCase) {    
    if (!RegExp.prototype.isPrototypeOf(reallyDo)) {    
        return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi": "g")), replaceWith);    
    } else {    
        return this.replace(reallyDo, replaceWith);    
    }    
} 

String.prototype.replaceAll = function(s1,s2)
{
	return this.replace(new RegExp(s1,"gm"),s2);
};
/**
 * 判断字符串是否是整型字符
 * @return 如果是整型，返回true，否则返回false
 */
String.prototype.isInt = function()
{
	return /^(\(?\+?[0-9]*\)?)?[0-9_\- \(\)]*$/.test(this);
};
/**
 * 判断字符串是否是整型字符
 * @return 如果是整型，返回true，否则返回false
 */
String.prototype.isDouble = function()
{
	return /^[-\+]?\d+(\.\d+)?$/.test(this);
};
/**
 * 判断字符串是否是数字（不包含-和.）
 * @return 如果是数字，返回true，否则返回false
 */
String.prototype.isNumber = function()
{
	return /^\d+$/.test(this);
};
/**
 * 判断字符串是否是纯英文(A-Z/a-z)
 * @return 如果是纯英文，返回true，否则返回false
 */
String.prototype.isOnlyEnglish = function()
{
	return /^[A-Za-z]+$/.test(this);
};
/**
 * 判断字符串是否是纯中文(不包含英文的任何字符，包括数字)
 * @return 如果是纯中文，返回true，否则返回false
 */
String.prototype.isOnlyChinese = function()
{
	return /^[\u0391-\uFFE5]+$/.test(this);
};
/**
 * 判断字符串是否是空字符串
 * @return 如果是空字符串，返回true，否则返回false
 */
String.prototype.isEmpty = function()
{
	var tp = this.trim();
	if(tp == "")
		return true;
	else
		return false;
};
/**
 * 把半角字符转换为全角字符
 * @return 返回转换之后的全角字符
 */
String.prototype.toCase = function()
{
        var tmp = "";
        for(var i=0;i<this.length;i++)
        {
                if(this.charCodeAt(i)>0&&this.charCodeAt(i)<255)
                {
                        tmp += String.fromCharCode(this.charCodeAt(i)+65248);
                }
                else
                {
                        tmp += String.fromCharCode(this.charCodeAt(i));
                }
        }
        return tmp;
};
/**
 * 判断字符串是否是日期格式：格式：yyyy-MM-dd或者yyyy/MM/dd
 * @return 返回true或false
 */
String.prototype.isDate = function()
{
        return this.isLongDate()||this.isShortDate();
};
/**
 * 判断字符串是否是短日期格式：格式：yyyy-MM-dd或者yyyy/MM/dd
 * @return 返回true或false
 */
String.prototype.isShortDate = function()
{
        var r = this.replace(/(^\s*)|(\s*$)/g, "").match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
        if(r==null)
        {
        	return false;
        }
        var d = new Date(r[1], r[3]-1, r[4]);
        return (d.getFullYear()==r[1]&&(d.getMonth()+1)==r[3]&&d.getDate()==r[4]);
};
/**
 * 判断字符串是否是长日期格式：格式：yyyy-MM-dd或者yyyy/MM/dd
 * @return 返回true或false
 */
String.prototype.isLongDate = function()
{
        var r = this.replace(/(^\s*)|(\s*$)/g, "").match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/);
        if(r==null)
        {
        	return false;
        }
        var d = new Date(r[1], r[3]-1,r[4],r[5],r[6],r[7]);
        return (d.getFullYear()==r[1]&&(d.getMonth()+1)==r[3]&&d.getDate()==r[4]&&d.getHours()==r[5]&&d.getMinutes()==r[6]&&d.getSeconds()==r[7]);

};
/**
 * 判断字符串是否是ip地址
 * @return 返回true或false
 */
String.prototype.isIP = function()
{
    var reSpaceCheck = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
    if (reSpaceCheck.test(this))
    {
        this.match(reSpaceCheck);
        if (RegExp.$1 <= 255 && RegExp.$1 >= 0
         && RegExp.$2 <= 255 && RegExp.$2 >= 0
         && RegExp.$3 <= 255 && RegExp.$3 >= 0
         && RegExp.$4 <= 255 && RegExp.$4 >= 0)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    else
    {
        return false;
    }
};

/**
 * 得到左边的字符串
 * @param len 要取长度
 * @return 返回指定长度字符串
 */
String.prototype.Left = function(len)
{
    if(isNaN(len)||len==null)
    {
        len = this.length;
    }
    else
    {
        if(parseInt(len)<0||parseInt(len)>this.length)
        {
            len = this.length;
        }
    }
    return this.substr(0,len);
};
/**
 * 得到右边的字符串
 * @param len 要取长度
 * @return 返回指定长度字符串
 */
String.prototype.Right = function(len)
{
    if(isNaN(len)||len==null)
    {
        len = this.length;
    }
    else
    {
        if(parseInt(len)<0||parseInt(len)>this.length)
        {
            len = this.length;
        }
    }
    return this.substring(this.length-len,this.length);
};

