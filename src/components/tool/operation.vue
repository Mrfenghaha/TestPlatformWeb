<template>
  <div>
    <div class="title">数据库操作</div>
    <div style="margin-top: 30px"></div>
      <div class="oper_input">
        <el-form :model="form" :rules="rules" ref="form" label-width="100px">
          <div class="database_select">
            <el-form-item label="数据库选择:" prop="db_id">
              <el-select style="width: 100%" v-model="form.db_id" filterable no-data-text="请先配置数据库" placeholder="请选择数据库">
                <el-option
                  v-for="item in databases"
                  :label="item.label"
                  :key="item.value"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="operation_select">
            <el-form-item label="操作选择:" prop="operation_id">
              <el-select style="width: 100%" v-model="form.operation_id" filterable no-data-text="请先配置DB操作" placeholder="请选择DB操作">
                <el-option
                  v-for="item in operations"
                  :label="item.label"
                  :key="item.value"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div style="margin-top: 30px"></div>
          <div class="parm_input">
            <el-form-item label="参数输入:" prop="param">
              <el-input class="parm_input_box" style="width:98%" v-model="form.param" placeholder="请依次输入参数并以半角,号隔开" autocomplete="off">
              </el-input>
            </el-form-item>
          </div>
          <div class="parm_input_instruction">请依次填入参数并以半角,号隔开，例：value1,value2,value3</div>
        </el-form>
      </div>
      <div class="button">
        <div style="margin-top: 20px"></div>
        <div class="submit">
          <el-button style="width: 100px" @click="submit" type="primary">提交执行</el-button>
        </div>
          <el-button class="reset" @click="reset">重置</el-button>
      </div>
      <div class="output">
        <div class="result">
          <div v-if="statusNameShow">{{ result.statusName }}</div>
          <div v-if="statusShow" :style="resultStatusColor(result.status)">{{ result.status }}</div>
          <div v-if="contentNameShow">{{ result.contentName }}</div>
          <el-form :model="result" ref="result">
            <el-input
              v-if="contentShow"
              type="textarea"
              :rows="15"
              :readonly="true"
              v-model="result.content">
            </el-input>
          </el-form>
        </div>
      </div>
  </div>
</template>
  
<script>
import {toolDBOperGetOperList, toolDBOperGetConfigList, toolDBOperExOper} from '../../api'

export default {
  name: "operation",
  inject: ['reload'],

  methods: {
    // 执行结果根据不同内容显示不同颜色
    resultStatusColor (content){
      // 如果执行结果包含执行失败字样，设置为红色，否则为绿色
      if (content.indexOf("执行失败") != -1){
        return {'color':'red'}
      }
      else{
        return {'color':'green'}
      }
    },

    submit () {
      this.$refs['form'].validate((valid) => {
        // 根据表单格式验证规则，触发验证行为，valid为验证结果
        if (valid) {
          // 当未输入任何字符时，接口parm参数设为[]，否则根据,切割为list
          if (this.form.param == ""){
            var parm = []
          }else{
            var parm = this.form.param.replace(/，/g,",").split(",")
          }
          toolDBOperExOper(this.form.db_id, this.form.operation_id, parm).then((response) => {
            response = response.data;
            console.log(response)
            if (response.success === true) {
              // 如果执行操作返回的结果为空时，不显示所结果标题和内容，否则正常显示
              if (response.data.result == ""){
                var contentName = ''
                var content = ''
                // 关闭结果内容元素显示
                this.contentNameShow = false
                this.contentShow = false
              }
              else{
                var contentName = '结果:'
                var content = JSON.stringify(response.data.result)
                // 打开结果内容元素显示
                this.contentNameShow = true
                this.contentShow = true
              }
              // 打开结果状态元素显示
              this.statusNameShow = true
              this.statusShow = true
              // 根据执行结果，设定显示内容
              this.result={"statusName": "状态:", "status": response.data.status, "contentName": contentName, "content": content}
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
    reset(){
      // 实现局部刷新
      this.reload()
    },

    getDatabases (size, page) {
      toolDBOperGetConfigList(size, page).then((response) => {
        response = response.data;
        console.log(response)
        if (response.success === true) {
          // 创建并定义db_list为list
          var db_list = new Array()
          // 当获取到list为空时，db_list为[]
          if (response.data.content == undefined){
            db_list = []
          }else{
            // 从接口获取的list数据，循环获取进行处理后，写入db_list中，用于数据库选择项
            for(var i=0;i<response.data.content.length;i++){
              var data = response.data.content[i]
              db_list.push({
                "label": data.name,
                "value": data.id,
              }
            )}
          }
          this.databases = db_list;

          console.log(this.databases)
        }
      }).catch(err => {
        this.$message({type: 'error',message: err.response.data.error_message})
        })
    },
    getOperations (size, page) {
      toolDBOperGetOperList(size, page).then((response) => {
        response = response.data;
        console.log(response)
        if (response.success === true) {
          // 创建并定义oper_list为list
          var oper_list = new Array()
          // 当获取到list为空时，oper_list为[]
          if (response.data.content == undefined){
            oper_list = []
          }else{
            // 从接口获取的list数据，循环获取进行处理后，写入oper_list中，用于操作选择项
            for(var i=0;i<response.data.content.length;i++){
              var data = response.data.content[i]
              oper_list.push({
                "label": data.name,
                "value": data.id,
              }
            )}
          }
          this.operations = oper_list;
          console.log(this.operations)
        }
      }).catch(err => {
        this.$message({type: 'error',message: err.response.data.error_message})
        })
    },
  },
  // 进入页面默认执行的钩子函数
  mounted () {
    this.getDatabases(1000, 1)
    this.getOperations(1000, 1)
  },
  
  data() {
    const validatePass = (rule, value, callback) => {
      if (value.charAt(value.length-1) == ',') {
        callback(new Error('参数不能已,结尾'))
      } else {
        if (value.charAt(value.length-1) == '，'){
          callback(new Error('参数不能已,结尾'))
        }else{
          callback()
        }
      }
    }

    return {
      // 数据库选择框的初始值
      value1: '',
      // 数据库选择框数据的初始值
      databases: [],
      // 操作选择框的初始值
      value2: '',
      // 操作选择框的初始值
      operations: [],
      // 参数输入框的初始值
      input: '',
      // 执行操作表单初始值
      form:{
        db_id: '',
        operation_id: '',
        param: ''
      },
      rules: {
        db_id: {required: true, message: '数据库必须选择'},
        operation_id: {required: true, message: '操作必须选择'},
        param: {required: false, validator: validatePass}
      },
      // 执行结果框是否显示的初始值
      statusNameShow: false,
      statusShow: false,
      contentNameShow: false,
      contentShow: false,
      // 执行结果的初始值
      result: {
        'statusName': '',
        'status': '',
        'contentName': '',
        'content': ''
        },
      }
    },
}
</script>
      
  
<style>
  .title {
    /* 元素内居左 */
    text-align:left;
    font-size: 19px;
    font-weight: bold;
  }

  .database_select {
    /* 当前div与下一个div同行显示 */
    position:absolute;
    /* 距离最左侧距离 */
    margin-left: 4%;
    /* 设置元素长度 */
    width: 20%;
  }

  .operation_select{
    margin-left: 38%;
    width: 50%;
  }

  .parm_input{
    margin-left: 4.6%;
    width: 83.5%;
  }

  .parm_input_box{
    margin-left: 2%;
  }

  .parm_input_instruction {
    margin-left: 175px;
    /* margin-top: -25px; */
    /* margin-left: 5%; */
    text-align:left;
    /* 文本字体大小 */
    font-size: 13px;
    /* 文本字体-斜体 */
    font-style: italic;
    /* 文本加粗 */
    font-weight: bold;
    /* 文本颜色 */
    color:	#808080
  }

  .submit{
    position:absolute;
    margin-left: 20%;
  }

  .reset{
    width: 100px;
  }

  .result{
    text-align:left;
    margin-top: 60px;
    margin-left: 15%;
    /* 设置元素高度 */
    line-height:40px;
    width: 60%;
  }
</style>
