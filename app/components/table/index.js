import React from 'react';
import { Table } from 'antd';
class TableComponent extends React.Component{
    render(){
        const { dataSource, columns, total, rowKey, onChange } = this.props;
        const pageSize = 15;
        let pageOption = {
            showQuickJumper: true,
            total: total,
            pageSize,
            onChange:(page, pageSize) => {
                if(onChange){
                    onChange(page, pageSize);
                }
            }
        };
        return (
            <Table className="q-table q-print" dataSource={dataSource} columns={columns} rowKey={rowKey}  pagination={total < pageSize ? false : pageOption}/>
        )
    }
}
export default TableComponent;