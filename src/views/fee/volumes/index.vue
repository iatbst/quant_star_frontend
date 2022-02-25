<template>
  <div class="app-container" style="background-color: lightgray">
    <!----------------------------------- 表1: 月度柱状图 --------------------------------------->
    <div style="background-color: white; margin-bottom: 20px">
        <month-volumes
        v-bind:subaccount-datas="subaccountDatas"
        v-if="subaccountDatasAvailable"
        >
        </month-volumes>
    </div>

    <!----------------------------------- 表2: 分布Pie图 --------------------------------------->
    <div style="background-color: white; margin-bottom: 20px">
        <volume-distributions
        v-bind:subaccount-datas="subaccountDatas"
        v-if="subaccountDatasAvailable"
        >
        </volume-distributions>
    </div>

  </div>
</template>

<script>
// Components
import monthVolumes from '@/views/fee/volumes/month_volumes'
import volumeDistributions from '@/views/fee/volumes/volume_distributions'



import config from '@/configs/system_configs'
import { getSubAccountDatas } from '@/api/subaccount' 


export default {
    components: {
        monthVolumes,
        volumeDistributions,
    },

    data() {
        return {
            subaccountDatas: null,
            subaccountDatasAvailable: false,
        }
    },

    created() {
        this.fetchDatas()
    },

    methods: {
        // 获取原始volume datas
        fetchDatas() {
            getSubAccountDatas(config.masterHost, 'subaccount,volumes').then(response => {
                    this.subaccountDatas = response.results    
                    this.subaccountDatasAvailable = true       
                }
            )
        }
     
    },
}
</script>