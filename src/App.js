import { useState, useEffect, useCallback } from 'react';

import { ProxyMessageStream, ExecutionController } from './core';
import './App.css';

function App() {

  const [proxyService, setProxyService] = useState();

  // const sendDataToRN = useCallback(() => {
  //   console.log('LOG: sendDataToRN executed');
  //   proxyService && proxyService.write('hello');
  // }, [proxyService]);

  useEffect(() => {
    const proxy = new ProxyMessageStream({
      name: 'webview',
      target: 'rnside',
      targetOrigin: '*',
      targetWindow: window.ReactNativeWebView,
    });
    setProxyService(proxy);

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

    const executionController = new ExecutionController();

    proxyService.on('data', (data) => {
      console.log('LOG: Proxy receiving data - ', data);
      const { snapId, method, args } = JSON.parse(data);

      switch (method) {
        case 'hello':
          console.log(executionController.jobs);
          // sendDataToRN();
          return;

        case 'start-snap':
          console.log('start-snap');
          startSnap(snapId);
          return;

        case 'stream-to-iframe':
          console.log({ snapId, method, args })
          // console.log({ jobs });
          const job = executionController.findJob(snapId);
          console.log('job->', job, job.stream.write, proxyService);
          job.stream.write('Your message. Text, number, object, whatever.');
          // if (job === undefined) {
          //   console.log(`Job | Snap with ID ${snapId} not found`);
          //   return;
          // }
          // console.log('DATA', { snapId, method, args, job }); 
          return;

        default:
          console.log('Default case');
      }

    });
  }, [proxyService]);

  return (
    <div className="App" />
  );
}

export default App;
