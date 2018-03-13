<template>
  <div class="article-wrapper">
    <div class="header">
      <!--<h1>文章共{{totalCount}}条</h1>-->
      <div class="search">
        <el-input
          clearable
          style="width: 200px"
          placeholder="请输入内容"
          prefix-icon="el-icon-search"
          v-model="search">
        </el-input>
        <el-button type="primary" @click="searchIp">搜索</el-button>
        <el-button type="success" @click="add">新增</el-button>
        <el-button @click="refresh">刷新缓存</el-button>
      </div>
    </div>
    <div class="table-list">
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          label="群组名称"
          prop="groupName"
        >
        </el-table-column>
        <el-table-column
          label="群组地址"
          prop="mailGroup"
        >
        </el-table-column>
        <el-table-column
          label="账户列表">
          <template slot-scope="scope">
            <span style="color: #459ffc;cursor: pointer;" @click="showList(scope.row)">点击查看</span>
          </template>
        </el-table-column>
        <el-table-column
          label="备注"
          prop="remark"
        >
        </el-table-column>
        <el-table-column
          label="创建时间">
          <template slot-scope="scope">
            <span>{{(new Date(scope.row.createTime)).Format("yyyy-M-d h:m:s")}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="有效开始">
          <template slot-scope="scope">
            <span>{{(new Date(scope.row.validBegin)).Format("yyyy-M-d h:m:s")}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="有效结束">
          <template slot-scope="scope">
            <span>{{(new Date(scope.row.validEnd)).Format("yyyy-M-d h:m:s")}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="180">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
      <div class="groupDialog">
        <el-dialog
          title="群组"
          :visible.sync="dialogVisible"
          width="550px"
          v-if="dialogVisible">
          <el-form :model="form" label-position="right">
            <el-form-item label="群组名称" label-width="100px">
              <el-input v-model="form.groupName" auto-complete="off" style="width: 90%;"></el-input>
            </el-form-item>
            <el-form-item label="群组地址" label-width="100px">
              <el-input v-model="form.mailGroup" auto-complete="off" style="width: 90%;"></el-input>
            </el-form-item>
            <el-form-item label="有效开始" label-width="100px">
              <el-date-picker
                v-model="form.validBegin"
                type="datetime"
                placeholder="选择有效开始"
                style="width: 90%;">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="有效结束" label-width="100px">
              <el-date-picker
                v-model="form.validEnd"
                type="datetime"
                placeholder="选择有效结束"
                style="width: 90%;">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="备注" label-width="100px">
              <el-input type="textarea" v-model="form.remark" auto-complete="off" style="width: 90%;"></el-input>
            </el-form-item>
            <h3 style="text-align: center;padding-bottom: 20px;">选择账户</h3>
            <el-transfer :filterable="true" v-model="form.mailLists" :data="transferData" :titles="['未选', '已选']"></el-transfer>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="postEdite">确 定</el-button>
          </span>
        </el-dialog>
      </div>
      <div class="listDialog">
        <el-dialog title="账户列表" :visible.sync="listDialogVisible" width="30%">
          <el-table :data="listData" max-height="500">
            <el-table-column property="name" label="账户" align="center"></el-table-column>
          </el-table>
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
        search: '',
        currentPage:1,
        pageSize:10,
        totalCount: 30,
        tableData: [],
        dialogVisible: false,
        listDialogVisible: false,
        isEdite: false,
        form: {
          groupName:'',
          mailGroup:'',
          remark:'',
          validBegin:'',
          validEnd:'',
          mailLists: []
        },
        listData:[],
        transferData: [],
        groupId: null
      }
    },
    mounted(){
      this.getAllArticle()
      this.searchNotSelected()
    },
    methods: {
      getAllArticle(){
        let data = {
          pageSize: this.pageSize,
          currentPage: this.currentPage,
          groupName:this.search
        }
        this.$http.post('/mail/page',data).then( (res) => {
          if(res.data.status == 0) {
            this.totalCount = Number(res.data.result.totalCount)
            this.tableData = res.data.result.result
          }
        })
      },
      handleEdit(index, row) {
        this.dialogVisible = true
        this.isEdite = true
        this.form = row
        if(!(this.form.mailLists instanceof Array)){
          this.form.mailLists = this.form.mailLists.split(',')
          console.log(this.form.mailLists)
        }
        this.groupId = row.groupId
        console.log(this.form)
      },
      add(){
        this.dialogVisible = true
        this.isEdite = false
        this.form = {
          groupName:'',
          mailGroup:'',
          remark:'',
          validBegin:'',
          validEnd:'',
          mailLists: []
        }
      },
      postEdite(){
        if(this.isEdite){
          let data = {
            groupName:this.form.groupName,
            mailGroup:this.form.mailGroup,
            remark:this.form.remark,
            validBegin:this.form.validBegin,
            validEnd:this.form.validEnd,
            mailLists: this.form.mailLists.join(','),
            groupId: this.groupId
          }
          this.$http.put('/mail',data).then( (res) => {
            if(res.data.status == 0) {
              this.$message.success('修改成功')
              this.dialogVisible = false
              this.getAllArticle()
            }
          })
        }else {
          let data = {
            groupName:this.form.groupName,
            mailGroup:this.form.mailGroup,
            remark:this.form.remark,
            validBegin:this.form.validBegin,
            validEnd:this.form.validEnd,
            mailLists: this.form.mailLists.join(','),

          }
          this.$http.post('/mail',data).then( (res) => {
            if(res.data.status == 0) {
              this.$message.success('新增成功')
              this.dialogVisible = false
              this.getAllArticle()
            }
          })
        }
      },
      handleDelete(index, row) {
        this.$http.delete('/mail',{
          params:{
            id: row.groupId
          }
        }).then( (res) => {
          if(res.data.status == 0){
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
      searchIp(data){
        this.getAllArticle()
      },
      showList(data){
        this.listDialogVisible = true
        this.listData = []
        if(data.mailLists != ''){
          if(!(data.mailLists instanceof Array)) {
            let arr = data.mailLists.split(',')
            arr.forEach(item => {
              this.listData.push({
                name: item
              })
            })
          }else{
            data.mailLists.forEach(item => {
              this.listData.push({
                name: item
              })
            })
          }
        }
      },
      searchNotSelected(){
        this.$http.post('/mail/notselected').then( (res) => {
          if(res.data.status == 0) {
            const postData = res.data.result.result
            const data = [];
            postData.forEach(item=>{
              data.push({
                key: item.userName,
                label: item.userName.split('@')[0]
              })
            })
            this.transferData = data
            this.form.mailLists = []
          }
        })
      },
      searchSelected(id){
        let data = {
            id: id
        }
        this.$http.post('/mail/selected',data).then( (res) => {
          if(res.data.status == 0) {
            const postData = res.data.result.result
            const data = [];
            postData.forEach(item=>{
              data.push({
                key: item,
                label: item.split('@')[0]
              })
            })
            this.form.mailLists = data
          }
        })
      },
      refresh(){
        this.$http.get('/mail/refresh').then( (res) => {
          if(res.data.status == 0) {
              this.$message.success('刷新成功')
          }else{
            this.$message.success('刷新失败')
          }
        })
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
  .el-dialog__body {
    padding-top:0;
  }
  .el-transfer {
    text-align: center;

  }
</style>
<style lang="scss">
  .listDialog {
    .el-dialog__body {
      padding-top:0;
    }
  }
</style>
<style lang="scss">
  .groupDialog {
    .el-transfer-panel__header {
      text-align: left;
    }
    .el-transfer-panel__body {
      text-align: left;
    }
  }
</style>
