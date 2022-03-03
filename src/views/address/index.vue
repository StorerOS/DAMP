<template>
  <div class="tableContainer">
    <div class="tableList">
      <div class="header"><div>地址本</div><el-button type="primary" size="default" @click="handleShowDialog('add')"><svg-icon icon-class="icon_add" />添加地址</el-button></div>
      <el-table :data="addressList" border stripe>
        <el-table-column prop="address" label="地址" />
        <el-table-column prop="tag_name" label="标签">
          <template slot-scope="scope">
            <div>{{ scope.row.tag_name }} <svg-icon icon-class="edit" @click="handleShowDialog('edit',scope.row)" /></div>
          </template>
        </el-table-column>
        <el-table-column prop="balance" label="账户余额" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column prop="created_time" label="添加时间" />
        <el-table-column label="操作">
          <template slot-scope="scope" class="btnList">
            <el-button v-if="!scope.row.observed" type="text" size="small" @click="handleAddAddress(scope.row.address)">加入观察</el-button>
            <el-button v-else type="text" size="small" @click="handleCloseAddress(scope.row.address)">取消观察</el-button>
            <router-link :to="{ name: 'Account', params: { address: scope.row.address }}"><el-button type="text" size="small">查看交易记录</el-button></router-link>
            <el-button type="text" size="small" @click="handleDeleteAddress(scope.row.address)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
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
      <add-dialog ref="dialog" :type="dialogConfig.dialogType" :info="dialogConfig.dialogInfo" @success="$_Mixin_search" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import { addObserve, delObserve } from '@/api/common'
import { addressList, deleteAddress } from '@/api/address'
import SvgIcon from '@/components/SvgIcon/index.vue'
import addDialog from './dialog'
import paginatMixin from '@/mixin/pagination'

export default {
  components: {
    addDialog,
    SvgIcon
  },
  mixins: [paginatMixin],

  data() {
    return {
      addressList: [],
      dialogConfig: {
        dialogInfo: {},
        dialogType: ''
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
      this.getTableList()
    }
  },
  mounted() {
    this.getTableList()
  },
  methods: {
    handleCloseAddress(address) {
      const { chainType } = this
      delObserve({ address, chain_type: chainType }).then(res => {
        this.$message.success('取消观察成功')
        this.$_Mixin_search()
      })
    },
    handleAddAddress(address) {
      const { chainType } = this
      addObserve({ address, chain_type: chainType }).then(res => {
        this.$message.success('添加观察成功')
        this.$_Mixin_search()
      })
    },
    handleDeleteAddress(address) {
      this.$confirm('此操作将永久删除该地址在地址簿, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        deleteAddress({ address }).then(res => {
          this.$message({ type: 'success', message: '删除成功!' })
          this.getTableList()
        })
      })
    },
    handleShowDialog(type = 'add', info = {}) {
      if (type === 'edit') {
        this.dialogConfig.dialogInfo = info
      }
      this.dialogConfig.dialogType = type
      this.$refs.dialog.visible = true
    },
    getTableList(page_no = 0) {
      const { chainType } = this
      const { pageSize } = this.paginationMixin
      addressList({ page_no, page_size: pageSize, chain_type: chainType }).then(res => {
        this.paginationMixin.total = res.header.total
        this.addressList = res.data.list
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .tableContainer{

    .title{
      font-size: 34px;
      font-weight: bold;
      border-bottom: 1px solid #ccc;
      padding: 20px 0;
      margin: 0 0 20px 0;
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
