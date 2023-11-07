import { motion } from 'framer-motion'
import React, { useState } from 'react'

const CodeExecutor: React.FC = () => {
    const [isExecuting, setIsExecuting] = useState(false)
    const [isError, setIsError] = useState(false)

    const handleExecute = () => {
        setIsExecuting(true)
        // insert code execution logic here
        // if executed code has error setIsError(true)
    }

    const handleMinimise = () => {
        setIsExecuting(false)
    }

    const heightVariants = {
        minimized: { height: '50px' },
        expanded: { height: '500px' },
    }

    return (
        <motion.div
            className='ce-container'
            style={{ display: 'flex' }}
            animate={isExecuting ? 'expanded' : 'minimized'}
            variants={heightVariants}
        >
            {isExecuting && (
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <div
                        className='ce-container'
                        style={{
                            margin: '0',
                            padding: '0',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <h3 style={{ margin: '5px', padding: '0' }}>Output</h3>
                        <button onClick={handleMinimise} style={{ height: '35px' }}>
                            Close
                        </button>
                    </div>
                    {isError ? (
                        <div className='error-output'>Error</div>
                    ) : (
                        <div className='code-output'>Output</div>
                    )}
                </div>
            )}
            {!isExecuting && (
                <button
                    onClick={handleExecute}
                    style={{ height: '35px', backgroundColor: '#00b8a2' }}
                >
                    Run
                </button>
            )}
        </motion.div>
    )
}

export default CodeExecutor
