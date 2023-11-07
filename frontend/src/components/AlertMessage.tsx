import React, { useEffect, useState } from 'react'

interface MessageProps {
    variant?: string
    children: React.ReactNode
}

const AlertMessage: React.FC<MessageProps> = ({ variant, children }) => {
    const [show, setShow] = useState(true)

    // On componentDidMount set the timer
    useEffect(() => {
        const timeId = setTimeout(() => {
            // After 2 seconds set the show value to false
            setShow(false)
        }, 2500)

        return () => {
            clearTimeout(timeId)
        }
    }, [])

    // If show is false the component will return null and stop here
    if (!show) {
        return null
    }

    // If show is true this will be returned
    return <div className={`alert alert-${variant} ${show ? 'fade-out' : ''}`}>{children}</div>
}

export default AlertMessage
