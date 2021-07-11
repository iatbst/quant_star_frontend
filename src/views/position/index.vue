<template>
  <div class="app-container" style="background-color: lightgray">
    <!-- 总仓位 -->
    <div style="background-color: white; margin-bottom: 20px">
        <el-row :gutter="0" type="flex">
            <el-col :span="24" align="center">
                <h2>              
                </h2>    
            </el-col>
        </el-row>
        <total-position v-bind:subaccount-datas="subaccountDatas" v-if="subaccountDatasAvailable"></total-position> 
    </div>

    <!-- 仓位排名 -->
    <div style="background-color: white; margin-bottom: 20px">
        <el-row :gutter="0" type="flex">
            <el-col :span="24" align="center">
                <h2>              
                </h2>    
            </el-col>
        </el-row>
        <position-ranks v-bind:subaccount-datas="subaccountDatas" v-if="subaccountDatasAvailable"></position-ranks> 
    </div>

    <!-- Pfo仓位 -->
    <div style="background-color: white; margin-bottom: 20px">
        <el-row :gutter="0" type="flex">
            <el-col :span="24" align="center">
                <h2>              
                </h2>    
            </el-col>
        </el-row>
        <pfo-positions v-bind:subaccount-datas="subaccountDatas" v-if="subaccountDatasAvailable"></pfo-positions> 
    </div>

    <!-- 仓位详情 -->
    <div style="background-color: white; margin-bottom: 20px">
        <el-row :gutter="0" type="flex">
            <el-col :span="24" align="center">
                <h3>
                    仓位明细              
                </h3>    
            </el-col>
        </el-row>
        <position-details v-bind:subaccount-datas="subaccountDatas" v-if="subaccountDatasAvailable"></position-details> 
    </div>
  </div>


</template>


<script>
import totalPosition from '@/views/position/total_position'
import positionRanks from '@/views/position/position_ranks'
import pfoPositions from '@/views/position/pfo_positions'
import positionDetails from '@/views/position/position_details'
import config from '@/configs/system_configs'
import { getSubAccountDatas } from '@/api/subaccount'


export default {
    components: {
        totalPosition,
        positionRanks,
        pfoPositions,
        positionDetails
    },

    data() {
        return {
            subaccountDatas: null,
            subaccountDatasAvailable: false,                                                    
        }
    },

    created() {
        this.subaccountDatas = []
        this.fetchSubAccountPositionDatas()
    },

    methods: {
        fetchSubAccountPositionDatas() {
            getSubAccountDatas(config.masterHost, 'positions,subaccount').then(response => {
                    this.subaccountDatas = response.results
                    this.subaccountDatasAvailable = true
                }
            )
        },
    }
}
</script>