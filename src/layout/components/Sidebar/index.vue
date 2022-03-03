<!--
 * @Author: 
 * @Date: 2021-11-01 09:13:16
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-12-28 16:05:28
 * @FilePath: \\src\layout\components\Sidebar\index.vue
-->
<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :unique-opened="false"
        :collapse-transition="false"
        mode="vertical"
      >
        <template>
          <template v-for="route in permissionsRoutes">
            <sidebar-item v-if="route.children && (route.children.length>0 && route.redirect)" :key="route.path" :item="route" :base-path="route.path" />
          </template>
        </template>
      </el-menu>
    </el-scrollbar>
    <div class="userInfo">
      <router-link to="/userInfo">
        <div class="content"><svg-icon icon-class="userInfo" /><span v-if="sidebar.opened">个人中心</span></div>
      </router-link>
      <el-select v-if="sidebar.opened" v-model="chain_type" size="small" placeholder="请选择">
        <!-- <el-option :key="0" label="FIL" value="FIL" /> -->
        <el-option
          v-for="item in chain_list"
          :key="item"
          :disabled="item!== 'FIL'"
          :label="item"
          :value="item"
        />
      </el-select>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
import SvgIcon from '@/components/SvgIcon/index.vue'
import { getChainList } from '@/api/common'
export default {
  components: { SidebarItem, Logo, SvgIcon },
  data() {
    return {
      chain_type: 'FIL',
      chain_list: []
    }
  },
  computed: {
    ...mapGetters([
      'chainType',
      'sidebar',
      'managementType',
      'permissionsRoutes'
    ]),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  watch: {
    chain_type(val) {
      this.$store.dispatch('user/setChainType', val)
    }
  },
  mounted() {
    const { chainType } = this
    getChainList().then(res => {
      this.chain_list = res.data.list
    })
    if (!chainType) {
      this.chain_type = this.chain_list[0]
      this.$store.dispatch('user/setChainType', this.chain_type)
    } else {
      this.chain_type = chainType
    }
  },
  methods: {
  }
}
</script>
<style scoped lang="scss">
.userInfo{
  position: absolute;
    bottom: 0;
    width: 100%;
    height: 80px;
    // background-color: #000;
    color: #000;
    text-align: center;
    .content{
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
    .svg-icon{
      width: 20px;
      height: 20px;
    }
    div{
      font-size: 16px;
      margin: 0 0 10px 10px;
    }
    .el-select{
      width: 80%;
      border-radius: 40%;
    }
}
</style>
