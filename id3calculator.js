import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ID3_CHARGING_DATA = [
  { soc: 0, speed: 60, time: '0m 0s', energyCharged: 0.0 },
  { soc: 1, speed: 115, time: '0m 25s', energyCharged: 0.6 },
  { soc: 2, speed: 117, time: '0m 50s', energyCharged: 1.2 },
  { soc: 3, speed: 118, time: '1m 15s', energyCharged: 1.7 },
  { soc: 4, speed: 119, time: '1m 40s', energyCharged: 2.3 },
  { soc: 5, speed: 120, time: '2m 5s', energyCharged: 2.9 },
  { soc: 6, speed: 120, time: '2m 30s', energyCharged: 3.5 },
  { soc: 7, speed: 120, time: '2m 55s', energyCharged: 4.1 },
  { soc: 8, speed: 121, time: '3m 20s', energyCharged: 4.6 },
  { soc: 9, speed: 121, time: '3m 45s', energyCharged: 5.2 },
  { soc: 10, speed: 121, time: '4m 10s', energyCharged: 5.8 },
  { soc: 11, speed: 121, time: '4m 35s', energyCharged: 6.4 },
  { soc: 12, speed: 121, time: '5m 0s', energyCharged: 7.0 },
  { soc: 13, speed: 121, time: '5m 25s', energyCharged: 7.5 },
  { soc: 14, speed: 121, time: '5m 50s', energyCharged: 8.1 },
  { soc: 15, speed: 121, time: '6m 15s', energyCharged: 8.7 },
  { soc: 16, speed: 121, time: '6m 40s', energyCharged: 9.3 },
  { soc: 17, speed: 121, time: '7m 5s', energyCharged: 9.9 },
  { soc: 18, speed: 121, time: '7m 30s', energyCharged: 10.4 },
  { soc: 19, speed: 121, time: '7m 55s', energyCharged: 11.0 },
  { soc: 20, speed: 120, time: '8m 20s', energyCharged: 11.6 },
  { soc: 21, speed: 119, time: '8m 45s', energyCharged: 12.2 },
  { soc: 22, speed: 118, time: '9m 10s', energyCharged: 12.8 },
  { soc: 23, speed: 117, time: '9m 35s', energyCharged: 13.3 },
  { soc: 24, speed: 115, time: '10m 1s', energyCharged: 13.9 },
  { soc: 25, speed: 113, time: '10m 27s', energyCharged: 14.5 },
  { soc: 26, speed: 110, time: '10m 54s', energyCharged: 15.1 },
  { soc: 27, speed: 107, time: '11m 21s', energyCharged: 15.7 },
  { soc: 28, speed: 104, time: '11m 49s', energyCharged: 16.2 },
  { soc: 29, speed: 101, time: '12m 18s', energyCharged: 16.8 },
  { soc: 30, speed: 98, time: '12m 48s', energyCharged: 17.4 },
  { soc: 31, speed: 96, time: '13m 19s', energyCharged: 18.0 },
  { soc: 32, speed: 94, time: '13m 51s', energyCharged: 18.6 },
  { soc: 33, speed: 92, time: '14m 24s', energyCharged: 19.1 },
  { soc: 34, speed: 90, time: '14m 58s', energyCharged: 19.7 },
  { soc: 35, speed: 88, time: '15m 33s', energyCharged: 20.3 },
  { soc: 36, speed: 86, time: '16m 9s', energyCharged: 20.9 },
  { soc: 37, speed: 85, time: '16m 46s', energyCharged: 21.5 },
  { soc: 38, speed: 83, time: '17m 24s', energyCharged: 22.0 },
  { soc: 39, speed: 82, time: '18m 3s', energyCharged: 22.6 },
  { soc: 40, speed: 81, time: '18m 43s', energyCharged: 23.2 },
  { soc: 41, speed: 80, time: '19m 24s', energyCharged: 23.8 },
  { soc: 42, speed: 79, time: '20m 6s', energyCharged: 24.4 },
  { soc: 43, speed: 78, time: '20m 49s', energyCharged: 24.9 },
  { soc: 44, speed: 77, time: '21m 33s', energyCharged: 25.5 },
  { soc: 45, speed: 77, time: '22m 17s', energyCharged: 26.1 },
  { soc: 46, speed: 76, time: '23m 2s', energyCharged: 26.7 },
  { soc: 47, speed: 75, time: '23m 48s', energyCharged: 27.3 },
  { soc: 48, speed: 75, time: '24m 34s', energyCharged: 27.8 },
  { soc: 49, speed: 74, time: '25m 21s', energyCharged: 28.4 },
  { soc: 50, speed: 73, time: '26m 9s', energyCharged: 29.0 },
  { soc: 51, speed: 72, time: '26m 57s', energyCharged: 29.6 },
  { soc: 52, speed: 71, time: '27m 46s', energyCharged: 30.2 },
  { soc: 53, speed: 70, time: '28m 36s', energyCharged: 30.7 },
  { soc: 54, speed: 69, time: '29m 27s', energyCharged: 31.3 },
  { soc: 55, speed: 68, time: '30m 18s', energyCharged: 31.9 },
  { soc: 56, speed: 67, time: '31m 11s', energyCharged: 32.5 },
  { soc: 57, speed: 66, time: '32m 4s', energyCharged: 33.1 },
  { soc: 58, speed: 65, time: '32m 58s', energyCharged: 33.6 },
  { soc: 59, speed: 63, time: '33m 54s', energyCharged: 34.2 },
  { soc: 60, speed: 62, time: '34m 51s', energyCharged: 34.8 },
  { soc: 61, speed: 60, time: '35m 49s', energyCharged: 35.4 },
  { soc: 62, speed: 59, time: '36m 49s', energyCharged: 36.0 },
  { soc: 63, speed: 57, time: '37m 51s', energyCharged: 36.5 },
  { soc: 64, speed: 56, time: '38m 54s', energyCharged: 37.1 },
  { soc: 65, speed: 55, time: '40m 0s', energyCharged: 37.7 },
  { soc: 66, speed: 54, time: '41m 7s', energyCharged: 38.3 },
  { soc: 67, speed: 53, time: '42m 16s', energyCharged: 38.9 },
  { soc: 68, speed: 53, time: '43m 26s', energyCharged: 39.4 },
  { soc: 69, speed: 52, time: '44m 38s', energyCharged: 40.0 },
  { soc: 70, speed: 51, time: '45m 51s', energyCharged: 40.6 },
  { soc: 71, speed: 51, time: '47m 6s', energyCharged: 41.2 },
  { soc: 72, speed: 50, time: '48m 22s', energyCharged: 41.8 },
  { soc: 73, speed: 50, time: '49m 39s', energyCharged: 42.3 },
  { soc: 74, speed: 50, time: '50m 57s', energyCharged: 42.9 },
  { soc: 75, speed: 50, time: '52m 15s', energyCharged: 43.5 },
  { soc: 76, speed: 50, time: '53m 33s', energyCharged: 44.1 },
  { soc: 77, speed: 50, time: '54m 51s', energyCharged: 44.7 },
  { soc: 78, speed: 50, time: '56m 9s', energyCharged: 45.2 },
  { soc: 79, speed: 50, time: '57m 27s', energyCharged: 45.8 },
  { soc: 80, speed: 50, time: '58m 45s', energyCharged: 46.4 },
  { soc: 81, speed: 47, time: '1h 0m 7s', energyCharged: 47.0 },
  { soc: 82, speed: 45, time: '1h 1m 33s', energyCharged: 47.6 },
  { soc: 83, speed: 43, time: '1h 3m 3s', energyCharged: 48.1 },
  { soc: 84, speed: 41, time: '1h 4m 38s', energyCharged: 48.7 },
  { soc: 85, speed: 40, time: '1h 6m 18s', energyCharged: 49.3 },
  { soc: 86, speed: 38, time: '1h 8m 3s', energyCharged: 49.9 },
  { soc: 87, speed: 36, time: '1h 9m 54s', energyCharged: 50.5 },
  { soc: 88, speed: 35, time: '1h 11m 51s', energyCharged: 51.0 },
  { soc: 89, speed: 33, time: '1h 13m 55s', energyCharged: 51.6 },
  { soc: 90, speed: 32, time: '1h 16m 6s', energyCharged: 52.2 },
  { soc: 91, speed: 30, time: '1h 18m 25s', energyCharged: 52.8 },
  { soc: 92, speed: 28, time: '1h 20m 53s', energyCharged: 53.4 },
  { soc: 93, speed: 27, time: '1h 23m 31s', energyCharged: 53.9 },
  { soc: 94, speed: 25, time: '1h 26m 21s', energyCharged: 54.5 },
  { soc: 95, speed: 24, time: '1h 29m 24s', energyCharged: 55.1 },
  { soc: 96, speed: 23, time: '1h 32m 41s', energyCharged: 55.7 },
  { soc: 97, speed: 21, time: '1h 36m 14s', energyCharged: 56.3 },
  { soc: 98, speed: 20, time: '1h 40m 6s', energyCharged: 56.8 },
  { soc: 99, speed: 18, time: '1h 44m 19s', energyCharged: 57.4 },
  { soc: 100, speed: 3, time: '1h 52m 51s', energyCharged: 58.0 }
];

const AC_LADE_EFFEKT = 11; // kW
const DC_LADE_EFFEKT_75 = 75; // kW
const DC_LADE_EFFEKT_150 = 150; // kW

const ElbilBeregningsApp = () => {
  const [elData, setElData] = useState({
    forbrug: 14,
    pris: 2.49,
    batteriStørrelse: 58, // ID.3 Pro battery size
    batteriProcent: 80,
    startProcent: 20,
    slutProcent: 80,
  });

  const formatTid = (minutter) => {
    return `${Math.round(minutter)} min.`;
  };

  const interpolerLadedata = (soc) => {
    for (let i = 1; i < ID3_CHARGING_DATA.length; i++) {
      if (soc <= ID3_CHARGING_DATA[i].soc) {
        const prevPoint = ID3_CHARGING_DATA[i - 1];
        const nextPoint = ID3_CHARGING_DATA[i];
        const ratio = (soc - prevPoint.soc) / (nextPoint.soc - prevPoint.soc);
        return {
          speed: prevPoint.speed + ratio * (nextPoint.speed - prevPoint.speed),
          time: prevPoint.time + ratio * (nextPoint.time - prevPoint.time),
          energyCharged: prevPoint.energyCharged + ratio * (nextPoint.energyCharged - prevPoint.energyCharged)
        };
      }
    }
    return ID3_CHARGING_DATA[ID3_CHARGING_DATA.length - 1];
  };

  const beregnLadetid = (startProcent, slutProcent, maxEffekt) => {
    const startData = interpolerLadedata(startProcent);
    const slutData = interpolerLadedata(slutProcent);
    let tid = slutData.time - startData.time;
    let energiOpladet = slutData.energyCharged - startData.energyCharged;

    // Juster tiden baseret på maxEffekt
    if (maxEffekt < Math.max(...ID3_CHARGING_DATA.map(d => d.speed))) {
      tid = (energiOpladet / maxEffekt) * 60;
    }

    return { tid, energiOpladet };
  };

  const beregnResultater = useCallback((data) => {
    const prisPerKm = (data.forbrug / 100) * data.pris;
    const fuldRækkevidde = (data.batteriStørrelse / data.forbrug) * 100;
    
    const acLadetid = beregnLadetid(data.startProcent, data.slutProcent, AC_LADE_EFFEKT);
    const dcLadetid75 = beregnLadetid(data.startProcent, data.slutProcent, DC_LADE_EFFEKT_75);
    const dcLadetid150 = beregnLadetid(data.startProcent, data.slutProcent, DC_LADE_EFFEKT_150);

    return {
      prisPerKm: prisPerKm.toFixed(2),
      prisPer100Km: (prisPerKm * 100).toFixed(2),
      prisPer500Km: (prisPerKm * 500).toFixed(2),
      rækkevidde: fuldRækkevidde.toFixed(2),
      rækkeviddeProcent: ((fuldRækkevidde * data.batteriProcent) / 100).toFixed(2),
      acLadetid: formatTid(acLadetid.tid),
      dcLadetid75: formatTid(dcLadetid75.tid),
      dcLadetid150: formatTid(dcLadetid150.tid),
      energyCharged: acLadetid.energiOpladet.toFixed(2),
    };
  }, [elData.batteriStørrelse]);

  const resultater = beregnResultater(elData);

  const handleInputChange = (field, value) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setElData(prev => ({ ...prev, [field]: numValue }));
    }
  };

  const InputField = ({ label, value, onChange, step = "0.5", min = "0", max = "100" }) => (
    <div className="mb-2">
      <Label htmlFor={label} className="text-sm font-medium text-gray-700">{label}</Label>
      <Input
        id={label}
        type="number"
        value={value}
        onChange={e => onChange(e.target.value)}
        step={step}
        min={min}
        max={max}
        className="mt-1 w-full"
      />
    </div>
  );

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-3xl font-bold text-center mb-4">Volkswagen ID.3 Pro Beregninger</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>ID.3 Pro ({elData.batteriStørrelse} kWh batteri)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <InputField label="Forbrug (kWh/100km)" value={elData.forbrug} onChange={v => handleInputChange('forbrug', v)} />
            <InputField label="Pris (kr/kWh)" value={elData.pris} onChange={v => handleInputChange('pris', v)} />
            <InputField 
              label="Batteriprocent (%)" 
              value={elData.batteriProcent} 
              onChange={v => handleInputChange('batteriProcent', v)}
              step="1"
            />
            <div className="grid grid-cols-2 gap-2">
              <InputField 
                label="Start opladning (%)" 
                value={elData.startProcent} 
                onChange={v => handleInputChange('startProcent', v)}
                step="1"
              />
              <InputField 
                label="Slut opladning (%)" 
                value={elData.slutProcent} 
                onChange={v => handleInputChange('slutProcent', v)}
                step="1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resultater</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b text-left">Kategori</th>
                  <th className="py-2 px-4 border-b text-left">Værdi</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 px-4 border-b">Pris per km</td>
                  <td className="py-2 px-4 border-b">{resultater.prisPerKm} kr</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b">Pris for 100 km</td>
                  <td className="py-2 px-4 border-b">{resultater.prisPer100Km} kr</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b">Pris for 500 km</td>
                  <td className="py-2 px-4 border-b">{resultater.prisPer500Km} kr</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b">Maks. rækkevidde</td>
                  <td className="py-2 px-4 border-b">{resultater.rækkevidde} km</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b">Rækkevidde ved {elData.batteriProcent}% batteri</td>
                  <td className="py-2 px-4 border-b">{resultater.rækkeviddeProcent} km</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b">Ladetid (11 kW AC) fra {elData.startProcent}% til {elData.slutProcent}%</td>
                  <td className="py-2 px-4 border-b">{resultater.acLadetid}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b">Ladetid (75 kW DC) fra {elData.startProcent}% til {elData.slutProcent}%</td>
                  <td className="py-2 px-4 border-b">{resultater.dcLadetid75}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b">Ladetid (150+ kW DC) fra {elData.startProcent}% til {elData.slutProcent}%</td>
                  <td className="py-2 px-4 border-b">{resultater.dcLadetid150}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b">Energi opladet</td>
                  <td className="py-2 px-4 border-b">{resultater.energyCharged} kWh</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ID.3 Pro Ladekurve</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={ID3_CHARGING_DATA}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="soc" 
                label={{ value: 'State of Charge (%)', position: 'insideBottomRight', offset: -10 }}
                ticks={[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100]}
              />
              <YAxis yAxisId="left" label={{ value: 'Ladehastighed (kW)', angle: -90, position: 'insideLeft' }} />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                label={{ value: 'Tid (min.)', angle: 90, position: 'insideRight' }} 
                tickFormatter={(value) => `${value} min.`}
              />
              <Tooltip 
                formatter={(value, name, props) => {
                  if (name === "Tid (min.)") {
                    return [`${value} min.`, name];
                  }
                  return [value, name];
                }}
              />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="speed" stroke="#8884d8" name="Ladehastighed (kW)" />
              <Line yAxisId="right" type="monotone" dataKey="time" stroke="#82ca9d" name="Tid (min.)" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ElbilBeregningsApp;