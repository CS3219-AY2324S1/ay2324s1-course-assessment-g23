import Peer from 'peerjs'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { useCurrentUser } from '../stores/userStore.ts'

const COMMUNICATION_API_URL =
    `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}` +
    '/api/communication'

function VideoChat() {
    const [peerId, setPeerId] = useState('')
    const [remotePeerIdValue, setRemotePeerIdValue] = useState('')
    const remoteVideoRef = useRef(null)
    const currentUserVideoRef = useRef(null)
    const peerInstance = useRef(null)

    const { roomId } = useParams()
    const [socket, setSocket] = useState<WebSocket | null>(null)
    const { data: user } = useCurrentUser()

    useEffect(() => {
        if (user !== null) {
            const socket = new WebSocket(
                COMMUNICATION_API_URL + `/communication_video/${roomId}/${user.username}`
            )
            setSocket(socket)

            return () => {
                socket.close()
            }
        }
    }, [user, roomId])

    useEffect(() => {
        if (socket == null) return

        socket.onopen = () => {
            const peer = new Peer()

            peer.on('open', (id) => {
                setPeerId(id)
            })

            peer.on('call', (call) => {
                var getUserMedia =
                    navigator.getUserMedia ||
                    navigator.webkitGetUserMedia ||
                    navigator.mozGetUserMedia

                getUserMedia({ video: true, audio: true }, (mediaStream) => {
                    currentUserVideoRef.current.srcObject = mediaStream
                    currentUserVideoRef.current.play()
                    call.answer(mediaStream)
                    call.on('stream', function (remoteStream) {
                        remoteVideoRef.current.srcObject = remoteStream
                        remoteVideoRef.current.play()
                    })
                })
            })

            peerInstance.current = peer

            console.log('Video connection is open')
        }

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data)
            if (data.event == 'join-video') {
                setRemotePeerIdValue(data.p2pId)
            }
        }

        socket.onclose = () => {
            console.log('video closed')
        }
    }, [socket])

    useEffect(() => {
        if (peerId == '') return
        socket?.send(
            JSON.stringify({
                event: 'join-video',
                p2pId: peerId,
            })
        )
    }, [peerId])

    useEffect(() => {
        if (remotePeerIdValue == '') return
        call(remotePeerIdValue)
    }, [remotePeerIdValue])

    const call = (remotePeerId) => {
        var getUserMedia =
            navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia

        getUserMedia({ video: true, audio: true }, (mediaStream) => {
            currentUserVideoRef.current.srcObject = mediaStream
            currentUserVideoRef.current.play()

            const call = peerInstance.current.call(remotePeerId, mediaStream)

            call.on('stream', (remoteStream) => {
                remoteVideoRef.current.srcObject = remoteStream
                remoteVideoRef.current.play()
            })
        })
    }

    return (
        <div className='App'>
            <div>
                <video ref={currentUserVideoRef} />
            </div>
            <div>
                <video ref={remoteVideoRef} />
            </div>
        </div>
    )
}

export default VideoChat
