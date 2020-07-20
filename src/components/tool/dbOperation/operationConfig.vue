<template>
  <div>
    <head-top></head-top>
    <div class="page">
      <div class="title">
        <div class="title_text">操作列表</div>
        <el-row style="text-align:right;">
          <el-button style="width: 100px" @click="addBox = true;box_title = '添加操作'" type="primary">添加</el-button>
        </el-row>
      </div>
      <div style="margin-top: 2%"></div>
      <div class="table">
        <el-table
          :data="tableData"
          border
          :stripe="true"
          style="width: 100%">
          <el-table-column
            fixed
            prop="number"
            label="序号"
            width="100">
          </el-table-column>
          <el-table-column
            prop="name"
            label="操作名称"
            width="200">
          </el-table-column>
          <el-table-column
            prop="sql"
            label="sql语句"
            width="350">
          </el-table-column>
          <el-table-column
            prop="note"
            label="说明">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row);addBox = true;box_title = '编辑操作'" type="text" size="small">编辑</el-button>
              <el-popconfirm title="确定删除该操作吗？">
                <el-button type="text" size="small" slot="reference">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top: 1%"></div>
        <div class="block" style="text-align:right;">
          <el-pagination
            :page-size="pagination.size"
            layout="total, prev, pager, next"
            :total="pagination.total">
          </el-pagination>
        </div>
      </div>
      <div class="box">
        <el-dialog
          :title="box_title"
          width=550px
          :visible.sync="addBox"
          :before-close="closeDialog">
          <div class="box_form">
          <el-form :model="form" label-width='80px'>
            <el-form-item
              label="名称"
              prop="name"
              :rules="{required: true,message: '名称不能为空'}">
              <el-input v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item
              label="sql语句"
              prop="sql"
              :rules="{required: true,message: 'sql语句不能为空'}">
              <el-input
                type="textarea"
                :rows="3"
                placeholder="所有参数均使用%s代替"
                v-model="form.sql"
                autocomplete="off">
              </el-input>
            </el-form-item>
            <el-form-item label="说明" prop="note">
              <el-input
                type="textarea"
                :rows="3"
                placeholder="请输入说明内容"
                v-model="form.note"
                autocomplete="off">
              </el-input>
            </el-form-item>
          </el-form>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addBox = false; resetForm('form')">取 消</el-button>
            <el-button type="primary" @click="addBox = false">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import headTop from '../../head'

export default {
  name: "operationConfigs",
  components: {
    headTop
  },
  inject: ['reload'],

  methods: {
    handleClick(row) {
      console.log(row);
    },
    closeDialog(){
      this.reload()
    }
  },

  data() {
    return {
      tableData: [{
        number: '1',
        name: '王小虎',
        sql: '上海普陀区',
        note: 'wangxiaohu'
      }, {
        number: '2',
        name: '王小虎',
        sql: '上海普陀区',
        note: 'wangxiaohu'
      }, {
        number: '3',
        name: '王小虎',
        sql: '上海普陀区',
        note: 'wangxiaohu'
      }, {
        number: '4',
        name: '王小虎',
        sql: '上海普陀区',
        note: 'wangxiaohu'
      }, {
        number: '5',
        name: '王小虎',
        sql: '上海普陀区',
        note: 'wangxiaohu'
      }, {
        number: '6',
        name: '王小虎',
        sql: '上海普陀区',
        note: 'wangxiaohu'
      }, {
        number: '7',
        name: '王小虎',
        sql: '上海普陀区',
        note: 'wangxiaohu'
      }, {
        number: '8',
        name: '王小虎',
        sql: '上海普陀区',
        note: 'wangxiaohu'
      }, {
        number: '9',
        name: '王小虎',
        sql: '上海普陀区',
        note: 'wangxiaohu'
      }, {
        number: '10',
        name: '王小虎',
        sql: '上海普陀区',
        note: 'wangxiaohu'
      }],
      addBox: false,
      // visible: false,
      box_title: '',
      form:{
        name: '',
        sql: '',
        note: ''
      },
      pagination:{
        size: 10,
        total: 88
      }
      }
    }
  }
</script>

<style>
.page {
  margin-left: 10%;
  margin-right: 10%;
  margin-top: 5%;
}

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