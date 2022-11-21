<template>
    <div class="app-container" align="center" >
        <div style="width: 95%; margin-top: 20px" v-if="feeFilterAvailable">
            <el-row>
                <el-col :span="4">
                    <el-select v-model="feeFilter.acctName" placeholder="请选择">
                        <el-option
                        v-for="item in options.acctNames"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>        
                </el-col>

                <el-col :span="4">
                    <el-select v-model="feeFilter.subType" placeholder="请选择">
                        <el-option
                        v-for="item in options.subTypes"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>    
                </el-col>

                <el-col :span="4">
                    <el-select v-model="feeFilter.pfo" placeholder="请选择">
                        <el-option
                        v-for="item in options.pfos"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>    
                </el-col>

                <el-col :span="4">
                    <el-select v-model="feeFilter.feeType" placeholder="请选择">
                        <el-option
                        v-for="item in options.feeTypes"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>    
                </el-col>

                <el-col :span="4">
                    <el-date-picker
                    v-model="feeFilter.monthRange"
                    type="monthrange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始月份"
                    end-placeholder="结束月份"
                    value-format="yyyy-MM"
                    :picker-options="pickerOptions">
                    </el-date-picker>
                </el-col>

                <el-col :span="3" :offset="1">
                    <el-row>
                        <el-col :span="10" :offset="2">
                            <el-button style="width: 100%" type="primary" @click="searchFees()">
                                查询
                            </el-button>                             
                        </el-col>
                        <el-col :span="10" :offset="2">
                            <el-button style="width: 100%" type="info" @click="resetFees()">
                                重置
                            </el-button> 
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
        </div>

        <div style="width: 95%; margin-top: 20px; margin-bottom: 20px" align="center">
            <fee-table
            v-bind:fee-datas="feeDatas"
            v-bind:total-fees="totalFees"
            v-if="feeDatasAvailable"
            >
            </fee-table>
        </div>
    </div>
</template>

<script>
import {toThousands} from '@/utils/general'
import feeTable from '@/views/fee/fees/_fee_table'
import { chineseString } from '@/utils/chinese'


export default {
    components: {
        feeTable
    },

    props: {
        subaccountDatas: {
            type:Array,
            default:[]
        }
    },

    watch: {
        subaccountDatas(val){
            // this.init()
            this.parseData()
        }
    },

    data() {
        return {
            initFeeDatas: true,
            feeDatas: null, 
            totalFees: null,  
            feeDatasAvailable: false,

            // 过滤
            feeFilterAvailable: false,
            feeFilter: null,
            options: null,
            pickerOptions: {
            shortcuts: [{
                text: '本月',
                onClick(picker) {
                picker.$emit('pick', [new Date(), new Date()]);
                }
            }, {
                text: '今年至今',
                onClick(picker) {
                const end = new Date();
                const start = new Date(new Date().getFullYear(), 0);
                picker.$emit('pick', [start, end]);
                }
            }, {
                text: '最近六个月',
                onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setMonth(start.getMonth() - 6);
                picker.$emit('pick', [start, end]);
                }
            }]
            },
        }
    },

    created() {
        this.init()

        // 分析Data
        this.parseData()
    },

    methods: {
        // 初始化
        init(){
            this.feeFilter = {
                acctName: null,
                subType: null,
                pfo: null,
                feeType: null,
                monthRange: null,
            }
            this.options = {
                acctNames: [{label: '全部', value: null}],
                subTypes: [{label: '全部', value: null}],
                pfos: [{label: '全部', value: null}],
                feeTypes: [{label: '全部', value: null}], 
            }
        },

        // 处理父组件建传入data: pfoDatas
        parseData() {
            this.prepareFeeDatas()
        },

        // 根据搜索条件查询
        searchFees(){
            this.prepareFeeDatas()
        },

        // 重置搜索条件和fee table
        resetFees(){
            this.feeFilter = {
                acctName: null,
                subType: null,
                pfo: null,
                feeType: null,
                monthRange: null,
            }
            this.prepareFeeDatas()
        },

        // 根据条件过滤
        filterFees(acctName, subType, pfo, feeType){
            if (this.feeFilter.acctName && acctName != this.feeFilter.acctName){
                return false
            } else if (this.feeFilter.subType && subType != this.feeFilter.subType){
                return false
            } else if (this.feeFilter.pfo && pfo != this.feeFilter.pfo){
                return false
            } else if (this.feeFilter.feeType && feeType != this.feeFilter.feeType){
                return false
            } else {
                // 通过
                return true
            }
        },

        filterByMonthRange(data){
            // debugger
            if (Array.isArray(this.feeFilter.monthRange) && this.feeFilter.monthRange.length == 2){
                var sum = 0
                var startMonth = this.feeFilter.monthRange[0]
                var endMonth = this.feeFilter.monthRange[1]
                for(let month in data.month_records){
                    if (month >= startMonth && month <= endMonth){
                        sum += data.month_records[month]
                    }
                }
                return sum
            } else {
                // 未指定monthRange, 返回合计值
                return data.sum
            }
        },

        // 为feeTypeDist准备数据
        prepareFeeDatas(){
            this.feeDatas = []
            this.totalFees = 0
            for(let i = 0; i < this.subaccountDatas.length; i++){
                for(let type in this.subaccountDatas[i].fees.types){
                    // 根据monthRange确定sum
                    var sum = this.filterByMonthRange(this.subaccountDatas[i].fees.types[type])

                    this.totalFees -= sum
                    var acctName = this.subaccountDatas[i].subaccount.account.name
                    var subType = this.subaccountDatas[i].subaccount.sub_type
                    var pfo = this.subaccountDatas[i].subaccount.portfolio.alias
                    var months = Object.keys(this.subaccountDatas[i].fees.types[type].month_records).sort()

                    // 起始/终止时间
                    if (Array.isArray(this.feeFilter.monthRange) && this.feeFilter.monthRange.length == 2){
                        var startMonth = this.feeFilter.monthRange[0]
                        var endMonth = this.feeFilter.monthRange[1]
                    } else {
                        var startMonth = months[0]
                        var endMonth = months[months.length - 1]
                    }

                    // 当前对应pfo的状态
                    var status = this.subaccountDatas[i].subaccount.portfolio.status

                    // 是否过滤
                    if (sum != 0){
                        var filterRet = this.filterFees(acctName, subType, pfo, type)
                        if (filterRet){
                            this.feeDatas.push({
                                acctName: acctName,
                                status: status,
                                subType: subType,
                                pfo: pfo,
                                feeType: type,
                                startMonth: startMonth,
                                endMonth: endMonth,
                                sum: -sum   // 后台fee的负值代表支出;正值代表收入.前台图表需要正负颠倒!
                            })
                        } 
                    }

                    // 添加options(只在第一次添加)
                    if (this.initFeeDatas){
                        if (!this.options.acctNames.map(a => a.value).includes(acctName)){
                            this.options.acctNames.push({
                                label: acctName,
                                value: acctName
                            })
                        }
                        if (!this.options.subTypes.map(a => a.value).includes(subType)){
                            this.options.subTypes.push({
                                label: chineseString(subType),
                                value: subType                            
                            })
                        }
                        if (!this.options.pfos.map(a => a.value).includes(pfo)){
                            this.options.pfos.push({
                                label: pfo,
                                value: pfo                                
                            })
                        }
                        if (!this.options.feeTypes.map(a => a.value).includes(type)){
                            this.options.feeTypes.push({
                                label: chineseString(type),
                                value: type                                 
                            })
                        }
                    }
                }
            }

            this.initFeeDatas = false
            this.feeDatasAvailable = true
            this.feeFilterAvailable = true
        },

        toThousands: toThousands,
    }
}
</script>