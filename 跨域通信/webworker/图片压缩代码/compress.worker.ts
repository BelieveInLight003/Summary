// 修正后的代码
self.onmessage = async function (e: MessageEvent) {
    const { data: imageList } = e.data;
    const resList = [];
  
    for (let img of imageList) {
      // 创建离屏画布
      const offscreen = new OffscreenCanvas(100, 100);
      const ctx = offscreen.getContext('2d');
      if (!ctx) continue;
  
      const imgData = await createImageBitmap(img);
      offscreen.width = imgData.width;
      offscreen.height = imgData.height;
      
      // 重新获取调整大小后的上下文
      const newCtx = offscreen.getContext('2d');
      if (!newCtx) continue;
      
      newCtx.drawImage(imgData, 0, 0, offscreen.width, offscreen.height);
      
      const blob = await offscreen.convertToBlob({ 
        type: 'image/jpeg', 
        quality: 0.75 
      });
      
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      
      const res = await new Promise<string>((resolve) => {
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
      });
      
      resList.push(res);
    }
  
    self.postMessage({
      data: resList,
      name: 'worker test'
    });
    
    self.close();
  };