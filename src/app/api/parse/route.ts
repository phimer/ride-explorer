import { NextResponse } from 'next/server'
import parseFitFileAndExtractRideDataJson, { RideDataDTO } from '@/app/backend/fitParse'
import { promises as fs } from 'fs';

export async function POST(request: Request) {
    const body = await request.json();
    console.log('body');
    console.log(body.filename);
  
    const rideDataDtoJson: RideDataDTO = await parseFitFileAndExtractRideDataJson(body.filename);

    // delete fit.file (async)
    fs.unlink(`./public/uploads/${body.filename}`);

    return NextResponse.json({ rideDataDto: rideDataDtoJson }, { status: 200 });
}

