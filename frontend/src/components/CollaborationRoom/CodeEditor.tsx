import 'quill/dist/quill.snow.css'
import {EditorState, Compartment} from "@codemirror/state"
import {basicSetup, EditorView} from "codemirror"
import { Error, Fullscreen, Restore, ZoomIn, ZoomOut } from '@mui/icons-material'
import { Tooltip } from '@mui/material'

import {basicDark} from 'cm6-theme-basic-dark'
import {solarizedDark} from 'cm6-theme-solarized-dark'
import { vscodeDarkInit } from '@uiw/codemirror-theme-vscode'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router'
import { Socket, io } from 'socket.io-client'
import { useShallow } from 'zustand/react/shallow'
import { getDocument, getLangExtension, peerExtension } from '../../api/codeEditor.ts'
import { useDocStore, useLanguage } from '../../stores/codeStore'
import LanguageSelect from './LanguageSelect.tsx'

export const CodeEditor: React.FC = () => {
    const { roomId } = useParams()
    const [socket, setSocket] = useState<Socket | null>(null)
    const [doc, setDoc] = useDocStore(useShallow((state) => [state.doc, state.setDoc]))
    const [version, setVersion] = useState<number | null>(null)
    const [showResetConfirmation, setShowResetConfirmation] = useState(false)
    const [fontSize, setFontSize] = useState(14) // Default font size for the editor
    const language = useLanguage((state) => state.language)
    const [editorView, setEditorView] = useState<EditorView | null>(null)
    const ref = useRef()

    useEffect (() => {
        if (socket == null || version == null) return
        setEditorView(new EditorView({
            state: EditorState.create({
                doc: doc,
                extensions: [
                    getLangExtension(language),
                    peerExtension(socket, version),
                    EditorView.updateListener.of(({ state }) => {
                        setDoc(state.doc.toString())
                    }),
                    basicSetup,
                    basicDark
                ],
        }),
            parent: ref.current
        }))
    }, [socket, version])

    useEffect(() => {
        editorView?.setState(
        EditorState.create({
                doc: doc,
                extensions: [
                    getLangExtension(language),
                    peerExtension(socket, version),
                    EditorView.updateListener.of(({ state }) => {
                        setDoc(state.doc.toString())
                    }),
                    basicSetup,
                    basicDark
                ],
        })
        )
    }, [language])

    useEffect(() => {

        const socket = io('http://localhost:8004', {
            path: `/room`,
        })
        setSocket(socket)

        return () => {
            socket.off('connect')
            socket.off('disconnect')
            socket.off('pullUpdateResponse')
            socket.off('pushUpdateResponse')
            socket.off('getDocumentResponse')
        }
    }, [])

    useEffect(() => {
        if (socket == null) return

        const fetchDoc = async () => {
            const { version, doc } = await getDocument(socket)
            setVersion(version)
            setDoc(doc.toString())
        }

        socket.on('connect', () => {
            console.log('Collab editor connected')
            socket.emit('join-room', roomId)
            fetchDoc()
        })

        socket.on('disconnect', () => {
            console.log('Collab editor connection closed')
        })
    }, [socket])

    const resetCode = () => {
        setShowResetConfirmation(false)
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
                <LanguageSelect />
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
                    {/* <Tooltip
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
                    </Tooltip> */}
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
                    <div ref={ref} />
                </div>
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
