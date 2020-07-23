<template>
  <div>
    <head-top></head-top>
    <div class="page">
      <div class="title">正交法生成测试组合</div>
      <div style="margin-top: 30px"></div>
      <div class="pair_input">
        <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px" class="demo-dynamic">
          <el-form-item
            prop="email"
            label="邮箱">
            <el-input v-model="dynamicValidateForm.email"></el-input>
          </el-form-item>
          <el-form-item
            v-for="(domain, index) in dynamicValidateForm.domains"
            :label="'条件' + index"
            :key="domain.key"
            :prop="'domains.' + index + '.value'"
            :rules="{
              required: true, message: '域名不能为空', trigger: 'blur'
            }"
          >
            <el-input v-model="domain.value"></el-input><el-button @click.prevent="removeDomain(domain)">删除</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('dynamicValidateForm')">提交</el-button>
            <el-button @click="addDomain">新增域名</el-button>
            <el-button @click="resetForm('dynamicValidateForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
  
<script>
import headTop from '../head'
import {toolDBOperGetOperList, toolDBOperGetConfigList, toolDBOperExOper} from '../../api'

export default {
  name: "dbOperation",
  components: {
    headTop
  },
  inject: ['reload'],

  methods: {
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      removeDomain(item) {
        var index = this.dynamicValidateForm.domains.indexOf(item)
        if (index !== -1) {
          this.dynamicValidateForm.domains.splice(index, 1)
        }
      },
      addDomain() {
        this.dynamicValidateForm.domains.push({
          value: '',
          key: Date.now()
        });
      }
  },
  
  data() {
      return {
        dynamicValidateForm: {
          domains: [{
            value: ''
          }],
          email: ''
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

  /* .pair_input{
    margin-left: 10%;
    margin-right: 15%;
    margin-top: 5%;
  } */

</style>
