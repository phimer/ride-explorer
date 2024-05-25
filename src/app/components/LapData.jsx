import React from 'react'
// import { LapDataType } from '/RideAnalyzer'

const LapData = ({ lapData }) => {


    console.log(lapData);
    
    const formatTime = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds} MM:SS`;
    };
    

    return (
        <div>
            {lapData.map((data, index) => (
                <div key={index} className='lap'>
                    <h3>Lap {index + 1}</h3>
                    <div>Time: {formatTime(data.total_timer_time)}</div>
                    <div>Lap Distance: {(data.total_distance/1000).toFixed(2)} km</div>
                    <div>Lap Speed: {data.avg_speed} km/h</div>
                    <div>Max Speed: {data.max_speed} km/h</div>
                    
                    <div>Lap Power: {data.avg_power} W</div>
                    <div>Lap NP: {data.normalized_power} W</div>
                    <div>Lap Max Power {data.max_power} W</div>

                    <div>Lap Heart Rate: {data.avg_heart_rate} BPM</div>
                    <div>Lap Max Heart Rate: {data.max_heart_rate} BPM</div>

                    <div>Lap Work: {data.total_work} J</div>
                    <div>Lap Calories: {data.total_calories} cal</div>

                    <div>Lap Cadence: {data.avg_cadence} RPM</div>

                    <div>Lap AVG Grade: {data.avg_grade} %</div>
                    <div>Lap L/R Balance: {data.left_right_balance}</div>

                </div>
            ))}
        </div>
    )
}

export default LapData