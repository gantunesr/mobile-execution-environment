import { WindowPostMessageStream } from '@metamask/post-message-stream';

import { IFRAME_URL } from '../constants';

type WindowWorker = Window | undefined;

interface ExecutionControllerArgs {
  proxyService: any;
}

interface IJob {
  id: string;
  window: WindowWorker;
  stream: WindowPostMessageStream;
}

class ExecutionController {
  
  public jobs: IJob[] | [];
  private proxyService: any;

  constructor({ proxyService }: ExecutionControllerArgs) {
    this.jobs = [];
    this.proxyService = proxyService;
  }

  _createWindow = (jobId: string): Promise<WindowWorker> => {
    return new Promise((resolve, reject) => {
      const iframe = document.createElement('iframe');
      iframe.setAttribute('id', jobId);
  
      iframe.setAttribute('src', IFRAME_URL);
      document.body.appendChild(iframe);

      // MDN article for `load` event: https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event
      iframe.addEventListener('load', () => {
        if (iframe.contentWindow) {
          resolve(iframe.contentWindow);
        } else {
          // We don't know of a case when this would happen, but better to fail
          // fast if it does.
          reject(
            new Error(
              `iframe.contentWindow not present on load for job "${jobId}".`,
            ),
          );
        }
      });

      iframe.setAttribute('sandbox', 'allow-scripts');
    })
  }

  _initJobStream = async (jobId: string): Promise<IJob> => {
    const window = await this._createWindow(jobId);
    console.log({ window });
    const stream = new WindowPostMessageStream({
      name: 'parent',
      target: 'child',
      targetWindow: window,
      targetOrigin: '*',
    });
    console.log({ stream });

    stream.on('data', (data: any) => {
      console.log('[ExecutionController LOG] ProxyService sending message to iframe', data);
      this.proxyService.write({ data, jobId });
    })

    return { id: jobId, window, stream };
  }

  // PUBLIC METHODS

  initJob = async (jobId: string) => {
    console.log('[ExecutionController LOG] initJob: Start new job');
    const job = await this._initJobStream(jobId);
    this.updateJobsState(job);
  };

  getJob = (jobId: string) => {
    const job = this.jobs.find((job: IJob) => job.id === jobId)
    console.log('[ExecutionController LOG] getJob:', { jobId, job });
    return job;
  };

  updateJobsState = (newJob: IJob) => {    
    const newJobsState = [...this.jobs, newJob];
    this.jobs = newJobsState;
    console.log('[ExecutionController LOG] updateJobsState:', this.jobs, newJob);
  }
};

export { ExecutionController };