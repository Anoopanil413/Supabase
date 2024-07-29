import  { useRef } from 'react';
import { Tooltip, Button,  } from 'antd';
import { CopyOutlined, DeleteOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';

const tools = [
  { name: 'Copy', icon: <CopyOutlined /> },
  { name: 'Delete', icon: <DeleteOutlined /> },
  { name: 'Edit', icon: <EditOutlined /> },
  { name: 'Save', icon: <SaveOutlined /> },
];

const MovableToolbar = ({onSelectTool}:any) => {
  const toolbarRef = useRef<HTMLDivElement>(null);

  const onMouseDown = (e:any) => {
    const toolbar = toolbarRef.current;
    if(!toolbar)return
    const shiftX = e.clientX - toolbar.getBoundingClientRect().left;
    const shiftY = e.clientY - toolbar.getBoundingClientRect().top;

    const moveAt = (pageX:any, pageY:any) => {
      toolbar.style.left = `${pageX - shiftX}px`;
      toolbar.style.top = `${pageY - shiftY}px`;
    };

    const onMouseMove = (e:any) => {
      moveAt(e.pageX, e.pageY);
    };

    document.addEventListener('mousemove', onMouseMove);

    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', onMouseMove);
    }, { once: true });
  };

  return (
    <div
      ref={toolbarRef}
      onMouseDown={onMouseDown}
      style={{
        position: 'absolute',
      //   top: '200px',
      //   left: '600px',
        display: 'flex',
        gap: '10px',
        padding: '10px',
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        borderRadius: '4px',
        cursor: 'move',
      }}
    >
      {tools.map((tool, index) => (
        <Tooltip key={index} title={tool.name}>
          <Button icon={tool.icon} style={buttonStyle} onClick={()=>onSelectTool(tool)}/>
        </Tooltip>
      ))}
    </div>
  );
};



const buttonStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export default MovableToolbar;
