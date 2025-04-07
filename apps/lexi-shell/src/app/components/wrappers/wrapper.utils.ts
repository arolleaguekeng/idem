// wrapper.utils.ts
export async function loadRemoteEntry(remoteEntryUrl: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = remoteEntryUrl;
      script.type = 'text/javascript';
      script.async = true;
  
      script.onload = () => resolve();
      script.onerror = () => reject();
  
      document.body.appendChild(script);
    });
  }
  