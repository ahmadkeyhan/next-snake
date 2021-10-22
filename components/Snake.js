import styles from '../styles/Home.module.css'
import {useEffect, useState, useRef} from 'react'
import useInterval from '@use-it/interval'
import { motion } from 'framer-motion'
import * as MdIcons from 'react-icons/io'
import * as AiIcons from 'react-icons/ai'
import * as ThemeIcons from 'react-icons/md'

export default function Snake() {
    //get the initial theme(or preferred) from body
    const [activeTheme, setActiveTheme] = useState(document.body.dataset.theme)
    //each time the theme changes, set it in body & local storage
    useEffect(() => {
        document.body.dataset.theme = activeTheme
        localStorage.setItem('theme', activeTheme)
      }, [activeTheme])
    //initial states
    const [snake, setSnake] = useState([[13,9],[12,9],[11,9]])
    const [direction, setDirection] = useState({x: 1, y:0})
    const [prevDirection, setPrevDirection] = useState({})
    const [dead, setDead] = useState(true)
    const [apple, setApple] = useState(growApple())
    const [score, setScore] = useState(0)
    const [highScore, setHighScore] = useState(0)
    const [newHighScore, setNewHighScore] = useState(false)
    const [firstTry, setFirstTry] = useState(true)
    const [timeTo, setTimeTo] = useState(4)
    const [width, setWidth] = useState(0)

    function countDown() {
        setDirection({x: 1, y: 0})
        const interval = setInterval(() => {
            setTimeTo(prevTimeTo => (prevTimeTo - 1))
        },(timeTo > 0) ? 750 : null)
        setTimeout(() => clearInterval(interval), 3000)
    }

    //canvas setup
    const canvasRef = useRef(null)
    useEffect(() => {
        setWidth(window.screen.width)
    }, [])
    //To omit the rendering error when canvas density is more than device width
    const [canvasWidth, canvasHeight, canvasGridSize] = width > 500 ? [1000, 760, 40] : [500, 380, 20]
    //get high score from local storage
    useEffect(() => {
        setHighScore(parseInt(localStorage.getItem('highscore')) || 0)
      }, [])
    // function to grow an apple in random position and check if it interferes with the snake
    function growApple() {
        let applePosition = [Math.floor(Math.random()*25),Math.floor(Math.random()*19)]
        while (snake.some(pos =>(pos[0] == applePosition[0] && pos[1] == applePosition[1]))) {
            applePosition = [Math.floor(Math.random()*25),Math.floor(Math.random()*19)]
        }
        return applePosition
    }
    //check if the snake eats the apple in each iteration(which accends with score) or not and update the snake array accordingly
    useInterval(() => {
        if (snake[0][0] !== apple[0] || snake[0][1] !== apple[1]) {
            snake.pop()
        } else {
            setApple(growApple())
            setScore(score+1)
        }
        setPrevDirection({ ...direction })
        setSnake([[snake[0][0]+direction.x, snake[0][1]+direction.y], ...snake])
    },(!dead && snake[0][0] > -1 && snake[0][0] < 25 && snake[0][1] > -1 && snake[0][1] < 19) ? Math.max(100,(300 - score**2)) : null)
    //kill the snake if its head meets its body, reset the position, direction and score & check for possible new high score
    for (let i = 1; i < snake.length; i++) {
        if (snake[0][0] == snake[i][0] && snake[0][1] == snake[i][1]) {
            setDead(true)
            setSnake([[13,9],[12,9],[11,9]])
            if (score > highScore) {
                setHighScore(score)
                setNewHighScore(true)
                localStorage.setItem('highscore', score)
            }
            setScore(0)
            setDirection({x:1, y:0})
        }
    }
    //kill the snake if it crosses the boundaries, reset the position, direction and score & check for possible new high score
    if (snake[0][0] == -1 || snake[0][0] == 25 || snake[0][1] == -1 || snake[0][1] == 19) {
        setDead(true)
        setSnake([[13,9],[12,9],[11,9]])
        if (score > highScore) {
            setHighScore(score)
            setNewHighScore(true)
            localStorage.setItem('highscore', score)
        } else {
            setNewHighScore(false)
        }
        setScore(0)
        setDirection({x:1, y:0})
    }
    //everytime the snake array changes, clear the whole canvas and draw the apple and snake(different sizes for the head and tail)
    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        ctx.clearRect(-1, -1, (canvasWidth + 6), (canvasHeight + 6))
        ctx.fillStyle = 'tomato'
        ctx.beginPath()  
        ctx.arc(apple[0]*canvasGridSize+canvasGridSize/2+2,apple[1]*canvasGridSize+canvasGridSize/2+2,canvasGridSize/2-2, 0, 2*Math.PI)
        ctx.closePath()
        ctx.fill()
        ctx.fillStyle = 'rgb(162, 102, 246)'
        snake.map((pos,index) => {
            if (index == 0) {
                ctx.beginPath()
                ctx.arc(pos[0]*canvasGridSize+canvasGridSize/2+2+direction.x*2,pos[1]*canvasGridSize+canvasGridSize/2+2+direction.y*2,canvasGridSize/2, 0, 2*Math.PI)
                ctx.closePath()
                ctx.fill()
            } else if (index == snake.length-1) {
                ctx.beginPath()
                ctx.arc(pos[0]*canvasGridSize+canvasGridSize/2+2,pos[1]*canvasGridSize+canvasGridSize/2+2,canvasGridSize/2 - 3, 0, 2*Math.PI)
                ctx.closePath()
                ctx.fill()
            } else {
                ctx.beginPath()
                ctx.arc(pos[0]*canvasGridSize+canvasGridSize/2+2,pos[1]*canvasGridSize+canvasGridSize/2+2,canvasGridSize/2 - 2, 0, 2*Math.PI)
                ctx.closePath()
                ctx.fill()
            }            
        })
    }, [snake])
    //keyboard event listeners for up,down,left and right arrow keys
    useEffect(() => {
        const handleKeyDown = e => {
            console.log(e.code)
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyA', 'KeyS', 'KeyD', 'KeyW'].includes(e.code)) {
                let dir = {}
                switch (e.code) {
                    case 'KeyA':
                        dir = {x: -1, y: 0}
                        break
                    case 'KeyW':
                        dir = {x: 0, y: -1}
                        break
                    case 'KeyD':
                        dir = {x: 1, y: 0}
                        break
                    case 'KeyS':
                        dir = {x: 0, y: 1}
                        break
                    case 'ArrowLeft':
                        dir = {x: -1, y: 0}
                        break
                    case 'ArrowUp':
                        dir = {x: 0, y: -1}
                        break
                    case 'ArrowRight':
                        dir = {x: 1, y: 0}
                        break
                    case 'ArrowDown':
                        dir = {x: 0, y: 1}
                        break
                    default:
                        console.error('Error')
                }
                setDirection(dir)
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.addEventListener('keydown', handleKeyDown)
        }
    }, [])
    return (
        <div className={styles.Main}>
            <div className={styles.Alert}
                style={dead && !firstTry ? null : {display: 'none'}}>
                <div className={styles.AlertCard}>
                <p className={styles.AlertMessage}>
                        {newHighScore ? "🥳" : '👻'}
                    </p>
                    <p className={styles.AlertMessage}>
                        {newHighScore ? "Congrats! You've reached a new high score!" : 'You can do better!'}
                    </p>
                    <button className={styles.AlertButton}
                    onClick={() => {
                        countDown()
                        setTimeout(() => {
                            setFirstTry(false)
                            setDead(false)
                            setTimeTo(4)}, 3000)}}>
                        {timeTo == 4 ? 'Try again!' : timeTo == 3 ? 'ready?' : timeTo == 2 ? 'set!' : 'snake!'}
                    </button>
                </div>
            </div>
            <div className={styles.Snake}>
                <div className={styles.Header}>
                    <motion.div
                        initial={{opacity: 0, y: '-3rem'}}
                        animate={activeTheme == 'dark' ? {opacity: 0, y: '-3rem'} : {opacity: 1, y: 0}}
                        transition={{duration: 0.25}}>
                        <ThemeIcons.MdOutlineLightMode className={styles.ThemeIcon}
                            onClick={ () => setActiveTheme('dark') } />
                    </motion.div>
                    <h1 className={styles.Title}>NEXT Snake</h1>
                    <motion.div
                        initial={{opacity: 0, y: '-3rem'}}
                        animate={activeTheme == 'dark' ? {opacity: 1, y: 0} : {opacity: 0, y: '-3rem'}}
                        transition={{duration: 0.25}}>
                        <ThemeIcons.MdOutlineDarkMode className={styles.ThemeIcon}
                            onClick={() => setActiveTheme('light')} />
                    </motion.div>
                </div>
                <canvas 
                    ref={canvasRef}
                    width={canvasWidth+4}
                    height={canvasHeight+4}
                    className={styles.Board} />
                <div className={styles.Card}>
                    <div className={styles.Scores}>
                        <h3 className={styles.Score}>
                            <AiIcons.AiFillStar /> Score: {score}
                        </h3>
                        <h3 className={styles.Score}>
                            <AiIcons.AiFillTrophy /> High: {highScore}
                        </h3>
                    </div>
                    {firstTry ?
                        <button 
                            onClick={() => {
                                countDown()
                                setTimeout(() => {
                                    setFirstTry(false)
                                    setDead(false)
                                    setTimeTo(4)
                                    }, 3000)}}
                            className={styles.FirstTryButton}>    
                            {timeTo == 4 ? 'start' : timeTo == 3 ? 'ready?' : timeTo == 2 ? 'set!' : 'snake!'}
                        </button> :
                        <div className={styles.Control}>
                            <div>
                                <MdIcons.IoMdArrowDropupCircle className={styles.Button}
                                    onClick={() => {
                                    if (direction.y == 0) {
                                        setDirection({x: 0, y: -1})
                                    }
                                    }} />
                            </div>
                            <div>
                                <MdIcons.IoMdArrowDropleftCircle className={styles.Button}
                                    onClick={() => {
                                    if (direction.x == 0) {
                                        setDirection({x: -1, y: 0})
                                    }
                                    }} />
                                <MdIcons.IoMdArrowDroprightCircle className={styles.Button}
                                    onClick={() => {
                                    if (direction.x == 0) {
                                        setDirection({x: 1, y: 0})
                                    }
                                    }} />
                            </div>
                            <div>
                                <MdIcons.IoMdArrowDropdownCircle className={styles.Button}
                                        onClick={() => {
                                        if (direction.y == 0) {
                                            setDirection({x: 0, y: 1})
                                        }
                                        }} />
                            </div>
                        </div> }                            
                </div>
            </div>
        </div> 
    )
}