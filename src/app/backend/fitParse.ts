// Require the module
import fitDecoder from 'fit-decoder';
import { promises as fs } from 'fs';
import { get } from 'http';
import path from 'path';



// fit2json expects binary represetnation in FIT format as ArrayBuffer
// You can get it by reading a file in Node:

type RideData = {
  timestamp: Date;
  position_lat: number;
  position_long: number;
  gps_accuracy: number;
  distance: number;
  heart_rate: number;
  calories: number;
  cadece: number;
  speed: number;
  power: number;
  altitude: number;
}

type LapData ={
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

export type RideDataDTO = {
    rideData: RideData[];
    lapData: LapData[];
}

// parse fit file to ride data
const parseFitFileAndExtractRideDataJson = async (filename: string): Promise<RideDataDTO> => {

    const filePath = path.join(process.cwd(), 'public', 'uploads', filename);
    console.log('filePath: ', filePath);
 
    const file = await fs.readFile(filePath);
    const buffer = file.buffer;
    const jsonRaw = fitDecoder.fit2json(buffer);
    const json = fitDecoder.parseRecords(jsonRaw);

    // const powerArray = fitDecoder.getRecordFieldValue(json, 'record', 'power');
    // const powerOverTime: string = fitDecoder.getValueOverTime(json, 'record', 'power');

    const rideData: RideData[] = getRideData(json);
    const lapData: LapData[] = getLapData(json);
    
    const outputPath = path.join(process.cwd(), 'src', 'output_files', 'output.json');
    writeJsonToFile(outputPath, json);

    const returnData: RideDataDTO = {
      rideData: rideData,
      lapData: lapData
    }

    return returnData;
}

const writeJsonToFile = async (filePath: string, data: object): Promise<void> => {
    try {
      const jsonData = JSON.stringify(data, null, 2); // Convert object to JSON string
      await fs.writeFile(filePath, jsonData, 'utf8'); // Write JSON string to file
      console.log('JSON data has been written to the file successfully.');
    } catch (err) {
      console.error('Error writing JSON to file:', err);
      throw err;
    }
};


const getRideData = (data: ParsedDataType): RideData[] => {
    const values: RideData[] = [];

    let i = 0;

    data.records.map((record: RecordType) => {
      if (record.type === 'record') {

        if (record.data.power > 2000) {
          console.log('power > 2000. Setting it to 150', record.data.power);
          let tempRecordData = record.data;
          tempRecordData.power = 150;
          values.push(tempRecordData);
        } else {
          values.push(record.data);
        }
      };
    });
    return values;
}

const getLapData = (data: ParsedDataType): LapData[] => {
    const lapValues: any[] = [];
    data.records.map((record: RecordType) => {
      if (record.type === 'lap') {
        lapValues.push(record.data);
      };
    });
    return lapValues;
}

type RecordType = {
    data: any;
    type: string;
};

type ParsedDataType = {
    records: any;
}





// fit2json converts binary FIT into a raw JSON representation. No record names, types or values 
// are parsed. It is useful for low level data analysis
// const jsonRaw = fitDecoder.fit2json(buffer);

// parseRecords converts raw JSON format into readable format using current 
// Global FIT Profile (SDK 21.47.00)
// It also performs simple conversions for some data formats like time, distance, coordinates.
// const json = fitDecoder.parseRecords(jsonRaw);


// The library also includes a couple of utils for simple data recovery.

// getRecordFieldValue returns the timerange, covered by a fit file
// const { minTimestamp, maxTimestamp } = fitUtils.getTimeLimits(json);

// getRecordFieldValue returns an array of values of one field of one record type
// const powerArray = fitDecoder.getRecordFieldValue(json, 'record', 'power');

// getValueOverTime returns values for one field of one record type over time
// const powerOverTime = fitDecoder.getValueOverTime(json, 'record', 'power');


export default parseFitFileAndExtractRideDataJson