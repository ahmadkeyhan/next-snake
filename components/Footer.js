import styles from '../styles/Footer.module.css'
import * as SiIcons from 'react-icons/si'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Footer() {
    const variants = {
        initial: { y: '3rem', opacity: 0 },
        animate: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 1,
                delay: 1
            }
        }
    }
    return (
        <motion.div
            variants={variants}
            initial='initial'
            animate='animate'
            className={styles.DevDiv}>
            <p className={styles.DevP}>
                Made with <SiIcons.SiJavascript className={styles.DevIcon} /> & lots of tea by <Link href='https://keyhansa.ir' passHref><span className={styles.DevLink}>keyhansa</span></Link>
            </p>
            <Link href='https://github.com/ahmadkeyhan/next-snake' passHref>
                <div className={styles.GitDiv}>
                    <SiIcons.SiGithub className={styles.GitIcon}/>
                </div>
            </Link>
        </motion.div>
    )
}