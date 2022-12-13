import { useState, useEffect } from 'react';

import { ProxyMessageStream, ExecutionController } from './core';
import './App.css';

function App() {

  const [proxyService, setProxyService] = useState();

  // const sendDataToRN = useCallback(() => {
  //   console.log('LOG: sendDataToRN executed');
  //   proxyService && proxyService.write('hello');
  // }, [proxyService]);

  const fetchData = () => {
    return fetch('https://registry.npmjs.org/@metamask/test-snap-bip44/-/test-snap-bip44-4.1.2.tgz')
          .then((response) => response.blob())
          .then((blob) => console.log(blob))
          // .then((stream) => console.log(stream))
  }

  useEffect(() => {
    const proxy = new ProxyMessageStream({
      name: 'webview',
      target: 'rnside',
      targetOrigin: '*',
      targetWindow: window.ReactNativeWebView,
    });
    setProxyService(proxy);

    fetchData();
  }, []);

  useEffect(() => {
    if (!proxyService) {
      return;
    }

    const startSnap = async (jobId) => {
      await executionController.initJob(jobId);
    }

    // Subscribe to events originated on the RN App
    console.log('LOG: Subscribe to events originated on the RN App');

    const executionController = new ExecutionController({
      proxyService
    });

    proxyService.on('data', async (data) => {
      console.log('LOG: Proxy receiving data - ', data);
      const { data : { data: { method, args } }, jobId } = data;

      console.log(jobId, method, args)

      switch (method) {
        case 'terminate':
          console.log(executionController.jobs);
          // sendDataToRN();
          return;

        case 'ping':
          console.log(executionController.jobs);
          await startSnap(jobId);
          const job = executionController.findJob(jobId);
          job.stream.write(data.data);
          // sendDataToRN();
          return;
    
        case 'hello':
          console.log(executionController.jobs);
          // sendDataToRN();
          return;

        case 'start-snap':
          console.log('start-snap');
          startSnap(jobId);
          return;

        case 'stream-to-iframe':
          console.log({ jobId, method, args })
          // console.log({ jobs });
          
          console.log('job->', job, job.stream.write, proxyService);
          job.stream.write('some message');
          // if (job === undefined) {
          //   console.log(`Job | Snap with ID ${snapId} not found`);
          //   return;
          // }
          // console.log('DATA', { snapId, method, args, job }); 
          return;

        default:
          const jobq = executionController.findJob(jobId);
          jobq.stream.write(data.data);
          console.log('Default case');
      }

    });
  }, [proxyService]);

  return (
    <div className="App" />
  );
}

export default App;
