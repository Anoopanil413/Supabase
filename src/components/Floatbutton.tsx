import React, { Component, ReactNode } from 'react'
import { FloatButton } from 'antd';

interface propstyp{
    icon?:ReactNode;
    description?: ReactNode;
    tooltip?:ReactNode | (() => ReactNode);
    type?:'default' | 'primary';
    shape?:'circle' |'square' ;
    handleFun?:(event:React.MouseEvent<HTMLElement, MouseEvent>)=>void;
    href?:string;
}
export class Floatbutton extends Component<propstyp,{}> {


  render() {

    const {icon,description,tooltip,type,shape,handleFun ,href} =this.props


    return (
        <>
        <FloatButton icon={icon} tooltip={tooltip} description={description} type={type} shape={shape} onClick={handleFun} href={href}/>
        </>

    )
  }
}

export default Floatbutton
