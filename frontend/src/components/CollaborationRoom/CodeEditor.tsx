
import CodeMirror from '@uiw/react-codemirror'
import 'quill/dist/quill.snow.css'

import { Error, Fullscreen, Restore, ZoomIn, ZoomOut } from '@mui/icons-material'
import { Tooltip } from '@mui/material'
import { io, Socket } from "socket.io-client";
import {getDocument, getLangExtension, peerExtension } from '../../stores/codeEditorStore.ts'
import { vscodeDarkInit } from '@uiw/codemirror-theme-vscode'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import LanguageSelect from './LanguageSelect.tsx'

export const CodeEditor: React.FC = () => {
    const { roomId } = useParams()
    const [socket, setSocket] = useState<Socket | null>(null)
    const [doc, setDoc] = useState<string>('')
    const [selectedLanguage, setSelectedLanguage] = useState('Javascript') // default to Javascript
    const [version, setVersion] = useState<number | null>(null)
    const [showResetConfirmation, setShowResetConfirmation] = useState(false)
    const [fontSize, setFontSize] = useState(14) // Default font size for the editor

    useEffect(() => {
        const socket = io("http://localhost:8004", {
            path: `/room`
            });
        setSocket(socket)

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('pullUpdateResponse');
            socket.off('pushUpdateResponse');
            socket.off('getDocumentResponse');
        }
    }, [])

    useEffect(() => {
        if (socket == null) return

        const fetchDoc = async () => {
            const {version, doc} = await getDocument(socket)
            setVersion(version)
            setDoc(doc.toString())
        }

        socket.on("connect", () => {
            console.log("Collab editor connected")
            socket.emit('join-room', roomId)
            fetchDoc()
          });

        socket.on("disconnect", () => {
            console.log("Collab editor connection closed")
        })

    }, [socket])

    const resetCode = () => {
        setShowResetConfirmation(false)
        setDoc('')
        console.log('reset')
    }

    const zoomIn = () => {
        setFontSize((prevFontSize) => Math.min(prevFontSize + 4, 44))
    }

    const zoomOut = () => {
        setFontSize((prevFontSize) => Math.max(prevFontSize - 4, 16)) // Prevents font size from going below 4px
    }

    const handleOnChange = (val: string, viewUpdate: any) => {
        setDoc(val)
    }

    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((e) => {
                console.error(`Failed to enter full screen mode: ${e.message} (${e.name})`)
            })
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen().catch((e) => {
                    console.error(`Failed to exit full screen mode: ${e.message} (${e.name})`)
                })
            }
        }
    }

    return (
        <div>
            <AnimatePresence>
                {showResetConfirmation && (
                    <ResetPrompt
                        onResetCode={resetCode}
                        onClose={() => setShowResetConfirmation(false)}
                    />
                )}
            </AnimatePresence>

            <div className='editor-header'>
                <LanguageSelect onLanguageChange={setSelectedLanguage} />
                <div className='editor-header-controls'>
                    <Tooltip
                        title='Zoom Out'
                        placement='bottom'
                        componentsProps={{
                            tooltip: {
                                sx: {
                                    backgroundColor: '#c2c2c2',
                                    color: '#242424',
                                    fontSize: '15px',
                                    maxWidth: '100%',
                                    height: 'auto',
                                },
                            },
                        }}
                    >
                        <div className='zoom-out-icon' onClick={zoomOut}>
                            <ZoomOut />
                        </div>
                    </Tooltip>
                    <Tooltip
                        title='Zoom In'
                        placement='bottom'
                        componentsProps={{
                            tooltip: {
                                sx: {
                                    backgroundColor: '#c2c2c2',
                                    color: '#242424',
                                    fontSize: '15px',
                                    maxWidth: '100%',
                                    height: 'auto',
                                },
                            },
                        }}
                    >
                        <div className='zoom-in-icon' onClick={zoomIn}>
                            <ZoomIn />
                        </div>
                    </Tooltip>
                    <Tooltip
                        title='Reset code'
                        placement='bottom'
                        componentsProps={{
                            tooltip: {
                                sx: {
                                    backgroundColor: '#c2c2c2',
                                    color: '#242424',
                                    fontSize: '15px',
                                    maxWidth: '100%',
                                    height: 'auto',
                                },
                            },
                        }}
                    >
                        <div className='reset-icon' onClick={() => setShowResetConfirmation(true)}>
                            <Restore />
                        </div>
                    </Tooltip>
                    <Tooltip
                        title='Enter fullscreen mode'
                        placement='bottom'
                        componentsProps={{
                            tooltip: {
                                sx: {
                                    backgroundColor: '#c2c2c2',
                                    color: '#242424',
                                    fontSize: '15px',
                                    maxWidth: '100%',
                                    height: 'auto',
                                },
                            },
                        }}
                    >
                        <div className='fullscreen-icon' onClick={toggleFullScreen}>
                            <Fullscreen />
                        </div>
                    </Tooltip>
                </div>
            </div>
            {socket && version != null?
            <div style={{ fontSize: `${fontSize}px` }}>
            <CodeMirror
                value={doc}
                onChange={handleOnChange}
                extensions={[getLangExtension(selectedLanguage), peerExtension(socket, version)]}
                theme={vscodeDarkInit({
                    settings: {
                        background: '#242424',
                        gutterBackground: '#242424',
                        lineHighlight: 'transparent',
                    },
                })}
                height='auto'
            /></div> : null}
        </div>
    )
}

interface ResetPromptProps {
    onResetCode: () => void
    onClose: () => void
}

const ResetPrompt: React.FC<ResetPromptProps> = ({ onResetCode, onClose }) => {
    return (
        <div className='dark-overlay' style={{ zIndex: 4 }}>
            <motion.div
                className='reset-confirmation'
                key='reset'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
            >
                <span className='reset-title'>
                    <Error
                        sx={{
                            marginRight: '10px',
                            color: '#febf1d',
                            height: '20px',
                            width: '20px',
                        }}
                    />
                    <h3 style={{ margin: '0' }}>Are you sure?</h3>
                </span>
                <div style={{ padding: '10px' }}>Your current code will be discarded!</div>
                <span className='reset-buttons'>
                    <button
                        style={{ backgroundColor: '#fe375f', marginRight: '5px' }}
                        onClick={onResetCode}
                    >
                        Reset
                    </button>
                    <button style={{ backgroundColor: 'transparent' }} onClick={onClose}>
                        Cancel
                    </button>
                </span>
            </motion.div>
        </div>
    )
}

export default CodeEditor
