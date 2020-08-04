<template>
  <div>
    <div class="title">
      <div class="title_text">Mock列表</div>
      <el-row style="text-align:right;">
        <el-button style="width: 100px" @click="addData" type="primary">添加</el-button>
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
  </div>
</template>

<script>
import {toolMockServerGetMockList, toolMockServerDelMock} from '../../api'

export default {
  name: "mockServer",
  inject: ['reload'],

  methods: {
    getData (size, page) {
      toolMockServerGetMockList(size, page).then((response) => {
        response = response.data;
        console.log(response)
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

    addData() {
      this.$router.replace('/tool/mock-server/detail')
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

</style>