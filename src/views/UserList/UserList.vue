<template>
  <div class="article-wrapper">
    <div class="header">
      <!--<h1>文章共{{totalCount}}条</h1>-->
      <div class="search">
        <el-select v-model="searchPlate" placeholder="请选择平台类型" @change="searchPlateChange">
          <el-option
            v-for="item in platIdData"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="searchApp" placeholder="请选择App">
          <el-option
            v-for="item in allAppIdData"
            :key="item.id"
            :label="item.appName"
            :value="item.id">
          </el-option>
        </el-select>
        <el-input
          clearable
          style="width: 200px"
          placeholder="请输入版本"
          prefix-icon="el-icon-search"
          v-model="searchVersion">
        </el-input>
        <el-button type="primary" @click="searchIp">搜索</el-button>
        <el-button type="primary" @click="reset">重置</el-button>
        <el-button type="success" @click="add">新增</el-button>

      </div>
    </div>
    <div class="table-list">
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          label="平台类型"
          prop="appPlatName"
        >
        </el-table-column>
        <el-table-column
          label="App"
          prop="appName"
        >
        </el-table-column>
        <el-table-column
          label="App版本"
          width="80"
          prop="appVersion"
        >
        </el-table-column>
        <el-table-column
          label="发布时间"
        >
          <template slot-scope="scope">
            <span>{{new Date(Number(scope.row.deployDate)).Format("yyyy-MM-dd hh:mm:ss")}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="安装包大小(kb)"
          prop="fullSize"
        >
        </el-table-column>
        <el-table-column
          label="补丁包大小(kb)"
          prop="patchSize"
        >
        </el-table-column>
        <el-table-column
          label="安装包更新路径"
          prop="fullInstall"
        >
        </el-table-column>
        <el-table-column
          label="补丁包更新路径"
          prop="patchInstall"
        >
        </el-table-column>
        <el-table-column
          label="满足下载补丁包的版本"
          prop="fastMinVersion"
        >
        </el-table-column>
        <el-table-column
          label="强制更新最大版本"
          prop="mustMaxVersion"
        >
        </el-table-column>
        <el-table-column
          label="忽略更新的版本"
          prop="ignoreVersions"
        >
        </el-table-column>
        <el-table-column
          label="MD5"
          prop="fileMd5"
        >
        </el-table-column>
        <el-table-column
          label="更新日志"
          prop="deployLog"
        >
        </el-table-column>
        <el-table-column
          label="入库时间"
        >
          <template slot-scope="scope">
            <span>{{new Date(Number(scope.row.cTime)).Format("yyyy-MM-dd hh:mm:ss")}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="80"
          fixed="right">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <!--<el-button-->
              <!--size="mini"-->
              <!--type="danger"-->
              <!--@click="handleDelete(scope.$index, scope.row)">删除</el-button>-->
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrapper" v-if="tableData.length > 0">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount">
        </el-pagination>
      </div>
      <div class="dialog">
        <el-dialog
          title="账户"
          :visible.sync="dialogVisible"
          width="30%">
          <el-form :model="form" label-position="right">
            <el-form-item label="平台类型" label-width="140px">
              <el-select v-model="form.appPlatId" placeholder="请选择" @change="changePlatId" style="width:95%">
                <el-option
                  v-for="item in platIdData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="App" label-width="140px">
              <el-select v-model="form.appId" placeholder="请选择" style="width:95%">
                <el-option
                  v-for="item in appIdData"
                  :key="item.id"
                  :label="item.appName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="版本" label-width="140px">
              <el-input type="text" v-model="form.appVersion" auto-complete="off" style="width:95%"></el-input>
            </el-form-item>
            <el-form-item label="发布时间" label-width="140px">
              <el-date-picker
                v-model="form.deployDate"
                type="datetime"
                placeholder="选择发布时间"
                style="width:95%">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="满足下载补丁包版本" label-width="140px">
              <el-input type="text" v-model="form.fastMinVersion" auto-complete="off" style="width:95%"></el-input>
            </el-form-item>
            <el-form-item label="强制更新最大版本" label-width="140px">
              <el-input type="text" v-model="form.mustMaxVersion" auto-complete="off" style="width:95%"></el-input>
            </el-form-item>
            <el-form-item label="忽略更新版本" label-width="140px">
              <el-input type="text" v-model="form.ignoreVersions" auto-complete="off" style="width:95%"></el-input>
            </el-form-item>
            <el-form-item label="更新日志" label-width="140px">
              <el-input type="textarea" v-model="form.deployLog" auto-complete="off" style="width:95%"></el-input>
            </el-form-item>
            <el-form-item label="" label-width="140px">
              <div class="fullInstall1" style="height: 40px;">
                <label for="fullInstall1" class="installBtn" :style="{background: btnBKG}" style="border-radius: 3px;width:95%;height: 40px;display: inline-block;color: #fff;text-align: center;line-height: 40px;"><i class="el-icon-upload" style="padding-right: 10px;font-size: 18px;"></i>{{labelText}}</label>
                <input type="file" id="fullInstall1" style="display: none;visibility: hidden;" @change="tirggerFile($event)">
              </div>
            </el-form-item>
            <el-form-item label="" label-width="140px">
              <div class="patchInstall" style="height: 40px;">
                <label for="patchInstall" class="installBtn" :style="{background: btnBKG2}" style="border-radius: 3px;width:95%;height: 40px;display: inline-block;color: #fff;text-align: center;line-height: 40px;"><i class="el-icon-upload" style="padding-right: 10px;font-size: 18px;"></i>{{labelText2}}</label>
                <input type="file" id="patchInstall" style="display: none;visibility: hidden;" @change="tirggerFile2($event)">
              </div>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="postEdite">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data(){
      return {
        number: 0,
        searchPlate:'',
        searchApp:'',
        searchVersion:'',
        currentPage:1,
        pageSize:10,
        totalCount: 30,
        tableData: [],
        dialogVisible: false,
        isEdite: false,
        form: {
          appPlatId:'',
          appId:'',
          appVersion:'',
          deployDate:'',
          fastMinVersion:'',
          mustMaxVersion:'',
          ignoreVersions:'',
          deployLog:'',
          file1: null,
          file2: null,
        },
        platIdData:[],
        appIdData:[],
        allAppIdData:[],
        labelText:'上传安装包',
        labelText2:'上传补丁包',
        btnBKG:'#0084ff',
        btnBKG2:'#0084ff',
      }
    },
    mounted(){
      this.getAllArticle()
      this.init()
    },
    methods: {
      init(){
        this.getPlatIdData()
        this.getAllAppIdData()
      },
      getAllArticle(){
        let data = {
          pageSize: this.pageSize,
          currentPage: this.currentPage,
          appPlatId: this.searchPlate,
          appId: this.searchApp,
          appVersion: this.searchVersion,
        }
        this.$http.post('/confAppDeploy/page',data).then( (res) => {
            if(res.data.status == 0){
              this.totalCount = Number(res.data.result.totalCount)
              this.tableData = res.data.result.result
            }
        })
      },
      getPlatIdData(){
        this.$http.get('/dimAppPlat').then( (res) => {
          if(res.data.result.status != 0){
            this.platIdData = res.data.result.result
          }
        })
      },
      getAppIdData(fn){
        this.$http.get('/confAppInfo',{
          params:{
            appPlatId: this.form.appPlatId
          }
        }).then( (res) => {
          if(res.data.result.status != 0){
            this.appIdData = res.data.result.result
            this.form.appId = this.appIdData[0].id
            if(fn){
                fn()
            }
          }
        })
      },
      getAllAppIdData(){
        this.$http.get('/confAppInfo',{
          params:{
            appPlatId: ''
          }
        }).then( (res) => {
          if(res.data.result.status != 0){
            this.allAppIdData = res.data.result.result
          }
        })
      },
      changePlatId(){
        this.getAppIdData()
      },
      tirggerFile(e){
        let file = event.target.files[0];
        this.labelText = file.name
        this.form.file1 = file;
      },
      tirggerFile2(e){
        let file = event.target.files[0];
        this.labelText2 = file.name
        this.form.file2 = file;
      },
      postForm(){
        let formData = new FormData();
        formData.append('appPlatId', this.form.appPlatId);
        formData.append('appId', this.form.appId);
        formData.append('appVersion', this.form.appVersion);
        formData.append('deployDate', this.form.deployDate.getTime());
        formData.append('fastMinVersion', this.form.fastMinVersion);
        formData.append('mustMaxVersion', this.form.mustMaxVersion);
        formData.append('ignoreVersions', this.form.ignoreVersions);
        formData.append('deployLog', this.form.deployLog);
        formData.append('fullInstallFile', this.form.file1);
        formData.append('patchInstallFile', this.form.file2);

        let config = {
          headers: {
            'Content-Type': 'multipart/form-data',
            'shouldQs': false
          }
        }
        this.$http.post('/confAppDeploy',formData,config).then( (res) => {
          if(res.data.status == 0){
            this.dialogVisible = false
            this.getAllArticle()
            this.$message.success('新增成功')
          }else {
            this.$message.error(res.data.result.result.message)
          }
        })
      },
      editeForm(){
        let formData = new FormData();
        formData.append('id', this.form.id);
        formData.append('appPlatId', this.form.appPlatId);
        formData.append('appId', this.form.appId);
        formData.append('appVersion', this.form.appVersion);
        formData.append('deployDate', new Date(this.form.deployDate).getTime());
        formData.append('fastMinVersion', this.form.fastMinVersion);
        formData.append('mustMaxVersion', this.form.mustMaxVersion);
        formData.append('ignoreVersions', this.form.ignoreVersions);
        formData.append('deployLog', this.form.deployLog);
        !this.form.file1 ? '' : (formData.append('fullInstallFile', this.form.file1));
        !this.form.file2 ? '' : (formData.append('patchInstallFile', this.form.file2));

        let config = {
          headers: {
            'Content-Type': 'multipart/form-data',
            'shouldQs': false
          }
        }
        this.$http.post('/confAppDeploy/update',formData,config).then( (res) => {
          if(res.data.status == 0){
            this.dialogVisible = false
            this.getAllArticle()
            this.$message.success('修改成功')
          }else {
            this.$message.error(res.data.result.result.message)
          }
        })
      },
      handleEdit(index, row) {
        this.dialogVisible = true
        this.isEdite = true
        this.form = {
          ...row
        }
        this.getAppIdData()
        let time = (new Date(Number(row.deployDate))).Format("yyyy-MM-dd hh:mm:ss")

        if(this.form.installPackage){
          this.labelText = this.form.installPackage
          this.btnBKG = '#47B884'
        }else {
          this.labelText = '上传安装包'
          this.btnBKG = '#0084ff'
        }
        if(this.form.patchPackage){
          this.labelText2 = this.form.patchPackage
          this.btnBKG2 = '#47B884'
        }else {
          this.labelText2 = '上传补丁包'
          this.btnBKG2 = '#0084ff'
        }

        this.form.deployDate = time
        this.form.oldPSW = ''
        this.form.newPSW = ''
        this.form.reNewPSW = ''
      },
      add(){
        this.dialogVisible = true
        this.isEdite = false
        this.form = {
          appPlatId:'',
          appId:'',
          appVersion:'',
          deployDate:'',
          fastMinVersion:'',
          mustMaxVersion:'',
          ignoreVersions:'',
          deployLog:'',
          file1: null,
        }
      },
      postEdite(){
        if(this.isEdite){
          this.editeForm()
        }else {
          this.postForm()
        }
      },
      handleDelete(index, row) {
        let data = {
          mailbox: row.userName
        }
        this.$http.post('/del/mailbox',data).then( (res) => {
          if(res.data.result.code == 200){
            this.$message.success('删除成功')
            this.getAllArticle()
          }
        })
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.getAllArticle()
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.getAllArticle()
      },
      handleCommand(command) {
        if(command == 'a'){
          this.$router.push('/IPList/NewArticle/Img/123')
        }
        if(command == 'b'){
          this.$router.push('/IPList/NewArticle/Text/123')
        }
      },
      searchIp(){
        this.getAllArticle()
      },
      searchPlateChange(data){
        this.form.appPlatId = data
        this.getAppIdData(()=>{this.allAppIdData = {...this.appIdData}})
      },
      reset(){
        this.searchApp = ''
        this.searchPlate = ''
        this.searchVersiong = ''
        this.getAllAppIdData()
        this.getAllArticle()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .header {
    overflow: hidden;
    height:40px;
    margin-bottom: 30px;
    h1 {
      float: left;
      font-size: 20px;
      line-height: 40px;
    }
    .search {
      float: left;
    }
  }
  .installBtn {
    cursor: pointer;
  }
</style>
<style lang="scss">
  .article-wrapper {
    .dialog {
      .fileInput {
        .el-input__inner {
          border : none
        }
      }

    }
  }

</style>
