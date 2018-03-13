<template>
  <div>
    <el-menu
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      background-color="#F1F1F1"
      text-color="#666"
      active-text-color="#459ffc"
      default-active="1">
      <router-link to="/UserList/index">
        <el-menu-item index="1">
          <i class="el-icon-setting"></i>
          <span slot="title">版本列表</span>
        </el-menu-item>
      </router-link>
      <!--<router-link to="/GroupMan/index">-->
        <!--<el-menu-item index="2">-->
          <!--<i class="el-icon-setting"></i>-->
          <!--<span slot="title">群组管理</span>-->
        <!--</el-menu-item>-->
      <!--</router-link>-->
      <!--<router-link :to="{ name: 'IPList'}">-->
        <!--<el-menu-item index="3">-->
          <!--<i class="el-icon-menu"></i>-->
          <!--<span slot="title">授权管理</span>-->
        <!--</el-menu-item>-->
      <!--</router-link>-->
    </el-menu>
  </div>
</template>


<style>
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
</style>

<script>
  export default {
    data() {
      return {
        isCollapse: true
      };
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
</script>
