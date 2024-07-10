import React, { useEffect } from 'react'
import {useRef} from 'react';
import WebViewer from '@pdftron/webviewer'
import pdf from '../../public/pdf/freee.pdf'



const Pdfviewer = () => {
    const viewer = useRef(null);
    useEffect(() => {
        WebViewer(
          {
            path: '/webviewer/public',
            licenseKey: '1720615244809:7f9dd2f103000000001576ad29aba6aaaff49a8b06f5079a9c4f51def3',
            initialDoc: '/public/pdf/freee.pdf',
          },
          viewer.current,
        ).then((instance) => {
            const { documentViewer, annotationManager, Annotations } = instance.Core;

            documentViewer.addEventListener('documentLoaded', () => {
              const rectangleAnnot = new Annotations.RectangleAnnotation({
                PageNumber: 1,
                // values are in page coordinates with (0, 0) in the top left
                X: 100,
                Y: 150,
                Width: 200,
                Height: 50,
                Author: annotationManager.getCurrentUser()
              });
      
              annotationManager.addAnnotation(rectangleAnnot);
              // need to draw the annotation otherwise it won't show up until the page is refreshed
              annotationManager.redrawAnnotation(rectangleAnnot);
            });
          });
      }, []);

  return (
    <>
        <div className="MyComponent">
      <div className="header">React sample</div>
      <div className="webviewer" style={{height:'100vh'}} ref={viewer} ></div>
    </div>
    </>

  )
}

export default Pdfviewer
