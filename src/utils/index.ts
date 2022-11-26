import { WindowPostMessageStream } from '@metamask/post-message-stream';

const createWindow = (jobId: string): any => {
  const iframe = document.createElement('iframe');
  iframe.setAttribute('id', jobId);
  document.body.appendChild(iframe);
  iframe.setAttribute('sandbox', 'allow-scripts');
  return iframe.contentWindow;
};

const initEventStream = (jobId: string): any => {
  const window = createWindow(jobId);
  const stream = new WindowPostMessageStream({
    name: `iframe-${jobId}`,
    target: `iframe-${jobId}`,
    targetOrigin: '*',
    targetWindow: window,
  });
  return { stream, window };
}

export { createWindow, initEventStream };
