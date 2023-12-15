jQuery.namespace('fee.Common');
fee.Common = (function () {
  return {
    /*转换成财务格式  [99999->99,999]*/
    formatAmount: function (amount) {
      if (amount == null || amount == '') {
        return '';
      }

      var num = parseFloat(amount).toFixed(2);
      //判断是否有小数点
      var s = num.toString().indexOf('.');
      if (s == -1) {
        //是整数
        return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + '.00';
      } else {
        //是小数
        var arr = num.toString().split('.');
        if (arr.length > 1 && arr[1].length < 2) {
          //一位小数
          return (
            (arr[0] || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + '.' + arr[1] + '0'
          );
        } else {
          //两位小数
          return (arr[0] || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + '.' + arr[1];
        }
      }
    },

    /*转换成正常格式  [99,999->99999]*/
    clearFormatAmount: function (amount) {
      if (amount == null || amount == '') {
        return '';
      }
      var oldMny = amount.replace(/,/g, '');
      if (oldMny.indexOf('.') > 0) {
        oldMny = oldMny.replace(/0+?$/, ''); //去除尾部多余的0
        oldMny = oldMny.replace(/[.]$/, ''); //如果最后一位是.则去掉
      }
      return oldMny;
    },

    numberformat: function (obj) {
      if (Number(obj.value) < 0 || !$.isNumeric(obj.value)) {
        obj.value = '';
      }
      obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
      //			return obj.value;
    },

    // 判断指定公司的资金计划是否已经同步
    checkSyncPlan: function (upOrgId) {
      $.ajax({
        url: WEB_CTX_PATH + '/paymentAction.do?method=checkSyncPlan',
        data: { upOrgId: upOrgId },
        type: 'POST',
        dataType: 'json',
        async: false,
        success: function (data) {
          //计划内可用金额赋值
          if (!data.result) {
            sweetAlert({
              title: '提示',
              text: '指定公司的当月资金计划未同步，不能进行报销。',
              type: 'error',
              showConfirmButton: true,
              confirmButtonText: '确认',
            });
          }
        },
        //异常
        error: function (data) {},
      });
    },
  };
})();
