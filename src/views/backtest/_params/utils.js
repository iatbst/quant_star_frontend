

// 检查回测参数
export function checkBacktestParams(backtestParams){
    var paramsError = null
    if (backtestParams == null){
      paramsError = '回测参数为空, 请配置后再运行!'
      return {ok: false, error: paramsError}
    } else if (backtestParams.products.datas.length == 0){
      paramsError = '交易标的列表为空, 请添加交易标的.'
      return {ok: false, error: paramsError}
    } else if (backtestParams.products.from_date == null){
      paramsError = '交易标的起始日期为空, 请指定起始日期.'
      return {ok: false, error: paramsError}
    // } else if (backtestParams.products.to_date == null){
    //   paramsError = '交易标的结束日期为空, 请指定结束日期.'
    //   return {ok: false, error: paramsError}
    } else if (backtestParams.products.from_date >= backtestParams.products.to_date){
      paramsError = '交易标的起始日期晚于结束日期, 请重新设置.'
      return {ok: false, error: paramsError}
    } else if (backtestParams.strategies.length == 0){
      paramsError = '交易策略列表为空, 请添加交易策略.'
      return {ok: false, error: paramsError}
    } else {
      // 检查通过
      return {ok: true, error: paramsError}
    }
  }