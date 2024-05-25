'use client';

import React, { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, useMap, Marker, Popup, Polyline} from 'react-leaflet'
import { RideData } from '@/app/components/RideAnalyzer';
import 'leaflet/dist/leaflet.css';

type RideMapProps = {
    rideData: RideData[];
}


const RideMap = ({ rideData }: RideMapProps) => {

    let firstCords = [rideData[0].position_lat, rideData[0].position_long];

    // const a: any = rideData[0];
    useEffect(() => {
        // console.log(rideData[0]);
    });

    const mapRef = useRef(null);


    return (
        <div style={{border: "5px solid red"}}>
            <MapContainer center={[rideData[0].position_lat, rideData[0].position_long]} zoom={13} scrollWheelZoom={false}ref={mapRef} style={{height: "70vh", width:"100vw"}}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    // different providers: leaflet-extras.github.io/leaflet-providers/preview/
                />

                {/* {rideData.map((rideDataPoint: RideDataPoint) => (
                    <Marker position={[rideDataPoint.position_lat, rideDataPoint.position_long]} />
                ))} */}

                <Polyline positions={rideData.map((rideDataPoint: RideData) => [rideDataPoint.position_lat, rideDataPoint.position_long])} color='blue' />

                {/* <Marker position={[51.505, -0.09]}>
                    <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker> */}
            </MapContainer>
        </div>

    )
}

export default RideMap