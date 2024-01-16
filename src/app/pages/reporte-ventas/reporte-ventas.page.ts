import { Component, OnInit } from '@angular/core';
import { Venta, VentaService } from 'src/app/services/venta.service';
import { VentasModalPage } from '../ventas-modal/ventas-modal.page';
import { ModalController, ToastController } from '@ionic/angular';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Chart } from 'chart.js';
import { GraficaVentasMensualService, VentaS } from 'src/app/services/grafica-ventas-mensual.service';

//Importar el plugin de capacitor para poder guardar el pdf en el telefono.
import { Filesystem, Directory } from '@capacitor/filesystem';

//Implemenatr los toast controller.

//Importar notificacion
import { LocalNotifications } from '@capacitor/local-notifications';


interface Week {
  name: string;
  startDate: string;
  endDate: string;
}

interface Month {
  name: string;
  weeks: Week[];
}

@Component({
  selector: 'app-reporte-ventas',
  templateUrl: './reporte-ventas.page.html',
  styleUrls: ['./reporte-ventas.page.scss'],
})
export class ReporteVentasPage implements OnInit {
  
  private myChart!: Chart;
  private graficaImagenUrl: string | undefined;
  ventasS: Venta[] = []; // Agrega esta propiedad para almacenar las ventas

  ventasM: Venta[] = []; // Agrega esta propiedad para almacenar las ventas

  ventaSeleccionada: Venta | null = null; // Agrega esta propiedad

  // ... tus otros métodos ...

  months: Month[] = [];
  selectedMonth: Month | any = null;
  selectedWeek: Week | any = null;

  ngOnInit() {
  }

  constructor(private modalController: ModalController,
              private ventaService : VentaService,
              private ventasMensualService : GraficaVentasMensualService,
              private toastController: ToastController
              
              ) {
    this.generateMonths();
  }

  generateMonths() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    for (let month = 0; month < 12; month++) {
      const firstDay = new Date(currentYear, month, 1);
      const lastDay = new Date(currentYear, month + 1, 0);

      const monthName = new Intl.DateTimeFormat('es', { month: 'long' }).format(firstDay);
      const capitalizedMonthName = monthName.charAt(0).toUpperCase() + monthName.slice(1).toLowerCase();

      const weeks = this.generateWeeks(firstDay, lastDay);

      this.months.push({
        name: capitalizedMonthName,
        weeks: weeks,
      });
    }
  }
  //GENERA LAS SEMANAAS PARA MOSTRARLAS EN EL SELECT OPTION
  generateWeeks(startDate: Date, endDate: Date): Week[]{
    const weeks = [];
    const startDateCopy = new Date(startDate);

    while (startDateCopy <= endDate) {
      const endDateOfWeek = new Date(startDateCopy);
      endDateOfWeek.setDate(endDateOfWeek.getDate() + 6);

      weeks.push({
        name: `Semana ${weeks.length + 1}`,
        startDate: startDateCopy.toLocaleDateString('es'),
        endDate: endDateOfWeek.toLocaleDateString('es'),
      });

      startDateCopy.setDate(startDateCopy.getDate() + 7);
    }

    return weeks;
  }
  //SELECCIONA LOS MESES, Y CO  EL SERVICE PASAN EL AÑO Y MES AL APICITA

  onMonthChange(event: any) {
    this.selectedMonth = this.months.find((month) => month.name === event.detail.value);
    this.selectedWeek = null; // Limpiar la semana seleccionada al cambiar el mes

    // Asumiendo que tienes una función para convertir el nombre del mes a su número correspondiente
    const mesSeleccionado = this.convertirMesANumero(this.selectedMonth.name);
    const anoActual = new Date().getFullYear();
  
    this.ventasMensualService.getVentasPorMes(mesSeleccionado, anoActual).subscribe({
      next: (data: VentaS[]) => {
        const semanas = data.map(item => item.semana);
        const totales = data.map(item => item.total_semanal);
        this.crearGrafica(semanas, totales);
      },
      error: (error) => {
        console.error("Error al obtener los datos de ventas", error);
      }
    });
    
    this.ventaService.getVentasPorMes(mesSeleccionado, anoActual)
        .subscribe({
          next: (ventasM: Venta[]) => {
            this.ventasM = ventasM;
            
          },
          error: (error) => {
            console.error("Error al obtener las ventas", error);
          }
        });
  }
  //FUNCION DEL BOTON PARA REINICIAR LAS SEMANAS
  reiniciarSemanas() {
    this.selectedMonth.weeks = [];
    this.selectedWeek = null; // Limpiar la semana seleccionada al reiniciar las semanas

  }
  
  //SELECCIONA LA SEMANA, LA ENVIA, RECIBE LA RESPUESTA Y LE COLOCA LAS VENTAS
  selectWeek(week: { name: string, startDate: string, endDate: string }) {
    this.selectedWeek = week;
    
    // Depura y muestra la fecha que se está recibiendo
    console.log('Week selected:', week);
    
      // Convertir las fechas de inicio y fin a un formato reconocido
      const [startDay, startMonth, startYear] = week.startDate.split('/').map(Number);
      const [endDay, endMonth, endYear] = week.endDate.split('/').map(Number);
      const formattedStartDate = new Date(startYear, startMonth - 1, startDay).toISOString().split('T')[0];
      const formattedEndDate = new Date(endYear, endMonth - 1, endDay).toISOString().split('T')[0];
      
      console.log('Formatted Start Date:', formattedStartDate);
      console.log('Formatted End Date:', formattedEndDate);
      
      // Llama al servicio para obtener las ventas de la semana seleccionada
      this.ventaService.getVentasPorSemana(formattedStartDate, formattedEndDate)
        .subscribe({
          next: (ventasS: Venta[]) => {
            this.ventasS = ventasS;
            
          },
          error: (error) => {
            console.error("Error al obtener las ventas", error);
          }
        });
        
     
  }
  //DESPLIEGA EL MODAL Y LE PSA EL OBJETO VENTA
  async selectVenta(venta: Venta) {
    const modal = await this.modalController.create({
      component: VentasModalPage,
      componentProps: {
        venta: venta
      }
    });
    return await modal.present();
  }
  //PARA GENERAR LA GRAFICA MENSUAL
  
  
  //convertir el mes a numero
  convertirMesANumero(nombreMes: string): number {
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return meses.indexOf(nombreMes) + 1;
  }
  //aQUI CONVIERTO LA GRAFICA A IMAGEN Y LA MANDO AL PDF
  crearGrafica(semanas: string[], totales: number[]) {
    const etiquetasSemanas = semanas.map((semana, index) => `Semana ${index + 1}`);
    const canvas = document.getElementById('myChart2') as HTMLCanvasElement;
  
    if (!canvas) {
      console.error('Elemento canvas no encontrado');
      return;
    }
  
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('No se pudo obtener el contexto del canvas');
      return;
    }
  
    // Destruir la instancia anterior de la gráfica si existe
    if (this.myChart) {
      this.myChart.destroy();
    }
  
    // Crear y asignar la nueva instancia a this.myChart
    this.myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: etiquetasSemanas,
        datasets: [{
          label: 'Total de Ventas del Mes',
        data: totales, // Datos para la gráfica
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
          // Configuraciones de colores y estilos...
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          },
          x: {
            ticks: {
              font: {
                size: 16 // Cambia el tamaño según tus necesidades
              }
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              // Ajustar el tamaño de la fuente para la leyenda
              font: {
                size: 16 // Cambia el tamaño según tus necesidades
              }
            }
          }
        },
      }
    });

    
  // Convertir la gráfica en una imagen
  const canvasImg = this.myChart.toBase64Image();
  this.graficaImagenUrl = canvasImg; // Almacenar la URL de la imagen para usarla más tarde
  console.log(this.graficaImagenUrl);


  }
  
    //AQUI VAMOS A GENERAR EL PDF DE VENTAS PERO POR SEMANA OMG
    async generarReporteSemanal() {
      if (!this.selectedMonth || this.ventasS.length === 0) {
        console.log('No hay datos disponibles para generar el reporte');
        return;
      }
    
      const doc = new jsPDF();
      let posicionY = 20; // Iniciar en la parte superior de la página
        
      
      // Encabezado del PDF
      const imagenAncho = 50; // Ancho de la imagen en mm
      const xImagen = 10; // Posición x para la imagen (alineada a la izquierda)
      const imagenUrl = '../../../assets/img/reporte-venta.png'; // Asegúrate de tener la imagen cargada o disponible
    
      // Añadir la imagen
      doc.addImage(imagenUrl, 'JPEG', xImagen, posicionY, imagenAncho, 30); // Ajusta la altura según sea necesario
    
      // Posición x para los textos, alineada donde termina la imagen
      const xTexto = xImagen + imagenAncho + 10; // Espacio después de la imagen
      doc.setFontSize(14);
      // Lista de textos a alinear a la derecha de la imagen
      const textos = [
        `Reporte de ventas semanal: ${this.selectedWeek.name}`,
        `Tienda comunitaria nª 105`,
        `Localidad: La Esperanza    Municipio: Atoyac`,
        `Ruta:   Almacen: Tomatlan    Estado: Veracruz`
      ];
    
      // Alinear y añadir cada línea de texto

      textos.forEach(texto => {
        doc.text(texto, xTexto, posicionY);
        posicionY += 10; // Ajustar la posición Y para el siguiente elemento
      });
      posicionY += 10;
      const textoGrafica = "Gráfica de ventas";
      const paginaAncho = doc.internal.pageSize.getWidth();
    
      const textoGraficaAncho = doc.getTextWidth(textoGrafica);
      const xTextoGrafica = (paginaAncho - textoGraficaAncho) / 2;
      
      doc.text(textoGrafica, xTextoGrafica, posicionY);
      posicionY += 10; // Ajustar la posición Y para el siguiente elemento
    
      // Insertar y centrar la imagen de la gráfica
      this.graficaImagenUrl = this.myChart.toBase64Image();
      const imagenGraficaAncho = 130; // Ancho de la imagen de la gráfica en mm
      const xImagenGrafica = (paginaAncho - imagenGraficaAncho) / 2;
    
      if (this.graficaImagenUrl) {
        doc.addImage(this.graficaImagenUrl, 'PNG', xImagenGrafica, posicionY, imagenGraficaAncho, 60);
        posicionY += 70; // Espacio después de la gráfica
      }
      this.ventasS.forEach((ventaS, index) => {
        // Verificar si es necesario añadir una nueva página
        if (posicionY >= doc.internal.pageSize.height - 20) {
          doc.addPage();
          posicionY = 10; // Restablecer la posición Y para la nueva página
        }
        doc.setFontSize(12);

        // Encabezado de cada venta
        doc.text(`Venta nº: ${ventaS.id_venta} Fecha: ${ventaS.fecha}`, 10, posicionY);
    
        // Calcular el ancho del texto "Total de Venta"
        const totalVentaTexto = `Total de venta: $ ${ventaS.total_venta}.00`;
        const totalVentaAncho = doc.getTextWidth(totalVentaTexto);
    
        // Calcular la posición x para alinear a la derecha
        const margenDerecho = 10; // Por ejemplo, 10 mm de margen derecho
        const paginaAncho = doc.internal.pageSize.getWidth();
        const xTotalVenta = paginaAncho - totalVentaAncho - margenDerecho;
    
        // Posicionar "Total de Venta" a la derecha y al mismo nivel de "Venta ID"
        doc.text(totalVentaTexto, xTotalVenta, posicionY);
    
        posicionY += 10; // Espacio después del encabezado de la venta
        
        // Datos para la tabla de detalles
        const detallesColumn = ["Codigo","Producto", "Cantidad", "Precio", "Subtotal"];
        const detallesRows = ventaS.detalles.map(detalle => [
          detalle.producto?.codigo_producto || 'N/A', 
          detalle.producto?.nombre || 'N/A', // 'N/A' como valor por defecto
          detalle.cantidad || 0,
          detalle.producto?.precio || 0,
          detalle.subtotal || 0,
        ]);
    
        // Añadir tabla de detalles al documento
        autoTable(doc, {
          head: [detallesColumn],
          body: detallesRows,
          startY: posicionY,
          headStyles: {
            fillColor: [15, 168, 46], // Color verde en formato RGB // Fuente
            fontStyle: 'bold' // Estilo de fuente en negrita
          },
          bodyStyles: { // Fuente para el cuerpo de la tabla
          },
          didDrawPage: function(data) {
            if (data.cursor) {
              posicionY = data.cursor.y + 10; // Actualizar la posición Y después de dibujar la tabla
            }
          }
        });
      });
    
     
      // Guardar el PDF ESCRITORIO
      doc.save(`reporte_ventas_${this.selectedMonth.name}_${this.selectedWeek.name}.pdf`);

      const pdfOutput = doc.output('datauristring');

      // Extraer solo la parte de Base64 de la cadena
      const base64Content = pdfOutput.split(',')[1];
  
      // Guardar el PDF en el dispositivo
      this.guardarPDFEnDispositivo(base64Content, `reporte_ventas_${this.selectWeek.name}.pdf`);

    
    }

     //PARA DETENER EL CLICK DE LA CARD: 
     stopClickPropagation(event: Event) {
      event.stopPropagation();
    }

    //ESTE ES SIN QUERER EL GENERADOR DE VENTAS POR MES
    
      async generarReporteMensual() {
        if (!this.selectedMonth || this.ventasM.length === 0) {
          console.log('No hay datos disponibles para generar el reporte');
          return;
        }
      
        const doc = new jsPDF();
        let posicionY = 20; // Iniciar en la parte superior de la página
          
        
        // Encabezado del PDF
        const imagenAncho = 50; // Ancho de la imagen en mm
        const xImagen = 10; // Posición x para la imagen (alineada a la izquierda)
        const imagenUrl = '../../../assets/img/reporte-venta.png'; // Asegúrate de tener la imagen cargada o disponible
      
        // Añadir la imagen
        doc.addImage(imagenUrl, 'JPEG', xImagen, posicionY, imagenAncho, 30); // Ajusta la altura según sea necesario
      
        // Posición x para los textos, alineada donde termina la imagen
        const xTexto = xImagen + imagenAncho + 10; // Espacio después de la imagen
        doc.setFontSize(14);
        // Lista de textos a alinear a la derecha de la imagen
        const textos = [
          `Reporte de ventas mensual: ${this.selectedMonth.name}`,
          `Tienda comunitaria nª 105`,
          `Localidad: La Esperanza    Municipio: Atoyac`,
          `Ruta:   Almacen: Tomatlan    Estado: Veracruz`
        ];
      
        // Alinear y añadir cada línea de texto
        textos.forEach(texto => {
          doc.text(texto, xTexto, posicionY);
          posicionY += 10; // Ajustar la posición Y para el siguiente elemento
        });
        posicionY += 10;
        const textoGrafica = "Gráfica de ventas";
        const paginaAncho = doc.internal.pageSize.getWidth();
      
        const textoGraficaAncho = doc.getTextWidth(textoGrafica);
        const xTextoGrafica = (paginaAncho - textoGraficaAncho) / 2;
        
        doc.text(textoGrafica, xTextoGrafica, posicionY);
        posicionY += 10; // Ajustar la posición Y para el siguiente elemento
      
        // Insertar y centrar la imagen de la gráfica
        this.graficaImagenUrl = this.myChart.toBase64Image();
        const imagenGraficaAncho = 130; // Ancho de la imagen de la gráfica en mm
        const xImagenGrafica = (paginaAncho - imagenGraficaAncho) / 2;
      
        if (this.graficaImagenUrl) {
          doc.addImage(this.graficaImagenUrl, 'PNG', xImagenGrafica, posicionY, imagenGraficaAncho, 60);
          posicionY += 70; // Espacio después de la gráfica
        }
        this.ventasM.forEach((ventaM, index) => {
          // Verificar si es necesario añadir una nueva página
          if (posicionY >= doc.internal.pageSize.height - 20) {
            doc.addPage();
            posicionY = 10; // Restablecer la posición Y para la nueva página
          }
          doc.setFontSize(12);

          // Encabezado de cada venta
          doc.text(`Venta nº: ${ventaM.id_venta} Fecha: ${ventaM.fecha}`, 10, posicionY);
      
          // Calcular el ancho del texto "Total de Venta"
          const totalVentaTexto = `Total de venta: $ ${ventaM.total_venta}.00`;
          const totalVentaAncho = doc.getTextWidth(totalVentaTexto);
      
          // Calcular la posición x para alinear a la derecha
          const margenDerecho = 10; // Por ejemplo, 10 mm de margen derecho
          const paginaAncho = doc.internal.pageSize.getWidth();
          const xTotalVenta = paginaAncho - totalVentaAncho - margenDerecho;
      
          // Posicionar "Total de Venta" a la derecha y al mismo nivel de "Venta ID"
          doc.text(totalVentaTexto, xTotalVenta, posicionY);
      
          posicionY += 10; // Espacio después del encabezado de la venta
          
          // Datos para la tabla de detalles
          const detallesColumn = ["Codigo","Producto", "Cantidad", "Precio", "Subtotal"];
          const detallesRows = ventaM.detalles.map(detalle => [
            detalle.producto?.codigo_producto || 'N/A', 
            detalle.producto?.nombre || 'N/A', // 'N/A' como valor por defecto
            detalle.cantidad || 0,
            detalle.producto?.precio || 0,
            detalle.subtotal || 0,
          ]);
      
          // Añadir tabla de detalles al documento
          autoTable(doc, {
            head: [detallesColumn],
            body: detallesRows,
            startY: posicionY,
            headStyles: {
              fillColor: [15, 168, 46], // Color verde en formato RGB // Fuente
              fontStyle: 'bold' // Estilo de fuente en negrita
            },
            bodyStyles: { // Fuente para el cuerpo de la tabla
            },
            didDrawPage: function(data) {
              if (data.cursor) {
                posicionY = data.cursor.y + 10; // Actualizar la posición Y después de dibujar la tabla
              }
            }
          });
        });
      
        // Guardar el PDF
        doc.save(`reporte_ventas_${this.selectedMonth.name}.pdf`);
  
        const pdfOutput = doc.output('datauristring');

    // Extraer solo la parte de Base64 de la cadena
    const base64Content = pdfOutput.split(',')[1];

    // Guardar el PDF en el dispositivo
    this.guardarPDFEnDispositivo(base64Content, `reporte_ventas_${this.selectedMonth.name}.pdf`);

        
      }
  
      async guardarPDFEnDispositivo(pdfBase64: string, fileName: string) {
        try {
          const result = await Filesystem.writeFile({
            path: fileName,
            data: pdfBase64,
            directory: Directory.Documents, // O el directorio adecuado
            recursive: true,
          });
          console.log('Archivo guardado:', result.uri);
    
          // Mostrar un toast de éxito
          this.mostrarToast('Archivo PDF guardado con éxito', 'primary');
          //Enviar notificación.
          this.mostrarNotificacion('Archivo PDF guardado con éxito');
        } catch (e) {
          console.error('Error al guardar el archivo:', e);
    
          // Mostrar un toast de error
          this.mostrarToast('Error al guardar el archivo PDF', 'danger');
        }
      }

      async mostrarToast(mensaje: string, color: string) {
        const toast = await this.toastController.create({
          message: mensaje,
          color: color,
          duration: 2000, // Duración en milisegundos
          position: 'middle',
        });
        toast.present();
      }
      async mostrarNotificacion(mensaje: string) {
        await LocalNotifications.schedule({
          notifications: [
            {
              title: "Confirmación",
              body: mensaje,
              id: 1,
              sound: '', // Puedes especificar un sonido si lo deseas
              extra: null
            }
          ]
        });
      }
    
    
    
}
