import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { IonicModule, ModalController, ToastController, NavController } from '@ionic/angular'; // <-- Añadido NavController
import { Router } from '@angular/router'; // <-- Añadido Router para capturar el state
import { addIcons } from 'ionicons';
import { buildOutline, chevronBackOutline, cloudUploadOutline } from 'ionicons/icons';

@Component({
  selector: 'app-agregar-pieza',
  templateUrl: './agregar-pieza.page.html',
  styleUrls: ['./agregar-pieza.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule]
})
export class AgregarPiezaPage implements OnInit {
  private API_URL = 'http://localhost/ProyectoFinal/piezas_vehiculos.php';
  piezaForm!: FormGroup;
  guardando: boolean = false;
  
  // Propiedades para controlar el comportamiento de edición
  esModoEdicion: boolean = false;
  idPieza: any = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private navCtrl: NavController, // <-- Inyectado
    private router: Router // <-- Inyectado
  ) {
    addIcons({ buildOutline, chevronBackOutline, cloudUploadOutline });
    
    // Capturar los datos enviados por la navegación antes de que cargue la vista
    const navegacion = this.router.getCurrentNavigation();
    if (navegacion && navegacion.extras.state && navegacion.extras.state['piezaEditar']) {
      const pieza = navegacion.extras.state['piezaEditar'];
      this.esModoEdicion = true;
      this.idPieza = pieza.id;
    }
  }

  ngOnInit() {
    this.initForm();

    // Si estamos editando, rellenamos el formulario inmediatamente con los datos capturados
    if (this.esModoEdicion) {
      const navegacion = this.router.getCurrentNavigation();
      // Como getCurrentNavigation solo está disponible en el constructor, usamos una alternativa segura leyendo el historial de rutas o re-asignando
      this.cargarDatosEdicion();
    }
  }

  initForm() {
    this.piezaForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9-]+$')]],
      nombre: ['', [Validators.required]],
      categoria: ['', [Validators.required]],
      stock: [0, [Validators.required, Validators.min(0)]],
      precio: [0.00, [Validators.required, Validators.min(0.01)]],
      ubicacion_almacen: ['', [Validators.required]]
    });
  }

  cargarDatosEdicion() {
    // Recuperamos los parámetros guardados en el historial de navegación
    const pieza = history.state?.piezaEditar;
    if (pieza) {
      this.piezaForm.patchValue({
        codigo: pieza.codigo,
        nombre: pieza.nombre,
        categoria: pieza.categoria,
        stock: pieza.stock,
        precio: pieza.precio,
        ubicacion_almacen: pieza.ubicacion_almacen
      });
    }
  }

  isValid(campo: string): boolean | null {
    return this.piezaForm.get(campo)!.touched && this.piezaForm.get(campo)!.invalid;
  }

  guardarPieza() {
    if (this.piezaForm.invalid) {
      this.piezaForm.markAllAsTouched();
      return;
    }

    this.guardando = true;

    // DEFINICIÓN DINÁMICA: Si es edición, usamos PUT pasándole el ?id=X, de lo contrario usamos POST
    const peticionHttp = this.esModoEdicion 
      ? this.http.put(`${this.API_URL}?id=${this.idPieza}`, this.piezaForm.value)
      : this.http.post(this.API_URL, this.piezaForm.value);

    peticionHttp.subscribe({
      next: (res: any) => {
        this.guardando = false;
        
        if (res.status === 'success' || res.success === true) {
          const mensajeExito = this.esModoEdicion 
            ? 'Componente actualizado exitosamente.' 
            : 'Componente almacenado exitosamente.';
          
          this.mostrarToast(mensajeExito, 'success');
          
          // Intentamos cerrar tanto si abrió como Modal como si fue por Navegación de páginas
          this.regresarRuta();
        } else {
          this.mostrarToast('Error: ' + res.message, 'danger');
        }
      },
      error: (err) => {
        this.guardando = false;
        console.error('Error de red en AutoGestor:', err);
        const msgError = err.error?.message || 'Fallo de conexión con el servidor backend.';
        this.mostrarToast(msgError, 'danger');
      }
    });
  }

  async mostrarToast(msg: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2500,
      color: color,
      position: 'bottom'
    });
    await toast.present();
  }

  // Método unificado para salir de la pantalla limpiamente
  regresarRuta() {
    // Si se usó en formato modal lo destruye
    this.modalCtrl.dismiss({ actualizado: true }).catch(() => {
      // Si no era un modal, vuelve de forma nativa a la lista de piezas
      this.navCtrl.navigateBack('/piezas');
    });
  }

  cerrar() {
    this.modalCtrl.dismiss({ actualizado: false }).catch(() => {
      this.navCtrl.navigateBack('/piezas');
    });
  }
}