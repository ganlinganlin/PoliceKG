from email.errors import StartBoundaryNotFoundDefect
from platform import node
from tracemalloc import start
from neo4j import GraphDatabase, basic_auth
import json
import sys
sys.path.append('D:\Web\PoliceKG')
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta



def get_one_week_ago(input_time_str):
    # 将字符串表示的时间转换为 datetime 对象
    input_time = datetime.strptime(input_time_str, '%Y-%m-%d')

    # 计算一周前的时间
    one_week_ago = input_time - timedelta(weeks=1)
    # 将结果格式化为字符串
    one_week_ago_str = one_week_ago.strftime('%Y-%m-%d')

    return one_week_ago_str


def get_one_year_ago(input_time_str):
    # 将字符串表示的时间转换为 datetime 对象
    input_time = datetime.strptime(input_time_str, '%Y-%m-%d')

    # 计算一年前的时间
    one_year_ago = input_time - relativedelta(years=1)
    # 将结果格式化为字符串
    one_year_ago_str = one_year_ago.strftime('%Y-%m-%d')

    return one_year_ago_str

def calculate_days_difference(time_str1, time_str2):
    # 将字符串表示的时间转换为 datetime 对象
    time1 = datetime.strptime(time_str1, '%Y-%m-%d')
    time2 = datetime.strptime(time_str2, '%Y-%m-%d')

    # 计算时间差
    time_difference = abs(time1 - time2)

    # 获取天数部分
    days_difference = time_difference.days

    return days_difference + 1


def calculate_yoy_growth_rate(current_year_value, last_year_value):
    try:
        # 计算同比增长率
        yoy_growth_rate = ((current_year_value - last_year_value) / abs(last_year_value)) * 100
        return round(yoy_growth_rate,2)
    except ZeroDivisionError:
        # 处理除零错误（如果去年值为零）
        return float('inf')

def adjust_dates(start_date_str, end_date_str):
    # 将字符串转换为日期对象
    start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
    end_date = datetime.strptime(end_date_str, '%Y-%m-%d')

    # 将初始时间调整为每年的1月1日
    adjusted_start_date = datetime(start_date.year, 1, 1)
    # 将终止时间调整为相同年份的那个月份的1日
    adjusted_end_date = datetime(end_date.year, end_date.month, 1)

    # 返回调整后的日期字符串
    return adjusted_start_date.strftime('%Y-%m-%d'), adjusted_end_date.strftime('%Y-%m-%d')



class GraphDB:

    def __init__(self, uri, user, password):
        self.driver = GraphDatabase.driver(uri, auth=basic_auth(user, password))

    def close(self):
        self.driver.close()

    def serialize_subj(self,item):
        return{
            'id' : item['id'],
            'name' : item['name'],
            'label' : 'subj'
        }
    def serialize_conc(self,item):
        return{
            'id': item['id'],
            'name': item['name'],
            'label' : 'conc'
        }
    def serialize_oper(self,item):
        return{
            'id': item['id'],
            'name': item['name'],
            'label' : 'oper'
        }
    def serialize_meth(self,item):
        return{
            'id': item['id'],
            'name': item['name'],
            'label' : 'meth'
    }
    def serialize_node(self,item):

        return{
            'id': item.id,
            'label': tuple(item.labels)[0],
            'properties': {
                'name': item['name'],
                'address': item['address'],
                'time': item['time'],

                'category': item['category'],
                'small': item['small'],
                'thin': item['thin'],
                'type': item['type'],

                'branch_public_security_bureau': item['branch_public_security_bureau'],
                'first_unit': item['first_unit'],
                'link_unit': item['link_unit'],

                'content': item['content'],
                'event': item['event'],
                'feedback': item['feedback'],
                'source': item['source'],
                'status':item['status']
            }
        }

    def serialize_path(self,item):

        return {
            'source': self.serialize_node(item.nodes[0]),
            'target': self.serialize_node(item.nodes[1]),
            'type': item.type,
            # 'properties': item.properties
        }
    
    def serialize_answer(self,item):

        return {
            'id': item['id'],
            'name': item['name'],
            
        }


    def get_graph(self):
        query_str ='MATCH P=(s:TIME) -[r]-> () RETURN P'
        with self.driver.session() as session:
            res = session.read_transaction(lambda tx: list(tx.run("MATCH P=(s:subj) -[r]-> (n)"
                                                        "RETURN s.name as Subject, id(s) as id, collect(n) as conc" )))
            rel = session.read_transaction(lambda tx: list(tx.run("MATCH P=(s:subj) -[r]-> (n)"
                                                        "RETURN r as rel" )))
            test = session.read_transaction(lambda tx: list(tx.run(query_str)))
            # session.read_transaction(lambda tx: list(tx.run("MATCH(c:Concept)-[:CONTAIN]->(o:Operation)"
            #                                             "RETURN c.name as conc,collect (o.name1) as oper"
            #                                             )))
            # oper_meth = session.read_transaction(lambda tx: list(tx.run("MATCH(o:Operation)-[r:CONTAIN2]->(m:Method)　"
            #                                             "RETURN o.name1 as oper,collect (m.method) as meth")))
        return res, rel,test


    def search_nodeid(self,id):
        query_str = 'MATCH (n) where id(n)=$id RETURN n as node'
        params = {
            'id' : id
        }
        with self.driver.session() as session:
            result = session.read_transaction(lambda tx: list(tx.run(query_str, params)))
        # print(result)
        res = [self.serialize_node(record['node']) for record in result]
        return res
    

    
    def search_graph(self, data):
        query_str = "match p = (n) -- (m) where n.name Contains \"%s\" return p as p"%data['data']
        # query_str.format(str=data)
        # print(query_str)
        # params = {
        #     'data' : data['data']
        # }
        nodeset = []
        nodes = []
        links = []

        try:
            with self.driver.session() as session:
                result = session.read_transaction(lambda tx: list(tx.run(query_str)))
                # print(result)
            for path in result:
                # print(path['p'].Relationship)
                for item in path['p']:
                    # print(item.type)
                    start = self.serialize_node(item.nodes[0])
                    end = self.serialize_node(item.nodes[1])
                    # print(start['name'])
                    # print(start, end)
                    link = self.serialize_path(item)

                    # 结点去重
                    try:
                        nodeset.index(start['properties']['name'])
                    except Exception:
                        nodeset.append(start['properties']['name'])
                        nodes.append(start)

                    try:
                        nodeset.index(end['properties']['name'])
                    except Exception:
                        nodeset.append(end['properties']['name'])
                        nodes.append(end)

                    links.append(link)
            return links, nodes
        except Exception as e:
            print('Error,no data!',e)
            links = []
            nodes = []
            return links,nodes


    def search_event(self, data): #match data=(t:TIME)-[r1:`事件时间`]->()-[r2:`事件地点`]->(a:ADDRESS) where '2023.08.08' <= t.time <= '2023.08.18' AND a.address = '天津市北辰区双口镇双口一村' return data
        query_str = "match p=(t:TIME)-[r1:`事件时间`]->()-[r2:`事件地点`]->(a:ADDRESS) where '%s' <= t.time <= '%s' AND a.address = '%s' return p as p"%(data['start_time'],data['end_time'],data['address'])
        # "match p = (n) -- (m) where n.name Contains \"%s\" return p as p"% data['data']
        # query_str.format(str=data)
        print(query_str)
        print(data)
        # params = {
        #     'data' : data['data']
        # }
        nodeset = []
        nodes = []
        links = []

        try:
            with self.driver.session() as session:
                result = session.read_transaction(lambda tx: list(tx.run(query_str)))
                # print(result)
                # return result
            for path in result:
                # print(path['p'].Relationship)



                for item in path['p']:
                    # print(item.type)
                    start = self.serialize_node(item.nodes[0])
                    end = self.serialize_node(item.nodes[1])
                    # print(start['id'])
                    # print(start, end)
                    link = self.serialize_path(item)

                    # 结点去重
                    try:
                        nodeset.index(start['id'])
                    except Exception:
                        nodeset.append(start['id'])
                        nodes.append(start)

                    try:
                        nodeset.index(end['id'])
                    except Exception:
                        nodeset.append(end['id'])
                        nodes.append(end)

                    links.append(link)
            return links, nodes
        except Exception as e:
            print('Error,no data!',e)
            links = []
            nodes = []
            return links,nodes

    def search_event_number(self, data): #match data=(t:TIME)-[r1:`事件时间`]->()-[r2:`事件地点`]->(a:ADDRESS) where '2023.08.08' <= t.time <= '2023.08.18' AND a.address = '天津市北辰区双口镇双口一村' return data
        query_str = "match data=(t:TIME)-[r1:`事件时间`]->(event)-[r2:`事件地点`]->(a:ADDRESS) where '%s' <= t.time <= '%s' AND a.address = '%s' with event,t,a match (event)-[r3]->(ac:Alarm_Category) RETURN t.time,a.address,ac.category AS ac_category, COUNT(*) AS event_count ORDER BY event_count DESC;"%(data['start_time'],data['end_time'],data['address'])
        #"match p=(t:TIME)-[r1:`事件时间`]->()-[r2:`事件地点`]->(a:ADDRESS) where '%s' <= t.time <= '%s' AND a.address = '%s' return p as p"%(data['start_time'],data['end_time'],data['address'])

        print(query_str)
        print(data)
        res =[]
        with self.driver.session() as session:
            result = session.read_transaction(lambda tx: list(tx.run(query_str)))

        for item in result:
            obj ={
                "time" : item[0],
                "address": item[1],
                "event": item[2],
                "number": item[3],
            }
            res.append(obj)

        return res



    #word文档导出
    def get_count_events(self,data):
        start_time = data['start_time']
        end_time = data['end_time']
        one_week_ago_start_time = get_one_week_ago(data['start_time'])
        one_week_ago_end_time = get_one_week_ago(data['end_time'])
        one_year_ago_start_time = get_one_year_ago(data['start_time'])
        one_year_ago_end_time = get_one_year_ago(data['end_time'])

        days_numbers = calculate_days_difference(data['start_time'], data['end_time'])
        days_numbers1 = calculate_days_difference(one_week_ago_start_time, one_week_ago_end_time)
        print("days_numbers1:", days_numbers1)
        days_numbers2 = calculate_days_difference(one_year_ago_start_time, one_year_ago_end_time)
        print("days_numbers2:", days_numbers2)
        res = []

        type_list = {
            'event': 'event',
            'ce': 'ce:Criminal_EVENT',
            'ae': 'ae:Administrative_EVENT',
            'te': 'te:Traffic_EVENT'
        }
        keys_list = list(type_list.keys())
        values_set = list(type_list.values())

        for i in range(len(type_list)):
            query_str = "match data=(t:TIME)-[r1:`事件时间`]->(%s)-[r2:`事件地点`]->(a:ADDRESS) where '%s' <= t.time <= '%s' RETURN COUNT(%s) AS count_events" %(values_set[i],start_time, end_time,keys_list[i])
            one_week_ago_query_str = "match data=(t:TIME)-[r1:`事件时间`]->(%s)-[r2:`事件地点`]->(a:ADDRESS) where '%s' <= t.time <= '%s' RETURN COUNT(%s) AS count_events" %(values_set[i],one_week_ago_start_time, one_week_ago_end_time,keys_list[i])
            one_year_ago_query_str = "match data=(t:TIME)-[r1:`事件时间`]->(%s)-[r2:`事件地点`]->(a:ADDRESS) where '%s' <= t.time <= '%s' RETURN COUNT(%s) AS count_events" %(values_set[i],one_year_ago_start_time, one_year_ago_end_time,keys_list[i])
            print(query_str)
            with self.driver.session() as session:
                result = session.read_transaction(lambda tx: list(tx.run(query_str)))
                one_week_ago_result = session.read_transaction(lambda tx: list(tx.run(one_week_ago_query_str)))
                one_year_ago_result = session.read_transaction(lambda tx: list(tx.run(one_year_ago_query_str)))
            for item in result:
                obj = {
                    keys_list[i]+"count_events_weeks": item[0],
                    keys_list[i]+"days_numbers": days_numbers,
                    keys_list[i]+"count_events_day": item[0] // days_numbers,
                }
            for item in one_week_ago_result:
                print(item)
                obj1 = {
                    keys_list[i]+"count_events_weeks1": item[0],
                    keys_list[i]+"days_numbers1": days_numbers1,
                    keys_list[i]+"count_events_day1": item[0] // days_numbers1,
                }
                obj.update(obj1)
            for item in one_year_ago_result:
                print(item)
                obj2 = {
                    keys_list[i]+"count_events_weeks2": item[0],
                    keys_list[i]+"days_numbers2": days_numbers2,
                    keys_list[i]+"count_events_day2": item[0] // days_numbers1,
                }
                obj.update(obj2)
            huanbi_rate = calculate_yoy_growth_rate(obj[keys_list[i]+"count_events_weeks"],obj[keys_list[i]+"count_events_weeks1"])
            if huanbi_rate == float('inf'):
                print("去年值为零，无法计算同比增长率。")
                huanbi = {
                    keys_list[i] + 'huanbi_change': "去年值为零无法计算",
                    keys_list[i] + 'huanbi_rate': 0
                }
            else:
                print("环比增长率为： {:.2f}%".format(huanbi_rate))
                print("环比增长率为： {:.2f}%", huanbi_rate)
                if huanbi_rate >= 0:
                    huanbi = {
                        keys_list[i] + 'huanbi_change': '上升',
                        keys_list[i] + 'huanbi_rate': "{:.2f}%".format(abs(huanbi_rate)),
                    }
                else:
                    huanbi = {
                        keys_list[i] + 'huanbi_change': '下降',
                        keys_list[i] + 'huanbi_rate': "{:.2f}%".format(abs(huanbi_rate)),
                    }
            obj.update(huanbi)

            tongbi_rate = calculate_yoy_growth_rate(obj[keys_list[i]+"count_events_weeks"], obj[keys_list[i]+"count_events_weeks2"])
            if tongbi_rate == float('inf'):
                print("去年值为零，无法计算同比增长率。")
                tongbi = {
                    keys_list[i] + 'tongbi_change': "去年值为零无法计算",
                    keys_list[i] + 'tongbi_rate': 0

                }
            else:
                print("环比增长率为： {:.2f}%".format(tongbi_rate))
                if tongbi_rate >= 0:
                    tongbi = {
                        keys_list[i]+'tongbi_change': '上升',
                        keys_list[i] + 'huanbi_rate': "{:.2f}%".format(abs(tongbi_rate)),
                    }
                else:
                    tongbi = {
                        keys_list[i]+'tongbi_change': '下降',
                        keys_list[i] + 'huanbi_rate': "{:.2f}%".format(abs(tongbi_rate)),
                    }
            obj.update(tongbi)
            res.append(obj)
        return res

    # 本周警情综述
    def get_count_events_figure(self,data):
        start_time = data['start_time']
        end_time = data['end_time']
        one_week_ago_start_time = get_one_week_ago(data['start_time'])
        one_week_ago_end_time = get_one_week_ago(data['end_time'])
        one_year_ago_start_time = get_one_year_ago(data['start_time'])
        one_year_ago_end_time = get_one_year_ago(data['end_time'])

        days_numbers = calculate_days_difference(data['start_time'], data['end_time'])
        days_numbers1 = calculate_days_difference(one_week_ago_start_time, one_week_ago_end_time)
        print("days_numbers1:", days_numbers1)
        days_numbers2 = calculate_days_difference(one_year_ago_start_time, one_year_ago_end_time)
        print("days_numbers2:", days_numbers2)
        res = []

        type_list = {
            'event': 'event',
            'ce': 'ce:Criminal_EVENT',
            'ae': 'ae:Administrative_EVENT',
            'te': 'te:Traffic_EVENT'
        }
        keys_list = list(type_list.keys())
        values_set = list(type_list.values())

        for i in range(len(type_list)):
            query_str = "match data=(t:TIME)-[r1:`事件时间`]->(%s)-[r2:`事件地点`]->(a:ADDRESS) where '%s' <= t.time <= '%s' RETURN COUNT(%s) AS count_events" %(values_set[i],start_time, end_time,keys_list[i])
            one_week_ago_query_str = "match data=(t:TIME)-[r1:`事件时间`]->(%s)-[r2:`事件地点`]->(a:ADDRESS) where '%s' <= t.time <= '%s' RETURN COUNT(%s) AS count_events" %(values_set[i],one_week_ago_start_time, one_week_ago_end_time,keys_list[i])
            one_year_ago_query_str = "match data=(t:TIME)-[r1:`事件时间`]->(%s)-[r2:`事件地点`]->(a:ADDRESS) where '%s' <= t.time <= '%s' RETURN COUNT(%s) AS count_events" %(values_set[i],one_year_ago_start_time, one_year_ago_end_time,keys_list[i])
            print(query_str)
            with self.driver.session() as session:
                result = session.read_transaction(lambda tx: list(tx.run(query_str)))
                one_week_ago_result = session.read_transaction(lambda tx: list(tx.run(one_week_ago_query_str)))
                one_year_ago_result = session.read_transaction(lambda tx: list(tx.run(one_year_ago_query_str)))
            for item in result:
                obj = {
                    keys_list[i]+"count_events_weeks": item[0],
                    keys_list[i]+"days_numbers": days_numbers,
                    keys_list[i]+"count_events_day": item[0] // days_numbers,
                }
            for item in one_week_ago_result:
                print(item)
                obj1 = {
                    keys_list[i]+"count_events_weeks1": item[0],
                    keys_list[i]+"days_numbers1": days_numbers1,
                    keys_list[i]+"count_events_day1": item[0] // days_numbers1,
                }
                obj.update(obj1)
            for item in one_year_ago_result:
                print(item)
                obj2 = {
                    keys_list[i]+"count_events_weeks2": item[0],
                    keys_list[i]+"days_numbers2": days_numbers2,
                    keys_list[i]+"count_events_day2": item[0] // days_numbers1,
                }
                obj.update(obj2)
            huanbi_rate = calculate_yoy_growth_rate(obj[keys_list[i]+"count_events_weeks"],obj[keys_list[i]+"count_events_weeks1"])
            if huanbi_rate == float('inf'):
                huanbi = {
                    'type': '环比',
                    'value': 0
                }
            else:
                huanbi = {
                    'type': '环比',
                    'value': huanbi_rate
                }
            if keys_list[i] == 'event':
                label = {
                    'label': '有效警情',
                }
            elif keys_list[i] == 'ce':
                label = {
                    'label': '刑事警情',
                }
            elif keys_list[i] == 'ae':
                label = {
                    'label': '行政（治安）警情',
                }
            elif keys_list[i] == 'te':
                label = {
                    'label': '交通警情',
                }
            obj.update(huanbi)
            huanbi.update(label)

            tongbi_rate = calculate_yoy_growth_rate(obj[keys_list[i]+"count_events_weeks"], obj[keys_list[i]+"count_events_weeks2"])
            if tongbi_rate == float('inf'):
                tongbi = {
                    'type': '同比',
                    'value': 0
                }
            else:
                tongbi = {
                    'type': '同比',
                    'value': tongbi_rate
                }
            if keys_list[i] == 'event':
                label = {
                    'label': '有效警情',
                }
            elif keys_list[i] == 'ce':
                label = {
                    'label': '刑事警情',
                }
            elif keys_list[i] == 'ae':
                label = {
                    'label': '行政（治安）警情',
                }
            elif keys_list[i] == 'te':
                label = {
                    'label': '交通警情',
                }
            tongbi.update(label)

            res.append(huanbi)
            res.append(tongbi)
        return res



    # 全局有效警情分类情况
    def get_count_events_sort(self,data):
        start_time = data['start_time']
        end_time = data['end_time']

        res = []

        query_str = "match data=(t:TIME)-[r1:`事件时间`]->(event)-[r2:`事件地点`]->(a:ADDRESS) where '%s' <= t.time <= '%s' with event,t,a match (event)-[r3]->(ac:Alarm_Category) RETURN ac.category AS ac_category, COUNT(*) AS event_count ORDER BY event_count DESC;" %(start_time, end_time)
        print(query_str)
        with self.driver.session() as session:
            result = session.read_transaction(lambda tx: list(tx.run(query_str)))
        # print(result)
        for item in result:
            # print(item)
            obj = {
                "type": item[0],
                'value':item[1],
            }
            res.append(obj)
        return res



    # 本时段各单位110接报警情一览表
    def get_schedule_this_time(self,data):
        start_time = data['start_time']
        end_time = data['end_time']

        res = []

        query_str_1 = "MATCH data = (p:PRU)-[r1:`事件负责单位`]->(e)-[r2:`事件时间`]->(t:TIME) WHERE '%s' <= t.time <= '%s' WITH p, e, r2, t RETURN p.first_unit, p.name, count(*) AS events ORDER BY events DESC;" %(start_time, end_time)
        query_str_2 = "MATCH data = (p:PRU)-[r1:`事件负责单位`]->(ce:Criminal_EVENT)-[r2:`事件时间`]->(t:TIME) WHERE '%s' <= t.time <= '%s' WITH p, ce, r2, t RETURN p.first_unit, p.name,labels(ce), count(*) AS events ORDER BY events DESC;" %(start_time, end_time)
        query_str_3 = "MATCH data = (p:PRU)-[r1:`事件负责单位`]->(ae:Administrative_EVENT)-[r2:`事件时间`]->(t:TIME) WHERE '%s' <= t.time <= '%s' WITH p, ae, r2, t RETURN p.first_unit, p.name,labels(ae), count(*) AS events ORDER BY events DESC;" %(start_time, end_time)
        query_str_4 = "MATCH data = (p:PRU)-[r1:`事件负责单位`]->(e)-[r2:`事件时间`]->(t:TIME) WHERE '%s' <= t.time <= '%s' WITH p, e, r2, t MATCH data2 = (e)-[r3:`事件报警类别`]->(ac:Alarm_Category) WHERE ac.small = '通信网络诈骗' AND ac.category IN ['行政(治安)警情','刑事警情'] RETURN p.first_unit, p.name, count(*) AS events ORDER BY events DESC ;" %(start_time, end_time)
        query_str_5 = "MATCH data = (p:PRU)-[r1:`事件负责单位`]->(e)-[r2:`事件时间`]->(t:TIME) WHERE '%s' <= t.time <= '%s' WITH  p.first_unit AS first_unit, p.name AS name, e.phone AS phone, count(*) AS numbers WHERE numbers >=2 RETURN first_unit, name, count(*) AS events ORDER BY events DESC;" %(start_time, end_time)

        print(query_str_1)
        with self.driver.session() as session:
            result_1 = session.read_transaction(lambda tx: list(tx.run(query_str_1)))
            result_2 = session.read_transaction(lambda tx: list(tx.run(query_str_2)))
            result_3 = session.read_transaction(lambda tx: list(tx.run(query_str_3)))
            result_4 = session.read_transaction(lambda tx: list(tx.run(query_str_4)))
            result_5 = session.read_transaction(lambda tx: list(tx.run(query_str_5)))

        # print(result)
        for item in result_1:
            # print(item)
            obj = {
                "key": item[1],
                'value':item[2],
                'type': '全部警情',
            }
            res.append(obj)
        for item in result_2:
            # print(item)
            obj2 = {
                "key": item[1],
                'value':item[3],
                'type': '刑事警情',
            }
            res.append(obj2)
        for item in result_3:
            # print(item)
            obj3 = {
                "key": item[1],
                'value':item[3],
                'type': '治安警情',
            }
            res.append(obj3)
        for item in result_4:
            # print(item)
            obj4 = {
                "key": item[1],
                'value':item[2],
                'type': '诈骗警情',
            }
            res.append(obj4)
        for item in result_5:
            # print(item)
            obj5 = {
                "key": item[1],
                'value':item[2],
                'type': '重复警情',
            }
            res.append(obj5)
        return res


    # 2023年以来各单位110接报警情一览表
    def get_schedule_all_time(self,data):
        start_time = data['start_time']
        end_time = data['end_time']
        start_time1, end_time1 = adjust_dates(start_time, end_time)
        res = []

        query_str_1 = "MATCH data = (p:PRU)-[r1:`事件负责单位`]->(e)-[r2:`事件时间`]->(t:TIME) WHERE '%s' <= t.time <= '%s' WITH p, e, r2, t RETURN p.first_unit, p.name, count(*) AS events ORDER BY events DESC;" % (start_time1, end_time1)
        query_str_2 = "MATCH data = (p:PRU)-[r1:`事件负责单位`]->(ce:Criminal_EVENT)-[r2:`事件时间`]->(t:TIME) WHERE '%s' <= t.time <= '%s' WITH p, ce, r2, t RETURN p.first_unit, p.name,labels(ce), count(*) AS events ORDER BY events DESC;" % (start_time1, end_time1)
        query_str_3 = "MATCH data = (p:PRU)-[r1:`事件负责单位`]->(ae:Administrative_EVENT)-[r2:`事件时间`]->(t:TIME) WHERE '%s' <= t.time <= '%s' WITH p, ae, r2, t RETURN p.first_unit, p.name,labels(ae), count(*) AS events ORDER BY events DESC;" % (start_time1, end_time1)
        query_str_4 = "MATCH data = (p:PRU)-[r1:`事件负责单位`]->(e)-[r2:`事件时间`]->(t:TIME) WHERE '%s' <= t.time <= '%s' WITH p, e, r2, t MATCH data2 = (e)-[r3:`事件报警类别`]->(ac:Alarm_Category) WHERE ac.small = '通信网络诈骗' AND ac.category IN ['行政(治安)警情','刑事警情'] RETURN p.first_unit, p.name, count(*) AS events ORDER BY events DESC ;" % (start_time1, end_time1)
        query_str_5 = "MATCH data = (p:PRU)-[r1:`事件负责单位`]->(e)-[r2:`事件时间`]->(t:TIME) WHERE '%s' <= t.time <= '%s' WITH  p.first_unit AS first_unit, p.name AS name, e.phone AS phone, count(*) AS numbers WHERE numbers >=2 RETURN first_unit, name, count(*) AS events ORDER BY events DESC;" % (start_time1, end_time1)

        print(query_str_1)
        with self.driver.session() as session:
            result_1 = session.read_transaction(lambda tx: list(tx.run(query_str_1)))
            result_2 = session.read_transaction(lambda tx: list(tx.run(query_str_2)))
            result_3 = session.read_transaction(lambda tx: list(tx.run(query_str_3)))
            result_4 = session.read_transaction(lambda tx: list(tx.run(query_str_4)))
            result_5 = session.read_transaction(lambda tx: list(tx.run(query_str_5)))

        # print(result)
        for item in result_1:
            # print(item)
            obj = {
                "key": item[1],
                'value': item[2],
                'type': '全部警情',
            }
            res.append(obj)
        for item in result_2:
            # print(item)
            obj2 = {
                "key": item[1],
                'value': item[3],
                'type': '刑事警情',
            }
            res.append(obj2)
        for item in result_3:
            # print(item)
            obj3 = {
                "key": item[1],
                'value': item[3],
                'type': '治安警情',
            }
            res.append(obj3)
        for item in result_4:
            # print(item)
            obj4 = {
                "key": item[1],
                'value': item[2],
                'type': '诈骗警情',
            }
            res.append(obj4)
        for item in result_5:
            # print(item)
            obj5 = {
                "key": item[1],
                'value': item[2],
                'type': '重复警情',
            }
            res.append(obj5)
        return res


    def get_all_time(self,data):
        start_time = data['start_time']
        end_time = data['end_time']
        start_time1, end_time1 = adjust_dates(start_time, end_time)
        res = []

        obj = {
            "start_time1": start_time1,
            'end_time1': end_time1,
        }
        res.append(obj)

        return res[0]



    def search_address(self, data):
        #match data = (t:TIME)-[r1:`事件时间`]->(e)-[r2: `事件地点`]->(a:ADDRESS) WHERE "%s" <= t.time <= "%s" WITH a, count(e) AS events WHERE events >= %s RETURN a as p
        query_str = "match data = (t:TIME)-[r1:`事件时间`]->(e)-[r2: `事件地点`]->(a:ADDRESS) WHERE '%s' <= t.time <= '%s' WITH a, count(e) AS events WHERE events >= %s RETURN a as p"%(data['start_time'],data['end_time'],data['number'])
        print(query_str)
        print(data)
        nodes =[]
        with self.driver.session() as session:
            result = session.read_transaction(lambda tx: list(tx.run(query_str)))
            # print(result)
        for path in result:
            print(path)
            for item in path:
                print(item[1])



        return nodes
        # try:
        #     with self.driver.session() as session:
        #         result = session.read_transaction(lambda tx: list(tx.run(query_str)))
        #         print(result)
        #         # return result
        #     for path in result:
        #         for item in path['p']:
        #             start = self.serialize_node(item.nodes)
        #
        #     #             # 结点去重
        #             nodeset.index(start['id'])
        #
        #             nodes.append(start)
        #
        #     return nodes
        # except Exception as e:
        #     print('Error,no data!',e)
        #     links = []
        #
        #     return links

    def search_address_number(self, data):
        query_str = "match data=(t:TIME)-[r1:`事件时间`]->(e)-[r2: `事件地点`]->(a:ADDRESS) WHERE '%s' <= t.time <= '%s' WITH a, count(e) AS events WHERE events >= %s RETURN a.address, events ORDER BY events DESC;"%(data['start_time'],data['end_time'],data['number'])
        #match data=(t:TIME)-[r1:`事件时间`]->(e)-[r2: `事件地点`]->(a:ADDRESS) WHERE '%s' <= t.time <= '%s' WITH a, count(e) AS events WHERE events >= %s RETURN a.address, events ORDER BY events DESC;
        print(query_str)
        print(data)
        res =[]
        with self.driver.session() as session:
            result = session.read_transaction(lambda tx: list(tx.run(query_str)))
            print(result)
        for item in result:
            obj ={
                "address": item[0],
                "number": item[1],
            }
            res.append(obj)

        return res




    def search_conc(self,id):
        # 根据结点属性查询相关联所有关系和结点
        print(id)
        # str = "MATCH (c:Concept) where c.id = $id OPTIONAL MATCH (c)<--(s:Subject) OPTIONAL MATCH (c) -->(o:Operation) RETURN s,c,o"
        str = "MATCH (c) where id(c)=$id RETURN id(c) as id , c.name as name "
        rel = "MATCH P=(c) -[r]-> () where id(c)=$id RETURN P"
        query_str ='MATCH P=(c:Concept) --> (o) where id(c)=$id RETURN o.name as name, id(o) as id'
        params = {
            'id' : id
        }
        with self.driver.session() as session:
            res = session.read_transaction(lambda tx: list(tx.run(query_str ,params)))
            rel = session.read_transaction(lambda tx: list(tx.run(query_str ,params)))
            node =  session.read_transaction(lambda tx: list(tx.run(str ,params)))
        return res,rel,node

    def search_oper(self,id):
        # print('method: ', id)
        str = "MATCH (c) where id(c)=$id RETURN id(c) as id, c.name as name"
        query_str = "MATCH P=(o:Operation) --> (m:Method) where id(o)=$id RETURN m.name as name, id(m) as id"
        params = {
            'id' : id
        }
        with self.driver.session() as session:
            res = session.read_transaction(lambda tx: list(tx.run(query_str ,params)))
            node = session.read_transaction(lambda tx: list(tx.run(str ,params)))
        return res,node
    def search_meth(self,id):
        print('method: ', id)
        str = "MATCH (c) where id(c)=$id RETURN id(c) as id, c.name as name"
        # query_str = "MATCH P=(o:Operation) --> (m:Method) where id(o)=$id RETURN m.method as name, id(m) as id"
        params = {
            'id' : id
        }
        res = ''
        with self.driver.session() as session:
            # res = session.read_transaction(lambda tx: list(tx.run(query_str ,params)))
            node = session.read_transaction(lambda tx: list(tx.run(str ,params)))
        return res,node
    
    def search_answer(self,data):
        print('question', data)
        params = {
            'data' : data
        }
        query_str = "match (m {name: $data})-[]-> (n) return n.name as name, id(n) as id, n.meaning as meaning, n.link as link"
        with self.driver.session() as session:
            res = session.read_transaction(lambda tx: list(tx.run(query_str,params)))
        # print(res)
        return res


    def search_answer_node(self,data):
        query_str = 'MATCH (n) where n.name = $data RETURN n as node'
        params = {
            'data' : data
        }
        with self.driver.session() as session:
            result = session.read_transaction(lambda tx: list(tx.run(query_str, params)))
        res = [self.serialize_node(record['node']) for record in result] 
        return res
    