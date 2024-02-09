import { useState, useEffect, useRef } from 'react'
import './App.css'
import TwoButtonsModal from './TwoButtonsModal';

function App() {
    const [time, setTime] = useState(0);
    const [altTime, setAltTime] = useState(0);
    const [lapTimes, setLapTimes] = useState([]);
    const lapListRef = useRef(null);

    const [isRunning, setIsRunning] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);
    const [isStarted, setIsStarted] = useState(false);

    const [id, setId] = useState(1);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (lapListRef.current) {
            lapListRef.current.scrollTop = lapListRef.current.scrollHeight;
        }
    }, [lapTimes]);

    useEffect(() => {
        let startTime;
        let intervalId;
    
        const updateTimers = () => {
            const currentTime = performance.now();
            const elapsedTime = currentTime - startTime;
    
            setTime((prevTime) => prevTime + elapsedTime / 10);
            setAltTime((prevAltTime) => prevAltTime + elapsedTime / 10);
    
            startTime = currentTime;
        };
    
        if (isRunning) {
            startTime = performance.now();
            intervalId = setInterval(updateTimers, 10);
        }
    
        return () => {
            clearInterval(intervalId);
        };
    }, [isRunning]);

    const hours = Math.floor(time / 360000);

    const minutes = Math.floor((time % 360000) / 6000);

    const seconds = Math.floor((time % 6000) / 100);

    const milliseconds = Math.floor(time % 100);

    const altHours = Math.floor(altTime / 360000);

    const altMinutes = Math.floor((altTime % 360000) / 6000);

    const altSeconds = Math.floor((altTime % 6000) / 100);

    const altMilliseconds = Math.floor(altTime % 100);

    const startAndPause = () => {
        if(isRunning) {
            setIsStarted(true);
            setId(id + 1);
            const capturedTime = {
                id: id,
                hours: hours,
                minutes: minutes,
                seconds: seconds,
                milliseconds: milliseconds,
            };
            const capturedAltTime = {
                id: id,
                hours: altHours,
                minutes: altMinutes,
                seconds: altSeconds,
                milliseconds: altMilliseconds,
            };
            setLapTimes((prevLapTimes) => [...prevLapTimes, [capturedTime, capturedAltTime]]);
            setAltTime(0);
            setLapTimes((prevLapTimes) => [...prevLapTimes, [{id: -1}]]);
        }
        setIsRunning(!isRunning);
    };

    const confirmReset = () => {
      setShowResetModal(true);
    }

    const reset = () => {
        setTime(0);
        setAltTime(0);
        setId(1);
        setIsStarted(false);
        setLapTimes([]);
    };

    const lap = () => {
        setIsStarted(true);
        setId(id + 1);
        const capturedTime = {
            id: id,
            hours: hours,
            minutes: minutes,
            seconds: seconds,
            milliseconds: milliseconds,
        };
        const capturedAltTime = {
            id: id,
            hours: altHours,
            minutes: altMinutes,
            seconds: altSeconds,
            milliseconds: altMilliseconds,
        };
        setLapTimes((prevLapTimes) => [...prevLapTimes, [capturedTime, capturedAltTime]]);
        setAltTime(0);
    };
    return (
        <>
            <div className={`container-wrapper${isStarted ? ' started' : ''}`}>
                <div className='stopwatch-container'>
                    <div className='timers-container'>
                        <p className='stopwatch-time'>
                            {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}:
                            {seconds.toString().padStart(2, '0')}:
                            {milliseconds.toString().padStart(2, '0')}
                        </p>
                        <p className='stopwatch-alt'>
                            {altHours.toString().padStart(2, '0')}:{altMinutes.toString().padStart(2, '0')}:
                            {altSeconds.toString().padStart(2, '0')}:
                            {altMilliseconds.toString().padStart(2, '0')}
                        </p>
                    </div>
                    <div className='stopwatch-buttons'>
                        <button className={`stopwatch-button ${isRunning ? 'pause' : ''}`} onClick={startAndPause}>
                            {isRunning ? 'Pause' : 'Start'}
                        </button>
                        <button className='stopwatch-button lap' onClick={lap} disabled={!isRunning}>
                            Lap
                        </button>
                        <button className='stopwatch-button reset' onClick={confirmReset} disabled={isRunning}>
                            Reset
                        </button>
                    </div>
                </div>
                <div className='stopwatch-laps' ref={lapListRef}>
                    {lapTimes.map((lapTime) => (
                        <>
                        {lapTime[0].id !== -1 && 
                            <p className={'lap-entry fade-in'} key={lapTime[0].id}>
                                <span style={{ color: 'purple', width: '40px' }}>
                                    #{lapTime[0].id}
                                </span>
                                {`\t${lapTime[0].hours.toString().padStart(2, '0')}`}:
                                {`${lapTime[0].minutes.toString().padStart(2, '0')}`}:
                                {`${lapTime[0].seconds.toString().padStart(2, '0')}`}:
                                {`${lapTime[0].milliseconds.toString().padStart(2, '0')}`}
                                <span style={{ color: 'orange' }}>
                                    {` ${lapTime[1].hours.toString().padStart(2, '0')}`}:
                                    {`${lapTime[1].minutes.toString().padStart(2, '0')}`}:
                                    {`${lapTime[1].seconds.toString().padStart(2, '0')}`}:
                                    {`${lapTime[1].milliseconds.toString().padStart(2, '0')}`}
                                </span>
                            </p>
                        }
                        {lapTime[0].id === -1 && 
                            <p className="pause-entry fade-in" style={{ color: 'purple', display: 'flex', justifyContent: 'center' }}>
                                Pause
                            </p>
                        }
                        </>
                    ))}
                </div>
            </div>
            <TwoButtonsModal
                show={showResetModal}
                onClose={() => setShowResetModal(false)}
                resetResponseData={reset}
                body={<p>Are you sure you want to reset the timer and clear lap times?</p>}
            />
        </>
    );
}

export default App
