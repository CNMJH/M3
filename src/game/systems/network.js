class Network {
  constructor(scene) {
    this.scene = scene;
    this.socket = null;
    this.connected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect() {
    console.log('🌐 尝试连接服务器...');
    
    // 暂时不实际连接，先预留接口
    // 后续添加 Socket.IO 连接逻辑
    
    this.connected = true;
    console.log('✅ 网络系统初始化完成（离线模式）');
  }

  update() {
    // 心跳检测
    if (this.connected) {
      // TODO: 发送心跳
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.connected = false;
  }

  reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`🔄 尝试重连 (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      this.connect();
    } else {
      console.log('❌ 重连失败，请检查网络连接');
    }
  }

  // 发送数据
  send(type, data) {
    if (this.socket && this.connected) {
      this.socket.emit(type, data);
    }
  }

  // 接收事件
  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }
}

export default Network;
