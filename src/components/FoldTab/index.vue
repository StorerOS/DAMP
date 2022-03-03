<!--
 * @Author: your name
 * @Date: 2021-12-16 15:55:08
 * @LastEditTime: 2021-12-24 14:56:50
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \stoss-console\src\components\FoldTab\index.vue
-->
<template>
  <div class="fold_container">
    <div class="flex_box" @click="fold=!fold">
      <svg-icon icon-class="down" :class="fold?'icon_right':''" />
      <slot name="count" />
      <slot name="history" />

    </div>
    <div class="tab" :class="fold?'hidden':''">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fold: true
    }
  }

}
</script>

<style lang="scss" scoped>
.fold_container{
  border-bottom: 5px solid #fff;
}
.flex_box{
    display: flex;
    align-items: center;
    background-color: #f0f0f0;
    padding: 15px 20px;
    .svg-icon{
        font-size: 24px;
        transition: 0.2s;
    }
    div{
        margin:0 15px;
    }
    .history{
        color: #0079fe;
        cursor: pointer;
    }
    .icon_right{
        transform: rotate(90deg);
    }
}
.tab{
    border: 1px solid  #f0f0f0;
    padding: 10px;
}
.hidden{
    display: none;
}
</style>
