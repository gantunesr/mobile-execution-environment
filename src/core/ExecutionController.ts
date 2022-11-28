import { WindowPostMessageStream } from '@metamask/post-message-stream';

// interface IExecutionControllerArgs {
//   jobId: string;
// }

type WindowWorker = Window | null;

interface IJob {
  jobId: string;
  window: WindowWorker;
//   stream: WindowPostMessageStream;
}

class ExecutionController {
  
  public jobs: IJob[] | [];
  private counter: number;

  constructor() {
    this.jobs = [];
    this.counter = 0;
  }

  _createWindow = (jobId: string): WindowWorker => {
    // return new Promise((resolve, reject) => {
      const iframe = document.createElement('iframe');
      iframe.setAttribute('id', jobId);
      document.body.appendChild(iframe);

    //   // MDN article for `load` event: https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event
    //   iframe.addEventListener('load', () => {
    //     if (iframe.contentWindow) {
    //       resolve(iframe.contentWindow);
    //     } else {
    //       // We don't know of a case when this would happen, but better to fail
    //       // fast if it does.
    //       reject(
    //         new Error(
    //           `iframe.contentWindow not present on load for job "${jobId}".`,
    //         ),
    //       );
    //     }
    //   });

      iframe.setAttribute('sandbox', 'allow-scripts');
      return iframe.contentWindow;
    // })
  }

  // PUBLIC METHODS

  initJob = async (jobId: string) => {
    console.log('LOG: ExecutionController::initJob - Start new job creation');
    const mockId = `${jobId}-${this.counter}`;
    const window = await this._createWindow(mockId);
    this.updateJobsState({ jobId: mockId, window });
    this.counter = this.counter + 1;
  };

  updateJobsState = (newJob: IJob) => {
    console.log('updateJobsState', this.jobs, newJob);
    const newJobsState = [...this.jobs, newJob];
    this.jobs = newJobsState;
    console.log(this.jobs);
  }

};

export { ExecutionController };