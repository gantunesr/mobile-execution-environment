import { WindowPostMessageStream } from '@metamask/post-message-stream';

type WindowWorker = Window | undefined;

interface IJob {
  id: string;
  window: WindowWorker;
  stream: WindowPostMessageStream;
}

class ExecutionController {
  
  public jobs: IJob[] | [];
  private proxyService: any;

  constructor({ proxyService }) {
    this.jobs = [];
    this.proxyService = proxyService;
  }

  _createWindow = (jobId: string): Promise<WindowWorker> => {
    return new Promise((resolve, reject) => {
      const iframe = document.createElement('iframe');
      iframe.setAttribute('id', jobId);
  
      iframe.setAttribute('src', 'https://metamask.github.io/iframe-execution-environment/0.10.0');
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
      console.log('proxyService iframe message', !!this.proxyService, data);
      this.proxyService.write(data);
    })

    return { id: jobId, window, stream };
  }

  // PUBLIC METHODS

  initJob = async (jobId: string) => {
    console.log('LOG: ExecutionController::initJob - Start new job creation');
    const mockId = `${jobId}`;
    const job = await this._initJobStream(mockId);
    this.updateJobsState(job);
  };

  findJob = (jobId: string) => {
    const job = this.jobs.find((job: IJob) => job.id === jobId)
    console.log('findJob', { jobId, job });
    return job;
  };

  updateJobsState = (newJob: IJob) => {
    console.log('updateJobsState', this.jobs, newJob);
    const newJobsState = [...this.jobs, newJob];
    this.jobs = newJobsState;
    console.log(this.jobs);
  }

};

export { ExecutionController };