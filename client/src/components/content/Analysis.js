import React, { useContext, useState, useEffect } from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import { GlobalContext } from "../context/GlobalState";
import moneyFormatter from "../utils/MoneyFormatter";
import BudgetTable from "../layout/BudgetTable";
import { getMonthlyReport, getAnnualReport, getCategoryReport } from "../utils/FinancialReports";
import "../style/Analysis.css";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend
);

const Analysis = () => {
  const { budgets, incomes, expenses } = useContext(GlobalContext);

  const [categoryData, setCategoryData] = useState([]);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const monthlyReport = getMonthlyReport(incomes, expenses, selectedMonth, selectedYear);
  const categoryReport = getCategoryReport(
    expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getMonth() === selectedMonth &&
        expenseDate.getFullYear() === selectedYear
      );
    })
  );

  const annualReportData = getAnnualReport(incomes, expenses, selectedYear);
  const annualReport = annualReportData.annualData;

  const averageIncome = Math.round(annualReport.reduce((sum, data) => sum + data.totalIncome, 0) / 12);
  const averageExpense = Math.round(annualReport.reduce((sum, data) => sum + data.totalExpense, 0) / 12);
  const averageBalance = Math.round(annualReport.reduce((sum, data) => sum + data.balance, 0) / 12);

  const doughnutChartData = {
    labels: Object.keys(categoryReport).map(category => {
      const categoryLabels = {
        'basic_needs': 'Kebutuhan Pokok',
        'education': 'Pendidikan',
        'entertainment': 'Hiburan',
        'social': 'Sosial',
        'finance': 'Keuangan',
        'unexpected_expenses': 'Pengeluaran Tidak Terduga'
      };
      return categoryLabels[category] || category;
    }),
    datasets: [
      {
        data: Object.values(categoryReport),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        hoverBackgroundColor: [
          "#CC506A",
          "#2B82BE",
          "#CCAC44",
          "#3A9898",
          "#7A52CC",
          "#CC7F33",
        ],
      },
    ],
  };

  const doughnutChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#fff",
        }
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context) {
            return moneyFormatter(context.raw);
          }
        }
      }
    },
  };

  const annualBarChartData = {
    labels: annualReport.map(data => {
      const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];
      return months[data.month - 1];
    }),
    datasets: [
      {
        label: "Total Pemasukan",
        data: annualReport.map(data => data.totalIncome),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Total Pengeluaran",
        data: annualReport.map(data => data.totalExpense),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    plugins: {
      legend: {
        labels: {
          color: '#ffffff',
        },
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context) {
            return moneyFormatter(context.raw);
          }
        }
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#ffffff',
        },
        grid: {
          color: '#555555',
        },
      },
      y: {
        ticks: {
          color: '#ffffff',
        },
        grid: {
          color: '#555555',
        },
      },
    },
  };

  useEffect(() => {
    const data = budgets.map(budget => {
      const totalSpent = expenses
        .filter(expense =>
          expense.category === budget.category &&
          new Date(expense.date).getMonth() === selectedMonth
        )
        .reduce((total, expense) => total + expense.amount, 0);
      return {
        category: budget.category,
        budget: budget.amount,
        spent: totalSpent,
      };
    });
    setCategoryData(data);
  }, [budgets, expenses, selectedMonth]);

  const chartData = {
    labels: categoryData.map(item => {
      const categoryLabels = {
        'basic_needs': 'Kebutuhan Pokok',
        'education': 'Pendidikan',
        'entertainment': 'Hiburan',
        'social': 'Sosial',
        'finance': 'Keuangan',
        'unexpected_expenses': 'Pengeluaran Tidak Terduga'
      };
      return categoryLabels[item.category] || item.category;
    }),
    datasets: [
      {
        label: "Anggaran",
        data: categoryData.map(item => item.budget),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Uang yang terpakai",
        data: categoryData.map(item => item.spent),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="analysis-con">

      {/* Laporan per tahun */}
      <div className="annual-report-con">
        <h2>Laporan Tahunan</h2>
        <div className="annual-select">
          <label htmlFor="year">Pilih Tahun:</label>
          <select
            id="year"
            value={selectedYear}
            onChange={e => setSelectedYear(parseInt(e.target.value))}
          >
            {Array.from({ length: 5 }, (_, i) => (
              <option key={i} value={currentYear - i}>
                {currentYear - i}
              </option>
            ))}
          </select>
        </div>
        <div className="annual-report">
          <div className="annual-summary">
            <h2>Rata-rata</h2>
            <h3>Pemasukan:<span> {moneyFormatter(averageIncome)}</span></h3>
            <h3>Pengeluaran:<span> {moneyFormatter(averageExpense)}</span></h3>
            <h3>Saldo:<span> {moneyFormatter(averageBalance)}</span></h3>
          </div>
          <Bar data={annualBarChartData} options={barChartOptions} />
        </div>
      </div>

      {/* Laporan per bulan */}
      <div className="monthly-report-con">
        <h2>Laporan Bulanan</h2>
        <div className="monthly-select">
          <label htmlFor="month">Pilih Bulan:</label>
          <select
            id="month"
            value={selectedMonth}
            onChange={e => setSelectedMonth(parseInt(e.target.value))}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
        </div>
        <div className="monthly-report">
          <div className="monthly-summary">
            <h2>Total</h2>
            <h3>Pemasukan: <span>{moneyFormatter(monthlyReport.totalIncome)}</span></h3>
            <h3>Pengeluaran: <span>{moneyFormatter(monthlyReport.totalExpense)}</span></h3>
            <h3>Saldo: <span>{moneyFormatter(monthlyReport.balance)}</span></h3>
          </div>
          <div className="monthly-chart">
            <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
          </div>
        </div>
      </div>

      {/* Anggaran */}
      <div className="budget-con">
        <h2>Anggaran</h2>
        <BudgetTable className="budgetTable-con" />
        <Bar data={chartData} options={barChartOptions} className="budgetBar-con" />
      </div>
    </div>
  );
};

export default Analysis;