<template>
  <div>
    <head-top></head-top>
    <div class="page">
      <div class="title">数据库操作</div>
      <div style="margin-top: 30px"></div>
        <div class="input">
          <el-form :model="form" :rules="rules" ref="form" label-width="100px">
            <div class="database_select">
              <el-form-item label="数据库选择:" prop="db_id">
                <el-select style="width: 100%" v-model="form.db_id" filterable no-data-text="请先配置数据库" placeholder="请选择数据库">
                  <el-option
                    v-for="item in databases"
                    :label="item.label"
                    :key="item.value"
                    :value="item.value">
                    {{ item.label }}
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
                    {{ item.label }}
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div style="margin-top: 30px"></div>
            <div class="parm_input">
              <el-form-item label="参数输入:" prop="param">
                <el-input v-model="form.param" filterable placeholder="请依次输入参数并以半角,号隔开" autocomplete="off">
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
            <el-button class="reset" @click="reset" type="primary">重置</el-button>
        </div>
        <div class="output">
          <div class="result">
            <div>{{ result.status }}</div>
            <div>{{ result.content }}</div>
          </div>
        </div>
    </div>
  </div>
</template>
  
<script>
import headTop from '../../head'
import {toolDBOperGetOperList, toolDBOperGetConfigList, toolDBOperExOper} from '../../../api'

export default {
  name: "dbOperation",
  components: {
    headTop
  },
  inject: ['reload'],

  methods: {
    submit () {
      this.$refs['form'].validate((valid) => {
        // 根据表单格式验证规则，触发验证行为，valid为验证结果
        if (valid) {
          toolDBOperExOper(this.form.db_id, this.form.operation_id, this.form.param.split(",")).then((response) => {
            response = response.data;
            console.log(response)
            if (response.success === true) {
              this.result={"status": "提交状态：" + response.data.result_explain, "content": "提交结果" + response.data.result}
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
            // 从接口获取的list数据，循环获取进行处理后，写入db_list中
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
            // 从接口获取的list数据，循环获取进行处理后，写入oper_list中
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
  // 进入/刷新页面默认执行的钩子函数
  mounted () {
    this.getDatabases(1000, 1)
    this.getOperations(1000, 1)
  },

  data() {
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
        // 执行结果的初始值
        result: '',
        // 执行操作表单初始值
        form:{
          db_id: '',
          operation_id: '',
          param: ''
        },
        rules: {
          db_id: {required: true, message: '数据库必须选择'},
          operation_id: {required: true, message: '操作必须选择'}
      }
      }
    },
}
</script>
      
  
<style>
  .page {
    margin-left: 10%;
    margin-right: 10%;
    margin-top: 5%;
  }

  .title {
    /* 元素内居左 */
    text-align:left;
    font-size: 19px;
    font-weight: bold;
  }

  /* .database_text {
    position:absolute;
    text-align:left;
    margin-left: 5%;
    width: 8%;
    line-height:40px;
  } */

  .database_select {
    /* 当前div与下一个div同行显示 */
    position:absolute;
    /* 距离最左侧距离 */
    margin-left: 4%;
    /* 设置元素长度 */
    width: 23%;
  }

  /* .operation_text {
    position:absolute;
    text-align:left;
    margin-left: 32%;
    width: 8%;
    line-height:40px;
  } */

  .operation_select{
    margin-left: 43%;
    width: 45%;
  }

  /* .parm_input_text{
    position:absolute;
    text-align:left;
    margin-left: 5%;;
    width: 8%;;
    line-height:40px;
  } */

  .parm_input{
    margin-left: 4.6%;
    width: 83.5%;
  }

  .parm_input_instruction {
    margin-top: -25px;
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
    margin-left: 5%
  }

  .result{
    text-align:left;
    margin-top: 60px;
    margin-left: 30%;
    /* 设置元素高度 */
    line-height:40px;
    width: 50%;
  }
</style>
