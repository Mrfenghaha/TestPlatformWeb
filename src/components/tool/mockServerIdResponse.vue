<template>
  <div class="response">
      <el-button style="position:absolute;margin-left: 40%" type="primary"><i class="el-icon-circle-plus-outline"></i> 添加</el-button>
      <el-card class="box-card">
        <el-form :model="form" ref="form" label-width="60px">
          <el-row>
            <el-col :span="5">
              <div class="result">
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
                响应代码:{{code}}
              </div>
              <el-link class="result_save" @click="saveSubmit(form)">保存</el-link>
            </el-col>
            <el-col :span="19">
              <div>
                <el-form-item class="result_remark" label="描述" prop="remark">
                  <el-input v-model="form.remark"  placeholder="请输入描述信息"></el-input>
                </el-form-item>
                <el-form-item class="result_status" label="状态码" prop="status">
                  <el-select style="width: 100%" v-model="form.status" placeholder="请选择返回状态码">
                    <el-option
                      v-for="item in status"
                      :label="item.label"
                      :key="item.value"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item class="result_headers" label="Headers" prop="remark">
                  <el-input
                    type="textarea"
                    :rows="1"
                    placeholder="请输入Response的Headers"
                    v-model="form.remark"
                    autocomplete="off">
                  </el-input>
                </el-form-item>
                <el-form-item class="result_body" label="Body" prop="remark">
                  <el-input
                    type="textarea"
                    :rows="3"
                    placeholder="请输入Response的Body"
                    v-model="form.remark"
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
import {toolMockServerGetConfigs} from '../../api'

export default {
  name: "mockServerResponse",

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
    }
  },
  // 进入页面默认执行的钩子函数
  mounted () {
    this.getConfigs()
  },

  data() {
    return {
      status: '',
      params: '',
      code: 0,
      form: {
        domains: [{
          value: ''
        }],
        cond: ''
      }
    }
  }
}
</script>

<style>
.response {
  margin-left: 12%;
  margin-right: 15%;
  margin-top: 2%;
}

.box-card{
  font-size: 14px;
  margin-top: 2%;
}

.el-popover{
white-space: pre-wrap;
}

.result{
  margin-left: 3%;
  margin-top: 60%;
  font-weight: bold;
}

.result_save{
  margin-top: 50%;
  margin-right: 35%
}

.result_remark{
  margin-top: 3%;
}

.result_status{
  margin-top: -2%;
}

.result_headers{
  margin-top: -3%;
}

.result_body{
  margin-top: -2%;
}
</style>