import  { ReactNode } from 'react';
import { Card, Button, Tooltip } from 'antd';

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

  let descrip = null 

  function truncateText(desc:string, maxLength=30) {
    if (desc.length > maxLength) {
      return desc.slice(0, maxLength) + '...';
    }
    return description;
  }
  if(description){
    descrip = truncateText(description,10)
  }

   onDescriptionClick = ()=>{
    return(
      <>

      <Tooltip title="prompt text">
      <span>Tooltip will show on mouse enter.</span>
    </Tooltip>
      </>
    )

  }
  
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
        description={
          <Tooltip title={description}>
            <div>{descrip}</div>
          </Tooltip>
        } 
      />
      {children}
    </Card>
  );
};

export default ReusableCard;
