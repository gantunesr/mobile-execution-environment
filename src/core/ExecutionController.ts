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
  terminateNext?: string;
}

class ExecutionController {
  
  public _jobs: Record<string, IJob>;
  private _proxyService: any;

  constructor({ proxyService }: ExecutionControllerArgs) {
    this._jobs = {};
    this._proxyService = proxyService;
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

  _deleteWindow = (jobId: string): void => {
    const iframe = document.getElementById(jobId);
    if (!iframe || !iframe.parentNode) {
      throw new Error(`Window with the id ${jobId} was not found`)
    }
    iframe.parentNode.removeChild(iframe);
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
      console.log('ExecutionController ->', data)
      this._proxyService.write({ data, jobId });
      this._handleJobDeletion({ data, jobId });
    })

    return { id: jobId, window, stream };
  }

  _update = (newJob: IJob): void => {    
    this._jobs[newJob.id] = newJob;
    console.log('[ExecutionController LOG] updateJobsState:', { newState: this._jobs, newElelment: newJob });
  }

  _handleJobDeletion = ({ jobId, data }: { jobId: string, data: any }): void => {
    const job = this.get(jobId);
    console.log('ExecutionController ->', job?.terminateNext, data?.data?.id)
      if (job?.terminateNext && job?.terminateNext === data?.data?.id) {
        this.delete(jobId);
      }
  }

  // PUBLIC METHODS

  init = async (jobId: string): Promise<void> => {
    console.log('[ExecutionController LOG] initJob: Start new job');
    const job = await this._initJobStream(jobId);
    this._update(job);
  };

  get = (jobId: string): IJob => {
    const job = this._jobs[jobId];
    console.log('[ExecutionController LOG] getJob:', { jobId, job });
    return job;
  };

  delete = (jobId: string): void => {
    console.log('[ExecutionController LOG] delete:', { jobId });
    this._jobs[jobId].stream._destroy();
    console.log('[ExecutionController LOG] stream deleted:', { jobId });
    this._deleteWindow(jobId);
    console.log('[ExecutionController LOG] iframe deleted:', { jobId });
    delete this._jobs[jobId];
    console.log('[ExecutionController LOG] job deleted from state:', { jobId });
  }

};

export { ExecutionController };