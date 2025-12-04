// File: /modules/ProductModule/ProductDataTableModule.jsx
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Input, Form, Space, Popconfirm, message } from 'antd';
import request from '@/request/request';

export default function ProductDataTableModule({ config }) {
  const { dataTableColumns, searchConfig, ADD_NEW_ENTITY, DATATABLE_TITLE } = config;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [searchValue, setSearchValue] = useState('');
  const [editingProduct, setEditingProduct] = useState(null); // <-- Track editing row

  // Fetch products from backend
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const products = await request.listAll({ entity: 'product' });
      setData(products.map(item => ({ ...item, key: item._id })));
    } catch (err) {
      console.error(err);
      message.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Open modal for adding or editing
  const openModal = (product = null) => {
    setEditingProduct(product);
    if (product) {
      form.setFieldsValue(product);
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  // Add or update product
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const payload = { ...values, total: values.price + values.tax, currency: 'USD' };

      if (editingProduct) {
        // Update product
        const updated = await request.update({ entity: 'product', id: editingProduct._id, jsonData: payload });
        setData(prev => prev.map(item => (item.key === editingProduct.key ? { ...updated, key: updated._id } : item)));
        message.success('Product updated');
      } else {
        // Add new product
        const newProduct = await request.create({ entity: 'product', jsonData: payload });
        setData(prev => [...prev, { ...newProduct, key: newProduct._id }]);
        message.success('Product added');
      }

      form.resetFields();
      setEditingProduct(null);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      message.error('Failed to save product');
    }
  };

  // Delete product
  const handleDelete = async (id, key) => {
    try {
      await request.delete({ entity: 'product', id });
      setData(prev => prev.filter(item => item.key !== key));
      message.success('Product deleted');
    } catch (err) {
      console.error(err);
      message.error('Failed to delete product');
    }
  };

  // Optional: simple client-side search
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchValue(value);
  };

  const filteredData = data.filter(item =>
    searchConfig.displayLabels.some(label => item[label]?.toString().toLowerCase().includes(searchValue))
  );

  return (
    <div>
      <h2>{DATATABLE_TITLE}</h2>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => openModal()}>
          {ADD_NEW_ENTITY}
        </Button>
        <Input placeholder="Search" onChange={handleSearch} />
      </Space>

      <Table
        loading={loading}
        columns={[
          ...dataTableColumns,
          {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
              <Space>
                <Button type="link" onClick={() => openModal(record)}>Edit</Button>
                <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record._id, record.key)}>
                  <Button danger size="small">Delete</Button>
                </Popconfirm>
              </Space>
            ),
          },
        ]}
        dataSource={filteredData}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingProduct ? 'Edit Product' : ADD_NEW_ENTITY}
        open={isModalOpen}
        onCancel={() => { setIsModalOpen(false); setEditingProduct(null); }}
        onOk={handleSave}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Product Name" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="itemCode" label="Item Code" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="category" label="Category" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}><Input type="number" /></Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true }]}><Input type="number" /></Form.Item>
          <Form.Item name="tax" label="Tax" rules={[{ required: true }]}><Input type="number" /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
