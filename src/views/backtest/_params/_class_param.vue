<!-- 
    模板: 更新class param
-->
<template>
  <div>
    <!-- 选择class -->
    <div style="margin-top: 10px">
        <el-select
        v-model="classObj.cls_name"
        placeholder="请选择"
        @change="clearClassObj()"
        style="width: 50%"
        >
        <el-option
            v-for="item in optionsMap[classType]"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
        </el-select>
    </div>   

    <!-- 填写参数 -->
    <div v-if="classObj.cls_name != null">
        <div v-for="param in paramsMap[classType][classObj.cls_name]" :key="param.name">
            <!-- number/string: 普通输入 -->
            <div v-if="(param.type == 'number' || param.type == 'string') && showParam(param)" style="margin-top: 10px">
                {{ param.label }}: <el-input v-model="classObj.params[param.name]" style="width: 20%" size="mini"></el-input>
                <span style="color: red">{{ param.alert }}</span>
            </div>
            
            <!-- bool: 开关 -->
            <div v-else-if="param.type == 'bool' && showParam(param)" style="margin-top: 10px">
                <el-switch v-model="classObj.params[param.name]"
                                :active-text="param.active_label"
                                :inactive-text="param.inactive_label">
                </el-switch>
            </div>

            <!-- date: 日期选择 -->
            <div v-else-if="param.type == 'date' && showParam(param)" style="margin-top: 10px">
                {{ param.label }}: 
                <el-date-picker
                v-model="classObj.params[param.name]"
                type="date"
                placeholder="选择日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd">
                </el-date-picker>
            </div>

            <!-- json: 文本输入 -->
            <div v-else-if="param.type == 'object' && showParam(param)" style="margin-top: 10px">
                {{ param.label }}: 
                <el-input
                type="textarea"
                :autosize="{ minRows: 1, maxRows: 4}"
                placeholder="请输入内容"
                style="width: 40%"
                v-model="classObj.params[param.name]">
                </el-input>
            </div>

            <!-- select: 选择 -->
            <div v-else-if="param.type == 'select' && showParam(param)" style="margin-top: 10px">
                {{ param.label }}: 
                <el-select v-model="classObj.params[param.name]" placeholder="请选择">
                    <el-option
                    v-for="item in param.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>

            <!-- class: 子类 -->
            <div v-else-if="param.type == 'class' && showParam(param)" style="margin-top: 10px">
                {{ param.label }}: 
                <class-param 
                v-bind:class-obj="classObj.params[param.name]" 
                v-bind:class-type="param.class_type"
                v-bind:options-map="optionsMap"
                v-bind:params-map="paramsMap"
                v-bind:refresh-counter="refreshCounter"

                @refreshSubComp="refreshSubComp"
                style="margin-top: 20px">
                </class-param>                
            </div>
        </div>
    </div>   
  </div>
</template>

<script>

export default {
    name: 'class-param',

    props: {
        // 需要更新的class param
        classObj: {
            type: Object,
            // default: {}
        },
        // class 类型: strategy/sizer/analyzer etc
        classType: {
            type: String,
            default: ''
        },
        optionsMap: {
            type: Object,
            defautl: {}
        },
        paramsMap: {
            type: Object,
            defautl: {}
        },
        refreshCounter: {
            type: Number,
            default: 0
        }
    },

    watch: {
        refreshCounter (val) {
            this.$forceUpdate()
            // alert('子组件刷新!')
        }
    },

    data() {
        return {

        }
    },

    created() {
        this.initClassObj()
    },

    methods: {
        // 初始化classObj
        initClassObj(){
            this.classObj = {
                cls_name: "",
                params: {}
            }
            
            // 递归组件初始化必须更新所有子组件
            this.refreshSubComp(this.classType)
        },

        // 初始化当前obj的params: obj可以是strategy/filter/analyzer
        clearClassObj(){
            this.classObj.params = {}
            var params = this.paramsMap[this.classType][this.classObj.cls_name]
            for(let ix in params){
                // 清空alert(alert挂载在param上)
                var param = params[ix]
                param.alert = null

                // 更新初始值
                // 注意: 要使用$set更新, 否则input无法编辑(参考: https://blog.csdn.net/weixin_44314609/article/details/107894733)
                if (param.default !== undefined){
                    this.$set(this.classObj.params, param.name, param.default)
                }

                // 属性是class, 需要递归call当前组件, 必须提前初始化classObj -> {cls_name: null, params: {}}
                if (param.type == 'class'){
                    this.$set(this.classObj.params, param.name, {cls_name: null, params: {}})
                }
            }
        },

        // 条件显示: 根据另一个switch param的状态决定是否显示
        // param需要设置参数: if_visible 和 visible_param
        // TODO: 右侧的参数不应该显示invisible的param
        showParam(param){
            if(param.if_visible === undefined){
                return true
            } else {
                if (param.if_visible === true && this.classObj.params[param.visible_param] === true){
                    return true
                } else if (param.if_visible === false && this.classObj.params[param.visible_param] === false) {
                    return true
                } else {
                    return false
                }
            }
        },

        refreshSubComp(class_type){
            this.$emit("refreshSubComp", class_type)
        }
    }
}
</script>
