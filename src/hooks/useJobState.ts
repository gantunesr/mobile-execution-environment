import { useState, useCallback } from 'react';
import { BasePostMessageStream } from "@metamask/post-message-stream";

interface Job {
  id: string;
  window: any;
  stream: BasePostMessageStream;
};

type State = Job[] | [];

export const useJobsState = () => {
  const [jobs, setJobs] = useState<State>([]);

  const findJob = useCallback(
    (jobId: string): Job | undefined  => jobs.find((job) => job.id === jobId), [jobs]
  );    

  const addJob = useCallback((newJob: Job): void => {
    const newJobsState = [
      ...jobs,
      newJob,
    ];
    console.log(newJobsState);
    setJobs(newJobsState);
  }, [jobs]);

  const removeJob = (jobId: string): void => {
    const newJobsState = jobs.filter((job) => job.id === jobId);
    setJobs(newJobsState);
  }

  const removeAllJobs = (): void => {
    setJobs([]);
  }

  return [
    jobs,
    findJob,
    addJob,
    removeJob,
    removeAllJobs,
  ]
}
