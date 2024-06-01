import React, { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Form,
  Input,
  Select,
  message
} from 'antd';
import { CategoryType } from '@/type';
import router from 'next/router';
import styles from './index.module.css'
import Content from '../Content';
import { LEVEL_OPTIONS } from '@/pages/category';
import { categoryAdd, getCategoryList } from '@/api/category';

export default function CategoryForm(){
    const [level, setLevel] = useState(1);
    const [levelOneList, setLevelOneList] = useState<CategoryType[]>([]);
    const [form] = Form.useForm();
    const handleFinish = async (values: CategoryType) =>{
        await categoryAdd(values);
        message.success("创建成功");
        router.push("/book");

    };

    useEffect(()=>{
      async function fetchData() {
        const res = await getCategoryList({all: true, level: 1 });
        setLevelOneList(res.data);
      }

     fetchData();
    },[])

    const levelOneOptions = useMemo(() => {
      return levelOneList.map((item) => ({
        value: item._id,
        label: item.name,
      }));
    }, [levelOneList]);

    return (
        <Content title="分类添加">
          {/* 书籍添加/修改 表单 */}
          <Form
            form={form}
            className={styles.form}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            layout="horizontal"
            // style={{ maxWidth: 600 }}
            onFinish={handleFinish}
          >
            {/* 书名输入框 */}
            <Form.Item
              label="名称"
              name="name"
              rules={[
                {
                  required: true,
                  message: "请输入名称",
                },
              ]}
            >
              <Input placeholder="请输入" />
            </Form.Item>

            {/* 级别选择器 */}
            <Form.Item
              label="级别"
              name="level"
              rules={[
                {
                  required: true,
                  message: "请选择级别",
                },
              ]}
            >
              <Select
                onChange={(value) => {
                  setLevel(value);
                }}
                placeholder="请选择"
                options={LEVEL_OPTIONS}
              ></Select>
            </Form.Item>
            {level === 2 && (
              <Form.Item
                label="所属级别"
                name="parent"
                rules={[
                  {
                    required: true,
                    message: "请选择级别",
                  },
                ]}
              >
                <Select placeholder="请选择" options={levelOneOptions}></Select>
              </Form.Item>
            )}
            <Form.Item label=" " colon={false}>
              <Button
                size="large"
                type="primary"
                htmlType="submit"
                className={styles.btn}
              >
                创建
              </Button>
            </Form.Item>
          </Form>
        </Content>
      );
}





