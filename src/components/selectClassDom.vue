<template>
  <section>
    <el-row>
      <el-col :span="24">
        <font color="#006699">教材形式 : </font>
        <input type="radio" name="radio1" value="C" checked />线上教材
        <input type="radio" name="radio1" value="P" />手写教材
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <font color="#006699">章名查询 : </font>
        <input type="text" style="border: 1px solid darkgray;line-height: 30px;" id="txtSearch" :keyup="onSearch2(1)" />
        <el-button type="primary" size="mini" id="btnSearch" @click="onSearch2(0)">查询</el-button>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <table cellspacing=0 width="100%"
               bordercolordark=#ffffff cellpadding=0 bordercolorlight=#e3e3e3 border=1 class="table">
          <tbody>
          <tr>
            <td style="width: 35px;overflow: hidden" class="txt3">章列表 : </td>
            <td width="35%" class="txt3">单元列表 : </td>
            <td width="30%" class="txt3">章描述 : <label id="lblChp"></label><label id="lblUnit"></label></td>
          </tr>
          <tr>
            <td valign=top rowspan="7" style="width: 35px;">
              <ul id="lstChp" style="width: 100%;height:400px;overflow: scroll;list-style: none;-webkit-padding-start: 0px;"></ul>
            </td>
            <td valign=top rowspan="7">
              <ul id="lstUnit" style="width: 100%;height:400px;overflow: scroll;list-style: none;-webkit-padding-start: 0px;"></ul>
            </td>
            <td valign="top">
              <textarea class="t" readonly id="txtChpDesc" style="width: 100%"></textarea>
            </td>
          </tr>
          <tr>
            <td class="txt3">单元描述 : </td>
          </tr>
          <tr>
            <td valign="top">
              <textarea class="t" readonly id="txtUnitDesc" style="width: 100%"></textarea>
            </td>
          </tr>
          <tr>
            <td class="txt3">例题 : </td>
          </tr>
          <tr>
            <td>
              <textarea valign="top" class="t" readonly id="txtSample" style="width: 100%">adfsd</textarea>
            </td>
          </tr>
          <tr>
            <td class="txt3">&nbsp;</td>
          </tr>
          <tr>
            <td valign=center align=center>
              <div class="btn-group" role="group" aria-label="...">
                <el-button type="primary"size="mini" id="btnExercise" @click="handleClick">确 定</el-button>
                <!--<button type="button" id="btnPreview" @click="onNewPreview('N')" class="btn btn-default">预览</button>-->
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </el-col>
    </el-row>
  </section>

</template>
<script type="text/ecmascript-6">
  import {onSearch,onNewPreview,onlstUnit} from '../js/Newdefault'
  export default {
    data(){
      return {
      }
    },
    mounted(){

    },
    methods:{
      onSearch2(v){
        onSearch();
      },
      handleClick(){
        let url = onNewPreview('Y');
        if(!url){
          return this.$message({type:'warning',message:'添加失败！'})
        }
        this.$emit('selectClassHandle',url)
      }
    }
  }
</script>
<style>
  .el-row{
    margin-bottom: 5px;
  }
</style>
