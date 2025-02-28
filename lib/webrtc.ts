type PeerConnection = RTCPeerConnection
type DataChannel = RTCDataChannel

export class WebRTCManager {
  private peerConnection: PeerConnection | null = null
  private dataChannel: DataChannel | null = null
  private remoteStream: MediaStream | null = null
  private localStream: MediaStream | null = null

  constructor(
    private onRemoteStream: (stream: MediaStream) => void,
    private onMessage: (message: any) => void,
    private onConnectionStateChange: (state: RTCPeerConnectionState) => void,
  ) {}

  async initializeConnection(isInitiator: boolean) {
    this.peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }],
    })

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        // Send the candidate to the remote peer
        this.onMessage({
          type: "candidate",
          candidate: event.candidate,
        })
      }
    }

    this.peerConnection.ontrack = (event) => {
      this.remoteStream = event.streams[0]
      this.onRemoteStream(this.remoteStream)
    }

    this.peerConnection.onconnectionstatechange = () => {
      if (this.peerConnection) {
        this.onConnectionStateChange(this.peerConnection.connectionState)
      }
    }

    if (isInitiator) {
      this.dataChannel = this.peerConnection.createDataChannel("gameData")
      this.setupDataChannel()
    } else {
      this.peerConnection.ondatachannel = (event) => {
        this.dataChannel = event.channel
        this.setupDataChannel()
      }
    }
  }

  private setupDataChannel() {
    if (!this.dataChannel) return

    this.dataChannel.onmessage = (event) => {
      const message = JSON.parse(event.data)
      this.onMessage(message)
    }

    this.dataChannel.onopen = () => {
      console.log("Data channel opened")
    }

    this.dataChannel.onclose = () => {
      console.log("Data channel closed")
    }
  }

  async addLocalStream(stream: MediaStream) {
    this.localStream = stream
    stream.getTracks().forEach((track) => {
      if (this.peerConnection && this.localStream) {
        this.peerConnection.addTrack(track, this.localStream)
      }
    })
  }

  async createOffer() {
    if (!this.peerConnection) return null

    const offer = await this.peerConnection.createOffer()
    await this.peerConnection.setLocalDescription(offer)
    return offer
  }

  async handleOffer(offer: RTCSessionDescriptionInit) {
    if (!this.peerConnection) return

    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
    const answer = await this.peerConnection.createAnswer()
    await this.peerConnection.setLocalDescription(answer)
    return answer
  }

  async handleAnswer(answer: RTCSessionDescriptionInit) {
    if (!this.peerConnection) return

    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
  }

  async handleCandidate(candidate: RTCIceCandidateInit) {
    if (!this.peerConnection) return

    await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
  }

  sendMessage(message: any) {
    if (this.dataChannel && this.dataChannel.readyState === "open") {
      this.dataChannel.send(JSON.stringify(message))
    }
  }

  closeConnection() {
    if (this.dataChannel) {
      this.dataChannel.close()
    }
    if (this.peerConnection) {
      this.peerConnection.close()
    }
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop())
    }
  }
}

