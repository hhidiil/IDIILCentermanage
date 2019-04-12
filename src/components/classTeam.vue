<template>
  <el-form>
    <el-form-item label="学生分组:" :label-width="formLabelWidth">
      <div>
        <el-transfer
          style="text-align: left;"
          v-model="form.studentGroup.nowList"
          :titles="form.studentGroup.nowGroup"
          @change="handleChange"
          :data="studentData"
          :key="type">
          <span slot-scope="{ option }">{{ option.userName }}</span>
          <el-button class="transfer-footer" slot="right-footer" type="primary" size="small" @click="addGroupData()">确定</el-button>
          <el-button class="transfer-footer" slot="right-footer" type="primary" size="small" @click="resize()">从新分组</el-button>
          <el-button class="transfer-footer tianjiazu" slot="right-footer" size="small" @click="innerDialogVisible = true">新建组</el-button>
        </el-transfer>
        <el-collapse v-model="activeNames" style="text-align: left">
          <el-collapse-item  v-for="(group,index) in form.studentGroup.groups" :name="index" :key="index">
            <template slot="title">{{group.name}}
              <el-button @click.stop="editGroup(group,index)" style="margin-left: 10px" size="mini" type="primary" icon="el-icon-edit" circle></el-button>
            </template>
            <el-tag
              v-for="(item,index) in group.studentItem"
              :key="index"
            >
              {{item.userName}}
            </el-tag>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-form-item>
  </el-form>
</template>

<script type="text/ecmascript-6">
    import {setStore, getStore} from '../config/publicMethod'
    import classData from '../data/classlist'
    export default {
      props: ['data', 'type', 'addFlag'],
      name: "classTeam",
      data() {
        let classData1 = JSON.stringify(classData)
        return {
          studentData: [],
          activeNames: ['1'],
          formLabelWidth: '90px',
          form: JSON.parse(classData1).classList
        }
      },
      computed: {
        sourceData () {
          let changeValue = this.form.studentGroup.nowList
          return this.studentData.filter(item => changeValue.indexOf(item.key) === -1)
        }
      },
      methods: {
        async getclassesList() {
          let result1 = await getAllClassesOfCenter({centerId: '002'})
          console.log('班级列表--------------------->', result1)
          if (result1.code === 200) {
            this.classOptions = result1.data
          }
        },
        handleChange(value, direction, movedKeys) {
          console.log('studentData', this.studentData)
          console.log('value', value)
          console.log('direction', direction)
          console.log('movedKeys', movedKeys)
          this.direction = direction
          this.form.studentGroup.nowList = value
        },
        // 确定按钮 --往组里面加数据
        addGroupData() {
          let form = this.form
          let endnowList = this.filterNowList(form.studentGroup.nowList)// 选中的学生列表，要添加到组里面的
          let nowgroupname = form.studentGroup.nowGroup[1]// 当前修改的是哪一个组
          let group = form.studentGroup.groups// 当前所有组的信息
          if ($.inArray(nowgroupname, form.studentGroup.groupArray) != -1) { // 已存在
            for (let ii in group) {
              if (group[ii].name == nowgroupname) { // 改组已经存在 则修改
                form.studentGroup.groups[ii].studentItem = form.studentGroup.groups[ii].studentItem.concat(endnowList)
              }
            }
          } else {
            form.studentGroup.groupArray.push(nowgroupname)
            form.studentGroup.groups.push({
              name: nowgroupname,
              studentItem: endnowList
            })
          }
          this.studentData = this.sourceData// 移除后的学生列表数组 赋值给 学生源数组
        },

      }
    }
</script>

<style scoped>

</style>
