<template>
  <el-form>
    <el-form-item label="学生分组:" :label-width="formLabelWidth">
      <el-row>
        <el-col :span="8">
          <el-card class="box-card" style="display: inline-block" :body-style="{ height: '180px',overflowY:'scroll' }">
            <div slot="header" class="clearfix">
              <span>已创建的组</span>
            </div>
            <div v-for="o in form.studentGroup.groupArray" class="text item" @click="editTeam(o)">
              {{o.name}}
            </div>
          </el-card>
        </el-col>
        <el-col :span="16">
          <el-transfer
            style="text-align: left;"
            filterable
            filter-placeholder="请输入学生姓名"
            v-model="form.studentGroup.nowList"
            :titles="form.studentGroup.nowGroup"
            @change="handleChange"
            :data="studentData"
            :key="type">
          </el-transfer>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-button-group>
            <el-button @click="addGroupData()">确定</el-button>
            <el-button @click="resize()">从新分组</el-button>
            <el-button class="tianjiazu" @click="innerDialogVisible = true">新建组</el-button>
          </el-button-group>
          <el-dialog
            title="提示"
            :visible.sync="innerDialogVisible"
            width="30%"
            :before-close="handleClose">
            <span>这是一段信息</span>
            <span slot="footer" class="dialog-footer">
              <el-button @click="innerDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="innerDialogVisible = false">确 定</el-button>
            </span>
          </el-dialog>
        </el-col>
      </el-row>
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
        const generateData = _ => {
          const data = [];
          let data_temp=JSON.parse(classData1).studentList
          for (let i = 1; i <= data_temp.length; i++) {
            data.push({
              key: data_temp[i-1].id,
              label: data_temp[i-1].name
            });
            console.log(data_temp[i-1].name)
          }
          return data;
        };
        return {
          studentData: generateData(),
          form: JSON.parse(classData1).classList,
          // studentData:[{userName:'王生安'},{userName:'李鑫灏'},{userName:'薛世'},{userName:'蔡壮保'},{userName:'钱勤堃'},
          // {userName:'潘恩依'},{userName:'陈国柏'},{userName:'魏皑虎'},{userName:'周卓浩'},{userName:'汤辟邦'},{userName:'张顺谷'},{userName:'张悌斯'},{userName:'张灶冲'},{userName:'易江维'},{userName:'孙来笙'},{userName:'饶展林'},{userName:'岳列洋'},
          // {userName:'时党舒'},{userName:'周迟蒲'},{userName:'廉梦容'},{userName:'张淮森'},{userName:'夏劲'},{userName:'王好隐'},{userName:'刘昼星'},{userName:'池荣弈'},{userName:'邹包幼'},{userName:'王施峪'},{userName:'武慎萌'},{userName:'范千皋'},
          // {userName:'潘佩焱'},{userName:'周逸依'},{userName:'齐寒昇'},{userName:'邱栾树'},{userName:'卢钦钧'},{userName:'文壮翔'},{userName:'蔡沐壮'},{userName:'唐盎正'},{userName:'王腾振'},{userName:'蔡容富'},{userName:'宁雨御'},{userName:'朱付流'},
          // {userName:'陆丛枫'},{userName:'汤丞昱'},{userName:'萧百徽'},{userName:'田稻善'},{userName:'莫立恩'},{userName:'戚苏'},{userName:'郭磊留'},{userName:'邱靖祈'},{userName:'刘鲜发'},{userName:'李彩早'},{userName:'卓互知'},{userName:'岳繁粟'},
          // {userName:'莫两敬'},{userName:'贺易'},{userName:'岑贝澄'},{userName:'陶杜'},{userName:'卫惇琰'},{userName:'王赫颢'},{userName:'何刚名'},{userName:'梁澄静'},{userName:'卢全煦'},{userName:'严席华'},{userName:'张顺廉'},{userName:'欧贡界'},{userName:'汤始青'},
          // {userName:'张鸿鹤'},{userName:'车亚忠'},{userName:'龙璨禄'},{userName:'柯纤翊'},{userName:'池慕营'},{userName:'吴登菘'},{userName:'齐奋厦'},{userName:'夏莱冶'},{userName:'夏吏克'},{userName:'殷蒙共'},{userName:'齐聪纪'},{userName:'金图康'},{userName:'秦尝乐'},
          // {userName:'丘心'},{userName:'俞灶迟'},{userName:'元感棋'},{userName:'陆示笙'},{userName:'简胜琰'},{userName:'云介融'},{userName:'梁夜翊'},{userName:'成昀澄'},{userName:'卞然倌'},{userName:'林静育'},{userName:'王成文'},{userName:'张昧谡'},{userName:'苏经苞'},
          // {userName:'彭笙葛'},{userName:'龚佩义'},{userName:'何翼宪'},{userName:'路桥'},{userName:'彭煌彤'},{userName:'严君'},{userName:'吴来衷'},{userName:'侯真堂'},{userName:'岑弥勳'},{userName:'龙铮财'},{userName:'张侠皆'},{userName:'周昀薄'},{userName:'葛赋铎'},
          // {userName:'车瑛鸿'},{userName:'邱涧栾'},{userName:'池亭其'},{userName:'鲁栋国'},{userName:'王侨'},{userName:'宁古'},{userName:'梁真'},{userName:'刘慕骏'},{userName:'贺滨'},{userName:'张宁光'},{userName:'吴川宜'},{userName:'蒲惇坚'},{userName:'欧彩徽'},{userName:'雷琳'},
          // {userName:'张频启'},{userName:'张祥德'},{userName:'周宪'},{userName:'龚杭维'},{userName:'翁编映'},{userName:'成河灿'},{userName:'赵毅敦'},{userName:'周谷岩'},{userName:'胡俐庚'},{userName:'邹度承'},{userName:'古军童'},{userName:'何颖升'},{userName:'王裁愿'},
          // {userName:'郑夜洲'},{userName:'戚扬伙'},{userName:'蒲元明'},{userName:'韩侠胤'},{userName:'刘德耿'},{userName:'王榕骋'},{userName:'尤三耀'},{userName:'余键开'},{userName:'陈原庚'},{userName:'何易晾'},{userName:'洪荐颢'},{userName:'余侠农'},{userName:'韦炜熊'},
          // {userName:'林必立'},{userName:'席喜'},{userName:'黄准'},{userName:'赵票威'},{userName:'王卓谡'},{userName:'丘约靖'},{userName:'饶皋素'},{userName:'郭炜俏'},{userName:'温曙映'},{userName:'陈春映'},{userName:'涂宣愈'},{userName:'韦品咏'},{userName:'龙壬薇'},
          // {userName:'周意竹'},{userName:'卫珠'},{userName:'陈启红'},{userName:'蔡保群'},{userName:'邢琴嫣'},{userName:'施金筌'},{userName:'文伟嘉'},{userName:'邢妤碧'},{userName:'施嶷卿'},{userName:'邢愈彦'},{userName:'成蕊蓉'},{userName:'王屏迎'},{userName:'吴湘意'},{userName:'刘玉'},
          // {userName:'王吉蓉'},{userName:'柳述俊'},{userName:'穆佑碧'},{userName:'赵程缨'},{userName:'韦裁苗'},{userName:'张存丽'},{userName:'范鹊茜'},{userName:'萧婷豫'},{userName:'宁芹谚'},{userName:'莫昀蕊'},{userName:'侯谊玉'},{userName:'韦傲然'},{userName:'钱等英'},{userName:'廖静'},
          // {userName:'高翔绚'},{userName:'袁裳群'},{userName:'费竞凡'},{userName:'齐量珍'},{userName:'邢衷晓'},{userName:'傅谊愿'},{userName:'廉生虹'},{userName:'金夷俊'},{userName:'倪情爽'},{userName:'樊依可'},{userName:'萧盈兰'},{userName:'颜舒爱'},{userName:'洪令艺'},{userName:'潘忻妍'},
          // {userName:'葛冠媛'},{userName:'成澄靖'},{userName:'林充蝶'},{userName:'莫驰晓'},{userName:'樊昆娥'},{userName:'蔡丞瑜'},{userName:'席浩贞'},{userName:'梅贤芝'},{userName:'潘本素'},{userName:'王留微'},{userName:'钟艳梦'},{userName:'樊鲜蓉'},{userName:'江服靖'},{userName:'乐伴岚'},
          // {userName:'柯量群'}],
          activeNames: ['1'],
          formLabelWidth: '90px',
          innerDialogVisible:false
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
        editTeam(o){
          let me=this;
          me.form.studentGroup.nowGroup.splice(1,1);
          me.form.studentGroup.nowGroup.push(o.name)
          me.form.studentGroup.nowList=[];
          $(o.studentList).each(function(){
            me.form.studentGroup.nowList.push($(this).attr("id"))
          })
        }
      }
    }
</script>

<style scoped>

</style>
