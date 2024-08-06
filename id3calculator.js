import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ID3_CHARGING_DATA = [
  { soc: 0, speed: 60, time: 0, energyCharged: 0 },
  { soc: 5, speed: 128, time: 98, energyCharged: 2.9 },
  { soc: 10, speed: 131, time: 183, energyCharged: 5.8 },
  { soc: 15, speed: 131, time: 266, energyCharged: 8.7 },
  { soc: 20, speed: 126, time: 350, energyCharged: 11.6 },
  { soc: 25, speed: 113, time: 450, energyCharged: 14.5 },
  { soc: 30, speed: 100, time: 550, energyCharged: 17.4 },
  { soc: 35, speed: 93, time: 664, energyCharged: 20.3 },
  { soc: 40, speed: 85, time: 787, energyCharged: 23.2 },
  { soc: 45, speed: 79, time: 922, energyCharged: 26.1 },
  { soc: 50, speed: 73, time: 1067, energyCharged: 29.0 },
  { soc: 55, speed: 68, time: 1223, energyCharged: 31.9 },
  { soc: 60, speed: 62, time: 1391, energyCharged: 34.8 },
  { soc: 65, speed: 55, time: 1581, energyCharged: 37.7 },
  { soc: 70, speed: 50, time: 1791, energyCharged: 40.6 },
  { soc: 75, speed: 50, time: 2012, energyCharged: 43.5 },
  { soc: 80, speed: 50, time: 2232, energyCharged: 46.4 },
  { soc: 85, speed: 40, time: 2468, energyCharged: 49.3 },
  { soc: 90, speed: 30, time: 2798, energyCharged: 52.2 },
  { soc: 95, speed: 25, time: 3205, energyCharged: 55.1 },
  { soc: 100, speed: 3, time: 3771, energyCharged: 58.0 },
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