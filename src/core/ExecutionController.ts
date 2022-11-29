import { WindowPostMessageStream } from '@metamask/post-message-stream';

type WindowWorker = Window | undefined;

interface IJob {
  id: string;
  window: WindowWorker;
  stream: WindowPostMessageStream;
}

class ExecutionController {
  
  public jobs: IJob[] | [];
  private counter: number;

  constructor() {
    this.jobs = [];
    this.counter = 0;
  }

  _createWindow = (jobId: string): Promise<WindowWorker> => {
    return new Promise((resolve, reject) => {
      const iframe = document.createElement('iframe');
      iframe.setAttribute('id', jobId);
  
      iframe.setAttribute('src', 'http://localhost:3001/');
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
      // return iframe.contentWindow;
    })
  }

  _initJobStream = async (jobId: string): Promise<IJob> => {
    const window = await this._createWindow(jobId);
    const stream = new WindowPostMessageStream({
      name: 'parent',
      target: 'child',
      targetWindow: window,
      targetOrigin: '*',
    });

    stream.on('data', () => console.log(`hello from iframe ${jobId}`))

    return { id: jobId, window, stream };
  }

  // PUBLIC METHODS

  initJob = async (jobId: string) => {
    console.log('LOG: ExecutionController::initJob - Start new job creation');
    const mockId = `${jobId}-${this.counter}`;
    const job = await this._initJobStream(mockId);
    this.updateJobsState(job);
    this.counter = this.counter + 1;
  };

  findJob = (jobId: string) => this.jobs.find((job: IJob) => job.id === jobId);

  updateJobsState = (newJob: IJob) => {
    console.log('updateJobsState', this.jobs, newJob);
    const newJobsState = [...this.jobs, newJob];
    this.jobs = newJobsState;
    console.log(this.jobs);
  }

};

export { ExecutionController };