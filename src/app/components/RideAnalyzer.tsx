'use client';

import React, { useEffect, useState, useRef, useCallback, ReactElement } from 'react'
import dynamic from 'next/dynamic'
// import Plot from 'react-plotly.js';
import { PlotData, Layout } from 'plotly.js-dist-min';
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });
const RideMap = dynamic(() => import ('@/app/components/RideMap'), { ssr: false });

import LapData from '@/app/components/LapData';


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



const RideAnalyzer: React.FC = (): ReactElement => {

    const [rideData, setRideData] = useState<RideData[]>();
    const [rideDataSlice, setRideDataSlice] = useState<RideData[]>();

    const [lapData, setLapData] = useState<any>();
    const [showLapData, setShowLapData] = useState<boolean>(false);

    const [timespanStartEnd, setTimespanStartEnd] = useState<[Date, Date]>([new Date(), new Date()]);
    const [timespan, setTimespan] = useState<number>();
    const [averagePower, setAveragePower] = useState<number>(0);
    const [averageHeartrate, setAverageHeartrate] = useState<number>(0);

    


    useEffect(() => {

        console.log('@@@@ useEffect');

        if (rideDataSlice && rideDataSlice.length === 0) {

        }

        if (rideDataSlice) {

            console.log(rideDataSlice);
            console.log('setting time span');
            const start: Date = rideDataSlice[0].timestamp;
            const end: Date = rideDataSlice[rideDataSlice.length - 1].timestamp;
            const timespanInMilliSeconds: any = Math.abs(end.getTime()-start.getTime());
            const timespanInMinutes: number = Math.round(timespanInMilliSeconds / 60000);
            const timespanInMinutesAndSeconds: number = Math.round(timespanInMilliSeconds / 1000);
            setTimespanStartEnd([start, end]);
            setTimespan(timespanInMinutes);

                        
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

            // todo: remove
            console.log(data.rideData);
            let x: any = data.rideDataDto.rideData.map((d: any) => {
                return [d.power, d.heart_rate]
            });
            console.log(x);

            console.log('setting ride data');
            setRideData(data.rideDataDto.rideData);
            setRideDataSlice(data.rideDataDto.rideData);
            setLapData(data.rideDataDto.lapData);

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
        {
            x: rideData.map(d => d.timestamp),
            y: rideData.map(d => d.altitude*10 ),
            mode: 'lines',
            type: 'scatter',
            hoverinfo: 'y+text',
            hovertext: 'Meters',
        },
]: [];

    // Layout configuration for the plot
    const layout: Partial<Layout> = {
        uirevision: 'true',
        title: 'Ride Data',
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


    function sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    return (
        <div className='ride-analyzer-div'>
            <button 
                onClick={() => parseFitFile('2024-05-15-154558-ELEMNT BOLT C5A3-45-0.fit')}
                className="parse-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >{rideData ? 'parse again' : 'parse'}</button>

            {rideData && <div>
                <div>Time Span: {timespanStartEnd[0].toLocaleTimeString()} - {timespanStartEnd[1].toLocaleTimeString()}</div>
                <div>Time Span in Minutes: {timespan}</div>
                <div>Average Power: {averagePower}</div>
                <div>Average Heatrate: {averageHeartrate}</div>
            </div>}

            {rideData && <button
                onClick={() => setShowLapData(!showLapData)}
                className="parse-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >{!showLapData? 'Show Lap Data' : 'Hide Lap Data'}</button>}
            {showLapData && <div>
                <LapData lapData={lapData}/>
            </div>}

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

            {rideDataSlice && <RideMap rideData={rideDataSlice} />}
        </div>  
    )               
}

export default RideAnalyzer