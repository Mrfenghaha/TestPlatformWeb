<template>
  <div class='detail_page'>
    <el-form :model="form" :rules="rules" ref="form" label-width="120px">
      <el-form-item label="URL" prop="url">
        <el-input v-model="form.url">
          <template slot="prepend">/mock/</template>
        </el-input>
      </el-form-item>
      <el-form-item label="请求方式" prop="methods">
        <el-select style="width: 100%" v-model="form.methods" placeholder="请选择请求方式">
          <el-option
            v-for="item in methods"
            :label="item.label"
            :key="item.value"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否启用" prop="availabled">
        <el-select style="width: 100%" v-model="form.availabled" placeholder="请选择是否启用">
          <el-option label="启用" value='1'></el-option>
          <el-option label="禁用" value='0'></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="响应延时(ms)" prop="delay">
        <el-input v-model.number="form.delay"></el-input>
      </el-form-item>
      <el-form-item label="默认响应" prop="resp_id">
        <el-select style="width: 100%" v-model="form.resp_id" placeholder="请选择默认响应代码">
          <el-option
            v-for="item in responses"
            :label="item.label"
            :key="item.value"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="接口描述" prop="remark">
        <el-input
          type="textarea"
          :rows="3"
          placeholder="请输入接口描述内容"
          v-model="form.remark"
          autocomplete="off">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="createSubmit('form')">保存</el-button>
        <el-button @click="cancel()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {toolMockServerGetConfigs, toolMockServerGetMock, toolMockServerUpdateMock, toolMockServerGetRespList} from '../../api/tool/mockServer'

export default {
  name: "mockServerDetail",
  inject: ['reload'],

  methods: {
    getConfigs() {
      toolMockServerGetConfigs().then((response) => {
        response = response.data;
        if (response.success === true) {
          // 从接口获取的list数据，循环获取进行处理后，写入methods中，用于请求选择项
          var method = new Array()
          for(var i=0;i<response.data.methods.length;i++){
            var data = response.data.methods[i]
            method.push({
              "label": data,
              "value": data,
            }
          )}
          this.methods = method
        }
      }).catch(err => {
        // 对于200之外的错误status，需要添加err获取接口数据
        this.$message({type: 'error',message: err.response.data.error_message})
      })
    },

    getResponses(){
      toolMockServerGetRespList(this.mock_id).then((response) => {
        response = response.data;
        if (response.success === true) {
          var responses = new Array()
          for(var i=0;i<response.data.length;i++){
            var name = response.data[i].name
            var id = response.data[i].id
            responses.push({
              "label": name,
              "value": id,
            }
          )}
          this.responses = responses
        }
      }).catch(err => {
        // 对于200之外的错误status，需要添加err获取接口数据
        this.$message({type: 'error',message: err.response.data.error_message})
      })
    },

    getData(){
      toolMockServerGetMock(this.mock_id).then((response) => {
        response = response.data;
        if (response.success === true) {
          var data = response.data
          var form = {
            url: data.url,
            methods: data.methods,
            availabled: String(data.is_available),
            delay: data.delay,
            remark: data.remark,
            resp_id: data.default_resp_id,
          }
          this.form = form
        }
      }).catch(err => {
        // 对于200之外的错误status，需要添加err获取接口数据
        this.$message({type: 'error',message: err.response.data.error_message})
      })
    },

    createSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        // 根据表单格式验证规则，触发验证行为，valid为验证结果
        if (valid) {
          toolMockServerUpdateMock(this.mock_id, this.form.url, this.form.methods, Number(this.form.availabled), this.form.delay, this.form.resp_id, this.form.remark).then((response) => {
            response = response.data;
            if (response.success === true) {
              this.$message({type: 'success',message: '修改成功'});
              this.$router.replace('/tool/mock-server')
            }
          }).catch(err => {
            // 对于200之外的错误status，需要添加err获取接口数据
            this.$message({type: 'error',message: err.response.data.error_message})
            })
        }else {
          return false;
        }
      })
    },

    cancel() {
      this.$message({type: 'info',message: '取消编辑'});
      this.$router.replace('/tool/mock-server')
    },
  },
  // 进入页面默认执行的钩子函数
  mounted () {
    this.getConfigs()
    this.getData()
    this.getResponses()
  },

  data() {
    return {
      // 当前mock的id
      mock_id: Number(this.$route.params.id),
      // 请求方式列表初始值
      methods: '',
      // 请求响应列表初始值
      responses: '',
      // mock表单初始值
      form: {
        url: '',
        methods: '',
        availabled: '',
        delay: '',
        remark: '',
        resp_id: '',
      },
      rules: {
        url: [
          {required: true, message: 'url不能为空'},
          {max: 255, message: '最多可输入255个字符'}
        ],
        methods: 
          {required: true, message: '请选择请求方式'},
        availabled: 
          {required: true, message: '请选择是否启用'},
        delay:[
          {required: true, message: '响应延时不能为空'},
          {type: 'number', message: '响应延时必须为数字'}
          ],
        remark: 
          {required: true, message: '请选择默认响应代码'},
        resp_id: 
          {required: true, message: '请选择默认响应名称'},
      }
    }
  }
}
</script>

<style>
.detail_page {
  margin-left: 15%;
  margin-right: 20%;
  margin-top: 2%;
}
</style>