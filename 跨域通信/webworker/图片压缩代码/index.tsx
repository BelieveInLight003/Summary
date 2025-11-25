import { Button } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import CompressWorker from './compress.worker?worker'; // 确保项目支持此语法

const allImgNum = 100;
const url = 'https://pic3.zhimg.com/v2-58d652598269710fa67ec8d1c88d8f03_r.jpg?source=1940ef5c';

interface WorkerResponse {
  data: string[];
  name: string;
}

export default function Home() {
  const [showTime, setShowTime] = useState<number>(Date.now());
  const rafRef = useRef<number>();

  useEffect(() => {
    updateShowTime();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const updateShowTime = () => {
    setShowTime(Date.now());
    rafRef.current = requestAnimationFrame(updateShowTime);
  };

  // 主线程压缩
  const mainCompressImg = async () => {
    const img: HTMLImageElement = await new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = url.trim();
      img.onload = () => resolve(img);
      img.onerror = reject;
    });

    console.time('compress');
    for (let i = 0; i < allImgNum; i++) {
      void compressImg(img); // void 防止未使用警告
    }
    console.timeEnd('compress');
  };

  const compressImg = (img: HTMLImageElement): string => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas not supported');
    
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.75);
  };

  // Worker 压缩
  const workerCompressImg = async () => {
    try {
      const res = await fetch(url.trim()).then(r => r.blob());
      const workerCount = 5;
      const imagesPerWorker = allImgNum / workerCount;
      
      // 更优雅地分配任务
      const workerList = Array.from({ length: workerCount }, (_, i) => 
        Array(imagesPerWorker).fill(res)
      );

      console.time('compressWorker');
      const pList = workerList.map(imageList => 
        new Promise<string[]>((resolve, reject) => {
          const myWorker = new CompressWorker();
          
          const handleMessage = (e: MessageEvent<WorkerResponse>) => {
            resolve(e.data.data);
            cleanup();
          };
          
          const handleError = (error: ErrorEvent) => {
            reject(error);
            cleanup();
          };
          
          const cleanup = () => {
            myWorker.removeEventListener('message', handleMessage);
            myWorker.removeEventListener('error', handleError);
            myWorker.terminate();
          };
          
          myWorker.addEventListener('message', handleMessage);
          myWorker.addEventListener('error', handleError);
          myWorker.postMessage({ imageList });
        })
      );

      const pRes = await Promise.all(pList);
      console.log('Worker 结果:', pRes);
      console.timeEnd('compressWorker');
    } catch (error) {
      console.error('Worker 压缩失败:', error);
    }
  };

  return (
    <div>
      <Button onClick={mainCompressImg}>压缩图片</Button>
      <Button onClick={workerCompressImg}>worker压缩图片</Button>
      <span>{showTime}</span>
    </div>
  );
}