<template>
  <div class="tableContainer">
    <!-- <div class="tableList">
      <div class="header"><div>预警通知</div></div>
      <el-table :data="chainList" border stripe class="chainList">
        <el-table-column align="center" label="资产名称">
          <template slot-scope="scope"><div>{{ scope.row }}</div></template>
        </el-table-column>
        <el-table-column align="center" label="预警值">
          <template slot-scope="scope" class="btnList">
            <el-button type="text" size="small" @click="handleShowDialog(scope.row.address)">规则</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div> -->

    <div class="tableList">
      <div class="header"><div>通知记录</div></div>
      <div class="heander">
        <div class="flex_box">
          <el-form ref="ruleForm" :inline="true" :model="search">
            <el-form-item label="钱包地址：" prop="address">
              <el-select v-model="search.address">
                <el-option :key="9999" label="全部" value="" />
                <el-option
                  v-for="item in addressList"
                  :key="item.address"
                  :label="item.address"
                  :value="item.address"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="交易类型：" prop="tx_type">
              <el-select v-model="search.tx_type">
                <el-option
                  v-for="(item,index) in txTypeList"
                  :key="item"
                  :label="item"
                  :value="index"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="交易资产:" prop="project">
              <el-select v-model="search.project">
                <el-option :key="9999" label="全部" value="" />
                <el-option
                  v-for="item in chainList"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-form>
          <div>
            <el-button type="primary" size="default" @click="$_Mixin_search">查询</el-button>
            <el-button size="default" @click="resetForm()">重置</el-button>
          </div>
        </div>
      </div>

      <el-table :data="alertLogList" border stripe>
        <el-table-column align="center" label="交易资产" prop="project" />
        <el-table-column align="center" label="通知时间" prop="notify_time">
          <template slot-scope="scope">
            <div>{{ scope.row.notify_time *1000 | parseTime($event,'yyyy-mm-dd') }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="消息ID" prop="msg_id" />
        <el-table-column align="center" label="发送地址" prop="from_addr" />
        <el-table-column align="center" label="接收地址" prop="to_addr" />
        <el-table-column align="center" label="数额" prop="amount" />
        <el-table-column align="center" label="预警规则" prop="tx_type">
          <template slot-scope="scope">
            <div>{{ scope.row.rule_type }}</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination_box">
      <el-pagination
        :current-page="paginationMixin.currentPage"
        :page-sizes="paginationMixin.pageSizes"
        :page-size="paginationMixin.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="paginationMixin.total"
        @size-change="$_paginationMixin_handleSizeChange"
        @current-change="$_paginationMixin_handleCurrentChange"
      />
    </div>
    <rulesDialog ref="dialog" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import { getChainList, getAlertLogList } from '@/api/chain'
import paginatMixin from '@/mixin/pagination'
import { addressList } from '@/api/address'
import rulesDialog from './dialog'
import { parseTime } from '@/utils'
export default {
  components: {
    rulesDialog
  },
  filters: {
    parseTime,
    txType(val) {
      let str = ''
      switch (val) {
        case 1:
          str = '转出'
          break
        case 2:
          str = '转入'
          break
        case 3:
          str = '余额'
          break
      }
      return str
    }
  },
  mixins: [paginatMixin],
  data() {
    return {
      chainList: [],
      addressList: [],
      alertLogList: [],
      txTypeList: ['全部', '转出告警', '转入告警'],
      search: {
        address: '',
        tx_type: 0,
        project: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'chainType'
    ])
  },
  watch: {
    chainType() {
      this.getData()
      this.getTableList()
    }
  },
  mounted() {
    this.getData()
    this.getTableList()
  },
  methods: {
    handleShowDialog() {
      this.$refs.dialog.visible = true
    },
    resetForm() {
      this.search = {
        address: '',
        tx_type: 0,
        project: ''
      }
      this.$_Mixin_search()
    },
    getData() {
      const { chainType } = this
      addressList({ chain_type: chainType }).then(res => {
        this.addressList = res.data.list
      })
      getChainList({ chain_type: chainType }).then(res => {
        this.chainList = res.data.list
      })
    },
    getTableList(page_no = 0) {
      const { pageSize } = this.paginationMixin
      const { chainType } = this
      getAlertLogList({ page_no, page_size: pageSize, chain_type: chainType, ...this.search }).then(res => {
        this.paginationMixin.total = res.header.total
        this.alertLogList = res.data.alert_list
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .tableContainer{
    .chainList{
      width: 50%;
      margin:0 auto;
    }
    .heander{
      background-color: #fff;
      border-radius: 4px;
      padding: 20px;
      .el-form-item{
           margin-bottom: 0;
      }
    }
    .tableList{
      background-color: #fff;
      border-radius: 4px;
      padding: 20px;
      margin: 10px 0 0;
      .header{
        display: flex;
        justify-content: space-between;
        font-size: 22px;
        margin:  0 0 20px;
        .svg-icon{
          margin-right: 10px;
        }
      }
    }
  }
  .flex_box,.el-form{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  ::v-deep .el-button--text{
      margin-right: 15px;
    }
</style>
