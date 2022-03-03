<template>
  <div class="tableContainer">
    <div class="tableList">
      <div class="header">
        <div>告警规则</div>
        <el-button type="primary" size="default" @click="handleShowDialog('add')"> <svg-icon icon-class="add-bold" />添加规则</el-button>
      </div>
      <el-table :data="rulesList" border stripe>
        <el-table-column align="center" label="所属账号" prop="address" />
        <el-table-column align="center" label="规则内容" prop="rule_content" />
        <el-table-column align="center" label="添加时间" prop="created_time" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleShowDialog('edit',scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="handleDelete(scope.row.id)">删除</el-button>
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
    <rulesDialog ref="dialog" :type="dialogConfig.type" :data="dialogConfig.data" @success="$_Mixin_search" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import { getAlertRuleList, delAlertRule } from '@/api/chain'
import paginatMixin from '@/mixin/pagination'
import rulesDialog from './rulesDialog.vue'

export default {
  components: {
    rulesDialog
  },
  mixins: [paginatMixin],
  data() {
    return {
      rulesList: [],
      dialogConfig: {
        type: 'add',
        data: {}
      }
    }
  },
  computed: {
    ...mapGetters([
      'chainType'
    ])
  },
  mounted() {
    this.getTableList()
  },
  methods: {
    handleShowDialog(type = 'add', data = {}) {
      this.dialogConfig.type = type
      this.dialogConfig.data = data
      this.$refs.dialog.visible = true
    },
    resetForm() {
      this.$_Mixin_search()
    },
    handleDelete(id) {
      this.$confirm('该操作将会删除此预警项？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        delAlertRule({
          id
        }).then(res => {
          this.$message.success('删除成功')
          this.getTableList()
        })
      })
    },
    getTableList(page_no = 0) {
      getAlertRuleList({ }).then(res => {
        this.paginationMixin.total = res.header.total
        this.rulesList = res.data.list || []
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
