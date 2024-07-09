import React, { ReactNode } from 'react';
import { Card, Button } from 'antd';

const { Meta } = Card;

interface Props{
    title:string;
    description?:string;
    image?:any; 
    actions?:any 
    children?:ReactNode; 
    onCardClick?:()=>void; 
    onTitleClick?:()=>void;
    onDescriptionClick?:()=>void;
}

const ReusableCard = ({ 
  title="Title", 
  description , 
  image, 
  actions, 
  children, 
  onCardClick, 
  onTitleClick, 
  onDescriptionClick 
}:Props) => {
  return (
    <Card
      hoverable
      cover={image && <img alt={title} src={image} />}
      onClick={onCardClick}
      actions={actions && actions.map((action:any, index:any) => (
        <Button key={index} onClick={action.onClick} type={action.type || 'primary'}>
          {action.label}
        </Button>
      ))}
    >
      <Meta 
        title={<div onClick={onTitleClick}>{title}</div>} 
        description={<div onClick={onDescriptionClick}>{description}</div>} 
      />
      {children}
    </Card>
  );
};

export default ReusableCard;
