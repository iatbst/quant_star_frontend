import {checkBacktestParams} from '@/views/backtest/_params/utils'


export function checkPlanParams(plan){
    var paramsError = null
    if (plan.name == null || plan.name.length == 0) {
      paramsError = '请输入方案名称.'
      return {ok: false, error: paramsError}
    } else if (plan.description == null || plan.description.length == 0){
        paramsError = '请输入方案描述.'
        return {ok: false, error: paramsError}
    } else {
      // 检查backtest参数
      return checkBacktestParams(plan.params)
    }
}