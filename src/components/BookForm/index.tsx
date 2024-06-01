import React, { useState } from 'react';
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Image,
  message
} from 'antd';
import { bookAdd } from '@/api/book';
import { BookType } from '@/type';
import router from 'next/router';
import styles from './index.module.css'
import dayjs from 'dayjs';
import Content from '../Content';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

export default function BookForm(){
    const [preview, setPreview] = useState("");
    const [form] = Form.useForm();
    const handleFinish = async (values: BookType) =>{
        // console.log('%c [ values ]-', 'font-size:13px; background:pink; color:#bf2c9f;', values);
        // 把String形式的publishAt转为时间戳
        if(values.publishAt){
            values.publishAt = dayjs(values.publishAt).valueOf();
        }
        await bookAdd(values);
        message.success("创建成功");
        router.push("/book");

    };
    return (
        <Content title="图书添加">
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
                        required: true, message:"请输入名称"
                    },
                ]}
            >
              <Input placeholder='请输入'/>
            </Form.Item>

            {/* 作者输入框 */}
            <Form.Item 
                label="作者" 
                name="author" 
                rules={[
                    {
                        required: true, message:"请输入作者"
                    },
                ]}
            >
              <Input placeholder='请输入'/>
            </Form.Item>

            {/* 书籍分类选择器 */}
            <Form.Item 
                label="分类" 
                name="category" 
                rules={[
                    {
                        required: true, message:"请选择分类"
                    },
                ]}
            >
              <Select placeholder='请选择'>
                <Select.Option value="demo">Demo</Select.Option>
              </Select>
            </Form.Item>

            {/* 书籍封面输入框 */}
            <Form.Item label="封面" name="cover">
              <Input.Group compact>
                <Input 
                    placeholder='请输入' 
                    style={{width:"calc(100% - 63px)"}}
                    onChange={(e)=>{
                        // console.log('%c [ e ]-', 'font-size:13px; background:pink; color:#bf2c9f;', e);
                        form.setFieldValue("cover", e.target.value);                    
                    }}
                />
                <Button 
                    type='primary'
                    onClick={(e)=>{
                        setPreview(form.getFieldValue("cover"));
                    }}
                >
                    预览</Button>
              </Input.Group>
            </Form.Item>

            {preview && (
            <Form.Item label="" colon={false}>
              <Image src={preview} width={100} height={100} alt='img loading fail'></Image>
            </Form.Item>
            )}

            <Form.Item label="出版日期" name="publishedAt">
              <DatePicker placeholder='请选择'/>
            </Form.Item>
            <Form.Item label="库存" name="stock">
              <Input placeholder='请输入'/>
            </Form.Item>
            <Form.Item label="描述" name="description">
              <TextArea rows={4} placeholder='请输入'/>
            </Form.Item>
            <Form.Item label="" colon={false}>
              <Button size='large' type='primary' htmlType='submit' className={styles.btn}>创建</Button>
            </Form.Item>
            
          </Form>
        </Content>
      );
}





