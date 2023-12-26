import { request } from 'umi';
import config from './config';
/** Create user This can only be done by the logged in user. POST /user */

export function getSearchRes(params, options) {
  return request(config.path_head + '/get_address', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),

  }).then(
    // 成功回调
    (res) => {
        console.log('getSearchRes',res)
        return res;
    },
    // 失败回调
    () => {
        return [];
    },
  );
}

export function getCountEvents(params, options) {
  return request(config.path_head + '/get_count_events', {
    method: 'POST',
    // params: { ...params },
    data: params,
    ...(options || {}),
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Allow-Control-Allow-Origin' : '*'
    },
  }).then(
    // 成功回调
    (res) => {
      console.log(res[0])
      // 设置模板变量的值，对象的键需要和模板上的变量名一致，值就是你要放在模板上的值
      const table = [

         { name: "01", danwei: '宜兴埠所', number_1:'17605', huanbi_1:'2%', tongbi_1:'2%', number_2:'122', huanbi_2:'2%', tongbi_2:'1%',number_3:'21', huanbi_3:'6%', tongbi_3:'4%',number_4:'23', huanbi_4:'3%', tongbi_4:'11%',number_5:'5', huanbi_5:'2%', tongbi_5:'2%', },
         { name: "02", danwei: '普东所', number_1:'16889', huanbi_1:'2%', tongbi_1:'2%', number_2:'122', huanbi_2:'2%', tongbi_2:'1%',number_3:'21', huanbi_3:'6%', tongbi_3:'4%',number_4:'23', huanbi_4:'3%', tongbi_4:'11%',number_5:'5', huanbi_5:'2%', tongbi_5:'2%', },
         { name: "03", danwei: '双街所', number_1:'12025', huanbi_1:'2%', tongbi_1:'2%', number_2:'122', huanbi_2:'2%', tongbi_2:'1%',number_3:'21', huanbi_3:'6%', tongbi_3:'4%',number_4:'23', huanbi_4:'3%', tongbi_4:'11%',number_5:'5', huanbi_5:'2%', tongbi_5:'2%', },
         { name: "04", danwei: '小淀所', number_1:'11807', huanbi_1:'2%', tongbi_1:'2%', number_2:'122', huanbi_2:'2%', tongbi_2:'1%',number_3:'21', huanbi_3:'6%', tongbi_3:'4%',number_4:'23', huanbi_4:'3%', tongbi_4:'11%',number_5:'5', huanbi_5:'2%', tongbi_5:'2%', },
         { name: "05", danwei: '瑞景所', number_1:'11336', huanbi_1:'2%', tongbi_1:'2%', number_2:'122', huanbi_2:'2%', tongbi_2:'1%',number_3:'21', huanbi_3:'6%', tongbi_3:'4%',number_4:'23', huanbi_4:'3%', tongbi_4:'11%',number_5:'5', huanbi_5:'2%', tongbi_5:'2%', },
         { name: "06", danwei: '果园新村所', number_1:'10853', huanbi_1:'2%', tongbi_1:'2%', number_2:'122', huanbi_2:'2%', tongbi_2:'1%',number_3:'21', huanbi_3:'6%', tongbi_3:'4%',number_4:'23', huanbi_4:'3%', tongbi_4:'11%',number_5:'5', huanbi_5:'2%', tongbi_5:'2%', },

       ]
      const content = {
        start_time: res[4]['start_time'],
        end_time: res[4]['end_time'],
        eventcount_events_weeks : res[0]['eventcount_events_weeks'],
        eventcount_events_day :  res[0]['eventcount_events_day'],
        eventdays_numbers: res[0]['eventdays_numbers'],
        // eventcount_events_weeks1: res[0]['eventcount_events_day'],
        // eventdays_numbers1: res[0]['eventcount_events_day'],
        // eventcount_events_day1: res[0]['eventcount_events_day'],
        // eventcount_events_weeks2: res[0]['eventcount_events_day'],
        // eventdays_numbers2: res[0]['eventcount_events_day'],
        // eventcount_events_day2: res[0]['eventcount_events_day'],
        eventhuanbi_change: res[0]['eventhuanbi_change'],
        eventhuanbi_rate: res[0]['eventhuanbi_rate'],
        eventtongbi_change: res[0]['eventtongbi_change'],
        eventtongbi_rate: res[0]['eventtongbi_rate'],

        cehuanbi_change: res[1]['cehuanbi_change'],
        cehuanbi_rate: res[1]['cehuanbi_rate'],
        cetongbi_change: res[1]['cetongbi_change'],
        cetongbi_rate: res[1]['cetongbi_rate'],

        aehuanbi_change: res[2]['aehuanbi_change'],
        aehuanbi_rate: res[2]['aehuanbi_rate'],
        aetongbi_change: res[2]['aetongbi_change'],
        aetongbi_rate: res[2]['aetongbi_rate'],

        tehuanbi_change: res[3]['tehuanbi_change'],
        tehuanbi_rate: res[3]['tehuanbi_rate'],
        tetongbi_change: res[3]['tetongbi_change'],
        tetongbi_rate: res[3]['tetongbi_rate'],
        // 表格
        // item_2 : table,
      }
        return content;
    },
    // 失败回调
    () => {
      console.log('失败')
      return [];
    },
  );
}
