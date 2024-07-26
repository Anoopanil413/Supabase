import React, { useEffect, useState, useRef } from 'react';
import WebViewer, { WebViewerInstance, } from '@pdftron/webviewer';
import MovableToolbar from '../components/MovableToolbar';

import  getInstance  from '@pdftron/webviewer'


const Pdfviewer: React.FC = () => {
  const viewer = useRef<HTMLDivElement>(null);
  const [viewToolbar, setViewToolbar] = useState(false);
  const [currentPdfInstance, setPdfInstance] = useState<WebViewerInstance | null>(null);
  const [currentTool, setCurrentTool] = useState<string | null>(null);
  

  type ToolName = 'Edit' | 'AnnotationEdit' 

  const onSelectTool = (tool: { name: ToolName }) => {


    setCurrentTool(tool.name);

    if (currentPdfInstance) {
      const { Tools } = currentPdfInstance.Core;
      // currentPdfInstance.
      switch (tool.name) {
        case 'Edit':
          // currentPdfInstance.UI.setToolMode(Tools);
          break;
        case 'AnnotationEdit':
          // currentPdfInstance.setToolMode(Tools.AnnotationEdit);
          break;
        // Add more cases for other tools
        default:
          // currentPdfInstance.UI.setToolMode(Tools.AnnotationEdit);
      }
    }
  };
  useEffect(()=>{
    const InnerELement = viewer.current

    // if(InnerELement){

    //   // const elementDimension = InnerELement.querySelector("iframe").contentWindow.document;

    //   console.log("elment with",elementDimension)
    // }



    if(currentPdfInstance){
      console.log("currentTool",currentTool)


      const { documentViewer, annotationManager } = currentPdfInstance.Core;

      const handleMouseDown = (e:any) => {
    
        if (currentTool === 'Edit') {

          const {  x, y } = e;

    
          const annotation = new currentPdfInstance.Core.Annotations.RectangleAnnotation();
          annotation.PageNumber = 1;
          annotation.X = x;
          annotation.Y = y;
          annotation.Width = 140;
          annotation.Height = 100;
          annotationManager.addAnnotation(annotation);
          annotationManager.redrawAnnotation(annotation);
        }
      }

      const handlemouseLeftUp =() => {
        annotationManager.deselectAllAnnotations();
      }
    
      
      documentViewer.addEventListener('mouseLeftDown', handleMouseDown);
      
      documentViewer.addEventListener('mouseLeftUp', handlemouseLeftUp);


      // documentViewer.addEventListener('mouseMove', (e) => {
      //   if(currentTool){
      //     const annotations = annotationManager.getAnnotationsList();
      //     const lastAnnotation = annotations[annotations.length - 1];
      //     if (lastAnnotation && currentTool === 'Edit') {
      //       const { pageNumber, x, y } = e;
      //       lastAnnotation.Width = x - lastAnnotation.X;
      //       lastAnnotation.Height = y - lastAnnotation.Y;
      //       annotationManager.redrawAnnotation(lastAnnotation);
      //     }
      //   }
   
   
      // });

      return () => {
        documentViewer.removeEventListener('mouseLeftDown', handleMouseDown);
        documentViewer.removeEventListener('mouseLeftUp', handlemouseLeftUp);
      };

      
    
    }

 
 

  },[currentTool,currentPdfInstance]) 

  useEffect(() => {
    WebViewer(
      {
        path: '/webviewer/public',
        licenseKey: 'demo:1720615244809:7f9dd2f103000000001576ad29aba6aaaff49a8b06f5079a9c4f51def3',
        initialDoc: '/public/pdf/freee.pdf',
        disabledElements: [
          "header",
          "annotationStylePopup",
          "annotationDeleteButton",
          "toolsOverlay",
          "searchOverlay",
          "toolbarGroup-Shapes",
          "toolbarGroup-Edit",
          "toolbarGroup-Insert",
          "linkButton",
          "menuOverlay",
          "toolsHeader",
          "pageNavOverlay",
          "redoButton",
          "undoButton",
        ],
        fullAPI: true,
      },
      viewer.current as HTMLDivElement,
    ).then((instance) => {
      setViewToolbar(true);
      setPdfInstance(instance);

      // const { documentViewer, annotationManager } = instance.Core;

      instance.UI.enableFeatures([instance.UI.Feature.Annotations]);

    });
  }, []);

  return (
    <>
      <div className="MyComponent">
        {viewToolbar && (
          <div className="header" style={{ display: 'flex', justifyContent: 'center' }}>
            <MovableToolbar onSelectTool={onSelectTool} />
          </div>
        )}
        <div className="webviewer" style={{ height: '80vh' }} ref={viewer}></div>
      </div>
    </>
  );
};

export default Pdfviewer;