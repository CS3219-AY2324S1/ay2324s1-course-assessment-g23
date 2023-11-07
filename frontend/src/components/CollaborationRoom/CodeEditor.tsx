import { langs } from '@uiw/codemirror-extensions-langs'
import CodeMirror from '@uiw/react-codemirror'
import Quill from 'quill'
import Delta from 'quill-delta'
import 'quill/dist/quill.snow.css'

import { Error, Fullscreen, Restore, ZoomIn, ZoomOut } from '@mui/icons-material'
import { Tooltip } from '@mui/material'
import { vscodeDarkInit } from '@uiw/codemirror-theme-vscode'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import LanguageSelect from './LanguageSelect.tsx'

/** URL for collaboration websocket API. */
const COLLABORATION_API_URL =
    `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}` +
    '/api/collaboration'

export const CodeEditor: React.FC = () => {
    const { roomId } = useParams()
    const [socket, setSocket] = useState<WebSocket | null>(null)
    const [quill, setQuill] = useState<Quill | null>(null)
    const [lock, setLock] = useState(0)
    const [value, setValue] = useState('')
    const [quillValue, setQuillValue] = useState('')
    const [selectedLanguage, setSelectedLanguage] = useState('Javascript') // default to Javascript
    const [showResetConfirmation, setShowResetConfirmation] = useState(false)
    const [fontSize, setFontSize] = useState(14) // Default font size for the editor

    useEffect(() => {
        const socket = new WebSocket(COLLABORATION_API_URL + `/collab/${roomId}`)
        setSocket(socket)

        return () => {
            socket.close()
        }
    }, [])

    useEffect(() => {
        if (socket == null || quill == null) return
        const userEdit = (eventName: string, ...args: any[]) => {
            if (eventName == 'text-change') {
                if (lock > 0) {
                    quill?.off('editor-change', userEdit)
                    setLock((prevLock) => prevLock - 1)
                } else {
                    editHandler(args[0])
                }
            }
        }
        if (lock <= 0) {
            // mounts only init
            quill?.on('editor-change', userEdit)
        }

        const editHandler = (delta: Delta) => {
            quill?.off('editor-change', userEdit)
            if (socket == null || quill == null || lock > 0) return
            quill?.on('editor-change', userEdit)
            const payload = {
                event: 'send-changes',
                data: {
                    delta: delta,
                    fullDoc: quill.getText(),
                },
            }
            socket.send(JSON.stringify(payload))
        }

        socket.onopen = () => {
            console.log('WebSocket connection is open')
        }

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data)

            if (data.event == 'open') {
                quill?.off('editor-change', userEdit) // this is treated like a semaphore
                quill?.setText(data.data)
                setValue(quill.getText())
                quill?.on('editor-change', userEdit)
            }

            if (data.event == 'receive-changes') {
                quill?.off('editor-change', userEdit) // this is treated like a semaphore
                quill?.updateContents(data.data)
                setValue(quill.getText())
                quill?.on('editor-change', userEdit)
            }
        }
    }, [lock, quill, socket])

    useEffect(() => {
        if (quill == null || lock > 0 || quill.getText() == value) return
        quill.setText(value)
    }, [value, quill, lock])

    const onChange = useCallback(
        (val: string, viewUpdate: any) => {
            setValue(val)
        },
        [lock]
    )

    const wrapperRef = useCallback((wrapper: HTMLElement | null) => {
        if (wrapper == null) return

        wrapper.innerHTML = ''
        const editor = document.createElement('div')
        wrapper.append(editor)
        const q = new Quill(editor, {
            modules: {
                toolbar: false,
            },
        })

        const quillElement = wrapper.querySelector('.ql-editor') as HTMLElement
        if (quillElement) {
            quillElement.style.cssText = 'display: none'
        }

        setQuill(q)
    }, [])

    const getLangExtension = (language: string) => {
        switch (language) {
            case 'Javascript':
                return langs.javascript()
            case 'Java':
                return langs.java()
            case 'Python':
                return langs.python()
            default:
                return langs.javascript()
        }
    }

    const resetCode = () => {
        setShowResetConfirmation(false)
        setValue('')
    }

    const zoomIn = () => {
        setFontSize((prevFontSize) => Math.min(prevFontSize + 4, 44))
    }

    const zoomOut = () => {
        setFontSize((prevFontSize) => Math.max(prevFontSize - 4, 16)) // Prevents font size from going below 4px
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
            <div style={{ fontSize: `${fontSize}px` }}>
                <CodeMirror
                    extensions={[getLangExtension(selectedLanguage)]}
                    theme={vscodeDarkInit({
                        settings: {
                            background: '#242424',
                            gutterBackground: '#242424',
                            lineHighlight: 'transparent',
                        },
                    })}
                    value={value}
                    height='auto'
                    onChange={onChange}
                />
            </div>
            <div id='container' ref={wrapperRef}></div>
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
