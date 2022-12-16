import { useState, useEffect } from 'react';

import { ProxyMessageStream, ExecutionController } from './core';
import { METHODS } from './constants';

import './App.css';

function App() {

  const [proxyService, setProxyService] = useState();

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

    // Subscribe to events originated on the RN App
    console.log('[WEB APP LOG] Subscribe to events originated on the RN App');

    const executionController = new ExecutionController({
      proxyService
    });

    proxyService.on('data', async (data) => {
      console.log('[WEB APP LOG] Proxy receiving data - ', data);
      const { data : { data: { method } }, jobId } = data;

      let job;
    
      switch (method) {
        case METHODS.TERMINATE:
          job = executionController.get(jobId);
          job.stream.write(data.data);
          console.log('[WEB APP LOG] Terminate job', data.data, jobId);
          // executionController.delete(jobId);
          return;

        case METHODS.PING:
          console.log(executionController.jobs);
          await executionController.init(jobId);
          job = executionController.get(jobId);
          job.stream.write(data.data);
          // sendDataToRN();
          return;

        case METHODS.EXECUTE_SNAP:
          job = executionController.get(jobId);
          job.stream.write(data.data);
          return;

        case METHODS.SNAP_RPC:
          job = executionController.get(jobId);
          job.stream.write(data.data);
          return;
  
        case METHODS.JSON_RPC:
          job = executionController.get(jobId);
          job.stream.write(data.data);
          return;

        default:
          job = executionController.get(jobId);
          job.stream.write(data.data);
          console.log('Default case');
      }

    });
  }, [proxyService]);

  return (
    <div className="App" />
  );
}

export default App;
