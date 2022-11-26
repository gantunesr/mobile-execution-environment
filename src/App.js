import { useState, useEffect } from 'react';

import './App.css';
import { ProxyMessageStream } from './core';
import { initEventStream } from './utils';
import { useJobsState } from './hooks';

function App() {

  const [counter, setCounter] = useState(0);
  const [proxyService, setProxyService] = useState();
  const [jobs, findJob, addJob, removeJob, removeAllJobs] = useJobsState();

  useEffect(() => {
    const proxy = new ProxyMessageStream({
      name: 'webview',
      target: 'rnside',
      targetOrigin: '*',
      targetWindow: window.ReactNativeWebView,
    });
    setProxyService(proxy);

  }, []);

  // useEffect(() => {
  //   if (!proxyService) {
  //     return;
  //   }
  
  //   // Subscribe to events originated on the RN App
  //   proxyService.on('data', (data) => {
  //     console.log('LOG: Proxy receiving data - ', data);
  //     const { snapId, method, args } = JSON.parse(data);
  //     const job = findJob(snapId);
  //     if (job === undefined) {
  //       return;
  //     }
  //     console.log('DATA', { snapId, method, args, job });  
  //   });
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [proxyService]);

  const createWindow = () => {
    console.log('LOG: createWindow executed');

    // This should be removed later
    // The Id should be passed from the SnapController
    const jobId = `jobId-${counter.toString()}`;
    const { stream, window } = initEventStream(jobId);
    addJob({ id: jobId, window, stream })
    setCounter(counter+1);
  }

  // const sendDataToIframeStream = () => {
  //   const job = findJob('jobId-2');
  // }

  // const sendDataToJob = (jobId) => {
  //   const job = findJob('jobId-0');
  //   console.log(job.stream);
  // }

  const sendDataToRN = () => {
    console.log('LOG: sendDataToRN executed');
    proxyService && proxyService.write('hello');
  }

  return (
    <div className="App">
      <button onClick={createWindow}>
        Add new iframe
      </button>

      <button onClick={sendDataToRN}>
        Send data to RN App
      </button>

      <button onClick={() => console.log('Send date to iframe')}>
        Send data iframe
      </button>
    </div>
  );
}

export default App;
