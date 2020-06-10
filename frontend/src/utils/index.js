import { isString } from 'lodash';

export const removeClassName = (classesNames, classNameToRemove) => {
  return classesNames.replace(new RegExp('(^' + classNameToRemove + '$|\\s+' + classNameToRemove + '$|^' + classNameToRemove + '\\s+)', 'gmi'), '');
};

export const removeClassesNames = (classesNames, classesNamesToRemove) => {
  if(isString(classesNamesToRemove)) {
    classesNamesToRemove = classesNamesToRemove.split(/\s+/gmi);
  }
  for(var i = 0; i < classesNamesToRemove.length; i++) {
    classesNames = removeClassName(classesNames, classesNamesToRemove[i]);
  }
  return classesNames;
};

export const wait = (duration, data) => {
  return new Promise((resolve) => setTimeout(resolve.bind(null, data), duration));
};

export const getWindowSize = () => {
  return {
    width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
  };
};

export const toFixed = (num) => {
  return num == null ? 'NA' : num.toFixed(2);
};
