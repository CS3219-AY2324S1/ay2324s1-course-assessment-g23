import { motion } from 'framer-motion'

/** Adapted from https://codesandbox.io/s/framer-motion-loader-tpbpg?file=/src/loader.jsx */

const colors = ['white', 'white', 'white', 'white', 'white']

const containerVariants = {
    initial: {},
    animate: {
        transition: {
            when: 'beforeChildren',
            staggerChildren: 0.1,
        },
    },
}

const dotVariants = {
    initial: {},
    animate: {
        height: [10, 30, 10],
        transition: {
            duration: 1.5,
            repeat: Infinity,
        },
    },
}

const TinyLoader = ({ count = colors.length }) => {
    return (
        <motion.div
            variants={containerVariants}
            initial='initial'
            animate='animate'
            style={{
                display: 'flex',
                gap: 5,
                height: 40,
                alignItems: 'center',
            }}
        >
            {Array(count)
                .fill(null)
                .map((_, index) => {
                    return (
                        <motion.div
                            key={index}
                            variants={dotVariants}
                            style={{
                                height: 30,
                                width: 10,
                                backgroundColor: colors[index % colors.length],
                                borderRadius: 20,
                            }}
                        />
                    )
                })}
        </motion.div>
    )
}

export default TinyLoader
