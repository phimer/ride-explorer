'use client';

import React, { useEffect, useState, useRef, useCallback, ReactElement } from 'react'
import dynamic from 'next/dynamic'
// import Plot from 'react-plotly.js';
import { PlotData, Layout } from 'plotly.js-dist-min';
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });
const RideMap = dynamic(() => import ('@/app/components/RideMap'), { ssr: false });

import LapData from '@/app/components/LapData';
// import FileUpload from './FileUpload';
import UploadForm from './UploadForm';


export type RideData = {
    timestamp: Date;
    position_lat: number;
    position_long: number;
    gps_accuracy: number;
    distance: number;
    heart_rate: number;
    calories: number;
    cadence: number;
    speed: number;
    power: number;
    altitude: number;
}

export type LapDataType ={
    event: string;
    event_type: string;
    timestamp: Date;
    start_time: Date;
    total_elapsed_time: number;
    total_timer_time: number;
    avg_speed: number;
    max_speed: number;
    total_distance: number;
    avg_cadence: number;
    max_cadence: number;
    min_heart_rate: number;
    avg_heart_rate: number;
    max_heart_rate: number;
    time_in_hr_zone: number;
    avg_power: number;
    max_power: number;
    left_right_balance: number;
    time_in_power_zone: number;
    total_work: number;
    min_altitude: number;
    avg_altitude: number;
    max_altitude: number;
    max_neg_grade: number;
    avg_grade: number;
    max_pos_grade: number;
    total_calories: number;
    normalized_power: number;
    avg_temperature: number;
    max_temperature: number;
    total_ascent: number;
    total_descent: number;
  }


export type UserMessage = {
    message: string;
    type: string;
}



export const formatTime = (ms: number | undefined): string => {

    if (!ms) {
        return '';
    }

    const totalSeconds: number = Math.floor(ms / 1000);

    const hours: number = Math.floor(totalSeconds / 3600);
    const remainingSeconds: number = totalSeconds % 3600;

    const minutes: number = Math.floor(remainingSeconds / 60);
    const seconds: number = remainingSeconds % 60;
    
    return `${hours > 0 ? hours+':' : ''}${minutes < 10 ? '0'+minutes : minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};



export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const RideAnalyzer: React.FC = (): ReactElement => {

    const [rideData, setRideData] = useState<RideData[]>();
    const [rideDataSlice, setRideDataSlice] = useState<RideData[]>();

    const [lapData, setLapData] = useState<any>();
    const [showLapData, setShowLapData] = useState<boolean>(false);

    const [timespanStartEnd, setTimespanStartEnd] = useState<[Date, Date]>([new Date(), new Date()]);
    const [timespan, setTimespan] = useState<number>();
    const [averagePower, setAveragePower] = useState<number>(0);
    const [averageHeartrate, setAverageHeartrate] = useState<number>(0);

    const [fitFileName, setFitFileName] = useState<string>();

    const [uploadFormUserMessage, setUploadFormUserMessage] = useState<UserMessage>({message: '', type: ''});



    useEffect(() => {

        console.log("### useEffect");

        if (rideDataSlice && rideDataSlice.length === 0) {
            console.log('first if')
        }

        if (rideDataSlice) {

            console.log('second if')
            console.log(rideDataSlice);
            console.log('setting time span');
            const start: Date = rideDataSlice[0].timestamp;
            const end: Date = rideDataSlice[rideDataSlice.length - 1].timestamp;
            const timespanInMilliSeconds: number = Math.abs(end.getTime()-start.getTime());
            setTimespanStartEnd([start, end]);
            setTimespan(timespanInMilliSeconds);

                        
            console.log('setting avg power');
            const totalPower: number = rideDataSlice.reduce((acc, curr) => acc + curr.power, 0);
            const avgPower: number = totalPower / rideDataSlice.length;
            setAveragePower(Math.round(avgPower));

            console.log('setting average heartrate');
            const totalHeartrate: number = rideDataSlice.reduce((acc, curr) => acc + curr.heart_rate, 0);
            const avgHeartrate: number = totalHeartrate / rideDataSlice.length;
            setAverageHeartrate(Math.round(avgHeartrate));   

        }

    }, [rideDataSlice]);

    const getSliceOfRideDataDependingOnTimestampsFromPlotlyRelayoutEvent = (event: any): RideData[] => {

        if (!rideData) {
            return [];
        };

        if (event['xaxis.autorange'] === true) {
            return rideData;
        }

        console.log('getSliceOfRideDataDependingOnTimestampsFromPlotlyRelayoutEvent');
        const start: Date = new Date(event['xaxis.range[0]']);
        const end: Date = new Date(event['xaxis.range[1]']);
    
        

        const sliceOfRideData: RideData[] = rideData.filter((dataPoint: RideData) => {
            return dataPoint.timestamp >= start && dataPoint.timestamp <= end;
        });
        return sliceOfRideData;
    }


    const parseFitFile = async (filename: string): Promise<void> => {

        console.log('parsing file');

        try {
            const response = await fetch('http://localhost:3000/api/parse', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ filename: filename }),
            });
        
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
        
            const data: any = await response.json();

            // parse timestamps to Date objects in RideData
            data.rideDataDto.rideData.map((d: RideData) => (
                d.timestamp = new Date(d.timestamp)
            ));


            console.log('setting ride data');
            setRideData(data.rideDataDto.rideData);
            setRideDataSlice(data.rideDataDto.rideData);
            setLapData(data.rideDataDto.lapData);
            console.log(data.rideDataDto.rideData);
            setUploadFormUserMessage({message: 'File parsed successfully', type: 'success'});
            await sleep(3000);
            setUploadFormUserMessage({message: '', type: 'success'});

        } catch (err) {
            console.error('Error fetching file:', err);
        }
    }
    


    const plotData: Partial<PlotData>[] = rideData ? [
        {
            x: rideData.map(d => d.timestamp),
            y: rideData.map(d => ( d.power )),
            mode: 'lines',
            type: 'scatter',
            hoverinfo: 'y+text',
            hovertext: 'Watts',
        },
        {
            x: rideData.map(d => d.timestamp),
            y: rideData.map(d => d.heart_rate ),
            mode: 'lines',
            type: 'scatter',
            hoverinfo: 'y+text',
            hovertext: 'BPM',
        },
        // {
        //     x: rideData.map(d => d.timestamp),
        //     y: rideData.map(d => d.altitude*10 ),
        //     mode: 'lines',
        //     type: 'scatter',
        //     hoverinfo: 'y+text',
        //     hovertext: 'Meters',
        // },
]: [];

    // Layout configuration for the plot
    const layout: Partial<Layout> = {
        uirevision: 'true',
        // title: 'Ride Data',
        xaxis: {
            title: 'Time',
        },
        yaxis: {
            title: 'Power in Watts'
        },
        yaxis2: {
            title: 'Elevation in Meters',
            overlaying: 'y',
            side: 'right'
        },
        width: 1600,
        height: 500,
        showlegend: false,
        hoverlabel: {
            bgcolor: 'white',
            font: {color: 'black'},
            bordercolor: 'white',
            align: 'auto',
        }

    };


    return (
        <div className='ride-analyzer-div'>

            <div className='input-div'>
                <UploadForm 
                    setFitFileName={setFitFileName}
                    userMessage={uploadFormUserMessage}
                    setUserMessage={setUploadFormUserMessage}                    
                />
                {fitFileName && <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded" onClick={() => parseFitFile(fitFileName)}>Parse</button>}

                {/* only for dev purposes */}
                {/* {<button onClick={() => parseFitFile("2024-06-12-155255-ELEMNT BOLT C5A3-54-0.fit")}>Parse</button>} */}
            </div>

            <div className='lap-data-div'>
                {rideData && <button
                    onClick={() => setShowLapData(!showLapData)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >{!showLapData? 'Show Lap Data' : 'Hide Lap Data'}</button>}

                {showLapData && <div>
                    <LapData lapData={lapData}/>
                </div>}
            </div>

            <div className='ride-data-div'>

                {rideData && <div className='ride-data-info text-xl'>
                    <div>Timespan: {formatTime(timespan)}</div>
                    <div>Average Power: {averagePower} W</div>
                    <div>Average Heatrate: {averageHeartrate} bpm</div>
                    <div>{timespanStartEnd[0].toLocaleTimeString()} - {timespanStartEnd[1].toLocaleTimeString()}</div>
                </div>}

                <div className='plot-div'>
                    {rideData && <Plot
                        data={plotData} 
                        layout={layout} 
                        // useResizeHandler={true}
                        onRelayout={ async (event) => {
                            console.log('onRelayout')
                            console.log(event);
                            setRideDataSlice(getSliceOfRideDataDependingOnTimestampsFromPlotlyRelayoutEvent(event));
                        }}

                    />}
                </div>

            </div>

            {rideDataSlice && <RideMap rideData={rideDataSlice} />}
        </div>  
    )               
}

export default RideAnalyzer