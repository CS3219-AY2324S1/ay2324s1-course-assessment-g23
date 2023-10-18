import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from './Loader.tsx';
import Spinner from "./Spinner.tsx";

const MatchingScreen = () => {
    const [showMatchFound, setShowMatchFound] = useState(true);
    const [showMatchedUser, setShowMatchedUser] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowMatchFound(false);
            setShowMatchedUser(true);  // Show the new message after hiding the previous one
        }, 2000);  // Hide the Match Found message after 2 seconds

        return () => clearTimeout(timer);
    }, []);

    const fadeInOut = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0, transition: { duration: 0.5 } }
    };

    return (
        <div className='dark-overlay' style={{ backgroundColor: 'black', opacity: ' 100%' }}>
            <div className='home-page-container' style={{ opacity: '100%' }}>
                <AnimatePresence>
                    <div>
                    {showMatchFound && (
                        <Spinner text={'Match Found!'}/>

                    )}
                    {showMatchedUser && (
                        <motion.h2
                            key="matchedUser"
                            initial="initial"
                            animate="animate"
                            variants={fadeInOut}
                            style={{ marginBottom: '2rem' }}
                        >
                            Matched with user123!
                        </motion.h2>
                    )}
                    </div>
                    <Loader />
                    {showMatchedUser && (
                        <motion.h2
                            key="matchedUser"
                            initial="initial"
                            animate="animate"
                            variants={fadeInOut}
                            style={{ marginTop: '5rem' }}
                        >
                            Redirecting to collaboration space...                        </motion.h2>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default MatchingScreen;

