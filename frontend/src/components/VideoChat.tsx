import { CallEnd, Message, Mic, SpeakerNotesOff, Videocam } from '@mui/icons-material'
import Peer from 'peerjs'
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { useCurrentUser } from '../stores/userStore.ts'

const COMMUNICATION_API_URL =
    `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}` +
    '/api/communication'

interface VideoChatProps {
    toggleMessages: () => void
    messageIconStatus: boolean
    closeVideoChat: () => void
}

const VideoChat: React.FC<VideoChatProps> = ({
    toggleMessages,
    messageIconStatus,
    closeVideoChat,
}) => {
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
        if (peerId == '' || socket == null) return
        socket.send(
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
        <div>
            <div className='video-chat-box'>
                <div className='user-video-container'>
                    <video className='user-video' ref={currentUserVideoRef} />
                </div>
                <div className='remote-video-container'>
                    <video className='remote-video' ref={remoteVideoRef} />
                </div>
            </div>
            <div className='video-controls'>
                <button className='videocam-icon'>
                    <Videocam />
                </button>
                <button className='mic-icon'>
                    <Mic />
                </button>
                {messageIconStatus ? (
                    <button className='message-icon' onClick={toggleMessages}>
                        <Message />
                    </button>
                ) : (
                    <button className='message-icon' onClick={toggleMessages}>
                        <SpeakerNotesOff />
                    </button>
                )}

                <button className='callend-icon' onClick={closeVideoChat}>
                    <CallEnd />
                </button>
            </div>
        </div>
    )
}

export default VideoChat
