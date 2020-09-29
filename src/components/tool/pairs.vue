<template>
  <div>
    <div class="title">正交法生成测试组合</div>
    <div style="margin-top: 30px"></div>
      <el-form :model="form" ref="form" label-width="70px">
        <div class="pair_input">
          <el-form-item
            prop="cond"
            label="条件1"
            class="pair_input_text"
            :rules="[{required: true, message: '条件参数不能为空'},{validator: validatePass}]">
            <el-input class="pair_input_box" style="width: 96%" v-model="form.cond" placeholder="请依次输入参数并以半角,号隔开" autocomplete="off"></el-input>
          </el-form-item>
          <i class="el-icon-circle-plus-outline pair_input_add"  @click="addDomain"></i>
        </div>
        <div class="pair_input_custom">
          <el-form-item
            v-for="(domain, index) in form.domains"
            :label="'条件' + (index+2)"
            :key="domain.key"
            :prop="'domains.' + index + '.value'"
            :rules="[{required: true, message: '条件参数不能为空'},{validator: validatePass}]">
            <el-input style="width:80%" v-model="domain.value" placeholder="请依次输入参数并以半角,号隔开" autocomplete="off"></el-input>
            <el-button style="margin-left: 3%" @click.prevent="removeDomain(domain)">删除</el-button>
          </el-form-item>
        </div>
        <div class="pair_submit">
          <el-form-item>
            <el-button type="primary" @click="submitForm('form')">提交</el-button>
            <el-button @click="resetForm()">重置</el-button>
          </el-form-item>
        </div>
      </el-form>
      <div class="pair_result">
        <div v-if="resultNumName">结果:</div>
        <div v-if="resultNum">{{ result.num }}</div>
        <el-form :model="result" ref="result">
          <el-input
            v-if="resultContentShow"
            type="textarea"
            :rows="13"
            :readonly="true"
            v-model="result.content">
          </el-input>
        </el-form>
      </div>
  </div>
</template>
  
<script>
import {toolPairs} from '../../api/tool/pairs'

export default {
  name: "pairs",
  inject: ['reload'],

  methods: {
    validatePass(rule, value, callback){
      if (value.charAt(value.length-1) == ',') {
        callback(new Error('参数不能已,结尾'))
      } else {
        if (value.charAt(value.length-1) == '，'){
          callback(new Error('参数不能已,结尾'))
        }else{
          callback()
        }
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var conds = new Array();
          // 传入第一行内容
          conds.push(this.form.cond.replace(/，/g,",").split(","))
          // 传入剩下的所有行
          for(var i=0;i<this.form.domains.length;i++){
            var domain = this.form.domains[i]
            conds.push(domain.value.replace(/，/g,",").split(","))
            }
          toolPairs(conds).then((response) => {
            response = response.data;
            if (response.success === true) {
              var pairs = new String();
              for(var i=0;i<response.data.pairs.length;i++){
                var pair = response.data.pairs[i]
                pairs += '[' + String(pair) + ']\n'
                }
              this.result = {"num": response.data.num ,"content": pairs}
              this.resultNumName = true
              this.resultNum = true
              this.resultContentShow = true
            }
          }).catch(err => {
          this.$message({type: 'error',message: err.response.data.error_message})
          })
        } else {
          return false;
        }
      });
    },
    resetForm() {
      this.reload()
    },
    removeDomain(item) {
      var index = this.form.domains.indexOf(item)
      if (index !== -1) {
        this.form.domains.splice(index, 1)
      }
    },
    addDomain() {
      this.form.domains.push({
        value: '',
        key: Date.now()
      });
    }
  },
  
  data() {
    return {
      form: {
        domains: [{
          value: ''
        }],
        cond: ''
      },
      // 执行结果的初始值
      result:{"content": ""},
      // 执行结果的初始值
      resultNumName:false,
      resultNum:false,
      resultContentShow: false,
    }
  }
}
</script>
      
  
<style>
  .pair_input{
    margin-left: 13%;
    margin-right: 30%;
    line-height:40px;
  }

  .pair_input_text{
    position:absolute;
    width: 35%;
  }

  .pair_input_box{
    margin-left: 4.5%
  }

  .pair_input_add{
    font-size: 23px;
    margin-left: 95%
  }

  .pair_input_custom{
    margin-top: 20px;
    margin-left: 13%;
    margin-right: 25%;
    /* 设置最大高度 */
    max-height: 230px;
    /* 超过最大高度，添加滚动条 */
    overflow-y: auto;
  }

  .pair_submit{
    margin-top: 20px;
    margin-right: 20%;
  }

  .pair_result{
    text-align:left;
    margin-left: 15%;
    /* 设置元素高度 */
    line-height:40px;
    width: 60%;
  }
</style>
