<template>
  <div>
    <div class="title">
      <div class="title_text">Mock列表</div>
      <el-row style="text-align:right;">
        <el-button style="width: 100px" @click="openDialog = true;getConfigs()" type="primary">添加</el-button>
      </el-row>
    </div>
    <div style="margin-top: 2%"></div>
    <div class="table">
      <el-table
        border
        :data="tableData"
        :stripe="true"
        style="width: 100%">
        <el-table-column
          fixed
          prop="url"
          label="url"
          width="200"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="method"
          label="请求方式"
          width="80"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="availabled"
          label="启用"
          width="80"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="delay"
          label="延时(s)"
          width="100"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="remark"
          label="接口描述"
          width="250"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="response"
          label="默认返回"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editData(scope.row)">编辑</el-button>
            <el-popconfirm @onConfirm="deleteData(scope.row)"  title="确定删除该mock接口吗？">
              <el-button type="text" size="small" slot="reference">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 1%"></div>
      <div class="block" style="text-align:right;">
        <el-pagination
          @current-change="getDataPageChange"
          layout="total, prev, pager, next"
          :page-size="10"
          :total="tableTotal">
        </el-pagination>
      </div>
    </div>
    <div class="box">
      <el-dialog
        title="添加Mock"
        width=600px
        :close-on-click-modal="false"
        :before-close="closeDialog"
        :visible.sync="openDialog">
        <div class="box_form">
        <el-form :model="form" :rules="rules" ref="form" label-width="110px">
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
          <el-form-item label="接口描述" prop="remark">
            <el-input
                  type="textarea"
                  :rows="4"
                  placeholder="请输入接口描述内容"
                  v-model="form.remark"
                  autocomplete="off">
                </el-input>
          </el-form-item>
        </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="openDialog = false;resetForm('form')">取 消</el-button>
          <el-button type="primary" @click="submitForm(form)">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {toolMockServerGetMockList, toolMockServerAddMock, toolMockServerDelMock, toolMockServerGetConfigs} from '../../api'

export default {
  name: "mockServer",
  inject: ['reload'],

  methods: {
    getConfigs() {
      toolMockServerGetConfigs().then((response) => {
        response = response.data;
        if (response.success === true) {
          // 从接口获取的list数据，循环获取进行处理后，写入methods中，用于请求选择项
          var method = new Array()
          for(var i=0;i<response.data.method.length;i++){
            var data = response.data.method[i]
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

    getData (size, page) {
      toolMockServerGetMockList(size, page).then((response) => {
        response = response.data;
        if (response.success === true) {
          // 创建并定义table_data为list
          var table_data = new Array()
          // 当获取到list为空时，table_data为[]
          if (response.data.content == undefined){
            table_data = []
          }else{
            // 从接口获取的list数据，循环获取进行处理后，写入table_data中
            for(var i=0;i<response.data.content.length;i++){
              var data = response.data.content[i]
              if(data.is_available == 1){
                var availabled = "是"
              }else{
                var availabled = "否"}
              var url = "/mock/" + data.url
              table_data.push({
                "id": data.id,
                "url": url,
                "method": data.method,
                "availabled": availabled,
                "delay": data.delay,
                "remark": data.remark,
                "response": JSON.stringify(data.response)
              }
            )}
          }
          this.tableData = table_data;
          // 同时获取数据总数
          this.tableTotal = response.data.total
        }
      }).catch(err => {
        // 对于200之外的错误status，需要添加err获取接口数据
        this.$message({type: 'error',message: err.response.data.error_message})
        })
    },
    getDataPageChange (val) {
      // 获取当前页码
      this.val = val
      this.getData(10, val)
    },

    deleteData (row){
      toolMockServerDelMock(row.id).then((response) => {
          response = response.data;
          if (response.success === true) {
          // 删除成功后刷新页面
          this.reload()
        }
      })
    },

    editData(row) {
      this.$router.replace('/tool/mock-server/detail?' + row.id)
    },

    submitForm(formName) {
      this.$refs['form'].validate((valid) => {
        // 根据表单格式验证规则，触发验证行为，valid为验证结果
        if (valid) {
          toolMockServerAddMock(formName.url, formName.methods, Number(formName.availabled), formName.delay, formName.remark).then((response) => {
            response = response.data;
            if (response.success == true) {
              // 创建成功后刷新页面
              this.reload()
              this.$message({type: 'success',message: '操作成功'});
            }
            }).catch(err => {
              // 对于200之外的错误status，需要添加err获取接口数据
              this.$message({type: 'error',message: err.response.data.error_message})
              })
        } else {
          return false;
        }
      })
    },

    resetForm(formName) {
      // 重置表单，此处主要作用为清除rules验证结果信息
      this.$refs[formName].resetFields();
      this.$message({type: 'info',message: '取消操作'});
      // 恢复form表单为空,重新赋值不能写为单独的方法，只能直接赋值
      this.form = {url: '', methods: '', availabled: '1', delay: 0, remark: ''};
    },

    closeDialog(){
      this.openDialog = false
      this.resetForm('form')
    },
  },
  // 进入页面默认执行的钩子函数
  mounted () {
    this.getData(10, 1)
  },
  

  data() {
    return {
      // 列表数据初始值
      tableData: [],
      // 列表总数初始值
      tableTotal: 0,
      // 列表每行数据初始值
      tableRow: '',
      // 添加弹窗默认关闭
      openDialog: false,
      // 添加弹窗请求方式默认值
      methods: '',
      // 添加弹窗表单初始值
      form: {
        url: '',
        methods: '',
        availabled: '1',
        delay: 0,
        remark: ''
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
        delay: 
          {required: true, message: '响应延时不能为空'},
        remark: 
          {required: true, message: '接口描述不能为空'}
      }
    }
  }
}
</script>

<style>
.title_text {
  position:absolute;
  font-size: 19px;
  font-weight: bold;
}

.box_form {
  margin-left: 45px;
  margin-right: 75px;
  margin-top: 20px
}

</style>