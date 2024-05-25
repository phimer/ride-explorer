import React, { ReactElement } from 'react'
// import { LapDataType } from '/RideAnalyzer'
import { formatTime, LapDataType } from '@/app/components/RideAnalyzer'

interface LapDataProps {
    lapData: LapDataType[];
}


const LapData: React.FC<LapDataProps> = ({ lapData }): ReactElement => {


    console.log(lapData);
    
    

    return (
        <div className="laps">
            {lapData.map((data: LapDataType, index: number) => (
                <div key={index} className='lap'>
                    <h3 className='font-extrabold'>Lap {index + 1}</h3>
                    <div className="inner-lap-div">
                        <div>Time: {formatTime(data.total_timer_time)}</div>
                        <div>Distance: {(data.total_distance/1000).toFixed(2)} km</div>
                        <div>Speed: {data.avg_speed} km/h</div>
                        <div>Speed: {data.max_speed} km/h</div>
                        <div>AVG Grade: {data.avg_grade/100} %</div>
                    </div>
                    
                    <div className="inner-lap-div">
                        <div>Power: {data.avg_power} W</div>
                        <div>NP: {data.normalized_power} W</div>
                        <div>Max Power {data.max_power} W</div>
                        <div>L/R Balance: {data.left_right_balance}</div>
                        <div>Cadence: {data.avg_cadence} RPM</div>
                    </div>

                    
                    <div className="inner-lap-div">
                        <div>Heart Rate: {data.avg_heart_rate} BPM</div>
                        <div>Max Heart Rate: {data.max_heart_rate} BPM</div>

                        <div>Work: {data.total_work} J</div>
                        <div>Calories: {data.total_calories} cal</div>
                        <div>Temperature: {data.avg_temperature} °C</div>
                    </div>

                    

                    
                    

                </div>
            ))}
        </div>
    )
}

export default LapData