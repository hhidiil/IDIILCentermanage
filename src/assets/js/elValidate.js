/**
 * Created by cuiwenping on 2019/5/23.
 */
//-------验证-------- 手机号
export function elValidatePhone(rule, value, callback) {
  if (value == '') {
    return callback(new Error('手机号码不能为空'))
  } else {
    let re = /^1[23456789]\d{9}$/;
    if (!re.test(value)) {
      return callback(new Error('手机号码输入格式有误'))
    }
    return callback();
  }
}
