import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController, AlertController } from '@ionic/angular'; // <-- Añadido AlertController
import { addIcons } from 'ionicons';
// <-- Añadidos pencilOutline y trashOutline
import { alertCircleOutline, layersOutline, locationOutline, chevronBackOutline, addOutline, pencilOutline, trashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-piezas',
  templateUrl: './piezas.page.html',
  styleUrls: ['./piezas.page.scss'],
  standalone: true, 
  imports: [
    CommonModule, 
    IonicModule
  ]
})
export class PiezasPage implements OnInit {
  private API_URL = 'http://localhost/ProyectoFinal/piezas_vehiculos.php';
  piezas: any[] = [];
  cargando: boolean = false;
  ultimoTermino: string = '';

  constructor(
    private http: HttpClient,
    private navCtrl: NavController,
    private alertCtrl: AlertController // <-- Inyectado
  ) {
    addIcons({
      'chevron-back-outline': chevronBackOutline,
      'alert-circle-outline': alertCircleOutline,
      'layers-outline': layersOutline,
      'location-outline': locationOutline,
      'add-outline': addOutline,
      'pencil-outline': pencilOutline, // <-- Registrados
      'trash-outline': trashOutline
    });
  }

  ngOnInit() {
    this.obtenerPiezas('');
  }

  buscarPiezas(event: any) {
    this.ultimoTermino = event.target.value || '';
    this.obtenerPiezas(this.ultimoTermino);
  }

  obtenerPiezas(termino: string) {
    this.cargando = true;
    this.http.get<any[]>(`${this.API_URL}?buscar=${termino}`)
      .subscribe({
        next: (data) => {
          this.piezas = data;
          this.cargando = false;
        },
        error: (error) => {
          console.error('Error al conectar con el backend AutoGestor:', error);
          this.cargando = false;
        }
      });
  }

  abrirModalAgregar() {
    this.navCtrl.navigateForward('/agregar-pieza');
  }

  // MÉTODO NUEVO: Redirige a la vista de agregar/editar compartiendo la pieza mediante el state de navegación
  editarPieza(pieza: any) {
    this.navCtrl.navigateForward('/agregar-pieza', {
      state: { piezaEditar: pieza }
    });
  }

  // MÉTODO NUEVO: Eliminar pieza con diálogo nativo de confirmación
  async eliminarPieza(id: any) {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar Componente',
      message: '¿Estás seguro de que deseas retirar esta pieza permanentemente del almacén?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.http.delete(`${this.API_URL}?id=${id}`).subscribe({
              next: () => {
                this.obtenerPiezas(this.ultimoTermino); // Recargar la lista actual
              },
              error: (err) => {
                console.error('Error al intentar eliminar la pieza:', err);
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }
}