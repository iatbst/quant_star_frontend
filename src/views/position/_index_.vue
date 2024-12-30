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

    <!-- 仓位详情1 -->
    <div style="background-color: white; margin-bottom: 20px">
        <el-row :gutter="0" type="flex">
            <el-col :span="24" align="center">
                <h3>
                    仓位明细1           
                </h3>    
            </el-col>
        </el-row>
        <position-details v-bind:subaccount-datas="subaccountDatas" v-if="subaccountDatasAvailable"></position-details> 
    </div>

    <!-- 仓位详情2 -->
    <div style="background-color: white; margin-bottom: 20px">
        <el-row :gutter="0" type="flex">
            <el-col :span="24" align="center">
                <h3>
                    仓位明细2           
                </h3>    
            </el-col>
        </el-row>
        <position-map v-bind:positions="positions" v-if="positionsAvailable"></position-map> 
    </div>
  </div>


</template>


<script>
import totalPosition from '@/views/position/total_position'
import positionRanks from '@/views/position/position_ranks'
import positionDetails from '@/views/position/position_details'
import positionMap from '@/views/position/position_map'
import config from '@/configs/system_configs'
import { getSubAccountDatas } from '@/api/subaccount'
import { getPositions } from '@/api/position'

export default {
    components: {
        totalPosition,
        positionRanks,
        positionDetails,
        positionMap
    },

    data() {
        return {
            pfoHosts: config.pfoHosts,

            subaccountDatas: null,
            subaccountDatasAvailable: false,      
            
            positions: null,
            positionsAvailable: false,
        }
    },

    created() {
        this.subaccountDatas = []
        this.fetchSubAccountPositionDatas()
        this.fetchPositions()
    },

    methods: {
        fetchSubAccountPositionDatas() {
            getSubAccountDatas(config.masterHost, 'positions,subaccount').then(response => {
                    this.subaccountDatas = response.results
                    this.subaccountDatasAvailable = true
                }
            )
        },
        fetchPositions() {
            this.positions = []
            var count = 0
            for(var i = 0; i < this.pfoHosts.length; i++){
                getPositions(this.pfoHosts[i]).then(response => {
                        count += 1
                        this.positions = this.positions.concat(response.results)
                        if (count === this.pfoHosts.length ){
                            // 排序
                            // this.positions.sort((a, b) => a.worker - b.worker)
                            this.positionsAvailable = true
                        }
                    }
                )
            }
        },
    }
}
</script>