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
          label="名称"
          prop="trustName"
          >
        </el-table-column>
        <el-table-column
          label="IP"
          prop="trustIp"
          >
        </el-table-column>
        <el-table-column
          label="备注"
          prop="remark"
        >
        </el-table-column>
        <el-table-column
          label="创建人"
          prop="createUser"
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
      <div class="dialog">
        <el-dialog
          title="授权"
          :visible.sync="dialogVisible"
          width="30%">
          <el-form :model="form" label-position="right">
            <el-form-item label="名称" label-width="80px">
              <el-input v-model="form.trustName" auto-complete="off" style="width: 95%;"></el-input>
            </el-form-item>
            <el-form-item label="IP" label-width="80px">
              <el-input v-model="form.trustIp" auto-complete="off" style="width: 95%;"></el-input>
            </el-form-item>
            <el-form-item label="有效开始" label-width="80px">
              <el-date-picker
                v-model="form.validBegin"
                type="datetime"
                placeholder="选择有效开始"
                style="width: 95%;">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="有效结束" label-width="80px">
              <el-date-picker
                v-model="form.validEnd"
                type="datetime"
                placeholder="选择有效结束"
                style="width: 95%;">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="备注" label-width="80px">
              <el-input type="textarea" v-model="form.remark" auto-complete="off" style="width: 95%;"></el-input>
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
            search: '',
            currentPage:1,
            pageSize:10,
            totalCount: 30,
            tableData: [],
            dialogVisible: false,
            isEdite: false,
            form: {
              trustName:'',
              trustIp:'',
              remark:'',
              validBegin:'',
              validEnd:''
            }
          }
      },
      mounted(){
        this.getAllArticle()
      },
      methods: {
        getAllArticle(){
          let data = {
            pageSize: this.pageSize,
            currentPage: this.currentPage,
            trustName:this.search
          }
          this.$http.post('/trusted/page',data).then( (res) => {
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
        },
        add(){
          this.dialogVisible = true
          this.isEdite = false
          this.form = {
            trustName:'',
            trustIp:'',
            remark:'',
            validBegin:'',
            validEnd:''
          }
        },
        postEdite(){
          if(this.isEdite){
            let data = {
              trustId:this.form.trustId,
              trustName:this.form.trustName,
              trustIp:this.form.trustIp,
              remark:this.form.remark,
              validBegin:this.form.validBegin,
              validEnd:this.form.validEnd,
            }
            this.$http.put('/trusted',data).then( (res) => {
              if(res.data.status == 0) {
                this.$message.success('修改成功')
                this.dialogVisible = false
                this.getAllArticle()
              }
            })
          }else {
            this.$http.post('/trusted',this.form).then( (res) => {
              if(res.data.status == 0) {
                this.$message.success('新增成功')
                this.dialogVisible = false
                this.getAllArticle()
              }
            })
          }
        },
        handleDelete(index, row) {
          this.$http.delete('/trusted',{
              params:{
                id: row.trustId
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
        refresh(){
          this.$http.get('/trusted/refresh').then( (res) => {
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
</style>
