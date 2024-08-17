class MockWebSocket {
  constructor(url) {
    this.url = url;
    this.onmessage = null;
    this.onopen = null;
    this.onclose = null;
    this.onerror = null;

    // Simulate connection delay
    setTimeout(() => {
      if (this.onopen) this.onopen({ type: 'open' });
    }, 100);
  }

  send(data) {
    // Simulate message delay
    setTimeout(() => {
      if (this.onmessage) {
        const parsedData = JSON.parse(data);
        switch (parsedData.type) {
          case 'add':
          case 'move':
          case 'update':
          case 'delete':
          case 'connect':
            this.onmessage({ data: JSON.stringify({ ...parsedData, userId: 'user2' }) });
            break;
          default:
            console.warn('Unknown message type:', parsedData.type);
        }
      }
    }, 100);
  }

  close() {
    if (this.onclose) this.onclose({ type: 'close' });
  }
}

export default MockWebSocket;