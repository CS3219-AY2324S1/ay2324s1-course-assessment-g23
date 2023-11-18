import { motion } from 'framer-motion'
import React from 'react'
import { useTimer } from '../TimerProvider.tsx'

interface TimerCircleProps {
    time: string
}

const TimerCircle: React.FC<TimerCircleProps> = ({ time }) => {
    const { seconds } = useTimer()
    const radius = 58 // Circle's radius
    const circumference = 2 * Math.PI * radius

    const dashOffset = React.useMemo(
        () => (circumference * (29 - seconds)) / 30,
        [circumference, seconds]
    )

    return (
        <div className='timer-circle'>
            <svg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'>
                {/* Circle background */}

                <motion.circle
                    cx='60'
                    cy='60'
                    r={radius}
                    fill='transparent'
                    stroke='white'
                    strokeWidth='4'
                    strokeDasharray={circumference}
                    animate={{ strokeDashoffset: dashOffset }}
                    transition={{
                        duration: 1,
                        ease: 'linear',
                        loop: 0,
                    }}
                    transform='rotate(-90 60 60)'
                />
                <text
                    x='60'
                    y='60'
                    dominantBaseline='middle'
                    textAnchor='middle'
                    style={{ fill: 'white', fontSize: '1.5rem' }}
                >
                    {time}
                </text>
            </svg>
        </div>
    )
}

export default TimerCircle
