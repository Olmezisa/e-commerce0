import { Component, OnInit, ViewChild } from '@angular/core';
import { SellerDashboardDto, SellerService } from '../../core/services/seller.service';
import { Chart, ChartOptions, ChartType, ChartDataset, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

Chart.register(...registerables);

@Component({
  selector: 'app-seller-dashboard',
  standalone: false,
  templateUrl: './seller-dashboard.component.html',
  styleUrls: ['./seller-dashboard.component.css']
})
export class SellerDashboardComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  data: SellerDashboardDto = {
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    topProductName: '',
    topProductSales: 0,
    avgProductPrice: 0
  };

  loading = true;
  error = '';

  // 📊 Grafik Ayarları
  public barChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: {
        backgroundColor: '#f9fafb',
        titleColor: '#1f2937',
        bodyColor: '#374151',
        borderColor: '#e5e7eb',
        borderWidth: 1
      }
    }
  };

  public barChartLabels: string[] = ['Toplam Sipariş', 'Bekleyen Sipariş'];
  public barChartType: ChartType = 'bar';
  public barChartData: ChartDataset<'bar'>[] = [
    {
      data: [],
      label: 'Sipariş Sayısı',
      backgroundColor: ['#3b82f6', '#facc15']
    }
  ];

  constructor(private sellerService: SellerService) {}

  ngOnInit(): void {
    this.sellerService.getDashboard().subscribe({
      next: dto => {
        this.data = dto;
        this.barChartData[0].data = [dto.totalOrders, dto.pendingOrders];
        if (this.chart) this.chart.update();
        this.loading = false;
      },
      error: err => {
        console.error('Dashboard load error', err);
        this.error = 'Dashboard yüklenirken hata oluştu';
        this.loading = false;
      }
    });
  }
}
