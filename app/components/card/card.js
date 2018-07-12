import React from 'react';
import { Card } from 'antd';
import './card.css';
export default class CardComponent extends React.Component{
    render(){
        const { bgColor, children, ...rest } = this.props;
        return (
            <section className="q-card-container" style={bgColor?{backgroundColor: bgColor}:null}>
                <Card {...rest}>
                    {children}
                </Card>
            </section>
        )
    }
}