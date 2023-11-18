import { motion } from 'framer-motion'
import React from 'react'

interface SpinnerProps {
    text: string
}

const Spinner: React.FC<SpinnerProps> = ({ text }) => {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}
        >
            <div
                style={{
                    width: '250px',
                    height: '250px',
                    borderRadius: '50%',
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <motion.div
                    style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        border: '10px solid transparent',
                        borderTopColor: '#00b8a2',
                        borderRightColor: '#febf1d',
                        borderBottomColor: '#fe375f',
                        borderLeftColor: '#4A90E2',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                    }}
                    animate={{ rotate: 360 }}
                    transition={{
                        loop: Infinity,
                        ease: 'linear',
                        duration: 2,
                    }}
                />
                <h2 style={{ position: 'relative', zIndex: 1 }}>{text}</h2>
            </div>
        </div>
    )
}

export default Spinner
