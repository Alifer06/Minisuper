import { Component, OnInit } from '@angular/core';
import { VentaTotal, VentaTotalService } from 'src/app/services/venta-total.service';
import { Chart, registerables } from 'chart.js';
import { GraficaVentasService } from 'src/app/services/grafica-ventas.service';
Chart.register(...registerables);

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  totalVentasDelDia: number = 0; // Esta propiedad almacena el total de ventas del día
  ventas: VentaTotal[] = []
  constructor(private ventaTotalService: VentaTotalService,
              private graficaVentasService: GraficaVentasService) { }

  ngOnInit() {
    
    this.ventaTotalService.getTotalVentasDelDia().subscribe({
      next: (data) => {
        // Si la API devuelve null o undefined, usa '||' para proporcionar un valor por defecto
        this.totalVentasDelDia = data.total_del_dia;
      },
      error: (error) => {
        console.error('Error al obtener el total de ventas del día:', error);
        // Establece un valor por defecto en caso de error
      }
    });

    this.graficaVentasService.getVentasSemanales().subscribe({
      next: (data) => {
        // Procesa los datos aquí para utilizarlos en la gráfica
        // Por ejemplo, extraer las semanas y los totales
        const semanas = data.map((item: { semana: any; }) => item.semana);
        const totales = data.map((item: { total_semanal: any; }) => item.total_semanal);
        this.crearGrafica(semanas, totales);
      },
      error: (error) => {
        console.error('Error al obtener ventas semanales:', error);
      }
    });
  }
  
   // Suponiendo que 'ventasSemanales' es un array con los totales de cada semana
 
   crearGrafica(semanas: string[], totales: number[]) {
    const etiquetasSemanas = semanas.map((semanas, index) => `Semana ${index + 1}`);

    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: etiquetasSemanas, // Las semanas serán las etiquetas en el eje X
        datasets: [{
          label: 'Total de Ventas del Mes',
          data: totales, // Los totales de ventas serán los datos de la gráfica
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(240, 166, 105, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            // Agrega más colores si tienes más de 4 semanas
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(207, 93, 0, 1)',
            'rgba(255, 99, 132, 1)',

            // Agrega más colores si tienes más de 4 semanas
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
