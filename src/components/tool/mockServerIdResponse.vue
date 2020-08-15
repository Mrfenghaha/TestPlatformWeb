<template>
  <div class="response_page">
    <el-button style="position:absolute;margin-left: 40%" type="primary"><i class="el-icon-circle-plus-outline"></i> 添加</el-button>
    <el-card class="response_card">
      <el-form :model="form" ref="form" :rules="rules" label-width="70px">
        <el-row>
          <el-col :span="5">
            <div class="response">
              <el-popover
                ref="popover"
                placement="right"
                title="替换参数说明"
                width="190"
                trigger="hover"
                :content="params">
              </el-popover>
              <el-link :underline="false" >
                <i class="el-icon-warning" v-popover:popover></i>
              </el-link>
              响应代码:{{form.code}}
            </div>
            <div v-if="!cardEditMode">
              <i class="el-icon-edit response_edit" @click="response_edit()"></i>
              <template>
                <i class="el-icon-delete response_delete" @click="response_delete(form)"></i>
              </template>
            </div>
            <div v-if="cardEditMode">
              <el-link class="response_cancel" @click="cancelSubmit()">取消</el-link>
              <el-link class="response_save" @click="saveSubmit(form)">保存</el-link>
            </div>
          </el-col>
          <el-col :span="19">
            <div v-if="!cardEditMode" style="text-align:left;">
              <el-form-item class="response_remark" label="描述">{{form.remark}}</el-form-item>
              <el-form-item class="response_status" label="状态码">{{form.status}}</el-form-item>
              <el-form-item class="response_headers" label="Headers">{{form.headers}}</el-form-item>
              <el-form-item class="response_body" label="Body">{{form.body}}</el-form-item>
            </div>
            <div v-if="cardEditMode">
              <el-form-item class="response_remark" label="描述" prop="remark"
                :rules="{required: true, message: '请输入Response描述信息'}">
                <el-input v-model="form.remark"  placeholder="请输入描述信息"></el-input>
              </el-form-item>
              <el-form-item class="response_status" label="状态码" prop="status"
                :rules="{required: true, message: '请选择Response响应状态'}">
                <el-select style="width: 100%" v-model="form.status" placeholder="请选择返回状态码">
                  <el-option
                    v-for="item in status"
                    :label="item.label"
                    :key="item.value"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="response_headers" label="Headers" prop="headers">
                <el-input
                  type="textarea"
                  :rows="1"
                  placeholder="请输入Response的Headers"
                  v-model="form.headers"
                  autocomplete="off">
                </el-input>
              </el-form-item>
              <el-form-item class="response_body" label="Body" prop="body">
                <el-input
                  type="textarea"
                  :rows="3"
                  placeholder="请输入Response的Body"
                  v-model="form.body"
                  autocomplete="off">
                </el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {toolMockServerGetConfigs, toolMockServerGetRespList, toolMockServerUpdateResp, toolMockServerDelResp} from '../../api'

export default {
  name: "mockServerResponse",
  inject: ['reload'],

  methods: {
    getConfigs() {
      toolMockServerGetConfigs().then((response) => {
        response = response.data;
        if (response.success === true) {
          var status = new Array()
          for(var i=0;i<response.data.resp_status.length;i++){
            var data = response.data.resp_status[i]
            status.push({
              "label": data,
              "value": data,
            }
          )}
          this.status = status

          var params = ''
          for(var i=0;i<response.data.replace_param.length;i++){
            var param = response.data.replace_param[i].param
            var remark = response.data.replace_param[i].remark
            params = params + param+ ":" + remark + "\n"
          }
          this.params = params
        }
      }).catch(err => {
        // 对于200之外的错误status，需要添加err获取接口数据
        this.$message({type: 'error',message: err.response.data.error_message})
      })
    },

    getData(){
      toolMockServerGetRespList(this.mock_id).then((response) => {
        response = response.data;
        if (response.success === true) {
          var data = response.data[0]
          var form = {
            id: data.id,
            code: data.resp_code,
            remark: data.remark,
            status: data.resp_status,
            headers: data.resp_headers,
            body: data.resp_body
          }
          this.form = form
        }
      }).catch(err => {
        // 对于200之外的错误status，需要添加err获取接口数据
        this.$message({type: 'error',message: err.response.data.error_message})
      })
    },

    response_edit(){
      this.cardEditMode = true
    },

    response_delete(FormName) {
      this.$confirm('此操作将删除该Response, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        toolMockServerDelResp(this.mock_id,FormName.id).then((response) => {
          response = response.data;
          if (response.success === true) {
          this.reload()
          this.$message({type: 'success', message: '删除成功!'});
          }
        }).catch(err => {
          this.$message({type: 'error',message: err.response.data.error_message})
        })
      }).catch(() => {
        this.$message({type: 'info', message: '已取消删除'});          
      });
    },

    cancelSubmit(){
      this.reload()
      this.$message({type: 'info', message: '已取消修改'});  
    },

    saveSubmit(FormName){
      toolMockServerUpdateResp(FormName.id, this.mock_id, FormName.code, FormName.status, FormName.headers, FormName.body, FormName.remark).then((response) => {
        response = response.data;
        if (response.success === true) {
          this.reload()
          this.$message({type: 'success', message: '修改成功!'});
        }
      }).catch(err => {
        // 对于200之外的错误status，需要添加err获取接口数据
        this.$message({type: 'error',message: err.response.data.error_message})
      })
    },
  },
  // 进入页面默认执行的钩子函数
  mounted () {
    this.getConfigs()
    this.getData()
  },

  data() {
    return {
      // 当前mock的id
      mock_id: Number(this.$route.params.id),
      // 响应状态列表初始值
      status: '',
      // 响应替换参数初始值
      params: '',
      // 响应列表title初始值
      code: 0,
      // card编辑状态初始值
      cardEditMode: false,
      // card中响应表单初始值
      form: {
        id: '',
        code: '',
        remark: '',
        status: '',
        headers: '',
        body: ''
      }
    }
  }
}
</script>

<style>
.response_page {
  margin-left: 12%;
  margin-right: 15%;
  margin-top: 2%;
}

.response_card{
  font-size: 14px;
  margin-top: 2%;
  height: 260px;
}

.el-popover{
white-space: pre-wrap;
}

.response{
  margin-left: -30%;
  margin-top: 50%;
  font-weight: bold;
}

.response_edit{
  font-size: 17px;
  margin-top: 43%;
  margin-right:10%
}

.response_delete{
  font-size: 17px;
  margin-top: 43%;
  margin-right: 35%
}

.response_cancel{
  position:absolute;
  margin-top: 45%;
  margin-right:5%
}

.response_save{
  margin-top: 45%;
  margin-right: 35%
}

.response_status{
  margin-top: -2%;
}

.response_headers{
  margin-top: -3%;
}

.response_body{
  margin-top: -2%;
}
</style>