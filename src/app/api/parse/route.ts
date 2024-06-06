import { NextResponse } from 'next/server'
import parseFitFileAndExtractRideDataJson, { RideDataDTO } from '@/app/backend/fitParse'

export async function POST(request: Request) {
    const body = await request.json();
    console.log('body');
    console.log(body.filename);
  
    const rideDataDtoJson: RideDataDTO = await parseFitFileAndExtractRideDataJson(body.filename);

    return NextResponse.json({ rideDataDto: rideDataDtoJson }, { status: 200 });
}

