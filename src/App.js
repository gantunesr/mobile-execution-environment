import { useState, useEffect, useCallback, useRef } from 'react';

import './App.css';
import { ProxyMessageStream, ExecutionController } from './core';
import { initEventStream } from './utils';

const usePrevious = (value, initialValue) => {
  const ref = useRef(initialValue);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const useEffectDebugger = (effectHook, dependencies, dependencyNames = []) => {
  const previousDeps = usePrevious(dependencies, []);

  const changedDeps = dependencies.reduce((accum, dependency, index) => {
    if (dependency !== previousDeps[index]) {
      const keyName = dependencyNames[index] || index;
      return {
        ...accum,
        [keyName]: {
          before: previousDeps[index],
          after: dependency
        }
      };
    }

    return accum;
  }, {});

  if (Object.keys(changedDeps).length) {
    console.log('[use-effect-debugger] ', changedDeps);
  }

  useEffect(effectHook, dependencies);
};

function App() {

  const [jobs, setJobs] = useState([]);
  const [counter, setCounter] = useState(0);
  const [proxyService, setProxyService] = useState();

  console.log('In every render', jobs, counter);

  const sendDataToRN = useCallback(() => {
    console.log('LOG: sendDataToRN executed');
    proxyService && proxyService.write('hello');
  }, [proxyService]);

  const createWindow = useCallback(() => {
    console.log('LOG: createWindow executed');

    // This should be removed later
    // The Id should be provided by the SnapController
    const jobId = `jobId-${counter.toString()}`;
  
    console.log('hello');
    const { stream, window } = initEventStream(jobId);

    console.log(jobs, { id: jobId, window, stream })
    const newJobsState = [
      ...jobs,
      { id: jobId, window, stream },
    ];
    console.log(newJobsState);
    setJobs(newJobsState);
    setCounter(counter+1);
  }, [jobs, counter])

  useEffect(() => {
    console.log('LOG: Check renderings A');
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

    const startSnap = async () => {
      await executionController.initJob('mock-id');
    }

    // Subscribe to events originated on the RN App
    console.log('LOG: Subscribe to events originated on the RN App');

    const executionController = new ExecutionController();

    proxyService.on('data', (data) => {
      console.log('LOG: Proxy receiving data - ', data);
      const { snapId, method, args } = JSON.parse(data);

      switch (method) {
        case 'start-snap':
          console.log('start-snap');
          startSnap();
          return;

        case 'hello':
          // sendDataToRN();
          return;

        case 'stream-to-iframe':
          // console.log({ jobs });
          // const job = jobs.find((job) => job.id === snapId);
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

  useEffect(() => {
    console.log('In useEffect', { counter, jobs });
  }, [jobs, counter]);

  return (
    <div className="App">
      {/* <button onClick={createWindow}>
        Add new iframe
      </button>

      <button onClick={sendDataToRN}>
        Send data to RN App
      </button>

      <button onClick={() => console.log('Send data to iframe')}>
        Send data iframe
      </button> */}
    </div>
  );
}

export default App;
