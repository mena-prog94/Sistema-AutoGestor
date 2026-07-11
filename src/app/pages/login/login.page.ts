import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { IonicModule, ToastController, AlertController } from '@ionic/angular'; 
import { AuthService } from '../../services/auth'; // Asegúrate de que la ruta apunte bien a tu archivo de servicio
import { addIcons } from 'ionicons';
import { mailOutline, lockClosedOutline, personCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true, 
  imports: [
    CommonModule, 
    FormsModule,     
    IonicModule,     
    RouterModule
  ]
})
export class LoginPage {
  email = '';
  password = '';

  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController, 
    private authService: AuthService // Inyectado con su tipado real
  ) {
    addIcons({ 
      'mail-outline': mailOutline,
      'lock-closed-outline': lockClosedOutline,
      'person-circle-outline': personCircleOutline 
    });
  }

  async onLogin() {
    if (!this.email || !this.password) {
      this.presentToast('Por favor, completa todos los campos.', 'warning');
      return;
    }

    const credentials = {
      correo: this.email.trim(),
      clave: this.password.trim()
    };

    this.authService.login(credentials).subscribe({
      next: async (response: any) => {
        if (response && response.success) {
          this.presentToast('¡Bienvenido de nuevo!', 'success');
          this.router.navigate(['/vehiculos']);
        } else {
          this.presentToast(response.message || 'Credenciales incorrectas.', 'danger');
        }
      },
      error: async (error: any) => {
        console.error('Error en Login:', error);
        this.presentToast('Error de conexión con el servidor.', 'danger');
      }
    });
  }

  async recuperarContrasena() {
    const alert = await this.alertCtrl.create({
      header: 'Recuperar Contraseña',
      subHeader: 'Introduce tu correo electrónico registrado para restablecer tu acceso.',
      inputs: [
        {
          name: 'correoRecuperacion',
          type: 'email',
          placeholder: 'ejemplo@correo.com',
          value: this.email ? this.email.trim() : ''
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Enviar',
          handler: (data) => {
            const correoInput = data.correoRecuperacion?.trim();

            if (!correoInput) {
              this.presentToast('Debes ingresar un correo electrónico válido.', 'warning');
              return false; 
            }

            this.ejecutarSolicitudRecuperacion(correoInput);
            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  private ejecutarSolicitudRecuperacion(correo: string) {
    this.authService.recuperarClave({ correo }).subscribe({
      next: async (res: any) => {
        if (res && res.success) {
          // Desplegamos el Alert de confirmación limpio con la contraseña temporal generada por PHP
          const exitoAlert = await this.alertCtrl.create({
            header: 'Acceso Restablecido',
            subHeader: 'Contraseña Provisional Generada',
            message: `Tu contraseña ha sido cambiada con éxito.<br><br>Nueva clave: <b style="font-size: 1.2rem; color: #3880ff;">${res.clave_temporal}</b><br><br>Úsala para iniciar sesión y cámbiala lo antes posible dentro del sistema.`,
            buttons: ['Entendido']
          });
          await exitoAlert.present();
        } else {
          this.presentToast(res.message || 'El correo ingresado no se encuentra registrado.', 'danger');
        }
      },
      error: (err: any) => {
        console.error('Error detallado de recuperación:', err);
        this.presentToast('No se pudo procesar la solicitud en este momento.', 'danger');
      }
    });
  }

  async presentToast(message: string, color: 'success' | 'danger' | 'warning') {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'bottom'
    });
    toast.present();
  }
}