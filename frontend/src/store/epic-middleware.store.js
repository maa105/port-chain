import rootEpic from '../epics';

const connectEpicMiddleware = (epicMiddleware) => {
  epicMiddleware.run(rootEpic);
};

export default connectEpicMiddleware;
