import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; 
import { VehiculosService } from '../servicios/vehiculos';

import { 
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonItem,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonList,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  ToastController,
  AlertController,
  IonSearchbar 
} from '@ionic/angular/standalone'; 

import { addIcons } from 'ionicons';
import { 
  logOutOutline, 
  carOutline, 
  checkmarkCircleOutline, 
  cartOutline, 
  hammerOutline, 
  cubeOutline, 
  searchOutline, 
  pencilOutline, 
  trashOutline,
  logoWhatsapp,
  alertOutline
} from 'ionicons/icons'; 

@Component({
  selector: 'app-vehiculos',
  standalone: true,
  templateUrl: './vehiculos.page.html',
  styleUrls: ['./vehiculos.page.scss'],
  imports: [
    CommonModule, 
    FormsModule,
    RouterModule, 
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonItem,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonList,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonSearchbar 
  ]
})
export class VehiculosPage implements OnInit {
  private vehiculosService = inject(VehiculosService);
  private toastCtrl = inject(ToastController);
  private alertCtrl = inject(AlertController);
  private router = inject(Router);

  vehiculo = {
    marca: '',
    modelo: '',
    anio: null as number | null,
    estado: '',
    parte_afectada: '',
    cliente_nombre: '',
    cliente_telefono: '',
    cliente_dni: '',
    fecha_venta: ''
  };

  vehiculos: any[] = [];
  vehiculosFiltrados: any[] = []; 
  editandoId: any = null; 

  constructor() {
    addIcons({ 
      'log-out-outline': logOutOutline,
      'car-outline': carOutline,
      'checkmark-circle-outline': checkmarkCircleOutline,
      'cart-outline': cartOutline,
      'hammer-outline': hammerOutline,
      'cube-outline': cubeOutline,
      'search-outline': searchOutline,
      'pencil-outline': pencilOutline, 
      'trash-outline': trashOutline,
      'logo-whatsapp': logoWhatsapp,  
      'alert-outline': alertOutline    
    });
  }

  ngOnInit() {
    this.cargarVehiculos();
  }

  cargarVehiculos() {
    this.vehiculosService.obtenerVehiculos().subscribe({
      next: (data) => {
        this.vehiculos = data;
        this.vehiculosFiltrados = data; 
      },
      error: (err) => {
        console.error('Error al obtener vehículos:', err);
      }
    });
  }

  filtrarVehiculos(event: any) {
    const query = event.target.value?.toLowerCase().trim();
    
    if (!query) {
      this.vehiculosFiltrados = this.vehiculos;
      return;
    }

    this.vehiculosFiltrados = this.vehiculos.filter(v => {
      const marca = v.marca ? v.marca.toLowerCase() : '';
      const modelo = v.modelo ? v.modelo.toLowerCase() : '';
      return marca.includes(query) || modelo.includes(query);
    });
  }

  get totalDisponibles(): number {
    return this.vehiculos.filter(v => v.estado === 'Disponible').length;
  }

  get totalVendidos(): number {
    return this.vehiculos.filter(v => v.estado === 'Vendido').length;
  }

  get totalMantenimiento(): number {
    return this.vehiculos.filter(v => v.estado === 'Mantenimiento').length;
  }

  esMantenimientoRetrasado(fechaActualizacion: string, estado: string): boolean {
    if (estado !== 'Mantenimiento' || !fechaActualizacion) return false;

    const fechaRegistro = new Date(fechaActualizacion);
    const fechaActual = new Date();
    
    const diferenciaTiempo = fechaActual.getTime() - fechaRegistro.getTime();
    const diasEnMantenimiento = Math.floor(diferenciaTiempo / (1000 * 60 * 60 * 24));

    return diasEnMantenimiento > 15;
  }

  enviarMensajeWhatsApp(v: any) {
    if (!v.cliente_telefono || v.estado !== 'Mantenimiento') return;

    let telefonoLimpio = v.cliente_telefono.replace(/\D/g, '');

    if (!telefonoLimpio.startsWith('1') && telefonoLimpio.length === 10) {
      telefonoLimpio = '1' + telefonoLimpio;
    }

    const mensaje = `Hola ${v.cliente_nombre}, le saludamos de AutoGestor. Le informamos que su vehículo ${v.marca} ${v.modelo} ya se encuentra listo.`;
    const mensajeCodificado = encodeURIComponent(mensaje);

    const urlWhatsApp = `https://wa.me/${telefonoLimpio}?text=${mensajeCodificado}`;
    window.open(urlWhatsApp, '_blank');
  }

  async confirmarSalida() {
    const alert = await this.alertCtrl.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro de que deseas salir del sistema?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Salir',
          role: 'confirm',
          handler: () => {
            localStorage.removeItem('user_session');
            this.router.navigate(['/login']);
          }
        }
      ]
    });
    await alert.present();
  }

  prepararEdicion(v: any) {
    this.editandoId = v.id; 
    this.vehiculo = { ...v }; 
    
    const content = document.querySelector('ion-content');
    if (content) content.scrollToTop(500);
  }

  cancelarEdicion() {
    this.editandoId = null;
    this.limpiarFormulario();
  }

  limpiarFormulario() {
    this.vehiculo = { 
      marca: '', modelo: '', anio: null, estado: '', 
      parte_afectada: '', cliente_nombre: '', 
      cliente_telefono: '', cliente_dni: '', fecha_venta: '' 
    };
  }

  async guardarVehiculo() {
    const marca = this.vehiculo.marca?.trim();
    const modelo = this.vehiculo.modelo?.trim();
    const anio = this.vehiculo.anio;
    const estado = this.vehiculo.estado;
    const cliente = this.vehiculo.cliente_nombre?.trim();

    if (!marca || !modelo || !anio || !estado || !cliente) {
      const toast = await this.toastCtrl.create({
        message: 'Por favor completa todos los campos obligatorios antes de guardar ⚠️',
        duration: 2000,
        color: 'warning'
      });
      await toast.present();
      return;
    }

    if (this.editandoId) {
      this.vehiculosService.actualizarVehiculo(this.editandoId, this.vehiculo).subscribe({
        next: async (res) => {
          const toast = await this.toastCtrl.create({
            message: 'Vehículo actualizado correctamente ✅',
            duration: 2000,
            color: 'success'
          });
          await toast.present();
          this.editandoId = null;
          this.cargarVehiculos(); 
          this.limpiarFormulario();
        },
        error: async (err) => {
          console.error('Error al actualizar:', err);
          const toast = await this.toastCtrl.create({
            message: 'Error al actualizar el vehículo ❌',
            duration: 2000,
            color: 'danger'
          });
          await toast.present();
        }
      });
    } else {
      this.vehiculosService.guardarVehiculo(this.vehiculo).subscribe({
        next: async (res) => {
          const toast = await this.toastCtrl.create({
            message: 'Vehículo registrado correctamente ✅',
            duration: 2000,
            color: 'success'
          });
          await toast.present();
          this.cargarVehiculos(); 
          this.limpiarFormulario();
        },
        error: async (err) => {
          console.error('Error del servidor al guardar:', err);
          const toast = await this.toastCtrl.create({
            message: 'Error al guardar vehículo en la base de datos ❌',
            duration: 2000,
            color: 'danger'
          });
          await toast.present();
        }
      });
    }
  }

  async eliminarVehiculo(id: any) {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar Registro',
      message: '¿Estás completamente seguro de eliminar este vehículo? Esta acción no se puede deshacer.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.vehiculosService.eliminarVehiculo(id).subscribe({
              next: async () => {
                const toast = await this.toastCtrl.create({
                  message: 'Vehículo eliminado con éxito 🗑️',
                  duration: 2000,
                  color: 'success'
                });
                await toast.present();
                this.cargarVehiculos();
                if (this.editandoId === id) this.cancelarEdicion();
              },
              error: async (err) => {
                console.error('Error al eliminar:', err);
                const toast = await this.toastCtrl.create({
                  message: 'No se pudo eliminar el registro ❌',
                  duration: 2000,
                  color: 'danger'
                });
                await toast.present();
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }
}