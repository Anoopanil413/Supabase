import React, { useEffect, useRef, useState } from 'react';
// import '../../build/potree/potree.css'







declare global {
  interface Window {
    Potree: any;
  }
}

const PotreeViewer: React.FC = () => {
  const viewerContainerRef = useRef<HTMLDivElement>(null);
  const [loadedScript, setScriptLoaded] = useState(false);

  useEffect(() => {
    const loadScript = (src: string) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.body.appendChild(script);
      });
    };

    const loadCSS = (href: string) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    };

    const loadPotreeAssets = async () => {
      try {

        loadCSS('potree_libs/jquery-ui/jquery-ui.min.css');
        loadCSS('potree_libs/spectrum/spectrum.css');
        // loadCSS('build/potree/potree.css');

        await loadScript('potree_libs/jquery/jquery-3.1.1.min.js');
        await loadScript('potree_libs/spectrum/spectrum.js');
        await loadScript('potree_libs/jquery-ui/jquery-ui.min.js');
        await loadScript('potree_libs/other/BinaryHeap.js');
        await loadScript('potree_libs/tween/tween.min.js');
        await loadScript('potree_libs/d3/d3.js');
        await loadScript('potree_libs/proj4/proj4.js');
        await loadScript('potree_libs/openlayers3/ol.js');
        await loadScript('potree_libs/i18next/i18next.js');
        await loadScript('potree_libs/jstree/jstree.js');
        await loadScript('potree_libs/potree/potree.js');
        await loadScript('potree_libs/plasio/js/laslaz.js');
        console.log('All Potree scripts loaded successfully');
        setScriptLoaded(true);
      } catch (error) {
        console.error('Error loading Potree scripts:', error);
      }
    };

    loadPotreeAssets();
  }, []);

  useEffect(() => {
    if (loadedScript) {
      const viewerElem = viewerContainerRef.current;
      if (!viewerElem) return;

      const Potree = window.Potree;
      const viewer = new Potree.Viewer(viewerElem);


      viewer.addEventListener('annotation_added', (e: any) => {
        const annotation = e.annotation;
        console.log("checking the event",e,"Heloooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo",annotation)
        // setAnnotations((prevAnnotations) => [...prevAnnotations, annotation]);
      });


      viewer.setEDLEnabled(true);
      viewer.setFOV(60);
      viewer.setPointBudget(1 * 1000 * 1000);
      viewer.setClipTask(Potree.ClipTask.SHOW_INSIDE);
      viewer.loadSettingsFromURL();

      viewer.setControls(viewer.orbitControls);

      console.log({ viewer });

      viewer.loadGUI(() => {
        console.log('loadGUI callback invoked');
        viewer.setLanguage('en');

        const menuAppearance = document.getElementById('menu_appearance');
        if (menuAppearance) {
          const nextElement = menuAppearance.nextElementSibling as HTMLElement | null;
          if (nextElement) {
            nextElement.style.display = 'block';
          }
        }

        viewer.toggleSidebar();
      });

      // Load and add point cloud to scene
      const url = 'http://5.9.65.151/mschuetz/potree/resources/pointclouds/helimap/360/MLS_drive1/cloud.js';

      Potree.loadPointCloud(url).then(
        (e: any) => {
          const pointcloud = e.pointcloud;
          const material = pointcloud.material;

          material.activeAttributeName = 'rgba';
          material.minSize = 2;
          material.pointSizeType = Potree.PointSizeType.FIXED;

          viewer.scene.addPointCloud(pointcloud);
          viewer.fitToScreen();

          console.log('This is the url', url);
        },
        (e: any) => console.error('ERROR: ', e)
      );
    }
  }, [loadedScript]);

  return (
    <div id="potree-root">

      
      <div ref={viewerContainerRef} className="potree_container">
        <div id="potree_render_area"></div>
      </div>
      <div id='potree_sidebar_container' className='potree_sidebar_container'>
      </div> 
 



    </div>
  );
};

export default PotreeViewer;
