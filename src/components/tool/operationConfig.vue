<template>
  <div>
    <div class="title">
      <div class="title_text">操作列表</div>
      <el-row style="text-align:right;">
        <el-button style="width: 100px" @click="openDialog = true;DialogTitle = '添加操作'" type="primary">添加</el-button>
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
          prop="name"
          label="操作名称"
          width="200"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="sql"
          label="sql语句"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="remark"
          label="说明"
          width="200"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editData(scope.row);openDialog = true;DialogTitle = '编辑操作'">编辑</el-button>
            <el-popconfirm @onConfirm="deleteData(scope.row)"  title="确定删除该操作吗？">
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
        :title="DialogTitle"
        width=550px
        :close-on-click-modal="false"
        :before-close="closeDialog"
        :visible.sync="openDialog">
        <div class="box_form">
        <el-form :model="form" :rules="rules" ref="form" label-width="70px">
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="sql语句" prop="sql">
            <el-input
              type="textarea"
              :rows="3"
              placeholder="所有参数均使用%s代替"
              v-model="form.sql"
              autocomplete="off">
            </el-input>
          </el-form-item>
          <el-form-item label="说明" prop="remark">
            <el-input
              type="textarea"
              :rows="3"
              placeholder="请输入说明内容"
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
import {toolDBOperGetOperList, toolDBOperAddOper, toolDBOperUpdateOper, toolDBOperDelOper} from '../../api'

export default {
  name: "operationConfigs",
  inject: ['reload'],

  methods: {
    getData (size, page) {
      toolDBOperGetOperList(size, page).then((response) => {
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
              table_data.push({
                "id": data.id,
                "name": data.name,
                "sql": data.sql,
                "remark": data.remark
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
      toolDBOperDelOper(row.id).then((response) => {
          response = response.data;
          if (response.success === true) {
          // 删除成功后刷新页面
          this.reload()
        }
      })
    },

    editData(row) {
      // row为选择行的内容，即list中该行数据
      // console.log(row);
      var data = {
              "name": row.name,
              "sql": row.sql,
              "remark": row.remark
              };
      this.form = data
      // 为每行数据赋值，为编辑提交时获取id
      this.tableRow = row
    },

    submitForm(formName) {
      this.$refs['form'].validate((valid) => {
        // 根据表单格式验证规则，触发验证行为，valid为验证结果
        if (valid) {
          if (this.DialogTitle == '添加操作'){
            toolDBOperAddOper(formName.name, formName.sql, formName.remark).then((response) => {
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
            toolDBOperUpdateOper(this.tableRow.id, formName.name, formName.sql, formName.remark).then((response) => {
              response = response.data;
              if (response.success == true) {
                this.openDialog = false;
                // 编辑成功后，仍停留在该页，需要使用当前页码获取数据，刷新显示
                this.getDataPageChange (this.val)
                this.submitUpdateForm('form')
              }
              }).catch(err => {
                this.$message({type: 'error',message: err.response.data.error_message})
                })
          }
        } else {
          return false;
        }
      })
    },
    submitUpdateForm(formName) {
      // 重置表单，此处主要作用为清除rules验证结果信息
      this.$refs[formName].resetFields();
      this.$message({type: 'success',message: '操作成功'});
      // 恢复form表单为空,重新赋值不能写为单独的方法，只能直接赋值
      this.form = {name: '',sql: '',remark: ''};
    },
    
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$message({type: 'info',message: '取消操作'});
      this.form = {name: '',sql: '',remark: ''};
    },

    closeDialog(){
      this.openDialog = false
      this.resetForm('form')
    }
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
      // 添加/编辑弹窗默认关闭
      openDialog: false,
      // 添加/编辑弹窗title初始值
      DialogTitle: '',
      // 添加/编辑弹窗表单初始值
      form:{
        name: '',
        sql: '',
        remark: ''
      },
      rules: {
        name: [
          {required: true, message: '名称不能为空'},
          {max: 64, message: '最多可输入64个字符'}
          ],
        sql: 
          {required: true, message: 'sql语句不能为空'}
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
  margin-left: 85px;
  margin-right: 105px;
  margin-top: 20px
}

</style>