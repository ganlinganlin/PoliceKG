from email.errors import StartBoundaryNotFoundDefect
from platform import node
from tracemalloc import start
from neo4j import GraphDatabase, basic_auth
import json
import sys
sys.path.append('D:\Web\PoliceKG')





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
    