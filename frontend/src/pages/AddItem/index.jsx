import React from 'react';
import { Tag } from 'antd';
import useLanguage from '@/locale/useLanguage';
import { useMoney } from '@/settings';
import ProductDataTableModule from '@/modules/ProductModule/ProductDataTableModule'; // Make sure you have a ProductDataTableModule

export default function Product() {
  const translate = useLanguage();
  const entity = 'product';
  const { moneyFormatter } = useMoney();

  const searchConfig = {
    entity: 'product',
    displayLabels: ['name', 'itemCode'],
    searchFields: 'name,itemCode',
  };

  const deleteModalLabels = ['name', 'itemCode'];

  const dataTableColumns = [
    {
      title: translate('Product Name'),
      dataIndex: 'name',
    },
    {
      title: translate('Item Code'),
      dataIndex: 'itemCode',
    },
    {
      title: translate('Category'),
      dataIndex: 'category',
    },
    {
      title: translate('Quantity'),
      dataIndex: 'quantity',
      onCell: () => ({
        style: {
          textAlign: 'right',
          whiteSpace: 'nowrap',
        },
      }),
    },
    {
      title: translate('Price'),
      dataIndex: 'price',
      onCell: () => ({
        style: {
          textAlign: 'right',
          whiteSpace: 'nowrap',
          direction: 'ltr',
        },
      }),
      render: (price, record) => moneyFormatter({ amount: price, currency_code: record.currency }),
    },
    {
      title: translate('GST'),
      dataIndex: 'GST',
      onCell: () => ({
        style: {
          textAlign: 'right',
          whiteSpace: 'nowrap',
        },
      }),
      render: (GST, record) => moneyFormatter({ amount: GST, currency_code: record.currency }),
    },
    {
      title: translate('Total'),
      dataIndex: 'total',
      onCell: () => ({
        style: {
          textAlign: 'right',
          whiteSpace: 'nowrap',
          direction: 'ltr',
        },
      }),
      render: (total, record) => moneyFormatter({ amount: total, currency_code: record.currency }),
    },
  ];

  const Labels = {
    PANEL_TITLE: translate('product'),
    DATATABLE_TITLE: translate('product_list'),
    ADD_NEW_ENTITY: translate('add_new_product'),
    ENTITY_NAME: translate('product'),
    RECORD_ENTITY: translate('record_product'),
  };

  const configPage = {
    entity,
    ...Labels,
  };

  const config = {
    ...configPage,
    dataTableColumns,
    searchConfig,
    deleteModalLabels,
  };

  return <ProductDataTableModule config={config} />;
}
