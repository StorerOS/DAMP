
<template>
  <div class="box_container">
    <div>
      <div class="flex_box"><div class="tit_box">容量总览</div><div class="time">更新时间2022-01-25 14:20:20</div></div>
      <div class="card_list">
        <div class="card_box">
          <div>总用量数</div>
          <div class="content">{{ summary.total || 0 }}</div>
        </div>
        <div class="card_box">
          <div>剩余可使用用量数</div>
          <div class="content">{{ summary.available || 0 }}</div>
        </div>
        <div class="card_box">
          <div>已使用用量数</div>
          <div class="content">{{ summary.used || 0 }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { usedManage } from '@/api/common'
export default {
  data() {
    return {
      summary: {}
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      usedManage({}).then(res => {
        this.summary = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.box_container{
  margin-top: 10px;
  padding:30px 30px;
  background: #fff;
  .tit_box{
    font-size: 24px;
  }
  .flex_box{
    display: flex;
    align-items: flex-end;
  }
  .time{
    margin: 0 0 0 20px;
  }
  .space_bwt{
    justify-content: space-between;
  }
  .card_list{
    display: flex;
    justify-content: space-between;
  }
  .card_box{
    background-color: #fff;
    border-radius: 20px;
    padding:20px;
    // width: 400px;
    width:33.3%;
    margin:20px;
    color: #999;
    display: inline-block;
    border: 1px solid #c0c0c0;
    .content{
      padding: 40px 0;
      font-size: 28px;
      font-weight: bold;
      color: #000;
    }
  }
  .chart{
    margin:20px;
    padding:20px;
    width:calc( 100%  - 40px );
    background-color: #fff;
    border-radius: 20px;
    .chart_title_box{
      display: flex;
      align-items: center;
      div{
        margin:0  30px 0  0;
      }
    }
    .lineChart{
      min-height: 400px;
      width: 100%;
    }
  }
}

</style>
