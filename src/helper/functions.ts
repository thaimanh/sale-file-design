import express from 'express';
import {IObject} from '../common/interfaces';
import * as bcrypt from 'bcrypt';

const SALT_ROUND = 5;

export const addZero = (item: string | number, length: number) => {
  return item.toString().padStart(length, '0');
};

export const hashMd5 = (str: string) => {
  return bcrypt.hash(str, SALT_ROUND);
};

/**
 *
 * @param {string} str
 * @param {string} strHash
 * @returns {boolean}
 */
export const compareHash = (str: string = '', strHash: string = '') => {
  const result = bcrypt.compareSync(str, strHash);
  return result;
};

export const escapeRegExp = (text: string) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

export const wait = (millisecond: number) =>
  new Promise((resolve) => setTimeout(resolve, millisecond));

export const objArrToDict = <T>(arr: T[], indexKey: keyof T) => {
  const normalizedObject: any = {};
  for (let i = 0; i < arr.length; i++) {
    const key = arr[i][indexKey];
    if (typeof key === 'string' || typeof key === 'number') {
      normalizedObject[key.toString()] = arr[i];
    }
  }
  return normalizedObject as {[key: string]: T};
};

export const objArrDistinct = <T>(arr: T[], indexKey: keyof T) => {
  const normalizedObject: any = {};
  for (let i = 0; i < arr.length; i++) {
    const key = arr[i][indexKey];
    if (typeof key === 'string' || typeof key === 'number') {
      normalizedObject[key.toString()] = arr[i];
    }
  }
  return Object.values(normalizedObject) as T[];
};

export const objFilterKeys = (objSrc: IObject<any>, keys: string[]) => {
  if (!(objSrc instanceof Object)) {
    objSrc = {};
  }
  const objDest: IObject<any> = {};
  for (const key of keys) {
    if (key in objSrc) {
      objDest[key] = objSrc[key];
    }
  }
  return objDest;
};

/**
 * @description Function used to filter undefined values
 * @param objSrc
 * @returns
 */
export const objValidateKey = (objSrc: IObject<any>) => {
  if (!(objSrc instanceof Object)) {
    objSrc = {};
  }

  const objDest: IObject<any> = {};

  for (const key of Object.keys(objSrc)) {
    if (objSrc[key]) {
      objDest[key] = objSrc[key];
    }
  }

  return objDest;
};

export const isJson = (str: string) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export function downloadFileFromPath(res: express.Response, filePath: string) {
  return new Promise((resolve, reject) => {
    res.download(filePath, (err) => {
      if (err) reject(err);
      res.end();
      resolve(undefined);
    });
  });
}

export function downloadFileFromStream(res: express.Response, fileStream: any) {
  return new Promise((resolve, reject) => {
    fileStream.pipe(res);
    fileStream.on('end', () => {
      res.end();
      resolve(undefined);
    });
    fileStream.on('error', reject);
  });
}

export function isEmpty(source: IObject) {
  return Object.keys(source).length === 0;
}
