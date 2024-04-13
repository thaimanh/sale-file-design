import express from 'express';
import {IObject} from '../definition/interfaces';
import crypto from 'crypto';

export const addZero = (item: string | number, length: number) => {
  return item.toString().padStart(length, '0');
};

export const hashMd5 = (str: string, salt?: string): string => {
  return crypto
    .createHash('md5')
    .update(String(str || '') + String(salt || ''))
    .digest('hex');
};

export const compareHash = (str: string = '', strHash: string = '', salt?: string): boolean => {
  const hashed = hashMd5(str, salt);
  return hashed === strHash;
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
