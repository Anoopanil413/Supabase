import  { Component, ReactNode } from 'react'
import { Button } from "antd";


interface propsType {
    type?: "link" | "text" | "default" | "primary" | "dashed" | 'default';
    block?:boolean;
    disabled?:boolean;
    text:string;
    className?:string
    handleClick?: any ;
    iconPosition?:'start' | 'end';
    icon?:ReactNode;
    ghost?:boolean;
}

export default class Buttons extends Component<propsType, {}> {


  render() {

    const { type,block,disabled,text,className,handleClick,iconPosition,icon,ghost} = this.props;
    
    return (
      <>
      <Button type={type} block={block} disabled={disabled} className={className} onClick={handleClick} iconPosition={iconPosition} icon={icon} ghost={ghost}>{text}</Button>
      </>
    )
  }
}
