const departmentMap = {
  1: 'Amazonas', 2: 'Áncash', 3: 'Apurímac', 4: 'Arequipa', 5: 'Ayacucho',
  6: 'Cajamarca', 7: 'Callao', 8: 'Cusco', 9: 'Huancavelica', 10: 'Huánuco',
  11: 'Ica', 12: 'Junín', 13: 'La Libertad', 14: 'Lambayeque', 15: 'Lima',
  16: 'Loreto', 17: 'Madre de Dios', 18: 'Moquegua', 19: 'Pasco', 20: 'Piura',
  21: 'Puno', 22: 'San Martín', 23: 'Tacna', 24: 'Tumbes', 25: 'Ucayali'
};

const PeruDashboard = () => {
  const [data, setData] = React.useState([]);
  const [selectedDepartment, setSelectedDepartment] = React.useState(1);
  const [departmentData, setDepartmentData] = React.useState([]);

  React.useEffect(() => {
    fetch('input.csv')
      .then(response => response.text())
      .then(csvText => {
        const result = Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true
        });
        setData(result.data);
      });
  }, []);

  React.useEffect(() => {
    const filtered = data.filter(d => d.department === selectedDepartment);
    setDepartmentData(filtered.map(d => ({
      year: d.year,
      value: d.y_HH
    })));
  }, [selectedDepartment, data]);

  const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = Recharts;

  return React.createElement('div', { className: 'p-4 max-w-6xl mx-auto' },
    React.createElement('div', { className: 'bg-white shadow rounded-lg' },
      React.createElement('div', { className: 'p-6' },
        React.createElement('h2', { className: 'text-2xl font-bold mb-4' }, 'Peru Regional Time Series (1997-2020)'),
        React.createElement('div', { className: 'space-y-4' },
          React.createElement('div', { className: 'flex items-center space-x-4' },
            React.createElement('label', { className: 'font-medium' }, 'Select Region:'),
            React.createElement('select', {
              className: 'p-2 border rounded',
              value: selectedDepartment,
              onChange: (e) => setSelectedDepartment(Number(e.target.value))
            }, Object.entries(departmentMap).map(([id, name]) =>
              React.createElement('option', { key: id, value: id }, name)
            ))
          ),
          React.createElement('div', { className: 'h-96 w-full' },
            React.createElement(ResponsiveContainer, null,
              React.createElement(LineChart, { data: departmentData },
                React.createElement(CartesianGrid, { strokeDasharray: '3 3' }),
                React.createElement(XAxis, {
                  dataKey: 'year',
                  type: 'number',
                  domain: ['dataMin', 'dataMax'],
                  ticks: Array.from({ length: 24 }, (_, i) => 1997 + i)
                }),
                React.createElement(YAxis),
                React.createElement(Tooltip),
                React.createElement(Legend),
                React.createElement(Line, {
                  type: 'monotone',
                  dataKey: 'value',
                  name: `${departmentMap[selectedDepartment]} Value`,
                  stroke: '#8884d8',
                  dot: false
                })
              )
            )
          )
        )
      )
    )
  );
};

ReactDOM.render(
  React.createElement(PeruDashboard),
  document.getElementById('root')
);
