<template>
  <div class="response_page">
    <div class="response_button">
      <el-button class="response_button_add" type="primary" @click="addDomain()"><i class="el-icon-circle-plus-outline"></i> 添加</el-button>
      <el-popover
        ref="popover"
        placement="right"
        title="替换参数说明"
        width="300"
        trigger="hover"
        :content="params">
      </el-popover>
      <el-link class="response_button_inst" :underline="false" v-popover:popover>
        参数替换说明<i class="el-icon-warning"></i>
      </el-link>
    </div>
    <div v-for="(form, i) in forms" :key="i">
      <el-form :model="form" ref="form" label-width="80px">
        <el-card class="response_card">
          <div slot="header" class="clearfix">
            <el-row>
              <el-col :span="4" style="text-align:left;">
                <div class="response_title">Response名称:</div>
              </el-col>
              <el-col :span="16" style="text-align:left;">
                <div v-if="form.cardEditMode">
                  <div class="response_name">
                  <el-form-item prop="name" label-width="0px"
                    :rules="[{required: true, message: '请输入Response名称'},{max: 64, message: '最多可输入64个字符'}]">
                    <el-input class="response_title" v-model="form.name" placeholder="请输入名称"></el-input>
                  </el-form-item>
                  </div>
                </div>
                <div v-if="!form.cardEditMode" class="response_title text_one">{{form.name}}</div>
              </el-col>
              <el-col :span="4">
                <div v-if="!form.cardEditMode">
                  <el-row>
                    <el-col :span="12"><i class="el-icon-edit icon" @click="response_edit(form)"></i></el-col>
                    <el-col :span="12"><i class="el-icon-delete icon" @click="response_delete(form)"></i></el-col>
                  </el-row>
                </div>
                <div v-if="form.cardEditMode">
                  <el-row>
                    <el-col :span="12"><el-link class="response_cancel" @click="cancelSubmit(form)">取消</el-link></el-col>
                    <el-col :span="12"><el-link class="response_save" @click="saveSubmit(form)">保存</el-link></el-col>
                  </el-row>
                </div>
              </el-col>
            </el-row>
          </div>
          <div>
            <div v-if="!form.cardEditMode" style="text-align:left;">
              <el-form-item label="描述">
                <el-tooltip class="item" width="100" effect="dark" :content="form.remark" placement="top-start">
                  <div class="text_one" >{{form.remark}}</div>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="状态码">{{form.status}}</el-form-item>
              <el-form-item label="Headers">
                <el-tooltip class="item" width="800" effect="dark" :content="form.headers" placement="top-start">
                  <div class="text_one" >{{form.headers}}</div>
                </el-tooltip>
              </el-form-item>
              <el-form-item style="height=80px" label="Body">
                <el-popover
                  placement="top-start"
                  width="600"
                  trigger="click"
                  :content="form.body">
                  <div class="text_two" slot="reference">{{form.body}}</div>
                </el-popover>
              </el-form-item>
            </div>
            <div v-if="form.cardEditMode">
              <el-form-item label="描述" prop="remark"
                :rules="{required: true, message: '请输入Response描述信息'}">
                <el-input v-model="form.remark"  placeholder="请输入描述信息"></el-input>
              </el-form-item>
              <el-form-item label="状态码" prop="status"
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
              <el-form-item label="Headers" prop="headers">
                <el-input v-model="form.headers" placeholder="请输入Response的Headers"></el-input>
              </el-form-item>
              <el-form-item label="Body" prop="body">
                <el-input
                  type="textarea"
                  :rows="3"
                  placeholder="请输入Response的Body"
                  v-model="form.body"
                  autocomplete="off">
                </el-input>
              </el-form-item>
            </div>
          </div>
        </el-card>
      </el-form>
    </div>
  </div>
</template>

<script>
import {toolMockServerGetConfigs, toolMockServerGetRespList, toolMockServerAddResp, toolMockServerUpdateResp, toolMockServerDelResp} from '../../api/tool/mockServer'

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

    addDomain() {
      // 判断当前处于编辑状态的表单的数量，同时只能编辑一个表单
      var list = new Array()
      for(var i=0;i<this.forms.length;i++){
        var cardEditMode = this.forms[i].cardEditMode
        list.push(cardEditMode)
      }
      if(this.data_count(list).true == undefined){
        this.forms.push({id: '', name: '', remark: '', status: '', headers: '{"content-type": "application/json"}', body: '{}', cardEditMode: true});
      }else{
        this.$message({type: 'error', message: '请保存后再进行操作'});
      }
    },

    getData(){
      toolMockServerGetRespList(this.mock_id).then((response) => {
        response = response.data;
        if (response.success === true) {
          var forms = new Array()
          for(var i=0;i<response.data.length;i++){
            var data = response.data[i]
            forms.push({
              id: data.id,
              name: data.name,
              status: data.status,
              headers: data.headers,
              body: data.body,
              remark: data.remark,
              cardEditMode: false
            }
          )}
          this.forms = forms
        }
      }).catch(err => {
        // 对于200之外的错误status，需要添加err获取接口数据
        this.$message({type: 'error',message: err.response.data.error_message})
      })
    },

    response_edit(FormName){
      // 判断当前处于编辑状态的表单的数量，同时只能编辑一个表单
      var list = new Array()
      for(var i=0;i<this.forms.length;i++){
        var cardEditMode = this.forms[i].cardEditMode
        list.push(cardEditMode)
      }
      if(this.data_count(list).true == undefined){
        FormName.cardEditMode = true
      }else{
        this.$message({type: 'error', message: '请保存后再进行操作'});
      }
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

    cancelSubmit(FormName){
      this.reload()
      this.$message({type: 'info', message: '已取消修改'});
    },

    saveSubmit(FormName){
      if(FormName.headers == ""){var headers = '{}'}
      else{var headers = FormName.headers}
      
      if(FormName.body == ""){var body = '{}'}
      else{var body = FormName.body}

      if(FormName.id == ''){
        toolMockServerAddResp(this.mock_id, FormName.name, FormName.status, headers, body, FormName.remark).then((response) => {
          response = response.data;
          if (response.success === true) {
            this.reload()
            this.$message({type: 'success', message: '添加成功!'});
          }
        }).catch(err => {
          // 对于200之外的错误status，需要添加err获取接口数据
          this.$message({type: 'error',message: err.response.data.error_message})
        })
      }else{
        toolMockServerUpdateResp(FormName.id, this.mock_id, FormName.name, FormName.status, headers, body, FormName.remark).then((response) => {
          response = response.data;
          if (response.success === true) {
            this.reload()
            this.$message({type: 'success', message: '修改成功!'});
          }
        }).catch(err => {
          // 对于200之外的错误status，需要添加err获取接口数据
          this.$message({type: 'error',message: err.response.data.error_message})
        })
      }
    },
    // 计算元素在list中出现的次数
    data_count(data){
      var map = {};
      var i = 0, len = data .length;
      //循环查找
      for (; i < len; i++) {
        //数组里的i个元素
          var v = data [i];
          //将数组的i个元素作为map对象的属性查看其属性值
          var counts = map[v];
          //如果map对象没有该属性，则设置该属性的值为1，有的话在其基础上再+1
          if (counts) {
              map[v] += 1;
          } else {
              map[v] = 1;
          }
      }
      return map
    }
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
      name: 0,
      // card中响应表单初始值
      forms: [{
        id: '',
        name: '',
        remark: '',
        status: '',
        headers: '{"content-type": "application/json"}',
        body: '{}',
        // card编辑状态初始值
        cardEditMode: false
      }]
    }
  }
}
</script>

<style>
.response_page {
  margin-left: 12%;
  margin-right: 15%;
  margin-top: 2%;
  /* 设置最大高度 */
  max-height: 700px;
  /* 超过最大高度，添加滚动条 */
  overflow-y: auto;
}

.response_button{
  position: absolute;
  margin-left: 78%;
}

.response_button_add{
  position: absolute;
}

.response_button_inst{
  margin-top: 80%
}

.response_card{
  font-size: 14px;
  margin-top: 2%;
  height: 370px;
}

.response_title{
  font-size: 15px;
  font-weight: bold;
}

.response_name{
  margin-top: -1.5%;
  margin-bottom: -8%;
}

.el-popover{
white-space: pre-wrap;
}

.icon{
  font-size: 17px;
}

.text_one{
  width:90%;
  /* 内容超出宽度时隐藏超出部分的内容 */
  overflow:hidden;
  /* 当对象内文本溢出时显示省略标记(...)需与overflow:hidden;一起使用 */
  text-overflow:ellipsis;
  /* 强制不换行 */
  white-space:nowrap;
}

.text_two{ 
  width:90%; 
  overflow: hidden;
  text-overflow: ellipsis;
  /* 必须结合的属性 ，将对象作为弹性伸缩盒子模型显示 */
  display: -webkit-box;
  /* 限制在一个块元素显示的文本的行数 */
  -webkit-line-clamp: 2;
  /* 必须结合的属性 ，设置或检索伸缩盒对象的子元素的排列方式  */
  -webkit-box-orient: vertical;
}
</style>