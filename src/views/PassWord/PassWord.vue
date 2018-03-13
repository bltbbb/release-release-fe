<template>
    <div class="changePWD">
      <div class="change-main">
        <h1>修改密码</h1>
        <el-form :model="form" label-position="right" :rules="rules" ref="ruleForm" :status-icon="true">
          <el-form-item label="账户" label-width="80px" prop="mailbox">
            <el-input v-model="form.mailbox" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="旧密码" label-width="80px" prop="pwd">
            <el-input v-model="form.pwd" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="新密码" label-width="80px" prop="newPwd">
            <el-input v-model="form.newPwd" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="postEdite">确 定</el-button>
      </div>
    </div>
</template>

<script>
    export default {
        data(){
            return {
              form: {
                mailbox:'',
                pwd:'',
                newPwd:'',
              },
              rules: {
                mailbox: [
                  { required: true, message: '请输入账户名', trigger: 'blur' },
                ],
                pwd: [
                  { required: true, message: '请输入旧密码', trigger: 'blur' },
                ],
                newPwd: [
                  { required: true, message: '请输入新密码', trigger: 'blur' },
                ],
              }
            }
        },
        methods:{
          postEdite(){
            this.$refs.ruleForm.validate((valid) => {
              if (valid) {

              }else {
                return false;
              }
            });
            this.$http.post('/update/mailboxbyUser',this.form).then( (res) => {
              if(res.data.result.code == 200) {
                this.$message.success('修改成功')
              }else{
                this.$message.error(res.data.result.desc)
              }
            })
          }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .change-main {
    width: 500px;
    padding: 30px;
    border: 1px solid #ddd;
    margin: 0 auto;
    position: relative;
    top: 240px;
    text-align: center;
    background: #fff;
    h1 {
      font-size:24px;
      padding-bottom: 30px;
    }
  }
</style>
