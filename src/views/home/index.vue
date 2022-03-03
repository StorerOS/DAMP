
<template>
  <div>
    <div v-if="observeList.length > 0 || (overview && overview.total_assets)">
      <div class="box_container">
        <div class="search">
          <!-- <svg-icon icon-class="refresh" /> -->
          <el-input v-model="search" placeholder="输入钱包地址,回车搜索" size="normal" clearable @keyup.enter.native="handleSearchAddress" />
        </div>
        <div class="header">
          <div class="head">FIL</div>
          <div class="content">
            <el-select v-model="address" filterable size="small">
              <el-option
                v-for="item in observeList"
                :key="item.id"
                :label="item.address"
                :value="item.address"
              />
            </el-select>
            <div class="day">注册天数:{{ overview.days || '' }}天</div>
            <div v-if="!hasObserve" class="btn" @click="handleAddObserve"><svg-icon icon-class="ic-add" />加入观察</div>
          </div>
          <div class="overview">
            <div>总资产<svg-icon icon-class="refresh" @click="getOverView" /></div>
            <div class="price">{{ overview.total_assets }}</div>
          </div>
        </div>
      </div>
      <div class="content_box">
        <el-tabs v-model="active">
          <el-tab-pane label="账户总览" name="overview">
            <el-table :data="overview.list" border stripe>
              <el-table-column prop="asset_name" label="资产名称" />
              <el-table-column prop="price" label="价格" />
              <el-table-column prop="count" label="数量" />
              <el-table-column prop="value" label="当前价值" />
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="交易历史" name="history">
            <el-table :data="tradeHistoryList" border stripe>
              <el-table-column prop="tx_time" label="时间">
                <template slot-scope="scope">
                  <div>{{ scope.row.tx_time | parseTime($event,'yyyy-mm-dd') }}</div>
                </template>
              </el-table-column>
              <el-table-column prop="msg_id" label="地址" />
              <el-table-column prop="amount" label="数量" />
              <el-table-column prop="" label="类型">
                <template slot-scope="scope">
                  <div>{{ scope.row.tx_type == 1?'转出':'转入' }}</div>
                </template>
              </el-table-column>
              <el-table-column prop="gas_fee" label="手续费" />
            </el-table>
            <div class="pagination_box">
              <el-pagination
                :current-page="paginationConfig.currentPage"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="paginationConfig.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="paginationConfig.total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div v-else class="search_input">
      <el-input v-model="search" placeholder="输入钱包地址,回车搜索" size="normal" @keyup.enter.native="handleSearchAddress" />
    </div>
  </div>
</template>
<script>
import { addObserve, observeList, accountOverview, tradeHistory, searchAddress } from '@/api/common'
import { parseTime } from '@/utils'
import paginatMixin from '@/mixin/pagination'
import { mapGetters } from 'vuex'
import SvgIcon from '@/components/SvgIcon/index.vue'
import _ from 'lodash'
export default {
  components: { SvgIcon },
  filters: {
    parseTime
  },
  mixins: [paginatMixin],
  data() {
    return {
      search: '',
      address: '',
      observeList: [],
      tradeHistoryList: [],
      overview: {},
      chain_type: 'FIL',
      active: 'overview',
      paginationConfig: {
        currentPage: 1,
        total: 1
      }
    }
  },
  watch: {
    address: function() {
      this.getOverView()
    },
    chainType() {
      this.getObserveList()
    }
  },
  computed: {
    ...mapGetters([
      'chainType'
    ]),
    hasObserve() {
      const { observeList, address } = this
      return observeList.find(item => item.address === address)
    }
  },
  mounted() {
    const address = this.$route.params.address
    if (address) {
      this.address = address
      this.active = 'history'
    } else {
      this.getObserveList()
    }
  },
  methods: {
    // 观察列表
    getObserveList() {
      const { chainType } = this
      observeList({ chain_type: chainType }).then(res => {
        this.observeList = res.data.list
        if (res.data.list.length > 0) {
          this.address = res.data.list[0].address
          this.getOverView()
        } else {
          this.overview = {}
        }
      })
    },
    //
    getOverView() {
      const { address } = this
      accountOverview({ address }).then(res => {
        this.overview = res.data
      })
      this.handleGetHistoryList()
    },
    // 交易历史
    handleGetHistoryList(page_no = 0) {
      const { address } = this
      tradeHistory({ address, page_no, page_size: 10 }).then(res => {
        this.tradeHistoryList = res.data.list
        this.paginationConfig.total = res.header.total
      })
    },
    // 搜索
    handleSearchAddress() {
      const { search, chainType } = this
      searchAddress({ address: search, chain_type: chainType }).then(res => {
        if (res.data.result) {
          this.address = search
          this.getOverView()
        }
      })
    },
    // 添加观察
    handleAddObserve() {
      const { address, chainType } = this
      addObserve({ address, chain_type: chainType }).then(res => {
        this.$message.success('加入观察成功')
        this.getObserveList()
      })
    },
    handleSizeChange(val) {
      this.paginationConfig.pageSize = val
      this.handleGetHistoryList()
    },
    handleCurrentChange(val) {
      this.paginationConfig.currentPage = val
      this.handleGetHistoryList(val - 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.box_container{
  padding:30px 30px;
  background: #fff;
}
.header{
  width:70%;
  display: flex;
  .head{
    width:100px;
    height:100px;
    border-radius: 50%;
    background: #c0c0c0;
    text-align: center;
    line-height: 100px;
    color: #fff;
  }
  .content{
    margin: 0 0 0 20px;
    .day{
      font-size: 16px;
      margin:10px 0;
    }
    .btn{
      display: inline-block;
      padding:5px 10px;
      border-radius: 20px;
      border:solid 1px #c0c0c0
    }
  }
  .overview{
    flex: 1; text-align: right;
    font-size: 20px;
    .svg-icon{
      margin:0 0 0 5px;
    }
    .price{
      font-size: 24px;
      margin:20px 0 0 0;
    }
  }

}
.search{
    border-radius: 20px;
    display: flex;
    justify-content: flex-end;
    position: relative;
    .el-input{
      width: 400px;

    }
    input{
      text-indent: 50px;
    }
    .svg-icon{
      position: absolute;
      right: 170px;
      z-index: 999;
      font-size: 20px;
    }
  }
  .content_box{
    margin:10px 0;
      padding:30px 30px;
      background: #fff;
  }
  .search_input{
    width: 80%;
    margin: 40px auto 100vh;
  }

</style>
