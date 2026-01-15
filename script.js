document.addEventListener('DOMContentLoaded', function () {
	const table = document.getElementById('data-table');
	const chartContainer = document.getElementById('chart-container');
	const rows = table.querySelectorAll('tbody tr');
	let currentChart = null;

	// Функция для форматирования чисел с пробелами
	function formatNumber(num) {
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
	}

	// Функция для создания графика
	function createChart(indicatorName, data) {
		// Удаляем предыдущий график, если он существует
		if (currentChart) {
			currentChart.destroy();
		}

		// Создаем массив дат для последних 7 дней
		const dates = [];
		const today = new Date();
		for (let i = 6; i >= 0; i--) {
			const date = new Date(today);
			date.setDate(date.getDate() - i);
			dates.push(date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }));
		}

		// Получаем название показателя из выбранной строки
		const selectedRow = table.querySelector('tbody tr.data-table__row--selected');
		const indicatorLabel = selectedRow ? selectedRow.querySelector('td:first-child').textContent : indicatorName;

		// Создаем новый график
		currentChart = Highcharts.chart('chart-container', {
			chart: {
				type: 'line',
				backgroundColor: 'transparent',
				height: 300
			},
			title: {
				text: indicatorLabel,
				style: {
					fontSize: '16px',
					fontWeight: '600'
				}
			},
			xAxis: {
				categories: dates,
				gridLineColor: '#e9ecef',
				lineColor: '#dee2e6',
				tickColor: '#dee2e6'
			},
			yAxis: {
				title: {
					text: indicatorLabel,
					style: {
						fontSize: '12px'
					}
				},
				gridLineColor: '#e9ecef',
				lineColor: '#dee2e6'
			},
			legend: {
				enabled: false
			},
			plotOptions: {
				line: {
					color: '#28a745',
					lineWidth: 2,
					marker: {
						radius: 4,
						fillColor: '#28a745',
						lineWidth: 2,
						lineColor: '#fff'
					}
				}
			},
			tooltip: {
				formatter: function () {
					return '<b>' + this.x + '</b><br/>' +
						indicatorLabel + ': <b>' + formatNumber(this.y) + '</b>';
				}
			},
			series: [{
				name: indicatorLabel,
				data: data,
				color: '#28a745'
			}],
			credits: {
				enabled: false
			}
		});

		// Показываем контейнер с графиком
		chartContainer.classList.add('chart--active');
	}

	// Обработчик клика по строке таблицы
	rows.forEach(row => {
		row.addEventListener('click', function () {
			// Убираем выделение с других строк
			rows.forEach(r => r.classList.remove('data-table__row--selected'));

			// Добавляем выделение к текущей строке
			this.classList.add('data-table__row--selected');

			// Получаем данные для графика
			const chartData = this.getAttribute('data-chart-data');
			const indicator = this.getAttribute('data-indicator');

			if (chartData) {
				try {
					const data = JSON.parse(chartData);
					createChart(indicator, data);
				} catch (e) {
					console.error('Ошибка при парсинге данных графика:', e);
				}
			}
		});
	});

	// Автоматически выбираем первую строку при загрузке
	if (rows.length > 0) {
		rows[0].click();
	}
});
