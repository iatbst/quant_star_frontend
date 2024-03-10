<template>
    <!--- 表2: 仓位 --->
    <el-table
    :data="positionDatas"
    :header-cell-style="{ background: '#f2f2f2' }"
    style="width: 100%">

        <el-table-column label="总仓位" min-width="10%" align="center">
            <template slot-scope="scope">
                <span style="color: green" v-if="scope.row.totalPosition >= 0">
                    {{toThousands(scope.row.totalPosition)}}
                </span>   
                <span style="color: red" v-else>
                    {{toThousands(scope.row.totalPosition)}}
                </span>             
            </template>   
        </el-table-column>

        <el-table-column label="总多头" min-width="10%" align="center">
            <template slot-scope="scope">
                <span style="color: green">
                    {{toThousands(scope.row.longPosition)}}
                </span>              
            </template>
        </el-table-column>

        <el-table-column label="总空头" min-width="10%" align="center">
            <template slot-scope="scope">
                <span style="color: red">
                    {{toThousands(-scope.row.shortPosition)}}
                </span>               
            </template>
        </el-table-column>

        <el-table-column label="大PV多头" min-width="10%" align="center">
            <template slot-scope="scope">
                <span style="color: green">
                    {{toThousands(scope.row.prLongPosition)}}
                </span>               
            </template>       
        </el-table-column>

        <el-table-column label="大PV空头" min-width="10%" align="center">
            <template slot-scope="scope">
                <span style="color: red">
                    {{toThousands(scope.row.prShortPosition)}}
                </span>        
            </template>
        </el-table-column>

        <el-table-column label="小PV头寸" min-width="10%" align="center">
            <template slot-scope="scope">
                <span style="color: red">
                    {{toThousands(scope.row.prmPosition)}}
                </span>              
            </template>       
        </el-table-column>

        <el-table-column label="抄底头寸" min-width="10%" align="center">
            <template slot-scope="scope">
                <span style="color: green">
                    {{toThousands(scope.row.pbPosition)}}
                </span>          
            </template>
        </el-table-column>
    </el-table> 
</template>

<script>
import config from '@/configs/system_configs'
import {toThousands, getAnnualReturn, getMaxDrawdown} from '@/utils/general'
import moment from 'moment'

export default {
    props: {
        parentPfoPositions: {
            type:Object,
            default:{}
        },
        subaccountDatas: {
            type:Object,
            default:{}
        }           
    },

    watch: {
        parentPfoPositions: {
            handler(val, oldVal){
                this.parseParentPfoPositions()
            },
            deep: true
        },

        subaccountDatas: {
            handler(val, oldVal){
                this.parseSubaccountDatas()
            },
            deep: true
        },
    },

    data() {
        return {
            // 仓位
            positionDatas: [{
                totalPosition: null,
                longPosition: null,
                shortPosition: null,

                prLongPosition: null,
                prShortPosition: null,
                prmPosition: null,
                pbPosition: null
            }],
        }
    },

    created() {
        // 分析Data
        this.parseSubaccountDatas()
        this.parseParentPfoPositions()
    },

    methods: {
        parseParentPfoPositions(){
            // 策略仓位信息从系统后台获取
            var prData = this.parentPfoPositions.pivot_reversal
            var pbData = this.parentPfoPositions.plunge_back
            var prmData = this.parentPfoPositions.pivot_reversal_mini
            this.positionDatas[0].prLongPosition = Math.round(prData.long)
            this.positionDatas[0].prShortPosition = Math.round(prData.short)
            this.positionDatas[0].pbPosition = Math.round(pbData.long)
            this.positionDatas[0].prmPosition = Math.round(prmData.short)
        },

        parseSubaccountDatas(){  
            // 总体仓位信息从subaccount(平台)获取
            var totalPosition = 0
            var longPosition = 0
            var shortPosition = 0
            for(var i = 0; i < this.subaccountDatas.length; i++){
                var summary = this.subaccountDatas[i].positions.summary
                totalPosition += summary.usdt_long
                totalPosition += summary.usdt_short
                longPosition += summary.usdt_long
                shortPosition += summary.usdt_short
            }
            this.positionDatas[0].totalPosition = Math.round(totalPosition)
            this.positionDatas[0].longPosition = Math.round(longPosition)
            this.positionDatas[0].shortPosition = Math.round(shortPosition)
        },

        toThousands: toThousands,
    },
}


</script>