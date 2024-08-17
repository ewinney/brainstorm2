import { useState } from 'react';
import { useDrag } from 'react-dnd';
import { Card } from '@/components/ui/card';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Chart({ id, position, onMove }) {
  const [chartData, setChartData] = useState({
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'chart',
    item: { id, left: position.x, top: position.y },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleDataChange = (index, value) => {
    const newData = [...chartData.datasets[0].data];
    newData[index] = value;
    setChartData(prevState => ({
      ...prevState,
      datasets: [{ ...prevState.datasets[0], data: newData }]
    }));
  };

  return (
    <Card
      ref={drag}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        opacity: isDragging ? 0.5 : 1,
        width: 300,
        height: 200,
      }}
      className="p-4 cursor-move"
    >
      <Bar data={chartData} />
      <div className="mt-2">
        {chartData.labels.map((label, index) => (
          <div key={label} className="flex items-center mt-1">
            <span className="w-20">{label}:</span>
            <input
              type="number"
              value={chartData.datasets[0].data[index]}
              onChange={(e) => handleDataChange(index, parseInt(e.target.value, 10))}
              className="w-16 px-1 py-0.5 border rounded"
            />
          </div>
        ))}
      </div>
    </Card>
  );
}