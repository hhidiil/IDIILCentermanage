/**
 * * 配置编译环境和线上环境之间的切换
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * Created by gaoju on 2018/10/29.
 */
let baseUrl = '';
let baseUrl_Main = '';//idiil总中心
let baseUrl_dev = '';//分中心
let routerMode = 'hash';

baseUrl = window.location.protocol + "//" +window.location.hostname;
baseUrl_dev = 'https://nwprodsub.idiil.com.cn';
//baseUrl_dev = 'https://joinsub.idiil.com.cn';
//baseUrl_dev = 'https://nwdev.idiil.com.cn';
baseUrl_Main = 'https://nwdev.idiil.com.cn';

export {
  baseUrl,
  baseUrl_Main,
  baseUrl_dev,
  routerMode
}
