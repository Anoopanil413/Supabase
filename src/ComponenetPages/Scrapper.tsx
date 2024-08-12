import React, { useEffect } from 'react'

import urlMetadata from'url-metadata'


const Scrapper = () => {
    const options = {
        // custom request headers
        requestHeaders: {
          'User-Agent': 'url-metadata/3.0 (npm module)',
          'From': 'example@example.com'
        },
      
        // `fetch` API cache setting for request
        cache: 'no-cache',
      
        // `fetch` API mode (ex: 'cors', 'no-cors', 'same-origin', etc)
        mode: 'cors',
      
        // charset to decode response with (ex: 'auto', 'utf-8', 'EUC-JP')
        // defaults to auto-detect in `Content-Type` header or meta tag
        // if none found, default `auto` option falls back to `utf-8`
        // override by passing in charset here (ex: 'windows-1251'):
        decode: 'auto',
      
        // timeout in milliseconds, default is 10 seconds
        timeout: 10000,
      
        // number of characters to truncate description to
        descriptionLength: 750,
      
        // force image urls in selected tags to use https,
        // valid for images & favicons with full paths
        ensureSecureImageRequest: true,
      
        // return raw response body as string
        includeResponseBody: false,
      
        // alternate use-case: pass in `Response` object here to be parsed
        // see example below
        parseResponseObject: null,
      };
      


    const fetchMetadata = async()=>{
        try {
            const url = 'https://www.npmjs.com/package/url-metadata';
            const metadata = await urlMetadata(url,options);
            console.log(metadata);
            return metadata
          } catch (err) {
            console.log(err);
          }
    }

    useEffect(()=>{

        (async()=>{
            const fetched = await fetchMetadata()

            console.log('fetched',fetched)

        })()


    },[])



  return (
    <div>

        Helo
      
    </div>
  )
}

export default Scrapper
