<template>
  <div>
    <head-top></head-top>
    <div class="page">
      <div class="title">数据库操作</div>
      <div style="margin-top: 30px"></div>
      <div class="input">
        <div class="database_text">数据库选择：</div>
        <div class="database_select">
          <el-select style="width: 100%" v-model="value1" filterable no-data-text="请先配置数据库" placeholder="请选择数据库">
            <el-option
              v-for="item in databaes"
              :label="item.label"
              :key="item.value"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="operation_text">操作选择：</div>
        <div class="operation_select">
          <el-select style="width: 100%" v-model="value2" filterable no-data-text="请先配置DB操作" placeholder="请选择DB操作">
            <el-option
              v-for="item in databaes"
              :label="item.label"
              :key="item.value"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div style="margin-top: 30px"></div>
        <div class="parm_input_text">参数输入：</div>
        <div class="parm_input">
          <el-input v-model="input" filterable placeholder="请依次输入参数并以半角,号隔开"></el-input>
        </div>
        <div class="parm_input_instruction">请依次填入参数并以半角,号隔开，例：value1,value2,value3</div>
        <div style="margin-top: 15px"></div>
        <div class="submit">
          <el-row>
            <el-button style="width: 100%" @click="submit" type="primary">提交执行</el-button>
          </el-row>
        </div>
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

export default {
  name: "dbOperation",
  components: {
    headTop
  },
  data() {
      return {
        databaes: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        value1: '',
        value2: '',
        input: '',
        result: {"status": "", "content": ""}
      }
    },
  methods: {
    submit: function() {
      this.result={"status": "提交状态：Success", "content": "提交结果：123"}
      // document.write(this.result);
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

  .title {
    text-align:left;
    font-size: 19px;
    font-weight: bold;
  }

  .database_text {
    /* 当前div与下一个div同行显示 */
    position:absolute;
    /* 元素内居左 */
    text-align:left;
    /* 距离最左侧距离 */
    margin-left: 5%;
    /* 设置元素长度 */
    width: 8%;
    /* 设置元素高度 */
    line-height:40px;
  }

  .database_select {
    position:absolute;
    margin-left: 13%;
    width: 16%;
  }

  .operation_text {
    position:absolute;
    text-align:left;
    margin-left: 32%;
    width: 8%;
    line-height:40px;
  }

  .operation_select{
    margin-left: 58%;
    width: 32%;
  }

  .parm_input_text{
    position:absolute;
    text-align:left;
    margin-left: 5%;;
    width: 8%;;
    line-height:40px;
  }

  .parm_input{
    margin-left: 19.5%;
    width: 70.5%;
  }

  .parm_input_instruction {
    margin-left: 20%;
    text-align:left;
    /* 文本字体大小 */
    font-size: 12px;
    /* 文本字体-斜体 */
    font-style: italic;
    /* 文本加粗 */
    font-weight: bold;
    /* 文本颜色 */
    color:	#808080
  }

  .submit{
    margin-left: 40%;
    width: 100px;
  }

  .result{
    text-align:left;
    margin-top: 60px;
    margin-left: 30%;
    line-height:40px;
    width: 50%;
  }
</style>
