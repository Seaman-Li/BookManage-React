import { Button, Col, Form, Input, Row, Select, Space, Table, Tooltip, TablePaginationConfig, Image, Tag, Modal, message } from "antd/lib";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "./index.module.css"
import { categoryDelete, getCategoryList } from "@/api/category";
import { CategoryQueryType } from "@/type/category";
import dayjs from "dayjs";
import Content from "@/components/Content";


const inter = Inter({ subsets: ["latin"] });

const LEVEL = {
  ONE: 1,
  TWO: 2,
};

export const LEVEL_OPTIONS = [
  { label: "级别1", value: LEVEL.ONE },
  { label: "级别2", value: LEVEL.TWO },
];

const COLUMNS = [
  {
    title: "名称",
    dataIndex: "name",
    key: "name",
    width: 200,
  },
  {
    title: "级别",
    dataIndex: "level",
    key: "level",
    width: 120,
    render: (text: number) => {
      return <Tag color={text === 1 ? "green" : "cyan"}>{`级别${text}`}</Tag>;
    },
  },
  {
    title: "所属分类",
    dataIndex: "parent",
    key: "parent",
    width: 120,
    render: (text: { name: string }) => {
      return text?.name ?? "-";
    },
  },
  {
    title: "创建时间",
    dataIndex: "createdAt",
    key: "createdAt",
    width: 130,
    render: (text: string) => dayjs(text).format("YYYY-MM-DD"),
  },
];

export default function Category() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [data, setData] = useState([])
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current:1,
    pageSize:20,
    showSizeChanger:true,
    total:0,
  })

  async function fetchData(values?: any) {
    const res = await getCategoryList({ 
      current: pagination.current, 
      pageSize: pagination.pageSize,
      ...values,
    })
    // console.log(res);
    const { data } = res
    // console.log(data)
    setData(data)
    setPagination({ ...pagination, current: 1, total: res.total })
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchFinish = async (values: CategoryQueryType) => {
    const res = await getCategoryList({ ...values, current: 1, pageSize: pagination.pageSize })
    setData(res.data)
    setPagination({ ...pagination, current: 1, total: res.total })
  }
  const handleSearchreset = ()=>{
    form.resetFields();
    // console.log(form);
  };

  const handleCategoryEdit =()=>{
    router.push("/category/edit/id")
  };

  const handleTableChange =(pagination:TablePaginationConfig)=>{
    setPagination(pagination)
    const query = form.getFieldsValue()
    getCategoryList({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...query
    })
  };

  const handleCategoryDelete =(id: string)=>{
    Modal.confirm({
      title:"确认删除？",
      okText:"确定",
      cancelText:"取消",
      async onOk(){
        // 注意删除操作是异步的，否则无论是否删除成功都会执行message
        await categoryDelete(id);
        message.success("删除成功");
        // console.log(form.getFieldsValue());
        fetchData(form.getFieldsValue());
      }
    })
  }

  const columns = [...COLUMNS,
  {
      title:'操作', key:"action", render: (_: any, row: any )=>{
        return <Space>
            <Button type="link" onClick={handleCategoryEdit}>编辑</Button>
            <Button type="link" danger onClick={()=>handleCategoryDelete(row._id)}>删除</Button>
        </Space>
    }
  }
  ]

  return (
    <Content 
      title="分类列表"
      operation={
        <Button 
          onClick={()=>{
          router.push("/category/add")
          }}
          type="primary"
        >
          添加
        </Button>
      }
    >
      {/* 搜索栏 */}
      <Form
      name="search"
      form={form}
      // layout="inline"
      onFinish={handleSearchFinish}
      initialValues={{
          name:'',
          author:'',
          category:'',
      }}
      >
        <Row gutter={24}>
          <Col span={5}>
            <Form.Item name="name" label="名称">
              <Input placeholder="请输入" allowClear/>
            </Form.Item>
          </Col>
          
          <Col span={5}>
            <Form.Item name="level" label="级别">
              <Select 
                placeholder="请选择"
                allowClear
                showSearch
                options={LEVEL_OPTIONS}
              />
            </Form.Item>
          </Col>
          
          <Col span={9}>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  搜索
                </Button>
                <Button onClick={handleSearchreset}>
                  清空
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      {/* 显示分类数据 */}
      <div className={styles.tableWrap}>
        <Table
          dataSource={data}
          columns={columns}
          scroll={{ x: 1000, y:500 }}
          onChange={handleTableChange}
          pagination={{ ...pagination, showTotal: () => `共 ${pagination.total} 条` }}
        />
      </div>
    </Content>
    
  );
}
